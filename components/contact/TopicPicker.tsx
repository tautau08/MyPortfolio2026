import { contact } from "@/data/profile";
import { composeLabel, composeRow } from "./ComposeField";

interface TopicPickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  errorId: string;
}

/** Radio buttons styled as chips. The choice becomes the email subject. */
export function TopicPicker({ value, onChange, error, errorId }: TopicPickerProps) {
  return (
    <fieldset className={composeRow} aria-describedby={error ? errorId : undefined}>
      <legend className="sr-only">What is this about?</legend>
      <div className="flex items-start gap-4 px-5 py-2.5">
        <span aria-hidden="true" className={`${composeLabel} pt-1.5`}>
          About
        </span>
        <div className="flex flex-wrap gap-2">
          {contact.form.topics.map((t) => (
            <label
              key={t.value}
              className="cursor-pointer rounded-full border border-white/20 px-3.5 py-1 text-sm font-semibold text-on-contact-muted transition-colors hover:border-on-contact hover:text-on-contact has-checked:border-on-contact has-checked:bg-on-contact has-checked:text-contact has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-contact-accent"
            >
              <input type="radio" name="topic" value={t.value} checked={value === t.value} onChange={() => onChange(t.value)} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </div>
      {error && (
        <p id={errorId} className="-mt-1 pr-5 pb-2.5 pl-[5.25rem] text-sm text-contact-accent">
          {error}
        </p>
      )}
    </fieldset>
  );
}
