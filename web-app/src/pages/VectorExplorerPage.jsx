import React from 'react';
import VectorInspector from '../components/explorer/VectorInspector';

export default function VectorExplorerPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-[#f8fafc] pb-16 md:pb-6">
      <VectorInspector />
    </div>
  );
}
