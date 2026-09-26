import { stats } from "@/data/profile";
import { Container } from "@/components/ui/Container";

export function Stats() {
  return (
    <Container as="section" aria-label="At a glance" className="mt-16 lg:mt-18">
      <ul className="grid grid-cols-2 gap-y-8 border-t-[1.5px] border-ink pt-7 lg:grid-cols-4">
        {stats.map((s) => (
          <li
            key={s.label}
            className="flex flex-col gap-2 pr-4 even:border-l even:border-line even:pl-5 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-line lg:[&:not(:first-child)]:pl-7"
          >
            <span className="text-[clamp(2.25rem,1.6rem+2vw,3.5rem)] leading-none font-extrabold tracking-[-0.045em]">{s.value}</span>
            <span className="text-base leading-snug text-ink-3">{s.label}</span>
          </li>
        ))}
      </ul>
    </Container>
  );
}
