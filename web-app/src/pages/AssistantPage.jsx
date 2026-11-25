import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import MessageItem from '../components/chat/MessageItem';
import QueryInput from '../components/chat/QueryInput';
import CitationDrawer from '../components/chat/CitationDrawer';
import ConfigModal from '../components/chat/ConfigModal';

const PROMPT_SUGGESTIONS = [
  'What is covariance and correlation, and how are they calculated?',
  'Explain how gradient descent minimizes the loss function.',
  'What is the core premise of Deep Learning according to the preface?',
  'How do Neural Networks use gradient descent during training?',
];

export default function AssistantPage({
  ragState,
  isConfigOpen,
  setIsConfigOpen,
}) {
  const {
    messages,
    loading,
    config,
    setConfig,
    activeCitations,
    setActiveCitations,
    sendQuery,
  } = ragState;

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden relative bg-[#f8fafc]">
      {/* Main Conversation Stream */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Suggestions Card on fresh start */}
            {messages.length <= 1 && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4 my-2">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Context-Aware RAG Engine
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Explore Your Ingested Knowledge Base
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every response is strictly synthesized from vector chunks retrieved from your
                  PDFs and documents. Click an example prompt below or enter your technical inquiry.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {PROMPT_SUGGESTIONS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendQuery(prompt)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 text-left text-xs text-slate-700 hover:text-blue-950 transition-all flex items-start space-x-2 shadow-2xs group"
                    >
                      <span className="text-blue-500 font-mono text-[10px] mt-0.5 group-hover:translate-x-0.5 transition-transform">↳</span>
                      <span className="leading-snug font-medium">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Messages */}
            {messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                onOpenCitations={(cData) => setActiveCitations(cData)}
              />
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
                <span className="font-mono text-[11px] text-slate-600">
                  Retrieving {config.retriever_type.toUpperCase()} vector chunks & synthesizing with Groq...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input Dock */}
        <div className="border-t border-slate-200/90 bg-white/90 backdrop-blur-md pt-3">
          <QueryInput
            onSend={sendQuery}
            loading={loading}
            config={config}
            onOpenConfig={() => setIsConfigOpen(true)}
          />
        </div>
      </div>

      {/* Slide-over Right Drawer for Citations */}
      {activeCitations && (
        <CitationDrawer
          activeCitations={activeCitations}
          onClose={() => setActiveCitations(null)}
        />
      )}

      {/* Tuning Settings Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        setConfig={setConfig}
      />
    </div>
  );
}
