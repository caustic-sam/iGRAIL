// Feature flags for controlling section visibility
export interface FeatureFlags {
  // Navigation sections
  showPolicyPulse: boolean;
  showVideos: boolean;
  showArticles: boolean;
  showPolicies: boolean;
  showBlog: boolean;

  // Homepage sections
  showHeroSection: boolean;
  showDataBoxes: boolean;
  showPolicyFeed: boolean;
  showFeaturedArticle: boolean;
  showVideoInsights: boolean;
  showNewsletter: boolean;
  showResourceLibrary: boolean;

  // MVP Launch - Features deferred to V1.1
  showQuickPosts: boolean;
  showScheduledPublishing: boolean;
}

export const DEFAULT_FLAGS: FeatureFlags = {
  // Navigation sections
  showPolicyPulse: true,
  showVideos: true,
  showArticles: true,
  showPolicies: true,
  showBlog: true,

  // Homepage sections
  showHeroSection: true,
  showDataBoxes: true,
  showPolicyFeed: true,
  showFeaturedArticle: true,
  showVideoInsights: true,
  showNewsletter: true,
  showResourceLibrary: true,

  // MVP Launch - Features deferred to V1.1
  showQuickPosts: false,
  showScheduledPublishing: false,
};

const STORAGE_KEY = 'igrail_feature_flags';
const LEGACY_STORAGE_KEY = 'gailp_feature_flags';

export function getFeatureFlags(): FeatureFlags {
  if (typeof window === 'undefined') return DEFAULT_FLAGS;

  try {
    // We prefer the new iGRAIL key, but we still read the legacy key so existing
    // browser settings survive the rename without any manual migration step.
    const stored =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY);

    if (stored) {
      return { ...DEFAULT_FLAGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error reading feature flags:', error);
  }

  return DEFAULT_FLAGS;
}

export function setFeatureFlags(flags: Partial<FeatureFlags>): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getFeatureFlags();
    const updated = { ...current, ...flags };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch (error) {
    console.error('Error saving feature flags:', error);
  }
}

export function resetFeatureFlags(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting feature flags:', error);
  }
}
