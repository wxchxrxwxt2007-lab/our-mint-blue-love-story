import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Bubbles } from "@/components/anniv/decor";
import { CountdownLock, OPEN_AT, PasscodeLock } from "@/components/anniv/gates";
import { Coupons, EasterEggs, Gallery, Hero, Letter, Quiz } from "@/components/anniv/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Our Story Continues... Saynam · 2nd Month Anniversary" },
      { name: "description", content: "กล่องความลับฉลองครบรอบ 2 เดือนของเรา" },
      { property: "og:title", content: "Our Story Continues... Saynam" },
      { property: "og:description", content: "กล่องความลับฉลองครบรอบ 2 เดือนของเรา" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Stage = "loading" | "countdown" | "lock" | "main";

function Index() {
  const [now, setNow] = useState(0);
  const [stage, setStage] = useState<Stage>("loading");

  useEffect(() => {
    const t0 = Date.now();
    setNow(t0);
    setStage(t0 < OPEN_AT ? "countdown" : localStorage.getItem("anniv-unlocked") === "1" ? "main" : "countdown");
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const unlock = useCallback(() => {
    localStorage.setItem("anniv-unlocked", "1");
    setStage("main");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Bubbles />
      {stage === "countdown" && <CountdownLock now={now} onReady={() => Date.now() >= OPEN_AT && setStage("lock")} />}
      {stage === "lock" && now >= OPEN_AT && <PasscodeLock onUnlock={unlock} />}
      {stage === "main" && now >= OPEN_AT && (
        <main className="anim-fade-up relative z-10 mx-auto flex max-w-md flex-col gap-14 pb-20">
          <Hero now={now} />
          <Quiz />
          <Gallery />
          <Letter />
          <Coupons />
          <p className="text-center font-display text-sm text-muted-foreground">To be continued... EP.3 🐟🍮</p>
          <EasterEggs />
        </main>
      )}
    </div>
  );
}
