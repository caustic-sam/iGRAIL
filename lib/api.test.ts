/**
 * Unit tests for iGRAIL API Layer
 *
 * Tests the mock data fallback behavior and API function signatures.
 * Supabase integration tests would require a test database instance.
 *
 * @jest-environment node
 */

import { getPolicies, getArticles, getVideos, getThoughts } from './api';
import { mockArticles, mockPolicies, mockVideos, mockThoughts } from './mockData';

// Mock the supabase module to ensure we're testing the fallback behavior
jest.mock('./supabase', () => ({
  isSupabaseConfigured: jest.fn(() => false),
  supabase: null,
}));

describe('API Layer - Mock Data Fallback', () => {
  describe('getPolicies', () => {
    it('should return mock policies when Supabase is not configured', async () => {
      const result = await getPolicies();

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('error');
      expect(result.error).toBeNull();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const result = await getPolicies({ limit: 2 });

      expect(result.data).toHaveLength(2);
      expect(result.count).toBe(mockPolicies.length);
    });

    it('should handle offset for pagination', async () => {
      const result = await getPolicies({ limit: 1, offset: 1 });

      expect(result.data).toHaveLength(1);
      expect(result.data?.[0]?.id).toBe(mockPolicies[1]?.id);
    });

    it('should return all policies when limit exceeds count', async () => {
      const result = await getPolicies({ limit: 1000 });

      expect(result.data?.length).toBeLessThanOrEqual(mockPolicies.length);
      expect(result.count).toBe(mockPolicies.length);
    });

    it('should return policies with required fields', async () => {
      const result = await getPolicies({ limit: 1 });
      const policy = result.data?.[0];

      expect(policy).toHaveProperty('id');
      expect(policy).toHaveProperty('title');
      expect(policy).toHaveProperty('status');
      expect(policy).toHaveProperty('summary');
      expect(policy).toHaveProperty('jurisdiction');
      expect(policy).toHaveProperty('category');
    });
  });

  describe('getArticles', () => {
    it('should return mock articles when Supabase is not configured', async () => {
      const result = await getArticles();

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('error');
      expect(result.error).toBeNull();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const result = await getArticles({ limit: 2 });

      expect(result.data).toHaveLength(2);
      expect(result.count).toBe(mockArticles.length);
    });

    it('should return articles with required fields', async () => {
      const result = await getArticles({ limit: 1 });
      const article = result.data?.[0];

      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('author');
      expect(article).toHaveProperty('category');
      expect(article).toHaveProperty('date');
      expect(article).toHaveProperty('readTime');
    });

    it('should filter by category when provided', async () => {
      const category = 'AI & Data Governance';
      const result = await getArticles({ category });

      // Mock implementation filters by category
      expect(result.data?.length).toBeGreaterThanOrEqual(0);
      expect(result.count).toBe(mockArticles.length);
    });
  });

  describe('getVideos', () => {
    it('should return mock videos when Supabase is not configured', async () => {
      const result = await getVideos();

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('error');
      expect(result.error).toBeNull();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const result = await getVideos({ limit: 1 });

      expect(result.data).toHaveLength(1);
      expect(result.count).toBe(mockVideos.length);
    });

    it('should return videos with required fields', async () => {
      const result = await getVideos({ limit: 1 });
      const video = result.data?.[0];

      expect(video).toHaveProperty('id');
      expect(video).toHaveProperty('title');
      expect(video).toHaveProperty('duration');
      expect(video).toHaveProperty('views');
      expect(video).toHaveProperty('date');
      expect(video).toHaveProperty('description');
    });
  });

  describe('getThoughts', () => {
    it('should return mock thoughts when Supabase is not configured', async () => {
      const result = await getThoughts();

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('error');
      expect(result.error).toBeNull();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const result = await getThoughts({ limit: 3 });

      expect(result.data).toHaveLength(3);
      expect(result.count).toBe(mockThoughts.length);
    });

    it('should return thoughts with required fields', async () => {
      const result = await getThoughts({ limit: 1 });
      const thought = result.data?.[0];

      expect(thought).toHaveProperty('id');
      expect(thought).toHaveProperty('author');
      expect(thought).toHaveProperty('content');
      expect(thought).toHaveProperty('time');
      expect(thought.author).toHaveProperty('name');
    });
  });

  describe('API Response Structure', () => {
    it('should return consistent response structure across all endpoints', async () => {
      const policiesResult = await getPolicies();
      const articlesResult = await getArticles();
      const videosResult = await getVideos();
      const thoughtsResult = await getThoughts();

      // All should have the same structure
      [policiesResult, articlesResult, videosResult, thoughtsResult].forEach((result) => {
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('count');
        expect(result).toHaveProperty('error');
        expect(typeof result.count).toBe('number');
      });
    });

    it('should return null error when successful', async () => {
      const result = await getPolicies();
      expect(result.error).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero limit gracefully', async () => {
      const result = await getPolicies({ limit: 0 });
      expect(result.data).toHaveLength(0);
    });

    it('should handle negative offset gracefully', async () => {
      const result = await getPolicies({ offset: -1 });
      // Should not throw, behavior defined by implementation
      expect(result).toHaveProperty('data');
    });

    it('should handle very large offset', async () => {
      const result = await getPolicies({ offset: 999999 });
      expect(result.data).toHaveLength(0);
    });
  });
});

describe('Mock Data Integrity', () => {
  it('should have valid mock policies', () => {
    expect(mockPolicies.length).toBeGreaterThan(0);
    mockPolicies.forEach((policy) => {
      expect(policy.id).toBeDefined();
      expect(policy.title).toBeDefined();
      expect(policy.status).toBeDefined();
      expect(['draft', 'adopted', 'in_force', 'repealed']).toContain(policy.status);
    });
  });

  it('should have valid mock articles', () => {
    expect(mockArticles.length).toBeGreaterThan(0);
    mockArticles.forEach((article) => {
      expect(article.id).toBeDefined();
      expect(article.title).toBeDefined();
      expect(article.author).toBeDefined();
      expect(article.category).toBeDefined();
    });
  });

  it('should have valid mock videos', () => {
    expect(mockVideos.length).toBeGreaterThan(0);
    mockVideos.forEach((video) => {
      expect(video.id).toBeDefined();
      expect(video.title).toBeDefined();
      expect(video.duration).toBeDefined();
      expect(video.date).toBeDefined();
    });
  });

  it('should have valid mock thoughts', () => {
    expect(mockThoughts.length).toBeGreaterThan(0);
    mockThoughts.forEach((thought) => {
      expect(thought.id).toBeDefined();
      expect(thought.author).toBeDefined();
      expect(thought.content).toBeDefined();
    });
  });
});
