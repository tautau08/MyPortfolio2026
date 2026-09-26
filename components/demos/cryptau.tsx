"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { CodeWalkthrough } from "./CodeWalkthrough";
import { DemoShell } from "./DemoShell";

/* ── Sale split ───────────────────────────────────────────── */

const WEI = BigInt("1000000000000000000");
const LISTING_PRICE = BigInt(1_000_000_000); // 0.000000001 ether, from the contract

function toWei(eth: string): bigint | null {
  if (!/^\d*\.?\d{0,18}$/.test(eth) || eth === "" || eth === ".") return null;
  const [whole, frac = ""] = eth.split(".");
  return BigInt(whole || "0") * WEI + BigInt((frac + "0".repeat(18)).slice(0, 18));
}

function fmt(wei: bigint): string {
  const whole = wei / WEI;
  const frac = (wei % WEI).toString().padStart(18, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : `${whole}`;
}

export function CrypTauSaleDemo() {
  const [price, setPrice] = useState("0.0042");
  const [sent, setSent] = useState("0.0042");
  const [sold, setSold] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const priceWei = toWei(price);
  const sentWei = toWei(sent);

  const buy = () => {
    // createMarketSale's require() checks, in order.
    if (!priceWei || priceWei === BigInt(0)) return setResult({ ok: false, text: 'revert "Item not for sale"' });
    if (sold) return setResult({ ok: false, text: 'revert "Item already sold"' });
    if (sentWei !== priceWei) return setResult({ ok: false, text: 'revert "Please submit the asking price in order to complete the purchase"' });
    setSold(true);
    setResult({ ok: true, text: "MarketSale: token #7 → buyer. Payouts sent." });
  };

  const seller = priceWei && priceWei > LISTING_PRICE ? priceWei - LISTING_PRICE : BigInt(0);

  return (
    <DemoShell kind="interactive" note="Arithmetic and revert messages from createMarketSale in Cryptau.sol. Uses exact wei math (BigInt).">
      <div className="flex flex-col gap-5 p-5">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 font-mono text-[11px] text-ink-3">
            listed price (ETH)
            <input
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setSold(false);
                setResult(null);
              }}
              inputMode="decimal"
              className="rounded-md border border-line bg-paper px-2.5 py-1.5 text-sm text-ink tabular"
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-[11px] text-ink-3">
            msg.value sent by buyer (ETH)
            <input
              value={sent}
              onChange={(e) => setSent(e.target.value)}
              inputMode="decimal"
              className="rounded-md border border-line bg-paper px-2.5 py-1.5 text-sm text-ink tabular"
            />
          </label>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-lg border border-line bg-paper p-4 font-mono text-xs">
          <span className="text-ink-3">buyer pays</span>
          <span className="text-right tabular">{sentWei !== null ? fmt(sentWei) : "—"} ETH</span>
          <span className="text-ink-3">→ marketplace owner</span>
          <span className="text-right tabular">{fmt(LISTING_PRICE)} ETH</span>
          <span className="text-ink-3">→ seller</span>
          <span className="text-right font-semibold tabular">{fmt(seller)} ETH</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={buy} className="rounded-md bg-ink px-3.5 py-1.5 text-sm font-medium text-paper transition-transform duration-150 hover:-translate-y-px">
            createMarketSale(7)
          </button>
          <button
            type="button"
            onClick={() => {
              setSold(false);
              setResult(null);
              setSent(price);
            }}
            className="font-mono text-xs text-ink-3 hover:text-ink"
          >
            relist
          </button>
          <span className={cn("rounded-full px-2 py-0.5 font-mono text-[11px]", sold ? "bg-paper-3 text-ink-3" : "bg-signal/15 text-signal-ink")}>{sold ? "sold" : "listed"}</span>
        </div>

        <p aria-live="polite" className={cn("min-h-[2.5rem] font-mono text-xs leading-relaxed", result ? (result.ok ? "text-signal" : "text-danger") : "text-ink-3")}>
          {result?.text ?? "Try sending a different amount, or buying the same token twice."}
        </p>
      </div>
    </DemoShell>
  );
}

/* ── Contract walkthrough ─────────────────────────────────── */

const saleCode = `function createMarketSale(uint256 tokenId) public payable {
    uint price = idToMarketItem[tokenId].price;
    address seller = idToMarketItem[tokenId].seller;

    require(price > 0, "Item not for sale");
    require(!idToMarketItem[tokenId].sold, "Item already sold");
    require(idToMarketItem[tokenId].owner == address(this), "Item not available");
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");

    idToMarketItem[tokenId].owner = payable(msg.sender);
    idToMarketItem[tokenId].sold = true;
    idToMarketItem[tokenId].seller = payable(address(0));
    _itemsSold.increment();

    _transfer(address(this), msg.sender, tokenId);

    uint256 sellerAmount = msg.value - listingPrice;
    payable(owner).transfer(listingPrice);
    payable(seller).transfer(sellerAmount);
}`;

export function CrypTauContractDemo() {
  return (
    <DemoShell kind="source" note="contracts/Cryptau.sol, comments removed." dark>
      <CodeWalkthrough
        file="contracts/Cryptau.sol"
        lang="sol"
        code={saleCode}
        steps={[
          { lines: [5, 8], note: "Checks first: the item exists, isn't sold, is held in escrow by the contract, and the buyer sent exactly the asking price." },
          { lines: [10, 13], note: "Effects next: storage is updated before any ETH moves, so a re-entrant call would see the item as sold." },
          { lines: [15, 15], note: "The contract releases the escrowed token straight to the buyer." },
          { lines: [17, 19], note: "Interactions last. transfer() forwards only 2300 gas, which limits reentrancy, but a seller contract that rejects ETH would make its own sale revert. Pull payments would fix that." },
        ]}
      />
    </DemoShell>
  );
}
