import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HavenFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#0A1222] text-[#98A7BD] border-t border-[#23324A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2457C5] to-[#29C5E8] flex items-center justify-center p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0A1222] rounded-[10px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] text-[#29C5E8]">domain</span>
                </div>
              </div>
              <span className="font-headline-sm text-xl uppercase tracking-tight text-[#F5F7FC] font-bold">
                PROPWISE <span className="text-[#3978F6]">AI</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#98A7BD] max-w-md">
              Institutional property intelligence, algorithmic appraisal regression, and private wealth placement advisory.
              Smarter Property Valuation. Safer Lending Decisions.
            </p>

            <div className="mt-2">
              <p className="text-[11px] font-bold uppercase text-[#29C5E8] tracking-widest mb-2">
                Private Off-Market Briefings
              </p>
              <form onSubmit={handleSubscribe} className="flex items-center max-w-md gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter corporate or private email"
                  required
                  className="flex-1 bg-[#111D32] text-[#F5F7FC] px-4 py-2.5 rounded-lg border border-[#23324A] focus:border-[#3978F6] outline-none text-xs shadow-inner placeholder:text-[#98A7BD]/60"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#3978F6] text-white rounded-lg text-xs font-semibold hover:bg-[#2457C5] transition-colors shrink-0 shadow-md shadow-[#3978F6]/20 cursor-pointer"
                >
                  {subscribed ? 'Subscribed' : 'Join Register'}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-[#20C997] mt-1.5 font-medium">
                  Confidential register confirmed. Welcome to PropWise AI &amp; Haven &amp; Key.
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Curated Portfolios */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-[11px] font-bold uppercase text-[#F5F7FC] tracking-widest">
              Curated Portfolios
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li><Link to="/catalog?type=waterfront" className="hover:text-[#29C5E8] transition-colors">Coastal &amp; Waterfront</Link></li>
              <li><Link to="/catalog?type=penthouse" className="hover:text-[#29C5E8] transition-colors">Sky Penthouses</Link></li>
              <li><Link to="/catalog?type=historic" className="hover:text-[#29C5E8] transition-colors">Historic Wine Country</Link></li>
              <li><Link to="/catalog?type=modern" className="hover:text-[#29C5E8] transition-colors">Architectural Originals</Link></li>
              <li><Link to="/catalog?category=offmarket" className="hover:text-[#29C5E8] transition-colors">Private Off-Market</Link></li>
            </ul>
          </div>

          {/* Column 3: Advisory & Intelligence */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-[11px] font-bold uppercase text-[#F5F7FC] tracking-widest">
              Advisory &amp; Intel
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li><Link to="/valuation" className="hover:text-[#29C5E8] transition-colors">Instant AI Valuation</Link></li>
              <li><Link to="/advisor" className="hover:text-[#29C5E8] transition-colors">Private Wealth Advisory</Link></li>
              <li><Link to="/dashboard/mortgage" className="hover:text-[#29C5E8] transition-colors">Mortgage Underwriting</Link></li>
              <li><Link to="/dashboard/risk" className="hover:text-[#29C5E8] transition-colors">Risk Intelligence</Link></li>
              <li><Link to="/dashboard/market" className="hover:text-[#29C5E8] transition-colors">Quarterly Market Index</Link></li>
            </ul>
          </div>

          {/* Column 4: Private Client Services */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-[11px] font-bold uppercase text-[#F5F7FC] tracking-widest">
              Institutional Offices
            </h4>
            <p className="text-xs leading-relaxed text-[#98A7BD]">
              Pacific Heights Flagship<br />
              2840 Pacific Avenue, San Francisco, CA 94115<br />
              Direct: +1 (415) 890-4200 · advisory@propwise.ai
            </p>
            <div className="flex items-center gap-3 mt-2 text-[#98A7BD]">
              <span className="text-[11px] font-semibold text-[#F5F7FC]">Institutional Clearance</span>
              <span className="text-xs font-semibold tracking-wider text-[#20C997]">SOC-2 TYPE II AUDITED</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Disclosures */}
        <div className="border-t border-[#23324A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#98A7BD]/70">
          <p>© 2026 PROPWISE AI Systems &amp; Haven &amp; Key Estates Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-[#F5F7FC] transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/compliance" className="hover:text-[#F5F7FC] transition-colors">Equal Housing Opportunity</Link>
            <span>·</span>
            <Link to="/help" className="hover:text-[#F5F7FC] transition-colors">Terms of Representation</Link>
            <span>·</span>
            <Link to="/dashboard" className="text-[#3978F6] hover:text-[#29C5E8] font-semibold">Client Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
