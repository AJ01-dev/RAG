import React, { useState } from 'react';
import { Copy, Check, BookOpen, Clock, Cpu, ExternalLink } from 'lucide-react';

export default function MessageItem({ message, onOpenCitations }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const hasCitations = message.citations && message.citations.length > 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end my-3">
        <div className="max-w-2xl bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          <div className="mt-1 flex justify-end">
            <span className="text-[10px] font-mono text-blue-100">{message.timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-4">
      <div
        className={`w-full max-w-3xl rounded-xl border ${
          message.isError
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-white border-slate-200/90 text-slate-800'
        } p-4 sm:p-5 shadow-sm space-y-3.5`}
      >
        {/* Header / Meta */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-600">
              AI
            </div>
            <span className="font-semibold text-slate-900 text-xs">Grounded Synthesis</span>
            {message.model_used && (
              <span className="hidden sm:inline-flex items-center space-x-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                <Cpu className="w-3 h-3 text-slate-500" />
                <span>{message.model_used}</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {message.execution_time_ms && (
              <span className="flex items-center space-x-1 font-mono text-[10px] text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{message.execution_time_ms}ms</span>
              </span>
            )}
            <button
              onClick={handleCopy}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Copy answer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
          {message.content}
        </div>

        {/* Citations / Source References Footer */}
        {hasCitations && (
          <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-500 flex items-center space-x-1 mr-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Sources:</span>
              </span>
              {message.citations.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    onOpenCitations &&
                    onOpenCitations({
                      query: message.content,
                      citations: message.citations,
                      initialIndex: idx,
                      model: message.model_used,
                      time: message.execution_time_ms,
                    })
                  }
                  className="px-2 py-0.5 rounded bg-blue-50/70 hover:bg-blue-100 border border-blue-200/80 text-[10px] font-mono text-blue-700 flex items-center space-x-1 transition-colors"
                >
                  <span>{c.source}</span>
                  {c.page && <span className="text-slate-500 font-sans">p.{c.page}</span>}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                onOpenCitations &&
                onOpenCitations({
                  query: message.content,
                  citations: message.citations,
                  model: message.model_used,
                  time: message.execution_time_ms,
                })
              }
              className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center space-x-1 hover:underline font-medium"
            >
              <span>Inspect {message.citations.length} Chunks</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
