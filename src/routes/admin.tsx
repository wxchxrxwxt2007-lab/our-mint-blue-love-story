import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { Bubbles, FishIcon, PuddingIcon } from "@/components/anniv/decor";
import { adminData, adminLogin, adminLogout, adminResetCoupon, adminStatus } from "@/lib/love.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Secret Admin Inbox · Saynam" },
      { name: "description", content: "กล่องข้อความลับของเจ้าของเว็บ" },
      { property: "og:title", content: "Secret Admin Inbox" },
      { property: "og:description", content: "กล่องข้อความลับของเจ้าของเว็บ" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Data = Awaited<ReturnType<typeof adminData>>;
const fmt = (s: string) => new Date(s).toLocaleString("th-TH", { timeZone: "Asia/Bangkok", dateStyle: "medium", timeStyle: "short" });

function Admin() {
  const status = useServerFn(adminStatus);
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const load = useServerFn(adminData);
  const reset = useServerFn(adminResetCoupon);
  const [state, setState] = useState<"loading" | "locked" | "in">("loading");
  const [data, setData] = useState<Data | null>(null);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const refresh = useCallback(async () => setData(await load()), [load]);
  useEffect(() => {
    status().then(async (s) => { if (s.admin) { await refresh(); setState("in"); } else setState("locked"); }).catch(() => setState("locked"));
  }, [status, refresh]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await login({ data: { password: pw } });
    if (r.ok) { await refresh(); setState("in"); setErr(false); } else setErr(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Bubbles />
      <main className="relative z-10 mx-auto max-w-md px-5 py-10">
        {state === "loading" && <p className="text-center">กำลังโหลด...</p>}
        {state === "locked" && (
          <form onSubmit={submit} className="card-cute mt-16 bg-secondary p-6 text-center">
            <div className="text-5xl">🔐</div>
            <h1 className="mt-2 font-display text-2xl font-bold">Secret Admin Inbox</h1>
            <p className="text-sm text-muted-foreground">สำหรับเจ้าของเว็บเท่านั้น</p>
            <input type="password" inputMode="numeric" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="รหัสผ่าน" className="mt-4 w-full rounded-full border-2 border-caramel bg-card px-4 py-2 text-center outline-none" />
            {err && <p className="mt-2 text-sm text-destructive">รหัสไม่ถูกต้อง</p>}
            <button className="mt-4 rounded-full border-2 border-caramel bg-pudding px-6 py-2 font-bold">เข้าสู่ระบบ</button>
          </form>
        )}
        {state === "in" && data && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-2xl font-bold">Admin Inbox 💌</h1>
              <div className="flex gap-2">
                <button onClick={refresh} className="rounded-full border-2 border-caramel bg-card px-3 py-1 text-xs font-bold">รีเฟรช</button>
                <button onClick={async () => { await logout(); setState("locked"); setPw(""); }} className="rounded-full border-2 border-caramel bg-card px-3 py-1 text-xs font-bold">ออก</button>
              </div>
            </div>
            <section className="card-cute bg-mint/60 p-4">
              <h2 className="mb-3 flex items-center gap-2 font-bold"><FishIcon className="h-7 w-7" /> ข้อความจากแฟน ({data.messages.length})</h2>
              {data.messages.length === 0 ? <p className="text-sm text-muted-foreground">ยังไม่มีข้อความ</p> : (
                <ul className="flex flex-col gap-2">
                  {data.messages.map((m) => (
                    <li key={m.id} className="rounded-2xl bg-card p-3">
                      <p className="whitespace-pre-wrap break-words">{m.message}</p>
                      <p className="mt-1 text-right text-xs text-muted-foreground">{fmt(m.created_at)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="card-cute bg-pudding/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold"><PuddingIcon className="h-7 w-7" /> ประวัติการใช้คูปอง ({data.coupons.length})</h2>
                {data.coupons.length > 0 && (
                  <button onClick={async () => { if (confirm("รีเซ็ตคูปองทั้งหมด?")) { await reset({ data: { id: null } }); await refresh(); } }} className="rounded-full border-2 border-caramel bg-card px-3 py-1 text-xs font-bold">รีเซ็ตทั้งหมด</button>
                )}
              </div>
              {data.coupons.length === 0 ? <p className="text-sm text-muted-foreground">ยังไม่มีคูปองที่ใช้</p> : (
                <ul className="flex flex-col gap-2">
                  {data.coupons.map((c) => (
                    <li key={c.id} className="flex items-center gap-2 rounded-2xl bg-card p-3">
                      <div className="flex-1"><p className="font-semibold">{c.coupon_title}</p><p className="text-xs text-muted-foreground">{fmt(c.used_at)}</p></div>
                      <button onClick={async () => { await reset({ data: { id: c.id } }); await refresh(); }} className="rounded-full border-2 border-caramel bg-mint px-3 py-1 text-xs font-bold">รีเซ็ต</button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
