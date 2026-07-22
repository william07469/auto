
-- ============ 1. Contact messages rate limiting ============
-- Allow max 3 messages per email per hour
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.contact_messages
      WHERE email = NEW.email
        AND created_at > now() - interval '1 hour') >= 3 THEN
    RAISE EXCEPTION 'Rate limit: Max 3 Nachrichten pro Stunde';
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER contact_messages_rate_limit
  BEFORE INSERT ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.check_contact_rate_limit();

-- ============ 2. Revoke dangerous grants from authenticated ============
-- pricing_packages
REVOKE INSERT, UPDATE, DELETE ON public.pricing_packages FROM authenticated;
-- gallery_items
REVOKE INSERT, UPDATE, DELETE ON public.gallery_items FROM authenticated;
-- faqs
REVOKE INSERT, UPDATE, DELETE ON public.faqs FROM authenticated;
-- testimonials
REVOKE INSERT, UPDATE, DELETE ON public.testimonials FROM authenticated;

-- Only service_role can write (RLS already checks admin via has_role)
GRANT INSERT, UPDATE, DELETE ON public.pricing_packages TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.gallery_items TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.faqs TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO service_role;
