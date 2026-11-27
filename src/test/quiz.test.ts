import { describe, expect, it } from "vitest";
import { OPEN_AT } from "@/components/anniv/gates";
import { resultText } from "@/components/anniv/sections";

describe("anniversary rules", () => {
  it("unlocks at 29 Nov 2026 06:00 Bangkok", () => {
    expect(new Date(OPEN_AT).toISOString()).toBe("2026-11-28T23:00:00.000Z");
  });
  it("3/3 message", () => expect(resultText(3)).toContain("ได้ 3/3 เต็ม!"));
  it("2/3 message", () => expect(resultText(2)).toContain("เกือบเต็มแล้ว"));
  it("low score message", () => expect(resultText(0)).toContain("ได้ 0/3 คะแนน... สงสัยเดือนที่ 3"));
});

import { cleanMessage, isValidCoupon } from "@/lib/coupons";
describe("coupon & message rules", () => {
  it("accepts a real coupon", () => expect(isValidCoupon("คูปองนวดผ่อนคลาย")).toBe(true));
  it("rejects unknown coupon", () => expect(isValidCoupon("คูปองปลอม")).toBe(false));
  it("rejects empty and >500 messages", () => {
    expect(cleanMessage("   ")).toBeNull();
    expect(cleanMessage("a".repeat(501))).toBeNull();
  });
});
