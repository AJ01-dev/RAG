import api from './api';

export const ragService = {
  // System status & health
  getHealth: () => api.get('/health'),
  getStats: () => api.get('/stats'),

  // Document ingestion & management
  getDocuments: () => api.get('/documents'),
  uploadDocument: (formData) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  indexExistingDocument: (payload) => api.post('/documents/index-existing', payload),
  clearVectorstore: () => api.delete('/documents/clear'),

  // RAG query & vector retrieval
  queryRag: (payload) => api.post('/rag/query', payload),
  similaritySearch: (payload) => api.post('/rag/similarity-search', payload),

  // Academic research
  searchArxiv: (payload) => api.post('/research/arxiv', payload),
};

export default ragService;
