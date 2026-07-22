-- Add category and description columns to gallery_items
-- category is used to group items into service tabs in the BeforeAfterSection
-- description is shown as the service explanation text under the tab

ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Galerie',
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Index for fast per-category queries
CREATE INDEX IF NOT EXISTS gallery_items_category_idx ON public.gallery_items (category);
