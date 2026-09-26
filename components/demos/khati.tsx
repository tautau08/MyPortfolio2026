"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { CodeWalkthrough } from "./CodeWalkthrough";
import { DemoShell } from "./DemoShell";
import { Terminal, type TermLine } from "./Terminal";

const gatewayLines: TermLine[] = [
  { kind: "cmd", text: "curl localhost:8080/api/inventory/products" },
  { kind: "dim", text: "gateway   GET  /api/inventory/products  →  inventory:8083", delay: 300 },
  { kind: "ok", text: '200  [{"id":4,"name":"Organic Apples","price":2.49,"stockQuantity":200}, …]', delay: 250 },
  { kind: "cmd", text: "curl -X POST localhost:8080/api/orders -H 'Authorization: Bearer eyJ…' -d '{\"items\":[{\"productId\":4,\"quantity\":4}]}'", delay: 700 },
  { kind: "dim", text: "gateway   POST /api/orders  →  order:8084", delay: 300 },
  { kind: "dim", text: "order     GET  inventory:8083/api/inventory/products/4   stock 200 ≥ 4", delay: 300 },
  { kind: "ok", text: '201  {"id":17,"status":"PENDING","totalAmount":9.96}', delay: 250 },
  { kind: "cmd", text: "curl -X POST localhost:8080/api/inventory/internal/update -d '{\"productId\":4,\"quantityChange\":500}'", delay: 800 },
  { kind: "info", text: "WARN  InternalEndpointFilter : Blocked attempt to access internal endpoint: /api/inventory/internal/update from IP: 127.0.0.1", delay: 300 },
  { kind: "err", text: '403  {"error":"Access to internal endpoints is forbidden"}', delay: 200 },
];

export function KhatiGatewayDemo() {
  return (
    <DemoShell kind="replay" note="Routes, ports, and the 403 body match the gateway and controller code. The request sequence is scripted." dark>
      <Terminal title="gateway :8080" lines={gatewayLines} heightClass="h-80" />
    </DemoShell>
  );
}

type Status = "PENDING" | "CONFIRMED" | "CANCELLED";
interface Order {
  id: number;
  qty: number;
  status: Status;
}

const START_STOCK = 5;

export function KhatiOrderDemo() {
  const [stock, setStock] = useState(START_STOCK);
  const [orders, setOrders] = useState<Order[]>([]);
  const [qty, setQty] = useState(3);
  const [log, setLog] = useState<{ ok: boolean; text: string } | null>(null);

  const place = () => {
    // OrderService.createOrder: compares against current stock, ignoring other PENDING orders.
    if (stock < qty) {
      setLog({ ok: false, text: "order: Insufficient stock for product: Organic Apples" });
      return;
    }
    const id = (orders.at(-1)?.id ?? 16) + 1;
    setOrders((o) => [...o, { id, qty, status: "PENDING" }]);
    setLog({ ok: true, text: `order #${id} created as PENDING. Stock checked (${stock} ≥ ${qty}) but not reserved.` });
  };

  const setStatus = (id: number, status: Status) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    if (status === "CONFIRMED") {
      // InventoryService.updateInventory rejects a negative result; the order transaction rolls back.
      if (stock - order.qty < 0) {
        setLog({ ok: false, text: `inventory: Insufficient stock. Order #${id} rolled back and stays PENDING.` });
        return;
      }
      setStock((s) => s - order.qty);
      setLog({ ok: true, text: `order #${id} CONFIRMED → inventory quantityChange −${order.qty}` });
    } else {
      setLog({ ok: true, text: `order #${id} CANCELLED. Stock unchanged.` });
    }
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const reset = () => {
    setStock(START_STOCK);
    setOrders([]);
    setLog(null);
  };

  return (
    <DemoShell kind="interactive" note="Runs in your browser. Mirrors the checks in OrderService and InventoryService.">
      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-wider text-ink-3 uppercase">Organic Apples · inventory_db</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight tabular">
              {stock}
              <span className="ml-2 text-base font-normal text-ink-3">in stock</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="khati-qty" className="font-mono text-xs text-ink-2">
              qty
            </label>
            <input
              id="khati-qty"
              type="number"
              min={1}
              max={9}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(9, Number(e.target.value) || 1)))}
              className="w-14 rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-sm tabular"
            />
            <button
              type="button"
              onClick={place}
              className="rounded-md bg-ink px-3.5 py-1.5 text-sm font-medium text-paper transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
            >
              Place order
            </button>
          </div>
        </div>

        <ul className="flex min-h-[112px] flex-col gap-2" aria-label="Orders">
          {orders.length === 0 && <li className="text-sm text-ink-3">No orders yet. Place two orders of 3 to see the gap.</li>}
          {orders.map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper px-3 py-2">
              <span className="font-mono text-sm">
                #{o.id} · qty {o.qty}
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-mono text-[11px]",
                    o.status === "PENDING" && "bg-accent-soft text-accent",
                    o.status === "CONFIRMED" && "bg-signal/15 text-signal-ink",
                    o.status === "CANCELLED" && "bg-paper-3 text-ink-3",
                  )}
                >
                  {o.status}
                </span>
                {o.status === "PENDING" && (
                  <>
                    <button type="button" onClick={() => setStatus(o.id, "CONFIRMED")} className="rounded px-2 py-0.5 text-xs text-ink-2 underline-offset-2 hover:text-ink hover:underline">
                      confirm
                    </button>
                    <button type="button" onClick={() => setStatus(o.id, "CANCELLED")} className="rounded px-2 py-0.5 text-xs text-ink-3 underline-offset-2 hover:text-ink hover:underline">
                      cancel
                    </button>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-start justify-between gap-4 border-t border-line pt-3">
          <p aria-live="polite" className={cn("min-h-[2.5rem] font-mono text-xs leading-relaxed", log ? (log.ok ? "text-ink-2" : "text-danger") : "text-ink-3")}>
            {log?.text ?? "Waiting for an order."}
          </p>
          <button type="button" onClick={reset} className="shrink-0 font-mono text-xs text-ink-3 hover:text-ink">
            reset
          </button>
        </div>
      </div>
    </DemoShell>
  );
}

const filterCode = `@Component
@Order(1)
@Slf4j
public class InternalEndpointFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String path = httpRequest.getRequestURI();

        // Block any request that contains /internal/ after the service prefix
        if (path.matches(".*/internal(/.*)?")) {
            log.warn("Blocked attempt to access internal endpoint: {} from IP: {}",
                    path, httpRequest.getRemoteAddr());
            httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("{\\"error\\":\\"Access to internal endpoints is forbidden\\"}");
            return;
        }

        chain.doFilter(request, response);
    }
}`;

export function KhatiFilterDemo() {
  return (
    <DemoShell kind="source" note="gateway/filter/InternalEndpointFilter.java, unmodified." dark>
      <CodeWalkthrough
        file="gateway/.../filter/InternalEndpointFilter.java"
        lang="java"
        code={filterCode}
        steps={[
          { lines: [1, 4], note: "A plain servlet filter at @Order(1), so it runs before the proxy controller sees the request." },
          { lines: [11, 14], note: "One regex covers every service: /api/users/internal/…, /api/inventory/internal/update, and any internal route added later." },
          { lines: [15, 20], note: "It logs the caller's IP and short-circuits with a JSON 403. The request never reaches a downstream service." },
          { lines: [23, 23], note: "Everything else continues to the proxy. Services still call each other's /internal/ routes directly on the private network." },
        ]}
      />
    </DemoShell>
  );
}
