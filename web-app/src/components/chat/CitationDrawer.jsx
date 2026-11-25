import React, { useState } from 'react';
import { X, BookOpen, Copy, Check, FileText } from 'lucide-react';

export default function CitationDrawer({ activeCitations, onClose }) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  if (!activeCitations || !activeCitations.citations) return null;

  const citations = activeCitations.citations;

  const handleCopyChunk = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <aside className="w-full lg:w-96 border-l border-slate-200 bg-white flex flex-col h-full z-20 shadow-xl overflow-hidden shrink-0">
      {/* Header */}
      <div className="h-16 border-b border-slate-200 px-4 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-900">Retrieved Context</h3>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {citations.length} chunks
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chunks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {citations.map((chunk, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
          >
            {/* Chunk Header */}
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-700 truncate max-w-[200px]">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate font-semibold">{chunk.source}</span>
                {chunk.page && (
                  <span className="text-slate-400 font-sans">p.{chunk.page}</span>
                )}
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                  #{idx + 1}
                </span>
                <button
                  onClick={() => handleCopyChunk(chunk.content, idx)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Copy chunk text"
                >
                  {copiedIdx === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Chunk Content */}
            <div className="text-xs font-mono text-slate-700 leading-relaxed max-h-48 overflow-y-auto bg-slate-50 p-3 rounded-lg border border-slate-200/70">
              {chunk.content}
            </div>

            {/* Metadata tags */}
            {chunk.metadata && Object.keys(chunk.metadata).length > 0 && (
              <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-500">
                {Object.entries(chunk.metadata)
                  .filter(([k]) => !['content', 'source'].includes(k))
                  .slice(0, 3)
                  .map(([k, v]) => (
                    <span key={k} className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/60">
                      {k}: {String(v)}
                    </span>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
