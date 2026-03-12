'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Video,
  File,
  Trash2,
  Download,
  Search,
  Filter,
  X,
  RefreshCw
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  created_at: string;
}

type FileTypeFilter = 'all' | 'images' | 'videos' | 'documents';

export default function MediaVaultPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FileTypeFilter>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const supabase = createClientComponentClient();

  // We wrap this loader in `useCallback` because the effect below depends on it.
  // Without `useCallback`, React would create a brand-new function on every render,
  // the effect would see that as a dependency change, and we could refetch in a loop.
  const fetchFiles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('media')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching files from Supabase storage:', error);
        setFiles([]);
        return;
      }

      // Filter out folders (items with null id or null metadata) and map to files
      const filesOnly = (data || []).filter(item => item.id !== null && item.metadata !== null);

      const filesWithUrls = filesOnly.map(file => {
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(file.name);

        // Add cache-busting timestamp to ensure fresh images
        const urlWithCacheBust = `${urlData.publicUrl}?t=${Date.now()}`;

        return {
          id: file.id!,
          name: file.name,
          type: file.metadata?.mimetype || 'unknown',
          size: file.metadata?.size || 0,
          url: urlWithCacheBust,
          created_at: file.created_at || new Date().toISOString()
        };
      });

      setFiles(filesWithUrls);
    } catch (error) {
      console.error('Unexpected error while loading media files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    // Force a fresh fetch on every mount
    setLoading(true);
    setFiles([]);
    fetchFiles().catch(err => {
      console.error('Media file refresh failed:', err);
      setLoading(false);
    });
  }, [fetchFiles]);

  const uploadFiles = async (fileList: FileList) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(fileList)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
          .from('media')
          .upload(fileName, file);

        if (error) {
          console.error(`Upload failed for media file "${fileName}":`, error);
          toast.error('Upload failed', { description: error.message });
        } else {
          toast.success('File uploaded', { description: fileName });
        }
      }

      setLoading(true);
      await fetchFiles();
      toast.success('Upload complete', { description: `${fileList.length} file(s) uploaded successfully` });
    } catch (error) {
      console.error('Unexpected error while uploading media files:', error);
      toast.error('Upload failed', { description: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      await uploadFiles(fileList);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      await uploadFiles(droppedFiles);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Delete ${fileName}?`)) return;

    try {
      const { error } = await supabase.storage
        .from('media')
        .remove([fileName]);

      if (error) {
        console.error(`Delete failed for media file "${fileName}":`, error);
        toast.error('Delete failed', { description: error.message });
        return;
      }

      toast.success('File deleted', { description: fileName });
      await fetchFiles();
    } catch (error) {
      console.error('Unexpected error while deleting a media file:', error);
      toast.error('Delete failed', { description: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-6 h-6" />;
    if (type.startsWith('video/')) return <Video className="w-6 h-6" />;
    if (type === 'application/pdf') return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileType = (type: string): FileTypeFilter => {
    if (type.startsWith('image/')) return 'images';
    if (type.startsWith('video/')) return 'videos';
    if (type === 'application/pdf' || type.startsWith('application/')) return 'documents';
    return 'all';
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || getFileType(file.type) === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] border-b border-blue-900/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Media Vault</h1>
              <p className="text-xl text-blue-100">Upload and manage your media files</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setFiles([]);
                fetchFiles();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Section with Drag & Drop */}
        <Card
          className={`p-6 mb-8 transition-all ${
            isDragging
              ? 'border-2 border-blue-500 border-dashed bg-blue-50'
              : 'border-2 border-transparent'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {isDragging ? 'Drop files here...' : 'Upload Files'}
              </h2>
              <p className="text-sm text-gray-600">
                {isDragging
                  ? 'Release to upload your files'
                  : 'Drag & drop files here, or click to browse'}
              </p>
              {!isDragging && (
                <p className="text-xs text-gray-500 mt-1">
                  Supports images (JPG, PNG, WebP), videos (MP4, WebM), and documents (PDF)
                </p>
              )}
            </div>
            {!isDragging && (
              <label className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>{uploading ? 'Uploading...' : 'Choose Files'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </Card>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'images', 'videos', 'documents'] as FileTypeFilter[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Files Grid */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : filteredFiles.length === 0 ? (
          <Card className="p-12 text-center">
            <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No files yet</h3>
            <p className="text-gray-600">Upload your first file to get started</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="p-2 hover:shadow-lg transition-shadow">
                {/* Preview */}
                <div
                  className="relative aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  onClick={() => setSelectedFile(file)}
                  title="Click to view details"
                >
                  {file.type.startsWith('image/') ? (
                    // `fill` tells Next.js to absolutely position the image and stretch it
                    // to this wrapper. That only works because the wrapper is `relative`
                    // and has a real size from `aspect-square`.
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 12vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="mb-2">
                  <h3 className="text-xs font-medium text-gray-900 truncate mb-0.5" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium hover:bg-blue-100 transition-colors"
                    title="Download"
                  >
                    <Download className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => handleDelete(file.name)}
                    className="flex items-center justify-center px-2 py-1.5 bg-red-50 text-red-600 rounded text-[10px] font-medium hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{files.length}</div>
            <div className="text-sm text-gray-600">Total Files</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {files.filter(f => f.type.startsWith('image/')).length}
            </div>
            <div className="text-sm text-gray-600">Images</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {files.filter(f => f.type.startsWith('video/')).length}
            </div>
            <div className="text-sm text-gray-600">Videos</div>
          </Card>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 truncate flex-1 mr-4">
                {selectedFile.name}
              </h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="p-6 flex items-center justify-center bg-gray-50">
              {selectedFile.type.startsWith('image/') ? (
                // The modal preview uses the same `fill` pattern as the grid preview:
                // parent establishes the box, image fills it, `object-contain` prevents
                // cropping so editors can inspect the full asset.
                <Image
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  width={1600}
                  height={1200}
                  unoptimized
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                />
              ) : (
                <div className="text-gray-400 p-12">
                  {getFileIcon(selectedFile.type)}
                  <p className="text-sm text-gray-600 mt-4">Preview not available</p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">File Details</h4>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-gray-500">File Name</dt>
                  <dd className="text-gray-900 font-medium mt-1 break-all">{selectedFile.name}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">File Size</dt>
                  <dd className="text-gray-900 font-medium mt-1">{formatFileSize(selectedFile.size)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">File Type</dt>
                  <dd className="text-gray-900 font-medium mt-1">{selectedFile.type}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Uploaded</dt>
                  <dd className="text-gray-900 font-medium mt-1">
                    {new Date(selectedFile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-gray-500">URL</dt>
                  <dd className="text-gray-900 font-mono text-xs mt-1 break-all bg-gray-50 p-2 rounded">
                    {selectedFile.url.split('?')[0]}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2 justify-end">
              <a
                href={selectedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              <button
                onClick={() => {
                  handleDelete(selectedFile.name);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
