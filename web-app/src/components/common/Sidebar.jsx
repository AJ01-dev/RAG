import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, FolderUp, Layers, BookMarked, Cpu, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Document Assistant',
    icon: MessageSquare,
    badge: 'Q&A',
  },
  {
    to: '/documents',
    label: 'Document Ingestion',
    icon: FolderUp,
    badge: 'Chroma',
  },
  {
    to: '/explorer',
    label: 'Vector Explorer',
    icon: Layers,
    badge: 'Chunks',
  },
  {
    to: '/research',
    label: 'Arxiv Research',
    icon: BookMarked,
    badge: 'Papers',
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-[#1e293b] bg-[#0c1427] flex flex-col justify-between hidden md:flex shrink-0 z-20">
      <div className="p-4 space-y-6">
        {/* Brand Header */}
        <div className="px-2 pt-1 pb-3 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-md shadow-blue-500/20">
            CR
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm text-white tracking-tight">
                CognitiveRAG
              </span>
              <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Document Intelligence Studio
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Workspaces
          </div>
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Architecture Specs Panel */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-2.5 text-[11px] shadow-sm">
          <div className="flex items-center space-x-2 text-slate-200 font-medium">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Architecture Specs</span>
          </div>
          <div className="space-y-1.5 font-mono text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Vector Engine:</span>
              <span className="text-slate-200 font-medium">ChromaDB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Embeddings:</span>
              <span className="text-slate-200 font-medium">MiniLM-L6-v2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Strategy:</span>
              <span className="text-slate-200 font-medium">MMR / MultiQuery</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Inference:</span>
              <span className="text-slate-200 font-medium">Groq Cloud</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Guarantee */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-0.5">
        <div className="flex items-center space-x-1.5 text-slate-300 font-medium text-[11px]">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Strict Context Grounding</span>
        </div>
        <p className="text-[10px] text-slate-500">Zero hallucinations guarantee</p>
      </div>
    </aside>
  );
}
