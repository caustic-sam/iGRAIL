'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';

type ImportStatus = 'idle' | 'parsing' | 'importing' | 'success' | 'error';

interface ImportResult {
  imported: number;
  failed: number;
  skipped: number;
  errors: string[];
}

export default function WordPressImportPage() {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setStatus('parsing');
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('importing');
      setProgress(50);

      const response = await fetch('/api/admin/import/wordpress', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Import failed');
      }

      setProgress(100);
      setStatus('success');
      setResult(data);
    } catch (error) {
      console.error('Import error:', error);
      setStatus('error');
      setResult({
        imported: 0,
        failed: 0,
        skipped: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Import from WordPress</h1>
              <p className="text-sm text-gray-600 mt-1">
                Upload a WordPress XML export file to import your posts and drafts
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Instructions Card */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            How to Export from WordPress
          </h2>
          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="font-semibold text-blue-600 min-w-[24px]">1.</span>
              <span>Log in to your WordPress admin dashboard</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-blue-600 min-w-[24px]">2.</span>
              <span>Go to <strong>Tools → Export</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-blue-600 min-w-[24px]">3.</span>
              <span>Select &quot;All content&quot; or &quot;Posts&quot; (includes drafts)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-blue-600 min-w-[24px]">4.</span>
              <span>Click &quot;Download Export File&quot; to get the XML file</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-blue-600 min-w-[24px]">5.</span>
              <span>Upload that XML file below</span>
            </li>
          </ol>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This will import posts, drafts, categories, and tags.
              Media files will need to be uploaded separately to the Media Studio.
            </p>
          </div>
        </Card>

        {/* Upload Card */}
        <Card className="p-8">
          <div className="text-center">
            {status === 'idle' || status === 'error' ? (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer group"
                  >
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-12 h-12 text-blue-600" />
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".xml,.wpress,.zip"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                {file ? (
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-gray-600 mb-2">
                      Drag and drop your WordPress export file here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: .xml (WordPress Export), .wpress (All-in-One WP Migration)
                    </p>
                  </div>
                )}

                {file && (
                  <button
                    onClick={handleImport}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Start Import
                  </button>
                )}

                {!file && (
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                  >
                    Choose File
                  </label>
                )}
              </>
            ) : status === 'parsing' || status === 'importing' ? (
              <>
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {status === 'parsing' ? 'Parsing WordPress file...' : 'Importing content...'}
                </h3>
                <div className="max-w-md mx-auto">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{progress}%</p>
                </div>
              </>
            ) : status === 'success' ? (
              <>
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Import Complete!
                </h3>
                {result && (
                  <div className="max-w-md mx-auto space-y-3 mb-6">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Imported</span>
                      <span className="text-lg font-bold text-green-600">{result.imported}</span>
                    </div>
                    {result.skipped > 0 && (
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Skipped (duplicates)</span>
                        <span className="text-lg font-bold text-yellow-600">{result.skipped}</span>
                      </div>
                    )}
                    {result.failed > 0 && (
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Failed</span>
                        <span className="text-lg font-bold text-red-600">{result.failed}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/admin"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Go to Publishing Desk
                  </Link>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setFile(null);
                      setResult(null);
                      setProgress(0);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Import Another File
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </Card>

        {/* Error Display */}
        {status === 'error' && result && result.errors.length > 0 && (
          <Card className="p-6 mt-6 border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Import Errors</h3>
                <ul className="space-y-1">
                  {result.errors.map((error, i) => (
                    <li key={i} className="text-sm text-red-700">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Alternative Import Methods */}
        <Card className="p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Alternative Import Methods
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg opacity-50">
              <FileText className="w-6 h-6 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-500 mb-1">LinkedIn Posts</h3>
              <p className="text-sm text-gray-400">Coming soon</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg opacity-50">
              <Download className="w-6 h-6 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-500 mb-1">CSV Import</h3>
              <p className="text-sm text-gray-400">Coming soon</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
