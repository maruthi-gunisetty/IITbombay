import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Send, Plus, RefreshCw, Key, ShieldCheck, Sparkles, MessageSquare
} from 'lucide-react';
import { aiAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AIChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [byokStatus, setByokStatus] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchBYOK();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchBYOK = async () => {
    try {
      const res = await aiAPI.getKeyStatus();
      setByokStatus(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await aiAPI.listConversations();
      setConversations(res.data || []);
      if (res.data?.length > 0 && !activeConvId) {
        setActiveConvId(res.data[0].id);
      } else if (res.data?.length === 0) {
        startNewConversation();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadMessages = async (id) => {
    try {
      const res = await aiAPI.getMessages(id);
      setMessages(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const startNewConversation = () => {
    setActiveConvId(null);
    setMessages([
      {
        sender: 'assistant',
        content: 'PropWise Intelligence session initialized. Ask questions regarding property valuations, debt-to-income limits, loan-to-value ratios, or anomaly checks.'
      }
    ]);
  };

  const handleSend = async (customPrompt = null) => {
    const text = customPrompt || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setLoading(true);

    try {
      const res = await aiAPI.chat({
        message: text,
        conversation_id: activeConvId
      });

      if (!activeConvId && res.data?.conversation_id) {
        setActiveConvId(res.data.conversation_id);
        fetchConversations();
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
          content: 'Notice: AI gateway communication error. You can verify your BYOK settings under Settings.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Explain the multi-variable valuation regression methodology",
    "How does DTI over 45% impact mortgage approval probability?",
    "Summarize the criteria for High Risk anomaly classification",
    "Describe the statutory human credit officer sign-off mandate"
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">PropWise Intelligence Assistant</h2>
          <p className="text-xs text-[#475569]">
            Context-grounded FinTech assistant providing explainable financial and property valuation intelligence.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse"></span>
          <span className="text-[#475569]">Active Gateway: <strong className="text-[#0F172A]">{byokStatus?.active_provider || 'Platform'}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px]">
        
        {/* Sessions Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <button
              onClick={startNewConversation}
              className="w-full py-2.5 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Intelligence Session</span>
            </button>

            <div className="pt-2">
              <span className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold block px-1 mb-2">
                Previous Sessions
              </span>
              <div className="space-y-1 max-h-[460px] overflow-y-auto">
                {conversations.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center space-x-2 ${
                      activeConvId === c.id
                        ? 'bg-[#F1F5F9] text-[#0284C7] border border-[#3978F6]/40 font-semibold'
                        : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{c.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-[10px] text-[#475569]">
            Deterministic Verification Active
          </div>
        </div>

        {/* Chat Conversation Canvas (9 cols) */}
        <div className="lg:col-span-9 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-xl flex flex-col overflow-hidden">
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-[#3978F6] text-white rounded-br-none shadow-md'
                      : 'bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{m.content}</p>
                  {m.provider_used && (
                    <div className="mt-2 pt-1 border-t border-[#E2E8F0]/40 text-[9px] text-[#475569]">
                      Source Engine: {m.provider_used}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#475569] flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-[#0284C7] animate-spin" />
                  <span>Synthesizing institutional context...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Row */}
          <div className="px-5 py-2.5 bg-[#F1F5F9] border-t border-[#E2E8F0] flex items-center space-x-2 overflow-x-auto no-scrollbar">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#3978F6]/20 border border-[#E2E8F0] text-[11px] text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-4 bg-[#FFFFFF] border-t border-[#E2E8F0]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-3"
            >
              <input
                type="text"
                placeholder="Submit an inquiry regarding valuation, underwriting formulas, or risk scores..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={loading}
                className="flex-1 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#475569] focus:outline-none focus:border-[#3978F6] transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white disabled:opacity-40 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AIChatPage;
