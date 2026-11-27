import { useEffect, useMemo, useState } from "react";
import { BeretIcon, Confetti, FishIcon, OctopusIcon, PuddingIcon, StarIcon } from "./decor";
import { TimeBoxes } from "./gates";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { COUPONS } from "@/lib/coupons";
import { listUsedCoupons, redeemCoupon, sendMessage } from "@/lib/love.functions";

const SINCE = Date.parse("2026-09-29T00:00:00+07:00");

function Title({ en, th }: { en: string; th: string }) {
  return (
    <div className="mb-5 text-center">
      <p className="font-display text-sm font-semibold tracking-widest text-turquoise">{en}</p>
      <h2 className="font-display text-2xl font-bold">{th}</h2>
    </div>
  );
}

function LoveHeart() {
  const [beat, setBeat] = useState(false);
  const words = useMemo(() => {
    const out: { x: number; y: number; z: number; ry: number; c: number }[] = [];
    const layers = [-1, -0.5, 0, 0.5, 1];
    layers.forEach((l, li) => {
      const scale = Math.sqrt(1 - l * l * 0.75);
      const n = Math.round(22 * scale) + 4;
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2;
        const x = 16 * Math.sin(t) ** 3;
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        out.push({ x: x * 6 * scale, y: y * 6 * scale, z: l * 55, ry: 0, c: (i + li) % 2 });
      }
    });
    return out;
  }, []);
  return (
    <div
      className="relative mx-auto my-4 h-64 w-64 [perspective:800px]"
      onPointerEnter={() => setBeat(true)}
      onPointerLeave={() => setBeat(false)}
      onClick={() => setBeat((b) => !b)}
      role="img"
      aria-label="หัวใจ 3 มิติจากคำว่า LOVE"
    >
      <div className={`absolute inset-0 ${beat ? "anim-beat" : ""}`} style={{ transformStyle: "preserve-3d" }}>
        <div className="anim-spin3d absolute left-1/2 top-1/2">
          {words.map((w, i) => (
            <span
              key={i}
              className={`absolute font-display text-[11px] font-bold ${w.c ? "text-turquoise glow-mint" : "text-caramel glow-pudding"}`}
              style={{ transform: `translate(-50%,-50%) translate3d(${w.x}px, ${w.y}px, ${w.z}px)` }}
            >
              LOVE
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero({ now }: { now: number }) {
  return (
    <section className="relative px-5 pt-10 text-center">
      <BeretIcon className="anim-float absolute left-4 top-6 h-10 w-10" />
      <StarIcon className="anim-wiggle absolute right-6 top-10 h-8 w-8" />
      <span className="inline-block -rotate-2 rounded-full border-2 border-caramel bg-pudding px-4 py-1 text-sm font-bold">
        🎬 2nd Month Anniversary
      </span>
      <LoveHeart />
      <p className="text-xs text-muted-foreground">แตะหัวใจดูสิ ♥</p>
      <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
        Our Story Continues...
        <span className="block text-5xl text-turquoise glow-pudding">Saynam</span>
      </h1>
      <p className="mt-4 text-sm">เรื่องราวของเราดำเนินมาแล้ว</p>
      <div className="mx-auto mt-3 max-w-sm"><TimeBoxes ms={now - SINCE} /></div>
    </section>
  );
}

const QUIZ = [
  { q: "เราเจอกันครั้งแรกที่ไหน?", opts: ["งานเลี้ยงของเพื่อน", "ร้านกาแฟแถวมหาลัย", "โรงแรม"], a: 2, note: "โรงแรม ร้ายไม่เบาเลยนะแฟนชั้น 😏" },
  { q: "เดตแรกของเราไปทำอะไรกัน?", opts: ["กินบุฟเฟต์", "ดูหนังที่โรง", "นอน"], a: 2, note: "นอน ใช่แค่นอนอ่ะป่าววอิอ้วน 🤭" },
  { q: "ของขวัญชิ้นแรกที่ให้ชั้นคืออะไร?", opts: ["ช่อดอกไม้", "ตุ๊กตา", "เสื้อ"], a: 2, note: "เสื้อ ไม่ใช่ตัวเธอหรอจ้ะอ้วน 😘" },
];

export function resultText(score: number) {
  if (score === 3) return "ได้ 3/3 เต็ม! แฟนเค้าเก่งจัง รู้ใจเค้าที่สุดเลย รางวัลคือจุ๊บ 1 ที! 😘";
  if (score === 2) return "ได้ 2/3 คะแนน! แฟนเค้าเก่งจัง เกือบเต็มแล้วนะเนี่ย น่ารักที่สุดเลย 💛🩵";
  return `ได้ ${score}/3 คะแนน... สงสัยเดือนที่ 3 เราต้องรู้จักกันให้มากกว่านี้แล้วล่ะ! (มาให้เค้ากอดซ่อมคะแนนเดี๋ยวนี้เลย)`;
}

export function Quiz() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [burst, setBurst] = useState(0);
  const done = idx >= QUIZ.length;
  const cur = QUIZ[idx];

  const pick = (i: number) => {
    if (picked !== null || !cur) return;
    setPicked(i);
    if (i === cur.a) { setScore((s) => s + 1); setBurst((b) => b + 1); }
  };
  const next = () => {
    setPicked(null);
    setIdx((n) => n + 1);
    if (idx === QUIZ.length - 1) setBurst((b) => b + 1);
  };
  const reset = () => { setIdx(0); setPicked(null); setScore(0); };

  return (
    <section className="px-5">
      <Title en="MINI QUIZ" th="เช็กความใจตรงกัน" />
      <div className="card-cute relative overflow-hidden bg-mint/60 p-5">
        <Confetti burst={burst} />
        {done ? (
          <div className="anim-fade-up text-center">
            <PuddingIcon className="anim-float mx-auto h-16 w-16" />
            <p className="mt-2 font-display text-5xl font-bold text-caramel">{score}/3</p>
            <p className="mt-3 text-xl font-bold leading-relaxed">{resultText(score)}</p>
            <button onClick={reset} className="mt-5 rounded-full border-2 border-caramel bg-card px-4 py-2 text-sm font-semibold">
              ลองตอบใหม่อีกครั้ง 🔁
            </button>
          </div>
        ) : cur && (
          <div key={idx} className="anim-fade-up">
            <div className="mb-3 flex justify-between text-sm font-semibold">
              <span>ข้อ {idx + 1}/3</span><span>คะแนน {score}</span>
            </div>
            <p className="mb-4 text-lg font-bold">{cur.q}</p>
            <div className="flex flex-col gap-2">
              {cur.opts.map((o, i) => {
                const state = picked === null ? "bg-card" : i === cur.a ? "bg-turquoise text-primary-foreground" : i === picked ? "bg-destructive/20 line-through" : "bg-card opacity-60";
                return (
                  <button key={o} onClick={() => pick(i)} className={`rounded-2xl border-2 border-caramel px-4 py-3 text-left font-medium ${state}`}>
                    {o}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="anim-fade-up mt-4 rounded-2xl bg-pudding p-3 text-center">
                <p className="font-bold">{picked === cur.a ? "ถูกต้อง! 🎉" : "ผิดน้า~ 🙈"}</p>
                <p className="text-sm">เฉลย: {cur.note}</p>
                <button onClick={next} className="mt-2 rounded-full bg-caramel px-4 py-1.5 text-sm font-semibold text-accent-foreground">
                  {idx === QUIZ.length - 1 ? "ดูผลคะแนน" : "ข้อต่อไป →"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// เปลี่ยนรูป: ใส่ไฟล์ใน public/images แล้วใส่ src เช่น "/images/photo1.jpg"
const PHOTOS: { src?: string; caption: string; date: string }[] = [
  { caption: "[ฉากแรก] วันที่เรื่องราวของเราเริ่มต้น", date: "29.09.2026" },
  { caption: "[เธอยิ้ม] แล้วเค้าก็ยิ้มตาม", date: "05.10.2026" },
  { caption: "[เดตแรก] หลับปุ๋ยข้างกันทั้งคู่", date: "12.10.2026" },
  { caption: "[เสื้อตัวแรก] ใส่แล้วน่ารักมาก", date: "20.10.2026" },
  { caption: "[ครบ 1 เดือน] ยังเขินเหมือนเดิม", date: "29.10.2026" },
  { caption: "[EP.2] และเรื่องราวยังไม่จบ...", date: "29.11.2026" },
];

export function Gallery() {
  const icons = [PuddingIcon, FishIcon, OctopusIcon, BeretIcon, StarIcon, PuddingIcon];
  return (
    <section className="px-5">
      <Title en="OUR MEMORIES" th="ฉากประทับใจ" />
      <div className="grid grid-cols-2 gap-4">
        {PHOTOS.map((p, i) => {
          const Icon = icons[i] ?? StarIcon;
          return (
            <figure key={i} className={`shadow-soft bg-card p-2 pb-3 ${i % 2 ? "rotate-2" : "-rotate-2"}`}>
              <div className={`flex aspect-square items-center justify-center overflow-hidden ${i % 2 ? "bg-pudding" : "bg-mint"}`}>
                {p.src ? <img src={p.src} alt={p.caption} className="h-full w-full object-cover" loading="lazy" /> : <Icon className="h-16 w-16 opacity-80" />}
              </div>
              <figcaption className="mt-2 text-center">
                <p className="rounded bg-foreground/80 px-1 py-0.5 text-[11px] text-background">{p.caption}</p>
                <p className="mt-1 font-display text-[11px] text-muted-foreground">{p.date}</p>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

const LETTER = "สุขสันต์วันครบรอบ 2 เดือนนะ ในซีรีส์/หนัง เรื่องโปรดของเธออาจจะมีฉากที่ทำให้ยิ้มตามตั้งหลายฉาก แต่สำหรับเค้า ฉากที่ชอบที่สุดในชีวิตจริงคือทุกวันที่มีเธออยู่ข้างๆ นะ ขอบคุณที่เข้ามาเป็นความสบายใจ เป็นรอยยิ้ม และเป็นความน่ารักในทุกๆ วันของเค้า ผ่านมา 2 เดือนแล้ว แต่เรื่องราวของเรายังมีเยอะแยะเลย อยู่เป็นคนโปรดของเค้าไปนานๆ เลยนะครับ";

export function Letter() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<string[]>([]);
  const [text, setText] = useState("");
  useEffect(() => { try { setMsgs(JSON.parse(localStorage.getItem("anniv-msgs") ?? "[]")); } catch { /* ignore */ } }, []);
  const save = useServerFn(sendMessage);
  const [err, setErr] = useState(false);
  const send = async () => {
    const t = text.trim().slice(0, 500); if (!t) return;
    const n = [...msgs, t]; setMsgs(n); setText(""); setErr(false);
    localStorage.setItem("anniv-msgs", JSON.stringify(n));
    try { await save({ data: { message: t } }); } catch { setErr(true); }
  };
  return (
    <section className="px-5">
      <Title en="SECRET SCRIPT" th="จดหมายถึงคนโปรด" />
      {!open ? (
        <button onClick={() => setOpen(true)} className="card-cute relative mx-auto block aspect-[3/2] w-full bg-pudding">
          <svg viewBox="0 0 300 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <path d="M0 0 L150 110 L300 0" fill="none" stroke="var(--caramel)" strokeWidth="4" />
          </svg>
          <span className="absolute left-1/2 top-[48%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-3 border-caramel bg-mint">
            <OctopusIcon className="h-11 w-11" />
          </span>
          <span className="absolute bottom-3 left-0 right-0 text-center text-sm font-semibold">แตะเพื่อเปิดซอง 💌</span>
        </button>
      ) : (
        <div className="card-cute anim-fade-up bg-card p-5">
          <p className="leading-loose">{LETTER}</p>
          <p className="mt-3 text-right font-semibold">— จากเค้า 🐟🍮</p>
        </div>
      )}
      <div className="card-cute mt-5 bg-mint/50 p-4">
        <p className="mb-3 text-center text-sm font-bold">💬 ตอบบทพูดกลับหาเค้า</p>
        <div className="mb-3 flex flex-col gap-2">
          <div className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-card px-3 py-2 text-sm">ครบ 2 เดือนแล้วนะ อยากบอกอะไรเค้ามั้ย? 🥺</div>
          {msgs.map((m, i) => (
            <div key={i} className="anim-fade-up max-w-[80%] self-end rounded-2xl rounded-br-sm bg-turquoise px-3 py-2 text-sm text-primary-foreground">{m}</div>
          ))}
        </div>
        {err && <p className="mb-2 text-center text-xs text-destructive">ส่งไม่สำเร็จ ลองใหม่อีกครั้งนะ</p>}
        <div className="flex gap-2">
          <input maxLength={500} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="พิมพ์ข้อความ..." className="min-w-0 flex-1 rounded-full border-2 border-caramel bg-card px-4 py-2 text-sm outline-none" />
          <button onClick={send} className="shrink-0 rounded-full border-2 border-caramel bg-pudding px-3 py-2 text-sm font-bold">ส่งบทพูดถึงเค้า</button>
        </div>
      </div>
    </section>
  );
}

export function Coupons() {
  const [usedTitles, setUsedTitles] = useState<string[]>([]);
  const list = useServerFn(listUsedCoupons);
  const redeem = useServerFn(redeemCoupon);
  useEffect(() => { list().then(setUsedTitles).catch(() => {}); }, [list]);
  const used = COUPONS.map((c, i) => (usedTitles.includes(c.t) ? i : -1)).filter((i) => i >= 0);
  const use = async (i: number) => {
    const t = COUPONS[i]?.t; if (!t) return;
    setUsedTitles((u) => [...u, t]);
    try { await redeem({ data: { title: t } }); setUsedTitles(await list()); } catch { setUsedTitles((u) => u.filter((x) => x !== t)); }
  };
  return (
    <section className="px-5">
      <Title en="LOVE COUPONS" th="คูปองตามใจแฟน" />
      <div className="flex flex-col gap-4">
        {COUPONS.map((c, i) => {
          const isUsed = used.includes(i);
          return (
            <div key={i} className={`shadow-soft relative flex overflow-hidden rounded-2xl border-2 border-dashed border-caramel ${i % 2 ? "bg-mint" : "bg-pudding"}`}>
              <div className="flex w-16 shrink-0 flex-col items-center justify-center border-r-2 border-dashed border-caramel bg-card/60 font-display">
                <span className="text-[10px]">ADMIT</span><span className="text-2xl font-bold">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex-1 p-3">
                <p className="font-bold">{c.t}</p>
                <p className="mt-1 text-xs leading-relaxed">{c.d}</p>
                <button disabled={isUsed} onClick={() => use(i)} className="mt-2 rounded-full border-2 border-caramel bg-card px-3 py-1 text-xs font-bold disabled:opacity-50">
                  {isUsed ? "ใช้แล้ว" : "กดใช้สิทธิ์ 🎟️"}
                </button>
              </div>
              {isUsed && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/40">
                  <span className="anim-stamp rounded-xl border-4 border-double border-destructive px-3 py-1 text-center text-sm font-bold text-destructive">
                    ใช้สิทธิ์แล้ว!<br />แคปหน้าจอส่งให้เค้าได้เลย
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function EasterEggs() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-label="พุดดิ้ง" onClick={() => setOpen(true)} className="fixed bottom-2 left-2 z-30 opacity-60"><PuddingIcon className="h-7 w-7" /></button>
      <Link to="/admin" aria-label="เจ้าของเว็บ" className="fixed bottom-2 right-2 z-30 text-xs opacity-20">🔑</Link>
      <button aria-label="ปลาหมึกน้อย" onClick={() => setOpen(true)} className="fixed right-2 top-2 z-30 opacity-60"><OctopusIcon className="h-7 w-7" /></button>
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-foreground/40 p-6" onClick={() => setOpen(false)}>
          <div className="card-cute anim-stamp relative max-w-xs bg-pudding p-6 text-center" style={{ animationName: "fade-up" }}>
            <Confetti burst={1} />
            <div className="text-5xl">😘</div>
            <p className="mt-3 text-xl font-bold">เก่งมากที่หาเจอ! รางวัลคือจุ๊บ 1 ที 😘</p>
            <button className="mt-4 rounded-full border-2 border-caramel bg-card px-4 py-1.5 text-sm font-semibold">รับจุ๊บ 💛</button>
          </div>
        </div>
      )}
    </>
  );
}
