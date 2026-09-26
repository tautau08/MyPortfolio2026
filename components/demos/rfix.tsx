"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { DemoShell } from "./DemoShell";

type Role = "admin" | "hr" | "employee";
type Method = "GET" | "POST" | "PUT" | "DELETE";

interface Permission {
  method: Method;
  endpoint: string;
}

/** Sample role_permissions rows. The roles are the ones roleController seeds. */
const GRANTS: Record<Role, Permission[]> = {
  admin: [
    { method: "GET", endpoint: "/api/users" },
    { method: "GET", endpoint: "/api/users/:id" },
    { method: "POST", endpoint: "/api/users" },
    { method: "PUT", endpoint: "/api/users/:id" },
    { method: "DELETE", endpoint: "/api/users/:id" },
    { method: "GET", endpoint: "/api/roles" },
    { method: "POST", endpoint: "/api/roles" },
    { method: "GET", endpoint: "/api/permissions" },
  ],
  hr: [
    { method: "GET", endpoint: "/api/users" },
    { method: "GET", endpoint: "/api/users/:id" },
    { method: "POST", endpoint: "/api/users" },
    { method: "PUT", endpoint: "/api/users/:id" },
    { method: "GET", endpoint: "/api/users/profile" },
    { method: "PUT", endpoint: "/api/users/profile" },
  ],
  employee: [
    { method: "GET", endpoint: "/api/users/profile" },
    { method: "PUT", endpoint: "/api/users/profile" },
  ],
};

/** JS version of the SQL: p.endpoint = $3 OR $3 ~ ('^' || REPLACE(REPLACE(p.endpoint, ':id', '[0-9]+'), '/', '\/') || '$') */
function toPattern(endpoint: string): string {
  return "^" + endpoint.replaceAll(":id", "[0-9]+").replaceAll("/", "\\/") + "$";
}

function normalize(path: string): string {
  const p = path.trim().split("?")[0];
  return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
}

export function RfixPermissionDemo() {
  const [role, setRole] = useState<Role>("hr");
  const [method, setMethod] = useState<Method>("DELETE");
  const [path, setPath] = useState("/api/users/42");

  const endpoint = normalize(path);
  const match = useMemo(
    () => GRANTS[role].find((p) => p.method === method && (p.endpoint === endpoint || new RegExp(toPattern(p.endpoint)).test(endpoint))),
    [role, method, endpoint],
  );

  const body = match
    ? { success: true, note: "next()" }
    : {
        success: false,
        message: "Access denied. You do not have permission to perform this action.",
        details: { requiredPermission: `${method} ${endpoint}`, yourRole: role },
      };

  return (
    <DemoShell kind="interactive" note="Matching logic ported from Permission.checkPermission and permissionMiddleware. Grant rows are sample data.">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 font-mono text-[11px] text-ink-3">
            role
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm text-ink">
              <option>admin</option>
              <option>hr</option>
              <option>employee</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 font-mono text-[11px] text-ink-3">
            method
            <select value={method} onChange={(e) => setMethod(e.target.value as Method)} className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm text-ink">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </label>
          <label className="flex min-w-[12rem] flex-1 flex-col gap-1 font-mono text-[11px] text-ink-3">
            path
            <input value={path} onChange={(e) => setPath(e.target.value)} spellCheck={false} className="rounded-md border border-line bg-paper px-2.5 py-1.5 font-mono text-sm text-ink" />
          </label>
        </div>

        <div className="rounded-lg border border-line bg-paper p-3">
          <p className="font-mono text-[11px] text-ink-3">role_permissions for {role}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {GRANTS[role].map((g) => {
              const hit = match === g;
              return (
                <li
                  key={g.method + g.endpoint}
                  title={toPattern(g.endpoint)}
                  className={cn("rounded px-1.5 py-0.5 font-mono text-[11px] transition-colors", hit ? "bg-signal text-paper" : "bg-paper-3 text-ink-2")}
                >
                  {g.method} {g.endpoint}
                </li>
              );
            })}
          </ul>
          {match && match.endpoint.includes(":id") && (
            <p className="mt-2 font-mono text-[11px] text-ink-3">
              matched via regex <span className="text-ink">{toPattern(match.endpoint)}</span>
            </p>
          )}
        </div>

        <pre tabIndex={0} aria-label="Middleware response" aria-live="polite" className="overflow-x-auto rounded-md bg-code-bg p-3 font-mono text-[11.5px] leading-relaxed text-code-ink">
          <span className={match ? "text-code-str" : "text-code-kw"}>{match ? "200 OK" : "403 Forbidden"}</span>
          {"\n"}
          {JSON.stringify(body, null, 2)}
        </pre>
      </div>
    </DemoShell>
  );
}

