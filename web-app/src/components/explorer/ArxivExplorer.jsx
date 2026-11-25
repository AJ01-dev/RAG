import React, { useState } from 'react';
import { BookMarked, Search, Loader2, ExternalLink, Calendar, Users } from 'lucide-react';
import ragService from '../../services/ragService';

export default function ArxivExplorer() {
  const [query, setQuery] = useState('large language models');
  const [maxResults, setMaxResults] = useState(5);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await ragService.searchArxiv({
        query: query.trim(),
        max_results: Number(maxResults),
      });
      setPapers(data.papers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Arxiv Academic Literature Search
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Query arXiv repository for academic preprints, foundational papers, and research summaries.
        </p>
      </div>

      {/* Query Bar */}
      <form
        onSubmit={handleSearch}
        className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Arxiv papers (e.g. 'retrieval augmented generation', 'deep learning optimization')..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value={3}>3 Papers</option>
              <option value={5}>5 Papers</option>
              <option value={10}>10 Papers</option>
            </select>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-colors disabled:opacity-50 flex items-center space-x-1.5"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              <span>Search arXiv</span>
            </button>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Papers View */}
      {papers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Found {papers.length} Arxiv Publications
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {papers.map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-sm text-slate-900 leading-snug">
                    {p.title}
                  </h3>
                  {p.pdf_url && (
                    <a
                      href={p.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center space-x-1.5 shrink-0 transition-colors"
                    >
                      <span>PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                  {p.authors && p.authors.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-xs">{p.authors.join(', ')}</span>
                    </div>
                  )}
                  {p.published && (
                    <div className="flex items-center space-x-1 font-mono text-[10px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.published}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 font-sans">
                  {p.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
