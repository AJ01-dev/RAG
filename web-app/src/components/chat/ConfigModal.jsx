import React, { useState } from 'react';
import { X, Sliders, Check, Globe } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl } from '../../services/api';

const MODELS = [
  { id: 'openai/gpt-oss-120b', label: 'GPT OSS 120B (Groq)', desc: 'Current project model' },
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile', desc: 'Fast, high-reasoning' },
  { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B (32k)', desc: 'Extended context window' },
];

const RETRIEVER_OPTIONS = [
  {
    id: 'mmr',
    name: 'MMR (Maximal Marginal Relevance)',
    desc: 'Balances relevance with diversity to avoid duplicate chunks.',
  },
  {
    id: 'similarity',
    name: 'Vector Similarity',
    desc: 'Pure cosine/L2 nearest-neighbor search for highest raw score.',
  },
  {
    id: 'multiquery',
    name: 'Multi-Query Expansion',
    desc: 'Uses LLM to generate multiple prompt angles for comprehensive retrieval.',
  },
];

export default function ConfigModal({ isOpen, onClose, config, setConfig }) {
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());

  if (!isOpen) return null;

  const handleApply = () => {
    setApiBaseUrl(apiUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden space-y-4">
        {/* Modal Header */}
        <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm text-slate-900">
              Retrieval & Model Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm max-h-[75vh] overflow-y-auto">
          {/* Backend API URL for Cloud Deployment */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Backend API URL (Render / Cloud)
              </label>
            </div>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="e.g. https://rag-backend.onrender.com/api or /api"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-400">
              Default is &apos;/api&apos; (local proxy) or set your Render backend URL.
            </p>
          </div>

          {/* LLM Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Inference Model (Groq)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {MODELS.map((m) => {
                const selected = config.model === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setConfig({ ...config, model: m.id })}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      selected
                        ? 'bg-blue-50/60 border-blue-500 text-blue-950 font-medium shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{m.label}</div>
                      <div className="text-[11px] text-slate-500">{m.desc}</div>
                    </div>
                    {selected && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Retriever Strategy */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Retrieval Algorithm
            </label>
            <div className="grid grid-cols-1 gap-2">
              {RETRIEVER_OPTIONS.map((r) => {
                const selected = config.retriever_type === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setConfig({ ...config, retriever_type: r.id })}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      selected
                        ? 'bg-blue-50/60 border-blue-500 text-blue-950 font-medium shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{r.name}</div>
                      <div className="text-[11px] text-slate-500">{r.desc}</div>
                    </div>
                    {selected && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tuning Sliders */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            {/* Top-K */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-800 font-medium">Top-K Chunks ({config.k})</span>
                <span className="text-slate-500 font-mono text-[11px]">Final context docs</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={config.k}
                onChange={(e) => setConfig({ ...config, k: Number(e.target.value) })}
                className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Fetch-K (for MMR) */}
            {config.retriever_type === 'mmr' && (
              <>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-800 font-medium">
                      Fetch-K Candidates ({config.fetch_k})
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      Initial pool to filter
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={config.fetch_k}
                    onChange={(e) =>
                      setConfig({ ...config, fetch_k: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Lambda Multiplier */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-800 font-medium">
                      Lambda Multiplier ({config.lambda_mult})
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      0: Diverse | 1: Relevant
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={config.lambda_mult}
                    onChange={(e) =>
                      setConfig({ ...config, lambda_mult: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
}
