-- Add meta_description column to articles table
-- This column was missing, causing "Publish Now" to fail

-- Add the column (if it doesn't exist)
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Optionally copy data from seo_description if it exists and meta_description is null
UPDATE articles
SET meta_description = seo_description
WHERE meta_description IS NULL AND seo_description IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN articles.meta_description IS 'SEO meta description for the article';
