import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import MobileNav from './components/common/MobileNav';
import AssistantPage from './pages/AssistantPage';
import DocumentsPage from './pages/DocumentsPage';
import VectorExplorerPage from './pages/VectorExplorerPage';
import ResearchPage from './pages/ResearchPage';
import { useSystemStatus } from './hooks/useSystemStatus';
import { useRAG } from './hooks/useRAG';

function AppLayout() {
  const { health, stats, refresh: refreshStats } = useSystemStatus();
  const ragState = useRAG();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const location = useLocation();

  const isAssistantRoute = location.pathname === '/';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-900">
      {/* Top Application Bar */}
      <Navbar
        health={health}
        stats={stats}
        onOpenConfig={isAssistantRoute ? () => setIsConfigOpen(true) : undefined}
        onClearHistory={isAssistantRoute ? ragState.clearHistory : undefined}
        showClear={isAssistantRoute}
      />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Navigation Drawer */}
        <Sidebar />

        {/* Content Viewport */}
        <main className="flex-1 overflow-hidden relative bg-[#f8fafc]">
          <Routes>
            <Route
              path="/"
              element={
                <AssistantPage
                  ragState={ragState}
                  isConfigOpen={isConfigOpen}
                  setIsConfigOpen={setIsConfigOpen}
                />
              }
            />
            <Route
              path="/documents"
              element={<DocumentsPage onStatsRefresh={refreshStats} />}
            />
            <Route path="/explorer" element={<VectorExplorerPage />} />
            <Route path="/research" element={<ResearchPage />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Navigation Dock */}
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
