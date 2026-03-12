'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { RichTextEditor } from '@/components/RichTextEditor';
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
  Eye,
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

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.slug, formData.title]);

  // Auto-generate excerpt from content
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

      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        const actionText = action === 'draft' ? 'saved as draft' : action === 'publish' ? 'published' : 'scheduled';
        toast.success(`Article ${actionText}!`, {
          description: `ID: ${data.article?.id}`,
        });
        router.push('/admin');
      } else {
        toast.error('Failed to save article', {
          description: data.error || 'Unknown error',
        });
      }
    } catch (error) {
      console.error('❌ Error saving article:', error);
      toast.error('Failed to save article', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
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

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      toast.info('Uploading image...', { duration: 2000 });

      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        toast.error('Upload failed', { description: error.message });
        return;
      }

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, featured_image_url: urlData.publicUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload exception:', error);
      toast.error('Upload failed', { description: error instanceof Error ? error.message : 'Unknown error' });
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
              <h1 className="text-2xl font-bold text-gray-900">New Article</h1>
              <p className="text-sm text-gray-600 mt-1">
                {formData.content ? `${formData.content.split(/\s+/).length} words · ${calculateReadTime()} min read` : 'Start writing...'}
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
                onClick={() => setShowPreview(true)}
                disabled={!formData.title || !formData.content}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>

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
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Content
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Write your article here..."
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
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    className="hidden"
                    id="featured-image-upload"
                  />
                  <label
                    htmlFor="featured-image-upload"
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer mb-2"
                  >
                    Choose File
                  </label>
                  <div className="text-xs text-gray-500 mb-2">or</div>
                  <input
                    type="text"
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder:text-gray-400"
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
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-[#4a6fa5] text-white rounded-lg hover:bg-[#3d5c8a] transition-colors"
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
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Meta Description</label>
                  <textarea
                    value={formData.seo_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                    placeholder={formData.excerpt || 'Auto-generated from excerpt'}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            {/* Web3 Publishing (Coming Soon) */}
            <Card className="p-6 bg-gradient-to-br from-[#f0eef3] to-[#e8eef5] border-[#d1c9dd]">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-[#8b7fa8]" />
                <label className="text-sm font-medium text-[#6b5f7e]">
                  Web3 Publishing
                </label>
                <span className="text-xs bg-[#e5dff0] text-[#756a8f] px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-[#756a8f] mb-3">
                Publish to IPFS and link to your ENS identity
              </p>
              <div className="space-y-2 text-xs text-[#8b7fa8]">
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
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_for}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduled_for: e.target.value }))}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    colorScheme: 'light'
                  }}
                />
                {formData.scheduled_for && (
                  <p className="text-sm text-gray-600 mt-2">
                    Article will be published on {new Date(formData.scheduled_for).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowScheduler(false)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handleSave('schedule');
                    setShowScheduler(false);
                  }}
                  disabled={!formData.scheduled_for || saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? 'Scheduling...' : 'Schedule Article'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8">
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] p-6 rounded-t-lg flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Article Preview</h3>
                <p className="text-blue-100 text-sm mt-1">
                  {calculateReadTime()} min read · {formData.category || 'Uncategorized'}
                </p>
              </div>
              <button onClick={() => setShowPreview(false)} className="text-white hover:text-blue-200">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-8">
              {/* Featured Image */}
              {formData.featured_image_url && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={formData.featured_image_url}
                    alt={formData.title}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title}</h1>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>·</span>
                <span>{calculateReadTime()} min read</span>
                {formData.category && (
                  <>
                    <span>·</span>
                    <span className="text-blue-600 font-medium">{formData.category}</span>
                  </>
                )}
              </div>

              {/* Excerpt */}
              {formData.excerpt && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <p className="text-lg text-gray-700 italic">{formData.excerpt}</p>
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />

              {/* Tags */}
              {formData.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview Footer */}
            <div className="bg-gray-50 p-6 rounded-b-lg flex justify-between items-center">
              <p className="text-sm text-gray-600">
                This is how your article will appear when published
              </p>
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
