-- Add user_id to bookings and wire up RLS for per-user access

-- 1. Add nullable user_id column (nullable so existing rows don't break)
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Index for fast per-user queries
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON public.bookings (user_id);

-- 3. Allow authenticated users to read their own bookings
CREATE POLICY "Users read own bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 4. Tighten the insert policy: require the row's user_id to match the caller
DROP POLICY IF EXISTS "Authenticated users can create booking" ON public.bookings;
CREATE POLICY "Authenticated users can create booking" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND char_length(customer_name) > 0
    AND char_length(email) > 0
  );
