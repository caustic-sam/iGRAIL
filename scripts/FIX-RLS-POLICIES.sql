-- Fix RLS Policies - Remove Circular Reference
-- Run this in Supabase SQL Editor

-- STEP 1: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "admin_select_all" ON public.user_profiles;
DROP POLICY IF EXISTS "admin_update_all" ON public.user_profiles;
DROP POLICY IF EXISTS "allow_insert_for_new_users" ON public.user_profiles;

-- STEP 2: Create simple, non-circular policies
-- Allow authenticated users to read their own profile
CREATE POLICY "select_own_profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "update_own_profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Allow INSERT for new user creation (used by trigger)
CREATE POLICY "insert_new_profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- STEP 3: Verify your profile exists
SELECT * FROM public.user_profiles WHERE email = 'caustic_sam@protonmail.com';

-- STEP 4: If not, create it
INSERT INTO public.user_profiles (id, email, role, created_at, updated_at)
VALUES (
  '3be8b5c2-87a2-4a91-acbd-ad0249c150a4',
  'caustic_sam@protonmail.com',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  role = 'admin',
  updated_at = NOW();

-- STEP 5: Test the query that AuthContext uses
SELECT * FROM public.user_profiles WHERE id = '3be8b5c2-87a2-4a91-acbd-ad0249c150a4';

-- ================================================================
-- STORAGE BUCKET POLICIES (For Media Vault)
-- ================================================================

-- STEP 6: Check if 'media' bucket exists
-- Go to Supabase Dashboard > Storage
-- If 'media' bucket doesn't exist, create it as PUBLIC bucket

-- STEP 7: Add storage policies for media bucket
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

-- Allow authenticated users to delete media
CREATE POLICY "Authenticated users can delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- Allow public read access
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- ================================================================
-- SCHEMA CACHE FIX (Articles table)
-- ================================================================

-- STEP 8: Verify columns exist in articles table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'articles'
AND column_name IN ('summary', 'read_time_minutes', 'is_featured');

-- If any columns are missing, uncomment and run:
-- ALTER TABLE articles ADD COLUMN IF NOT EXISTS summary TEXT;
-- ALTER TABLE articles ADD COLUMN IF NOT EXISTS read_time_minutes INTEGER;
-- ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- STEP 9: Reload PostgREST schema cache
-- Go to: Supabase Dashboard > Settings > API
-- Click: "Reload schema cache" button
