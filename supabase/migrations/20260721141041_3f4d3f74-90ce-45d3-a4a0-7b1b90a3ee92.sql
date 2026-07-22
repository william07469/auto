
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
-- Restrict has_role to authenticated only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
-- Tighten bookings insert with lightweight check (still permits all valid inserts)
DROP POLICY "Anyone can create booking" ON public.bookings;
CREATE POLICY "Anyone can create booking" ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(customer_name) > 0 AND char_length(email) > 0);
