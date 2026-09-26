export function Reflection({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <section aria-labelledby="reflection-title" className="grid gap-6 rounded-[32px] bg-accent-soft p-8 sm:p-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[15px] text-accent-ink">Reflection</span>
        <h2 id="reflection-title" className="text-4xl font-extrabold tracking-[-0.03em]">
          What I&apos;d change
        </h2>
      </div>
      <p className="text-[19px] leading-relaxed text-ink-2">{text}</p>
    </section>
  );
}
