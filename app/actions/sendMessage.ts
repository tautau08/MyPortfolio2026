"use server";

import { headers } from "next/headers";
import { profile } from "@/data/profile";
import { topicLabel, trimMessage, validateMessage, type MessageInput, type SendResult } from "@/lib/contact";

/**
 * Emails a visitor's message to me through Resend (https://resend.com).
 * Env: RESEND_API_KEY (required), CONTACT_TO and CONTACT_FROM (optional).
 * Reply-To is the visitor, so replying in Gmail answers them directly.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

/** Best-effort, per server instance: enough to stop one visitor flooding the inbox. */
function isRateLimited(key: string): boolean {
  const now = Date.now();
  // Forget visitors whose window has passed, so the map can't grow without bound.
  for (const [k, times] of recent) if (now - times[times.length - 1] >= WINDOW_MS) recent.delete(k);
  const hits = [...(recent.get(key) ?? []), now];
  recent.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

/** Server actions are public endpoints, so anything can arrive here: keep only strings. */
const asString = (value: unknown) => (typeof value === "string" ? value : "");

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const unavailable = `Couldn't send right now. Please email me at ${profile.links.email} instead.`;

export async function sendMessage(input: MessageInput & { website?: string }): Promise<SendResult> {
  // Honeypot: the field is hidden from people, so only bots fill it. Pretend it worked.
  if (asString(input?.website)) return { ok: true };

  const message = trimMessage({ name: asString(input?.name), email: asString(input?.email), topic: asString(input?.topic), message: asString(input?.message) });
  const errors = validateMessage(message);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) return { ok: false, error: "That's a lot of messages. Please try again in a few minutes." };

  const topic = topicLabel(message.topic);
  const subject = `Portfolio · ${topic} · ${message.name}`;
  const text = `${message.name} <${message.email}>\nTopic: ${topic}\n\n${message.message}`;
  const html = `<p><strong>${escapeHtml(message.name)}</strong> &lt;${escapeHtml(message.email)}&gt;<br>Topic: ${escapeHtml(topic ?? "")}</p><p style="white-space:pre-wrap">${escapeHtml(message.message)}</p>`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return { ok: false, error: unavailable };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
        to: process.env.CONTACT_TO || profile.links.email,
        reply_to: message.email,
        subject,
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error(`[contact] Resend responded ${res.status}: ${await res.text()}`);
      return { ok: false, error: unavailable };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact] Resend request failed", err);
    return { ok: false, error: unavailable };
  }
}
