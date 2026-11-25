import { useState, useCallback } from 'react';
import ragService from '../services/ragService';

export function useRAG() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Welcome to CognitiveRAG. I am indexed against your technical documents, research notes, and papers. Ask any question to retrieve grounded answers with verified source citations.',
      citations: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [activeCitations, setActiveCitations] = useState(null);
  const [error, setError] = useState(null);

  // Retrieval & LLM Config
  const [config, setConfig] = useState({
    retriever_type: 'mmr', // 'mmr' | 'similarity' | 'multiquery'
    k: 4,
    fetch_k: 10,
    lambda_mult: 0.5,
    model: 'openai/gpt-oss-120b',
  });

  const sendQuery = useCallback(
    async (questionText) => {
      if (!questionText.trim()) return;

      const userMsgId = Date.now().toString();
      const userMessage = {
        id: userMsgId,
        role: 'user',
        content: questionText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      try {
        const response = await ragService.queryRag({
          question: questionText.trim(),
          retriever_type: config.retriever_type,
          k: config.k,
          fetch_k: config.fetch_k,
          lambda_mult: config.lambda_mult,
          model: config.model,
        });

        const assistantMsgId = (Date.now() + 1).toString();
        const assistantMessage = {
          id: assistantMsgId,
          role: 'assistant',
          content: response.answer,
          citations: response.citations || [],
          retriever_type: response.retriever_type,
          model_used: response.model_used,
          execution_time_ms: response.execution_time_ms,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Auto-preview citations if available
        if (response.citations && response.citations.length > 0) {
          setActiveCitations({
            query: questionText,
            citations: response.citations,
            model: response.model_used,
            time: response.execution_time_ms,
          });
        }
      } catch (err) {
        setError(err.message);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            isError: true,
            content: `Failed to retrieve answer: ${err.message}. Ensure the backend is active and vector store is populated.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [config]
  );

  const clearHistory = useCallback(() => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Conversation history cleared. Ask a question to begin.',
        citations: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setActiveCitations(null);
  }, []);

  return {
    messages,
    loading,
    error,
    config,
    setConfig,
    activeCitations,
    setActiveCitations,
    sendQuery,
    clearHistory,
  };
}
