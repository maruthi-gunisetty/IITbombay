import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, Key, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { aiAPI } from '../../services/api';

const AIAssistantModal = ({ contextType = 'general', referenceId = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      content: 'Welcome to PropWise Intelligence. I provide analytical decision support for property valuations, mortgage underwriting parameters, decoupled risk matrices, and fraud indicators. How can I assist your review?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [byokStatus, setByokStatus] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchBYOKStatus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchBYOKStatus = async () => {
    try {
      const res = await aiAPI.getKeyStatus();
      setByokStatus(res.data);
    } catch (e) {
      console.error("BYOK status error:", e);
    }
  };

  const handleSendMessage = async (customPrompt = null) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setLoading(true);

    try {
      const res = await aiAPI.chat({
        message: textToSend,
        conversation_id: conversationId,
        context_type: contextType,
        reference_id: referenceId ? String(referenceId) : null
      });

      if (res.data?.conversation_id) {
        setConversationId(res.data.conversation_id);
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          content: res.data.message,
          provider_used: res.data.provider_used
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          content: 'Notice: Unable to reach the AI gateway. If you have a personal OpenRouter API key, please configure it under Settings to activate direct BYOK completions.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Explain valuation regression factors",
    "Explain DTI and LTV lending limits",
    "Describe fraud anomaly check logic",
    "Clarify human review requirements"
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-tr from-[#2457C5] to-[#3978F6] text-white shadow-2xl hover:shadow-[#3978F6]/40 transition-all duration-300 hover:scale-105 flex items-center space-x-2 border border-[#0284C7]/40"
        title="Open PropWise Intelligence Assistant"
      >
        <Bot className="w-5 h-5 text-white" />
        <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline">PropWise Intelligence</span>
      </button>

      {/* Slide-out Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-4 bg-[#FFFFFF] border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#3978F6]/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#0284C7]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] leading-none">PropWise Intelligence</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
                  <span className="text-[10px] text-[#475569]">
                    Active Provider: <strong className="text-[#0F172A]">{byokStatus?.active_provider || 'Platform'}</strong>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#475569] hover:text-white hover:bg-[#FFFFFF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BYOK Status Banner */}
          <div className="px-4 py-2 bg-[#FFFFFF]/60 border-b border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#475569]">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>Grounded Institutional Analysis</span>
            </div>
            {byokStatus?.masked_key && (
              <span className="text-[10px] text-[#0284C7] font-mono">
                BYOK: {byokStatus.masked_key}
              </span>
            )}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-[#3978F6] text-white rounded-br-none shadow-md'
                      : 'bg-[#FFFFFF] text-[#0F172A] border border-[#E2E8F0] rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{m.content}</p>
                  {m.provider_used && (
                    <div className="mt-2 pt-1 border-t border-[#E2E8F0]/40 text-[9px] text-[#475569] flex items-center justify-between">
                      <span>Source: {m.provider_used}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs text-[#475569] flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#0284C7] animate-spin" />
                  <span>Synthesizing institutional context...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-[#FFFFFF]/60 border-t border-[#E2E8F0] flex items-center space-x-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#3978F6]/20 border border-[#E2E8F0] text-[10px] text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#FFFFFF] border-t border-[#E2E8F0]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask about valuation factors, DTI, LTV, risk..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={loading}
                className="flex-1 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs text-[#0F172A] placeholder-[#475569] focus:outline-none focus:border-[#3978F6] transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="p-2 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white disabled:opacity-40 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};

export default AIAssistantModal;
