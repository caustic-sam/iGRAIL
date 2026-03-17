-- Mark an article as featured for homepage display
-- Run this in Supabase SQL Editor

-- STEP 1: See all published articles
SELECT id, title, slug, is_featured, published_at
FROM articles
WHERE status = 'published'
ORDER BY published_at DESC;

-- STEP 2: Choose one and mark it as featured
-- Replace the ID below with the article you want to feature
UPDATE articles
SET is_featured = true
WHERE id = 1; -- Change this ID to the article you want

-- STEP 3: Verify it worked
SELECT id, title, slug, is_featured
FROM articles
WHERE is_featured = true;

-- Optional: If you want to feature a different article later,
-- first unfeature all articles, then feature the new one
-- UPDATE articles SET is_featured = false WHERE is_featured = true;
-- UPDATE articles SET is_featured = true WHERE id = YOUR_NEW_ID;
