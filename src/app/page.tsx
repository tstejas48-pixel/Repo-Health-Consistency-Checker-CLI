'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/lib/types';

export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [repoName, setRepoName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'demo'>('demo');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!files || files.length === 0) {
      setError('Please select files to analyze');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      formData.append('repoName', repoName || 'Uploaded Repository');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDemo = async () => {
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Demo analysis failed');
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'success': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '•';
    }
  };

  const groupChecksByCategory = () => {
    if (!result) return {};
    
    const grouped: Record<string, typeof result.checks> = {};
    
    result.checks.forEach(check => {
      if (!grouped[check.category]) {
        grouped[check.category] = [];
      }
      grouped[check.category].push(check);
    });
    
    return grouped;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏥 Repo Health Checker
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Analyze your repository for code quality, documentation, and best practices
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'demo'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🎯 Try Demo
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📁 Upload Files
            </button>
          </div>
        </div>

        {/* Demo Tab */}
        {activeTab === 'demo' && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Try a Demo Analysis
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Run an analysis on a sample well-configured repository to see what a healthy repo looks like.
                  The demo includes README, tests, CI/CD, linting, and more.
                </p>
              </div>
              <button
                onClick={handleDemo}
                disabled={analyzing}
                className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Run Demo Analysis'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Repository Files</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="repoName" className="block text-sm font-medium text-gray-700 mb-2">
                  Repository Name (Optional)
                </label>
                <input
                  type="text"
                  id="repoName"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="my-awesome-project"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    /* @ts-ignore */
                    webkitdirectory=""
                    directory=""
                    className="hidden"
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer">
                    <div className="text-5xl mb-4">📁</div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {files ? `${files.length} files selected` : 'Select folder to upload'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Click to browse and select your project folder
                    </p>
                  </label>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!files || analyzing}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing Repository...
                  </span>
                ) : (
                  'Analyze Repository'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            <div className="flex items-center gap-2">
              <span className="text-xl">❌</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Health Score Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Health Score</h2>
                <div className={`text-6xl font-bold ${getScoreColor(result.healthScore)}`}>
                  {result.healthScore}
                  <span className="text-2xl">/100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{result.summary.total}</div>
                  <div className="text-sm text-gray-600">Total Checks</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{result.summary.passed}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600">{result.summary.errors}</div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">{result.summary.warnings}</div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
              </div>
            </div>

            {/* Checks by Category */}
            {Object.entries(groupChecksByCategory()).map(([category, checks]) => (
              <div key={category} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>{category}</span>
                  <span className="text-sm font-normal text-gray-500">
                    ({checks.filter(c => c.passed).length}/{checks.length} passed)
                  </span>
                </h3>
                
                <div className="space-y-3">
                  {checks.map((check, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${
                        check.passed
                          ? 'border-green-500 bg-green-50'
                          : check.severity === 'error'
                          ? 'border-red-500 bg-red-50'
                          : check.severity === 'warning'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{getSeverityIcon(check.severity)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{check.message}</span>
                            {check.filePath && (
                              <span className="text-xs text-gray-500 font-mono">
                                {check.filePath}
                              </span>
                            )}
                          </div>
                          {check.suggestion && (
                            <p className="text-sm text-gray-600 mt-1">
                              💡 {check.suggestion}
                            </p>
                          )}
                          {check.details && Object.keys(check.details).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                                View details
                              </summary>
                              <pre className="mt-2 text-xs bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                                {JSON.stringify(check.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>
                  Analyzed: {new Date(result.metadata.analyzedAt).toLocaleString()}
                </span>
                <span>
                  Duration: {result.metadata.duration}ms
                </span>
                <span>
                  Repository: {result.metadata.repositoryName}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!result && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-3">📖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-gray-600 text-sm">
                Check for README quality, required sections, code examples, and more
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal & Compliance</h3>
              <p className="text-gray-600 text-sm">
                Verify license presence, recognition, and copyright notices
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Code Quality</h3>
              <p className="text-gray-600 text-sm">
                Detect tests, linting configs, CI/CD setup, and coverage
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Git Hygiene</h3>
              <p className="text-gray-600 text-sm">
                Analyze .gitignore completeness and prevent common mistakes
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dependencies</h3>
              <p className="text-gray-600 text-sm">
                Check package.json metadata, scripts, and lock files
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CI/CD</h3>
              <p className="text-gray-600 text-sm">
                Identify automation workflows and deployment pipelines
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p className="text-sm">
            Built with Next.js, PostgreSQL, and Drizzle ORM • Repo Health Checker v1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
}
