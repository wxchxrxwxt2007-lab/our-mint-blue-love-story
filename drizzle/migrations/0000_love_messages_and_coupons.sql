CREATE TABLE public.love_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), message text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.used_coupons (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), coupon_title text NOT NULL UNIQUE, used_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.love_messages TO service_role;
GRANT ALL ON public.used_coupons TO service_role;
ALTER TABLE public.love_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.used_coupons ENABLE ROW LEVEL SECURITY;