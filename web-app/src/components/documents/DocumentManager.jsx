import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Trash2, Database, Sliders } from 'lucide-react';
import ragService from '../../services/ragService';

export default function DocumentManager({ onStatsRefresh }) {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [indexingDoc, setIndexingDoc] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [chunkSize, setChunkSize] = useState(1000);
  const [chunkOverlap, setChunkOverlap] = useState(200);

  const loadDocuments = async () => {
    try {
      const data = await ragService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('chunk_size', chunkSize.toString());
    formData.append('chunk_overlap', chunkOverlap.toString());

    try {
      const res = await ragService.uploadDocument(formData);
      setStatusMessage({
        type: 'success',
        text: `Successfully uploaded & indexed '${res.filename}': ${res.chunks_created} chunks added. Total: ${res.total_vectors} vectors.`,
      });
      await loadDocuments();
      onStatsRefresh?.();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleIndexExisting = async (filename) => {
    setIndexingDoc(filename);
    setStatusMessage(null);

    try {
      const res = await ragService.indexExistingDocument({
        filename,
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
      });
      setStatusMessage({
        type: 'success',
        text: `Indexed '${filename}': +${res.chunks_indexed} chunks. Vector count: ${res.total_vectors}.`,
      });
      onStatsRefresh?.();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIndexingDoc(null);
    }
  };

  const handleClearVectorstore = async () => {
    if (!window.confirm('Are you sure you want to clear all indexed vectors from Chroma?')) return;
    try {
      await ragService.clearVectorstore();
      setStatusMessage({
        type: 'success',
        text: 'Vector store successfully cleared.',
      });
      onStatsRefresh?.();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Document Ingestion & Indexing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ingest PDFs and technical documents into Chroma vector database with configurable chunking boundaries.
          </p>
        </div>

        <button
          onClick={handleClearVectorstore}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium transition-colors self-start sm:self-auto shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Vector Database</span>
        </button>
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center space-x-3 shadow-sm ${statusMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Chunking Parameters Bar */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          <span>Ingestion Splitter Settings</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs pt-1">
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5">
              <span className="font-medium">Chunk Size ({chunkSize} characters)</span>
              <span className="font-mono text-slate-400">RecursiveCharacter</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="50"
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5">
              <span className="font-medium">Chunk Overlap ({chunkOverlap} characters)</span>
              <span className="font-mono text-slate-400">Boundary Context</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="20"
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(Number(e.target.value))}
              className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Card */}
      <div className="p-8 rounded-xl bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors flex flex-col items-center justify-center text-center space-y-3.5 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-slate-900">
            Upload PDF or Text Document
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Supports technical books, PDFs, and text notes. Automatic extraction and vector indexing.
          </p>
        </div>
        <label className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-colors inline-flex items-center space-x-2">
          {uploading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Processing Document...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Select Document</span>
            </>
          )}
          <input
            type="file"
            accept=".pdf,.txt,.md"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Available Documents List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Project Documents
        </h2>
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {documents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No documents found in server/data/documents/.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.filename}
                  className="p-4 sm:px-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {doc.filename}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 flex items-center space-x-2">
                        <span className="font-medium text-slate-600">{doc.file_type}</span>
                        <span>•</span>
                        <span>{(doc.size_bytes / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleIndexExisting(doc.filename)}
                      disabled={indexingDoc === doc.filename}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors flex items-center space-x-1.5 shadow-sm"
                    >
                      {indexingDoc === doc.filename ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                          <span>Indexing...</span>
                        </>
                      ) : (
                        <>
                          <Database className="w-3.5 h-3.5 text-blue-600" />
                          <span>Index / Embed</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
