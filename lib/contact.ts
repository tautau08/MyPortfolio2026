import { contact } from "@/data/profile";

/** Shared by the form (instant feedback) and the server action (the check that counts). */

export const LIMITS = { name: 80, email: 254, minMessage: 10, message: 2000 } as const;

export interface MessageInput {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export type FieldErrors = Partial<Record<keyof MessageInput, string>>;

export type SendResult = { ok: true } | { ok: false; errors?: FieldErrors; error?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const topicLabel = (value: string) => contact.form.topics.find((t) => t.value === value)?.label;

/** Trims every field; the name also collapses line breaks, since it goes into the email subject. */
export function trimMessage(input: MessageInput): MessageInput {
  return { name: input.name.replace(/\s+/g, " ").trim(), email: input.email.trim(), topic: input.topic, message: input.message.trim() };
}

export function validateMessage({ name, email, topic, message }: MessageInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!name) errors.name = "Add your name so I know who's writing.";
  else if (name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`;
  if (!EMAIL.test(email) || email.length > LIMITS.email) errors.email = "That email doesn't look right. I'll reply there.";
  if (!topicLabel(topic)) errors.topic = "Pick what this is about.";
  if (message.length < LIMITS.minMessage) errors.message = `Write at least ${LIMITS.minMessage} characters.`;
  else if (message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters.`;
  return errors;
}
