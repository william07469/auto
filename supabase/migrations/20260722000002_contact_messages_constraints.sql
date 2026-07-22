-- ============ contact_messages column-level CHECK constraints ============
-- Enforce the same bounds validated in the UI and the rate-limit trigger.
-- These constraints run inside the DB transaction, so they apply regardless
-- of which client (anon key, service_role, direct psql) performs the INSERT.

ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_name_length
    CHECK (char_length(trim(name)) BETWEEN 2 AND 100),

  ADD CONSTRAINT contact_message_length
    CHECK (char_length(trim(message)) BETWEEN 10 AND 2000),

  -- Basic email sanity check: local@domain.tld
  -- Uses a conservative pattern to avoid false negatives on valid addresses.
  ADD CONSTRAINT contact_email_format
    CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),

  ADD CONSTRAINT contact_email_length
    CHECK (char_length(trim(email)) BETWEEN 5 AND 254);
