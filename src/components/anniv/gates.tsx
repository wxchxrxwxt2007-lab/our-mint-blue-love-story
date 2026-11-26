import { useEffect, useState } from "react";
import { HourglassIcon, PuddingIcon, FishIcon, StarIcon } from "./decor";

export const OPEN_AT = Date.parse("2026-11-29T06:00:00+07:00");
const PASS = "280869";

export function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export function TimeBoxes({ ms }: { ms: number }) {
  const t = split(ms);
  const items: [number, string][] = [[t.d, "วัน"], [t.h, "ชั่วโมง"], [t.m, "นาที"], [t.s, "วินาที"]];
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(([v, l], i) => (
        <div key={l} className={`card-cute py-3 text-center ${i % 2 ? "bg-pudding" : "bg-mint"}`}>
          <div className="font-display text-3xl font-bold tabular-nums">{String(v).padStart(2, "0")}</div>
          <div className="text-xs">{l}</div>
        </div>
      ))}
    </div>
  );
}

export function CountdownLock({ now, onReady }: { now: number; onReady: () => void }) {
  const left = OPEN_AT - now;
  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-5 text-center">
      <HourglassIcon className="anim-wiggle h-24 w-24" />
      <span className="rounded-full border-2 border-caramel bg-pudding px-4 py-1 text-sm font-semibold">COMING SOON · EP.2</span>
      {left > 0 ? (
        <>
          <p className="text-lg leading-relaxed">
            กำลังจะออนแอร์เร็วๆ นี้... อดใจรออีกนิดนะคนเก่งของเค้า เจอกันวันที่ 29 พ.ย. 69 เวลา 06:00:00 น. นะ!
          </p>
          <div className="w-full"><TimeBoxes ms={left} /></div>
        </>
      ) : (
        <button onClick={onReady} className="anim-glow rounded-full border-3 border-caramel bg-pudding px-6 py-4 text-lg font-bold">
          ถึงเวลาแล้ว! กดเพื่อเปิดกล่องความลับ ✨
        </button>
      )}
      <div className="flex gap-4"><PuddingIcon className="anim-float h-12 w-12" /><FishIcon className="anim-float h-12 w-12" /></div>
    </main>
  );
}

export function PasscodeLock({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(0);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    if (code.length !== 6) return;
    if (code === PASS) {
      setOpening(true);
      const t = setTimeout(onUnlock, 900);
      return () => clearTimeout(t);
    }
    setErr((e) => e + 1);
    const t = setTimeout(() => setCode(""), 500);
    return () => clearTimeout(t);
  }, [code, onUnlock]);

  const press = (k: string) => {
    if (opening) return;
    if (k === "del") setCode((c) => c.slice(0, -1));
    else if (code.length < 6) setCode((c) => c + k);
  };

  return (
    <main className={`relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-5 px-5 ${opening ? "anim-unlock" : ""}`}>
      <div className="card-cute relative w-full bg-secondary p-6 text-center">
        <StarIcon className="anim-wiggle absolute -right-4 -top-4 h-10 w-10" />
        <div className="text-5xl">{opening ? "🔓" : "🔒"}</div>
        <h1 className="mt-2 font-display text-2xl font-bold">กล่องความลับของเรา</h1>
        <p className="mt-1 text-sm text-muted-foreground">คำใบ้: คุยกันวันแรก 💬</p>
        <div key={err} className={`my-5 flex justify-center gap-2 ${err ? "anim-shake" : ""}`}>
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={`h-4 w-4 rounded-full border-2 border-caramel ${i < code.length ? "bg-turquoise" : "bg-card"}`} />
          ))}
        </div>
        {err > 0 && !opening && <p className="-mt-2 mb-3 text-sm text-destructive">ยังไม่ใช่น้า ลองใหม่อีกที</p>}
        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) =>
            k ? (
              <button key={i} onClick={() => press(k)} className="rounded-2xl border-2 border-caramel bg-card py-3 font-display text-2xl font-bold active:bg-mint">
                {k === "del" ? "⌫" : k}
              </button>
            ) : <span key={i} />,
          )}
        </div>
      </div>
    </main>
  );
}
