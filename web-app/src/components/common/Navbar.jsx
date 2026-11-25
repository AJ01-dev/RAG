import React from 'react';
import { Database, Cpu, Settings2, Trash2, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES = {
  '/': 'Document Assistant',
  '/documents': 'Document Ingestion',
  '/explorer': 'Vector Space Explorer',
  '/research': 'Arxiv Academic Research',
};

export default function Navbar({ health, stats, onOpenConfig, onClearHistory, showClear }) {
  const isHealthy = health?.status === 'healthy';
  const totalVectors = health?.total_vectors ?? stats?.total_chunks ?? 0;
  const isGroqReady = health?.groq_configured;
  const location = useLocation();

  const currentTitle = ROUTE_TITLES[location.pathname] || 'Workspace';

  return (
    <header className="h-16 border-b border-slate-200/90 bg-white px-4 sm:px-6 flex items-center justify-between z-10 shadow-sm">
      {/* Workspace Breadcrumbs & Title */}
      <div className="flex items-center space-x-3">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">{currentTitle}</span>
          </div>
          <h1 className="text-sm font-semibold text-slate-900 tracking-tight hidden sm:block">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* System Telemetry & SaaS Action Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Backend Connectivity Status */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              isHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className="text-slate-700 font-medium text-[11px] hidden md:inline">
            {isHealthy ? 'Backend Live' : 'Connecting...'}
          </span>
        </div>

        {/* Vector DB Count Chip */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50/70 border border-blue-200/80 text-xs">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-mono text-blue-800 font-semibold text-[11px]">
            {totalVectors} <span className="text-blue-600 font-sans font-normal hidden sm:inline">vectors</span>
          </span>
        </div>

        {/* LLM Status Chip */}
        <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50/70 border border-amber-200 text-xs">
          <Cpu className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-amber-800 text-[11px] font-medium">
            {isGroqReady ? 'Groq Grounded' : 'No API Key'}
          </span>
        </div>

        {/* Clear History Button */}
        {showClear && (
          <button
            onClick={onClearHistory}
            title="Clear Chat History"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Configuration Modal Button */}
        {onOpenConfig && (
          <button
            onClick={onOpenConfig}
            title="Tuning & Retrieval Settings"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium text-[11px]">Settings</span>
          </button>
        )}
      </div>
    </header>
  );
}
