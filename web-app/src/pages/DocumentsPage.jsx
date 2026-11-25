import React from 'react';
import DocumentManager from '../components/documents/DocumentManager';

export default function DocumentsPage({ onStatsRefresh }) {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-[#f8fafc] pb-16 md:pb-6">
      <DocumentManager onStatsRefresh={onStatsRefresh} />
    </div>
  );
}
