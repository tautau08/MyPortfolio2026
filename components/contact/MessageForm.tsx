"use client";

import { useEffect, useId, useRef, useState, useTransition, type FormEvent, type KeyboardEvent } from "react";
import { sendMessage } from "@/app/actions/sendMessage";
import { contact, profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";
import { LIMITS, trimMessage, validateMessage, type FieldErrors, type MessageInput } from "@/lib/contact";
import { useDraft } from "@/lib/useDraft";
import { ComposeField, composeInput, composeRow } from "./ComposeField";
import { MessageSent } from "./MessageSent";
import { TopicPicker } from "./TopicPicker";

const empty: MessageInput = { name: "", email: "", topic: contact.form.topics[0].value, message: "" };

/** A message form styled as a mail compose window. Sends through a server action. */
export function MessageForm() {
  const [draft, setDraft, clearDraft] = useDraft("contact-draft", empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  // Until React has loaded, a click would do a plain browser submit and put the message in the URL.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const formRef = useRef<HTMLFormElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const id = useId();

  const ids = { name: `${id}-name`, email: `${id}-email`, topic: `${id}-topic`, message: `${id}-message` };
  const errorId = (field: keyof MessageInput) => `${ids[field]}-error`;
  const invalid = (field: keyof MessageInput) =>
    errors[field] ? { "aria-invalid": true, "aria-describedby": errorId(field) } : {};

  const update = (field: keyof MessageInput) => (value: string) => {
    setDraft((d) => ({ ...d, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = trimMessage(draft);
    const found = validateMessage(input);
    setErrors(found);
    setFormError("");
    const firstInvalid = (Object.keys(found) as (keyof MessageInput)[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    startTransition(async () => {
      try {
        const result = await sendMessage({ ...input, website: honeypot.current?.value });
        if (result.ok) {
          setSentTo(input.email);
          clearDraft();
        } else {
          setErrors(result.errors ?? {});
          setFormError(result.error ?? "");
        }
      } catch {
        setFormError(`Couldn't reach the server. Please email me at ${profile.links.email} instead.`);
      }
    });
  };

  // Ctrl/⌘ + Enter sends from any field, like a mail client.
  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const topic = contact.form.topics.find((t) => t.value === draft.topic) ?? contact.form.topics[0];

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.04]">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
        </span>
        <p className="ml-2 min-w-0 truncate font-mono text-[13px] text-on-contact-muted">
          New message to {profile.firstName}
          <span className="text-contact-accent"> · {topic.label}</span>
        </p>
      </div>

      {sentTo ? (
        <MessageSent email={sentTo} onReset={() => setSentTo(null)} />
      ) : (
        <form ref={formRef} noValidate onSubmit={onSubmit} onKeyDown={onKeyDown} aria-label={`Message ${profile.firstName}`} className="relative">
          <div className="grid sm:grid-cols-2">
            <ComposeField label="Name" htmlFor={ids.name} error={errors.name} errorId={errorId("name")} className="sm:border-r">
              <input
                id={ids.name}
                name="name"
                autoComplete="name"
                placeholder="Your name"
                maxLength={LIMITS.name}
                value={draft.name}
                onChange={(e) => update("name")(e.target.value)}
                className={composeInput}
                {...invalid("name")}
              />
            </ComposeField>
            <ComposeField label="Email" htmlFor={ids.email} error={errors.email} errorId={errorId("email")}>
              <input
                id={ids.email}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                maxLength={LIMITS.email}
                value={draft.email}
                onChange={(e) => update("email")(e.target.value)}
                className={composeInput}
                {...invalid("email")}
              />
            </ComposeField>
          </div>
          <TopicPicker value={draft.topic} onChange={update("topic")} error={errors.topic} errorId={errorId("topic")} />

          <div className={composeRow}>
            <label htmlFor={ids.message} className="sr-only">
              Message
            </label>
            <textarea
              id={ids.message}
              name="message"
              rows={3}
              placeholder={topic.placeholder}
              maxLength={LIMITS.message}
              value={draft.message}
              onChange={(e) => update("message")(e.target.value)}
              className="block max-h-[22rem] min-h-26 w-full resize-none bg-transparent px-5 py-3.5 text-base leading-relaxed text-on-contact outline-none [field-sizing:content] placeholder:text-on-contact-muted/55"
              {...invalid("message")}
            />
            {errors.message && (
              <p id={errorId("message")} className="px-5 pb-3 text-sm text-contact-accent">
                {errors.message}
              </p>
            )}
          </div>

          {/* Hidden from people and assistive tech; bots that fill every field reveal themselves. */}
          <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
            <label>
              Website
              <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
            </label>
          </div>

          {formError && (
            <p role="alert" className="px-5 pt-4 text-sm text-contact-accent">
              {formError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3">
            <p className="font-mono text-xs text-on-contact-muted">
              <span className="hidden sm:inline">Ctrl / ⌘ + Enter to send · </span>
              <span className="tabular">
                {draft.message.length}/{LIMITS.message}
              </span>
            </p>
            <Button type="submit" variant="accent" badgeIcon={pending ? undefined : "send"} disabled={pending || !ready}>
              {pending && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              {pending ? "Sending…" : "Send message"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
