// FreshRSS API Integration
// Documentation: https://freshrss.github.io/FreshRSS/en/developers/06_GoogleReader_API.html

interface FreshRSSConfig {
  apiUrl: string;
  username: string;
  password: string;
}

interface FreshRSSItem {
  id: string;
  title: string;
  summary?: { content: string };
  canonical?: Array<{ href: string }>;
  author?: string;
  published?: number;
  categories?: string[];
  origin?: {
    streamId: string;
    title: string;
    htmlUrl: string;
  };
}

class FreshRSSClient {
  private config: FreshRSSConfig;
  private authToken?: string;

  constructor(config: FreshRSSConfig) {
    this.config = config;
  }

  /**
   * Authenticate with FreshRSS using Google Reader API
   */
  async authenticate(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/accounts/ClientLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          Email: this.config.username,
          Passwd: this.config.password,
        }),
      });

      if (!response.ok) {
        console.error('FreshRSS authentication failed:', response.statusText);
        return false;
      }

      const text = await response.text();
      const authMatch = text.match(/Auth=(.+)/);

      if (authMatch) {
        this.authToken = authMatch[1];
        return true;
      }

      return false;
    } catch (error) {
      console.error('FreshRSS authentication error:', error);
      return false;
    }
  }

  /**
   * Get reading list (recent items)
   */
  async getItems(options: {
    count?: number;
    excludeRead?: boolean;
    newerThan?: number; // Unix timestamp
  } = {}): Promise<FreshRSSItem[]> {
    const { count = 20, excludeRead = false, newerThan } = options;

    if (!this.authToken) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error('FreshRSS authentication required');
      }
    }

    try {
      const params = new URLSearchParams({
        n: count.toString(),
      });

      if (excludeRead) {
        params.append('xt', 'user/-/state/com.google/read');
      }

      if (newerThan) {
        params.append('ot', newerThan.toString());
      }

      const response = await fetch(
        `${this.config.apiUrl}/reader/api/0/stream/contents/reading-list?${params}`,
        {
          headers: {
            Authorization: `GoogleLogin auth=${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`FreshRSS API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching FreshRSS items:', error);
      return [];
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    if (!this.authToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(
        `${this.config.apiUrl}/reader/api/0/unread-count`,
        {
          headers: {
            Authorization: `GoogleLogin auth=${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`FreshRSS API error: ${response.statusText}`);
      }

      const data = await response.json();
      const unreadCounts = data.unreadcounts || [];
      const totalUnread = unreadCounts.find(
        (c: { id: string; count: number }) => c.id === 'user/-/state/com.google/reading-list'
      );

      return totalUnread?.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Get subscription list (feeds)
   */
  async getSubscriptions(): Promise<Array<{
    id: string;
    title: string;
    url: string;
    htmlUrl: string;
    categories: Array<{ id: string; label: string }>;
  }>> {
    if (!this.authToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(
        `${this.config.apiUrl}/reader/api/0/subscription/list`,
        {
          headers: {
            Authorization: `GoogleLogin auth=${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`FreshRSS API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.subscriptions || [];
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  }

  /**
   * Mark item as read
   */
  async markAsRead(itemId: string): Promise<boolean> {
    if (!this.authToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(
        `${this.config.apiUrl}/reader/api/0/edit-tag`,
        {
          method: 'POST',
          headers: {
            Authorization: `GoogleLogin auth=${this.authToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            i: itemId,
            a: 'user/-/state/com.google/read',
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error marking item as read:', error);
      return false;
    }
  }

  /**
   * Star/unstar item
   */
  async toggleStar(itemId: string, star: boolean): Promise<boolean> {
    if (!this.authToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(
        `${this.config.apiUrl}/reader/api/0/edit-tag`,
        {
          method: 'POST',
          headers: {
            Authorization: `GoogleLogin auth=${this.authToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            i: itemId,
            [star ? 'a' : 'r']: 'user/-/state/com.google/starred',
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error toggling star:', error);
      return false;
    }
  }

  /**
   * Convert FreshRSS item to iGRAIL format
   */
  static transformItem(item: FreshRSSItem): {
    title: string;
    link: string;
    description: string;
    author?: string;
    publishedAt: Date | null;
    feedName: string;
    feedUrl: string;
  } {
    return {
      title: item.title,
      link: item.canonical?.[0]?.href || '',
      description: item.summary?.content || '',
      author: item.author,
      publishedAt: item.published ? new Date(item.published * 1000) : null,
      feedName: item.origin?.title || 'Unknown Feed',
      feedUrl: item.origin?.htmlUrl || '',
    };
  }
}

// Export configured client
let freshRSSClient: FreshRSSClient | null = null;

export function getFreshRSSClient(): FreshRSSClient | null {
  if (!process.env.FRESHRSS_API_URL ||
      !process.env.FRESHRSS_API_USERNAME ||
      !process.env.FRESHRSS_API_PASSWORD) {
    console.warn('⚠️ FreshRSS environment variables not configured');
    return null;
  }

  if (!freshRSSClient) {
    freshRSSClient = new FreshRSSClient({
      apiUrl: process.env.FRESHRSS_API_URL,
      username: process.env.FRESHRSS_API_USERNAME,
      password: process.env.FRESHRSS_API_PASSWORD,
    });
  }

  return freshRSSClient;
}

export { FreshRSSClient };
export type { FreshRSSItem, FreshRSSConfig };
