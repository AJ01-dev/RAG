import React, { useState, useRef, useEffect } from 'react';
import { Send, SlidersHorizontal, Loader2 } from 'lucide-react';

export default function QueryInput({ onSend, loading, config, onOpenConfig }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || loading) return;
    onSend(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [text]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white border border-slate-300 rounded-xl shadow-md focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
      >
        {/* Controls Bar Above Input */}
        <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Strategy:
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {config.retriever_type.toUpperCase()} (k={config.k})
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenConfig}
            className="flex items-center space-x-1 text-[11px] text-slate-500 hover:text-blue-600 transition-colors font-medium"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Tune Parameters</span>
          </button>
        </div>

        {/* Text Input Area */}
        <div className="flex items-end p-2.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a technical question from the indexed documents (e.g. 'What is covariance?', 'Explain gradient descent')..."
            className="flex-1 bg-transparent border-0 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 resize-none max-h-36 py-1 px-1.5"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!text.trim() || loading}
            className={`p-2 rounded-lg ml-2 transition-all flex items-center justify-center ${text.trim() && !loading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
      <div className="flex justify-between items-center px-1 mt-1.5 text-[10px] text-slate-400">
        <span>Enter to submit • Shift + Enter for new line</span>
        <span className="font-medium text-slate-500">Strict Context Grounding Active</span>
      </div>
    </div>
  );
}
