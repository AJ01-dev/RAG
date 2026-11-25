import React from 'react';
import ArxivExplorer from '../components/explorer/ArxivExplorer';

export default function ResearchPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-[#f8fafc] pb-16 md:pb-6">
      <ArxivExplorer />
    </div>
  );
}