/* ── Menu tree ────────────────────────────────────────────── */

interface MenuRow {
  id: number;
  name: string;
  route: string | null;
  parent_id: number | null;
  roles: Role[];
}

const MENUS: MenuRow[] = [
  { id: 1, name: "Dashboard", route: "/dashboard", parent_id: null, roles: ["admin", "hr", "employee"] },
  { id: 2, name: "People", route: null, parent_id: null, roles: ["admin", "hr", "employee"] },
  { id: 3, name: "Directory", route: "/users", parent_id: 2, roles: ["admin", "hr"] },
  { id: 4, name: "My profile", route: "/profile", parent_id: 2, roles: ["admin", "hr", "employee"] },
  { id: 5, name: "Access", route: null, parent_id: null, roles: ["admin", "hr", "employee"] },
  { id: 6, name: "Roles", route: "/roles", parent_id: 5, roles: ["admin"] },
  { id: 7, name: "Permissions", route: "/permissions", parent_id: 5, roles: ["admin"] },
];

type Node = MenuRow & { children: Node[] };

/** Same two passes and filter as Menu.buildTree. */
function buildTree(flat: MenuRow[]): Node[] {
  const map: Record<number, Node> = {};
  const tree: Node[] = [];
  flat.forEach((m) => (map[m.id] = { ...m, children: [] }));
  flat.forEach((m) => {
    if (m.parent_id && map[m.parent_id]) map[m.parent_id].children.push(map[m.id]);
    else if (!m.parent_id) tree.push(map[m.id]);
  });
  return tree.filter((p) => p.route || p.children.length > 0);
}

export function RfixMenuDemo() {
  const [role, setRole] = useState<Role>("employee");
  const visible = MENUS.filter((m) => m.roles.includes(role));
  const tree = buildTree(visible);
  const dropped = MENUS.filter((m) => m.parent_id === null && m.roles.includes(role) && !tree.some((t) => t.id === m.id));

  return (
    <DemoShell kind="interactive" note="Tree logic ported from Menu.buildTree. Menu rows are sample data.">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 p-5 sm:grid-cols-2">
        <div>
          <div role="radiogroup" aria-label="Role" className="flex gap-2">
            {(["admin", "hr", "employee"] as const).map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={role === r}
                onClick={() => setRole(r)}
                className={cn("rounded-full border px-3 py-1 font-mono text-xs transition-colors", role === r ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink-3")}
              >
                {r}
              </button>
            ))}
          </div>
          <table className="mt-4 w-full font-mono text-[11px]">
            <caption className="sr-only">Menu rows visible to {role}</caption>
            <thead className="text-left text-ink-3">
              <tr>
                <th className="py-1 font-normal">id</th>
                <th className="py-1 font-normal">name</th>
                <th className="py-1 font-normal">parent_id</th>
              </tr>
            </thead>
            <tbody>
              {MENUS.map((m) => {
                const on = m.roles.includes(role);
                return (
                  <tr key={m.id} className={cn("transition-opacity", on ? "text-ink" : "text-ink-3 line-through")}>
                    <td className="py-0.5">{m.id}</td>
                    <td className="py-0.5">{m.name}</td>
                    <td className="py-0.5">{m.parent_id ?? "null"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-line bg-paper p-4" aria-live="polite">
          <p className="font-mono text-[11px] text-ink-3">sidebar for {role}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {tree.map((n) => (
              <li key={n.id} className="animate-rise">
                <span className="font-medium">{n.name}</span>
                {n.children.length > 0 && (
                  <ul className="mt-1 ml-1 space-y-1 border-l border-line pl-3 text-ink-2">
                    {n.children.map((c) => (
                      <li key={c.id}>{c.name}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          {dropped.length > 0 && <p className="mt-3 font-mono text-[11px] text-ink-3">dropped (no route, no children): {dropped.map((d) => d.name).join(", ")}</p>}
        </div>
      </div>
    </DemoShell>
  );
}
