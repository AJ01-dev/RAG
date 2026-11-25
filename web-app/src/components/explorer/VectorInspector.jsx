import React, { useState } from 'react';
import { Search, Layers, Loader2, FileText } from 'lucide-react';
import ragService from '../../services/ragService';

export default function VectorInspector() {
  const [query, setQuery] = useState('');
  const [k, setK] = useState(4);
  const [retrieverType, setRetrieverType] = useState('similarity');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await ragService.similaritySearch({
        query: query.trim(),
        k: Number(k),
        retriever_type: retrieverType,
      });
      setResults(data);
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
          Vector Space Explorer
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Query Chroma embeddings directly without invoking the LLM. Inspect retrieved text chunks, distances, and metadata.
        </p>
      </div>

      {/* Query Bar */}
      <form
        onSubmit={handleSearch}
        className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vector embeddings (e.g., 'covariance formula', 'neural network loss')..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={retrieverType}
              onChange={(e) => setRetrieverType(e.target.value)}
              className="py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="similarity">Similarity</option>
              <option value="mmr">MMR Diversity</option>
            </select>

            <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">k:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={k}
                onChange={(e) => setK(e.target.value)}
                className="w-10 bg-transparent text-center font-mono text-xs text-slate-900 font-semibold focus:outline-none"
              />
            </div>

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
              <span>Query Vectors</span>
            </button>
          </div>
        </div>
      </form>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Results View */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Retrieved <span className="font-mono text-slate-900 font-semibold">{results.count}</span> nearest chunk(s) for query &quot;{results.query}&quot;
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {results.results.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs">
                  <div className="flex items-center space-x-2 font-mono text-[11px] text-blue-700 font-semibold">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.source}</span>
                    {item.page && <span className="text-slate-400 font-normal">p.{item.page}</span>}
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Rank #{idx + 1}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {item.content}
                </div>

                {item.metadata && (
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-500">
                    {Object.entries(item.metadata).map(([mk, mv]) => (
                      <span key={mk} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {mk}: {String(mv)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
