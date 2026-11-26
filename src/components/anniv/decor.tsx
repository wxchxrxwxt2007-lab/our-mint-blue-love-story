import type { SVGProps } from "react";

const stroke = { stroke: "var(--caramel)", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function PuddingIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" {...p}>
      <path d="M14 50 L20 24 Q32 18 44 24 L50 50 Q32 56 14 50Z" fill="var(--pudding)" {...stroke} />
      <path d="M20 24 Q32 14 44 24 Q40 30 32 28 Q24 30 20 24Z" fill="var(--caramel)" {...stroke} />
      <circle cx="26" cy="38" r="1.8" fill="var(--caramel)" />
      <circle cx="38" cy="38" r="1.8" fill="var(--caramel)" />
      <path d="M29 43 Q32 46 35 43" fill="none" {...stroke} strokeWidth={2} />
    </svg>
  );
}
export function BeretIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" {...p}>
      <path d="M8 38 Q10 18 32 18 Q54 18 56 38 Q32 44 8 38Z" fill="var(--caramel)" {...stroke} stroke="var(--foreground)" />
      <path d="M32 18 L33 11" {...stroke} stroke="var(--foreground)" />
    </svg>
  );
}
export function FishIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" {...p}>
      <path d="M10 32 Q24 12 42 22 Q52 28 52 32 Q52 36 42 42 Q24 52 10 32Z" fill="var(--turquoise)" {...stroke} />
      <path d="M50 32 L60 22 L60 42Z" fill="var(--mint)" {...stroke} />
      <circle cx="22" cy="29" r="2.5" fill="var(--foreground)" />
      <path d="M15 37 Q20 40 26 37" fill="none" {...stroke} strokeWidth={2} />
    </svg>
  );
}
export function OctopusIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" {...p}>
      <path d="M16 34 Q14 12 32 12 Q50 12 48 34 Q52 44 46 50 Q42 42 40 48 Q36 54 32 46 Q28 54 24 48 Q22 42 18 50 Q12 44 16 34Z" fill="var(--mint)" {...stroke} />
      <circle cx="26" cy="28" r="2.2" fill="var(--foreground)" />
      <circle cx="38" cy="28" r="2.2" fill="var(--foreground)" />
      <circle cx="22" cy="33" r="2.5" fill="var(--pudding)" />
      <circle cx="42" cy="33" r="2.5" fill="var(--pudding)" />
    </svg>
  );
}
export function StarIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" {...p}>
      <path d="M32 6 Q35 28 58 32 Q35 36 32 58 Q29 36 6 32 Q29 28 32 6Z" fill="var(--pudding)" {...stroke} />
    </svg>
  );
}
export function HourglassIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" {...p}>
      <path d="M16 8 H48 M16 56 H48" {...stroke} strokeWidth={4} />
      <path d="M20 8 Q20 26 32 32 Q44 26 44 8Z" fill="var(--mint)" {...stroke} />
      <path d="M20 56 Q20 38 32 32 Q44 38 44 56Z" fill="var(--pudding)" {...stroke} />
    </svg>
  );
}

const bubbles = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 8 + ((i * 13) % 22),
  dur: 9 + ((i * 7) % 10),
  delay: (i * 1.3) % 12,
}));

export function Bubbles() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="anim-bubble absolute -bottom-10 rounded-full border-2 border-turquoise/50 bg-mint/30"
          style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
        />
      ))}
    </div>
  );
}

export function Confetti({ burst }: { burst: number }) {
  if (!burst) return null;
  return (
    <div key={burst} aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-visible">
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className="anim-pop absolute bottom-6 text-2xl"
          style={{ left: `${8 + i * 6.5}%`, animationDelay: `${(i % 5) * 0.08}s`, color: i % 2 ? "var(--turquoise)" : "var(--pudding)" }}
        >
          {i % 3 === 0 ? "◦" : "♥"}
        </span>
      ))}
    </div>
  );
}
