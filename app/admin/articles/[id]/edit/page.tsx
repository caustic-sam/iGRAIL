'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';
import {
  Save,
  Send,
  Clock,
  Image as ImageIcon,
  Tag,
  Globe,
  X,
  Upload,
  Trash2,
} from 'lucide-react';

interface ArticleFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured_image_url: string;
  seo_title: string;
  seo_description: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduled_for: string;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [saving, setSaving] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    featured_image_url: '',
    seo_title: '',
    seo_description: '',
    status: 'draft',
    scheduled_for: '',
  });

  // Fetch existing article data
  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/admin/articles/${articleId}`);
        const data = await response.json();

        if (response.ok && data.article) {
          const article = data.article;
          setFormData({
            title: article.title || '',
            slug: article.slug || '',
            content: article.content || '',
            excerpt: article.summary || '',
            category: article.category || '',
            tags: article.tags || [],
            featured_image_url: article.featured_image_url || '',
            seo_title: article.meta_title || '',
            seo_description: article.meta_description || '',
            status: article.status || 'draft',
            scheduled_for: article.scheduled_for || '',
          });
        } else {
          alert(`Failed to load article: ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error fetching article for the edit screen:', error);
        alert(`Error loading article: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  // Auto-generate slug from title (only for empty slugs)
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.slug, formData.title]);

  // Auto-generate excerpt from content (only for empty excerpts)
  useEffect(() => {
    if (formData.content && !formData.excerpt) {
      const plainText = formData.content.replace(/<[^>]*>/g, '');
      const excerpt = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
      setFormData(prev => ({ ...prev, excerpt }));
    }
  }, [formData.content, formData.excerpt]);

  const handleSave = async (action: 'draft' | 'schedule' | 'publish') => {
    setSaving(true);

    try {
      const payload = {
        ...formData,
        status: action === 'schedule' ? 'scheduled' : action === 'publish' ? 'published' : 'draft',
        published_at: action === 'publish' ? new Date().toISOString() : null,
      };

      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message
        const actionText = action === 'draft' ? 'saved as draft' : action === 'publish' ? 'published' : 'scheduled';
        alert(`✅ Article ${actionText}!\n\nID: ${data.article?.id}\nSource: ${data.source}`);
        router.push('/admin');
      } else {
        alert(`❌ Error: ${data.error || 'Failed to update article'}\n\nDetails: ${JSON.stringify(data.details || {}, null, 2)}`);
      }
    } catch (error) {
      console.error('Error updating article from the edit screen:', error);
      alert(`❌ Failed to update article.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck browser console for details.`);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${formData.title}"?\n\nThis action cannot be undone.`)) return;

    try {
      toast.info('Deleting article...', { duration: 1000 });

      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      toast.success('Article deleted successfully!', {
        description: formData.title,
      });

      // Redirect to dashboard after successful delete
      router.push('/admin');
    } catch (error) {
      console.error('Error deleting article from the edit screen:', error);
      toast.error('Failed to delete article', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const calculateReadTime = () => {
    const wordsPerMinute = 200;
    const wordCount = formData.content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
              <p className="text-sm text-gray-600 mt-1">
                {formData.content ? `${formData.content.split(/\s+/).length} words · ${calculateReadTime()} min read` : 'Loading...'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                title="Delete article"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              <div className="w-px h-8 bg-gray-300" />

              <button
                onClick={() => handleSave('draft')}
                disabled={saving || !formData.title}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>

              <button
                onClick={() => setShowScheduler(true)}
                disabled={saving || !formData.title}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <Clock className="w-4 h-4" />
                Schedule
              </button>

              <button
                onClick={() => handleSave('publish')}
                disabled={saving || !formData.title}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Publish Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Editor Column */}
          <div className="col-span-2 space-y-6">
            {/* Title */}
            <Card className="p-6">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Article Title"
                className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-0"
              />
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Globe className="w-4 h-4" />
                <span>worldpapers.com/articles/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-slug"
                  className="flex-1 text-gray-700 border-none focus:outline-none focus:ring-0 p-0"
                />
              </div>
            </Card>

            {/* Content Editor */}
            <Card className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <div className="flex gap-2 mb-3 text-sm text-gray-600">
                  <button className="px-3 py-1 hover:bg-gray-100 rounded">B</button>
                  <button className="px-3 py-1 hover:bg-gray-100 rounded italic">I</button>
                  <button className="px-3 py-1 hover:bg-gray-100 rounded underline">U</button>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <button className="px-3 py-1 hover:bg-gray-100 rounded">H1</button>
                  <button className="px-3 py-1 hover:bg-gray-100 rounded">H2</button>
                  <button className="px-3 py-1 hover:bg-gray-100 rounded">Quote</button>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <button className="px-3 py-1 hover:bg-gray-100 rounded flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" />
                    Image
                  </button>
                </div>
              </div>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your article here... (Markdown supported)"
                className="w-full min-h-[500px] text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-0 resize-y font-mono text-sm"
              />
            </Card>

            {/* Excerpt */}
            <Card className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (Optional)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Short description for previews and social media..."
                className="w-full min-h-[100px] text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
              <p className="text-xs text-gray-500 mt-2">
                {formData.excerpt.length}/160 characters (auto-generated if left empty)
              </p>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Featured Image
              </label>
              {formData.featured_image_url ? (
                <div className="relative">
                  <Image
                    src={formData.featured_image_url}
                    alt="Featured"
                    width={640}
                    height={160}
                    className="w-full h-40 object-cover rounded-lg"
                    unoptimized
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '' }))}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload image or paste URL</p>
                  <input
                    type="text"
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              )}
            </Card>

            {/* Category */}
            <Card className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="AI & Data Governance">AI & Data Governance</option>
                <option value="Privacy & Security">Privacy & Security</option>
                <option value="Platform Regulation">Platform Regulation</option>
                <option value="Digital Rights">Digital Rights</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Web3 & Blockchain">Web3 & Blockchain</option>
              </select>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tag..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </Card>

            {/* SEO */}
            <Card className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                SEO Settings
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={formData.seo_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                    placeholder={formData.title || 'Auto-generated from title'}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Meta Description</label>
                  <textarea
                    value={formData.seo_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                    placeholder={formData.excerpt || 'Auto-generated from excerpt'}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            {/* Web3 Publishing (Coming Soon) */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-purple-600" />
                <label className="text-sm font-medium text-purple-900">
                  Web3 Publishing
                </label>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-purple-700 mb-3">
                Publish to IPFS and link to your ENS identity
              </p>
              <div className="space-y-2 text-xs text-purple-600">
                <div className="flex items-center gap-2">
                  <input type="checkbox" disabled className="rounded" />
                  <span>Publish to IPFS</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" disabled className="rounded" />
                  <span>Mint as NFT</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" disabled className="rounded" />
                  <span>Sign with ENS</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule Publication</h3>
              <button onClick={() => setShowScheduler(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_for}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduled_for: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowScheduler(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSave('schedule');
                    setShowScheduler(false);
                  }}
                  disabled={!formData.scheduled_for}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Schedule
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
