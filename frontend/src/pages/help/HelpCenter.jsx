import React, { useState } from 'react';
import {
  HelpCircle, ChevronDown, ChevronUp, BookOpen, Calculator,
  Landmark, Key, MessageSquare, Send, CheckCircle2, ShieldCheck
} from 'lucide-react';

const HelpCenter = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    {
      q: "How does the AI Property Valuation Model compute property values?",
      a: "The valuation engine utilizes a multi-variable regression pipeline that processes locality baseline price indexes, built-up area dimensions, room layout counts, physical construction quality tiers, and age depreciation curves. Each valuation output features an explainable SHAP-style factor breakdown and confidence range bounds."
    },
    {
      q: "How are Debt-to-Income (DTI) and Loan-to-Value (LTV) limits calculated?",
      a: "DTI is calculated as total monthly debt service (new proposed EMI plus existing borrower obligations) divided by gross monthly income. LTV is calculated as requested loan principal divided by the assessed collateral property market value. Standard prudential ceilings are 45% for DTI and 80% for LTV."
    },
    {
      q: "What is Dual API Key Management (BYOK) and how does automatic fallback work?",
      a: "BYOK allows users to provide their personal OpenRouter API key. By default, PROPWISE AI utilizes its platform-managed key pool. If the platform pool reaches quota exhaustion or rate limits, the system seamlessly routes requests to your validated personal key (if configured and enabled), ensuring uninterrupted workflow."
    },
    {
      q: "Can the AI Assistant make binding mortgage credit decisions?",
      a: "No. The AI Assistant and underwriting algorithms operate strictly as decision support instruments. Under institutional governance policies and regulatory directives, binding credit approvals require non-delegable sign-off from a certified human bank officer."
    },
    {
      q: "How are personal OpenRouter API keys encrypted?",
      a: "Personal API keys are encrypted at rest using AES-256-GCM authenticated encryption. The server generates a unique cryptographic nonce for every key and stores only the ciphertext. Plaintext keys are never stored, logged, or returned to frontend browsers."
    }
  ];

  const guides = [
    {
      icon: Calculator,
      title: "Property Valuation Protocol",
      desc: "Learn how dimensional inputs, locality multipliers, and amenity counts influence automated estimates."
    },
    {
      icon: Landmark,
      title: "Underwriting & DTI Standards",
      desc: "A comprehensive manual on financial affordability thresholds, EMI amortization formulas, and reserve requirements."
    },
    {
      icon: Key,
      title: "OpenRouter BYOK Integration",
      desc: "Step-by-step instructions for generating an OpenRouter key, enabling fallback, and monitoring quota consumption."
    }
  ];

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    setTicketSent(true);
    setTicketSubject('');
    setTicketMsg('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[#F5F7FC] tracking-tight">Help Center & Knowledge Base</h2>
        <p className="text-xs text-[#98A7BD]">
          Operational guides, algorithmic methodology disclosures, and technical support desk.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guides.map((g, i) => {
          const Icon = g.icon;
          return (
            <div key={i} className="bg-[#111D32] border border-[#23324A] rounded-xl p-5 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-[#0D1628] border border-[#23324A] flex items-center justify-center text-[#29C5E8]">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#F5F7FC]">{g.title}</h3>
              <p className="text-xs text-[#98A7BD] leading-relaxed">{g.desc}</p>
            </div>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <div className="bg-[#111D32] border border-[#23324A] rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-[#F5F7FC] pb-3 border-b border-[#23324A]">
          Frequently Asked Questions
        </h3>

        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#080E1B] border border-[#23324A] rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-[#F5F7FC]"
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#3978F6]" /> : <ChevronDown className="w-4 h-4 text-[#98A7BD]" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-[#98A7BD] leading-relaxed border-t border-[#23324A]/40 pt-2.5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support Ticket Desk Form */}
      <div className="bg-[#111D32] border border-[#23324A] rounded-2xl p-6 shadow-xl space-y-4 max-w-xl">
        <h3 className="text-sm font-bold text-[#F5F7FC]">Submit Support Request to Engineering Desk</h3>
        <p className="text-xs text-[#98A7BD]">
          Direct inquiry to technical support and model operations team. Responses are provided within 24 business hours.
        </p>

        {ticketSent && (
          <div className="p-3.5 rounded-xl bg-[#20C997]/10 border border-[#20C997]/30 text-xs text-[#20C997] flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Support ticket recorded successfully. An engineering specialist will follow up shortly.</span>
          </div>
        )}

        <form onSubmit={handleSupportSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[#F5F7FC] font-semibold mb-1">Issue Topic</label>
            <input
              type="text"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g. BYOK validation inquiry or valuation question"
              className="w-full bg-[#080E1B] border border-[#23324A] rounded-xl px-3 py-2 text-[#F5F7FC] focus:outline-none focus:border-[#3978F6]"
            />
          </div>

          <div>
            <label className="block text-[#F5F7FC] font-semibold mb-1">Detailed Technical Explanation</label>
            <textarea
              rows={3}
              required
              value={ticketMsg}
              onChange={(e) => setTicketMsg(e.target.value)}
              placeholder="Describe the question or behavior observed"
              className="w-full bg-[#080E1B] border border-[#23324A] rounded-xl px-3 py-2 text-[#F5F7FC] focus:outline-none focus:border-[#3978F6]"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit Support Request</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default HelpCenter;
