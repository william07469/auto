
REVOKE INSERT ON public.bookings FROM anon;
DROP POLICY IF EXISTS "Anyone can create booking" ON public.bookings;
CREATE POLICY "Authenticated users can create booking" ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (char_length(customer_name) > 0 AND char_length(email) > 0);
