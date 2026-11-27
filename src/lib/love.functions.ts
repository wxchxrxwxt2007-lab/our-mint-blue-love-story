import { createServerFn } from "@tanstack/react-start";
import { cleanMessage, isValidCoupon } from "./coupons";

async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}
async function session() {
  const { useSession } = await import("@tanstack/react-start/server");
  return useSession<{ admin?: boolean }>({
    password: process.env["SESSION_SECRET"]!,
    name: "anniv-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
  });
}
async function requireAdmin() {
  const s = await session();
  if (!s.data.admin) throw new Error("Unauthorized");
}

export const sendMessage = createServerFn({ method: "POST" })
  .validator((d: { message: string }) => {
    const m = cleanMessage(String(d?.message ?? ""));
    if (!m) throw new Error("Invalid message");
    return { message: m };
  })
  .handler(async ({ data }) => {
    const { error } = await (await db()).from("love_messages").insert({ message: data.message });
    if (error) throw new Error("บันทึกไม่สำเร็จ");
    return { ok: true };
  });

export const listUsedCoupons = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await (await db()).from("used_coupons").select("coupon_title");
  return (data ?? []).map((r) => r.coupon_title);
});

export const redeemCoupon = createServerFn({ method: "POST" })
  .validator((d: { title: string }) => {
    if (!isValidCoupon(String(d?.title))) throw new Error("Invalid coupon");
    return { title: d.title };
  })
  .handler(async ({ data }) => {
    await (await db()).from("used_coupons").upsert({ coupon_title: data.title }, { onConflict: "coupon_title", ignoreDuplicates: true });
    return { ok: true };
  });

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => ({ admin: !!(await session()).data.admin }));

export const adminLogin = createServerFn({ method: "POST" })
  .validator((d: { password: string }) => ({ password: String(d?.password ?? "") }))
  .handler(async ({ data }) => {
    const { createHash, timingSafeEqual } = await import("node:crypto");
    const h = (v: string) => createHash("sha256").update(v).digest();
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected || !timingSafeEqual(h(data.password), h(expected))) return { ok: false };
    await (await session()).update({ admin: true });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  await (await session()).clear();
  return { ok: true };
});

export const adminData = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const c = await db();
  const [m, u] = await Promise.all([
    c.from("love_messages").select("id, message, created_at").order("created_at", { ascending: false }),
    c.from("used_coupons").select("id, coupon_title, used_at").order("used_at", { ascending: false }),
  ]);
  return { messages: m.data ?? [], coupons: u.data ?? [] };
});

export const adminResetCoupon = createServerFn({ method: "POST" })
  .validator((d: { id: string | null }) => ({ id: d?.id ? String(d.id) : null }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const q = (await db()).from("used_coupons").delete();
    await (data.id ? q.eq("id", data.id) : q.not("id", "is", null));
    return { ok: true };
  });
