-- iGRAIL Database Schema
-- PostgreSQL/Supabase
-- Created: 2024-10-31

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- AUTHORS / EXPERTS
-- =====================================================
CREATE TABLE authors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  avatar_url TEXT,
  title TEXT, -- e.g., "Policy Analyst", "Legal Expert"
  bio TEXT,
  organization TEXT,
  social_twitter TEXT,
  social_linkedin TEXT,
  social_website TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CATEGORIES / TAGS
-- =====================================================
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  color TEXT, -- For UI theming
  icon TEXT, -- Icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- POLICIES
-- =====================================================
CREATE TABLE policies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT, -- Full policy details (markdown/html)

  -- Status tracking
  status TEXT NOT NULL CHECK (status IN ('draft', 'adopted', 'in_force', 'repealed')),

  -- Categorization
  category TEXT NOT NULL, -- e.g., "Regulation", "Framework", "Directive"
  region TEXT NOT NULL, -- e.g., "EU", "APAC", "Americas"
  country TEXT NOT NULL,
  jurisdiction_level TEXT, -- e.g., "Federal", "State", "Municipal"

  -- Metadata
  policy_date TIMESTAMP WITH TIME ZONE, -- When policy was enacted/updated
  effective_date TIMESTAMP WITH TIME ZONE, -- When it takes effect
  source_url TEXT,
  official_document_url TEXT,

  -- Engagement metrics
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  bookmarks_count INTEGER DEFAULT 0,

  -- SEO
  meta_description TEXT,
  meta_keywords TEXT[],

  -- Publishing
  published_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ARTICLES (WordPress imported content + new analysis)
-- =====================================================
CREATE TABLE articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Basic info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL, -- Full article (markdown/html)
  excerpt TEXT, -- Short excerpt for listings

  -- Author
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,

  -- Media
  featured_image_url TEXT,
  featured_image_alt TEXT,

  -- Categorization
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Content metadata
  read_time_minutes INTEGER,
  word_count INTEGER,

  -- Engagement metrics
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,

  -- SEO
  meta_description TEXT,
  meta_keywords TEXT[],

  -- Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,

  -- WordPress migration fields
  wordpress_id INTEGER, -- Original WP post ID
  wordpress_url TEXT, -- Original WP URL for redirects

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ARTICLE-TAG RELATIONSHIP (many-to-many)
-- =====================================================
CREATE TABLE article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- =====================================================
-- RSS FEEDS (FreshRSS integration)
-- =====================================================
CREATE TABLE rss_feeds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  feed_url TEXT NOT NULL UNIQUE,
  site_url TEXT,
  description TEXT,

  -- FreshRSS integration
  freshrss_feed_id TEXT, -- FreshRSS internal ID

  -- Display settings
  is_active BOOLEAN DEFAULT TRUE,
  display_in_feed BOOLEAN DEFAULT TRUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Metadata
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  last_build_date TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rss_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,

  -- Content
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Full content if available

  -- Metadata
  guid TEXT UNIQUE, -- RSS item GUID
  author TEXT,
  published_at TIMESTAMP WITH TIME ZONE,

  -- Engagement
  is_read BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VIDEOS
-- =====================================================
CREATE TABLE videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Basic info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,

  -- Video details
  video_url TEXT NOT NULL, -- YouTube, Vimeo, etc.
  video_provider TEXT, -- 'youtube', 'vimeo', 'custom'
  video_id TEXT, -- Provider's video ID
  thumbnail_url TEXT,
  duration_seconds INTEGER,

  -- Author
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,

  -- Categorization
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Engagement metrics
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,

  -- Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMMUNITY THOUGHTS (Policy Pulse)
-- =====================================================
CREATE TABLE thoughts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Author (can be user or expert)
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,

  -- Content
  content TEXT NOT NULL CHECK (char_length(content) <= 500), -- Tweet-like limit

  -- Optional media
  image_url TEXT,

  -- Engagement
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,

  -- Moderation
  is_approved BOOLEAN DEFAULT TRUE,
  is_pinned BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMMENTS (for articles, policies, videos)
-- =====================================================
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Polymorphic relationship
  commentable_type TEXT NOT NULL CHECK (commentable_type IN ('article', 'policy', 'video')),
  commentable_id UUID NOT NULL,

  -- Author
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,

  -- Content
  content TEXT NOT NULL,

  -- Threading
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,

  -- Engagement
  likes_count INTEGER DEFAULT 0,

  -- Moderation
  is_approved BOOLEAN DEFAULT TRUE,
  is_flagged BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NEWSLETTER SUBSCRIBERS
-- =====================================================
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,

  -- Preferences
  is_active BOOLEAN DEFAULT TRUE,
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  topics TEXT[], -- Array of interested topics

  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT UNIQUE,
  verification_sent_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,

  -- Unsubscribe
  unsubscribe_token TEXT UNIQUE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for performance
-- =====================================================

-- Authors
CREATE INDEX idx_authors_email ON authors(email);

-- Policies
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_region ON policies(region);
CREATE INDEX idx_policies_country ON policies(country);
CREATE INDEX idx_policies_published_at ON policies(published_at DESC);
CREATE INDEX idx_policies_slug ON policies(slug);

-- Articles
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_wordpress_id ON articles(wordpress_id);

-- RSS
CREATE INDEX idx_rss_items_feed_id ON rss_items(feed_id);
CREATE INDEX idx_rss_items_published_at ON rss_items(published_at DESC);
CREATE INDEX idx_rss_items_guid ON rss_items(guid);

-- Videos
CREATE INDEX idx_videos_author_id ON videos(author_id);
CREATE INDEX idx_videos_category_id ON videos(category_id);
CREATE INDEX idx_videos_published_at ON videos(published_at DESC);
CREATE INDEX idx_videos_slug ON videos(slug);

-- Thoughts
CREATE INDEX idx_thoughts_author_id ON thoughts(author_id);
CREATE INDEX idx_thoughts_created_at ON thoughts(created_at DESC);

-- Comments
CREATE INDEX idx_comments_commentable ON comments(commentable_type, commentable_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- Newsletter
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(is_active) WHERE is_active = TRUE;

-- =====================================================
-- FUNCTIONS: Auto-update timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rss_feeds_updated_at BEFORE UPDATE ON rss_feeds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_updated_at BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Basic setup
-- =====================================================

-- Enable RLS on tables (customize based on your auth needs)
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published policies" ON policies
  FOR SELECT USING (status = 'in_force' OR status = 'adopted');

CREATE POLICY "Public can view published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published videos" ON videos
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view approved thoughts" ON thoughts
  FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "Public can view approved comments" ON comments
  FOR SELECT USING (is_approved = TRUE);

-- Note: Add more specific policies based on your authentication setup
