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
    <footer className="w-full bg-[#eff4ff] text-[#45464d] border-t border-[#dce9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img
                alt="Haven & Key Real Estate Logo"
                className="h-7 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/ALJJyrAf8wxbxnaQNYaVA6z6lfB5jMc5LTtlN93GkdKrF0zMehykUb3DX877wyL8utZ0zaHuV-JhDYDIF6t5jPDUS-uYUb7RThCFbdjF-R3vz8fbdlbn61XvIBYsXofPeDldo_p1pGdoMUgQYTyHDA9qB9iprl_kVS3Tz9WT_ykZISk8S4FzAg4gZTHgCZTykdTTknvikFX0zVskFYSRYf2SLJV-_SOmzz6zzBUxuCAUZo4"
              />
              <span className="font-headline-sm text-xl uppercase tracking-tight text-[#0b1c30] font-medium">
                Haven &amp; Key
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#45464d] max-w-md">
              Private advisory, premier residential brokerage, and off-market portfolio representation for discerning global acquisitions.
            </p>

            <div className="mt-2">
              <p className="text-[11px] font-bold uppercase text-[#904d00] tracking-widest mb-2">
                Private Off-Market Briefings
              </p>
              <form onSubmit={handleSubscribe} className="flex items-center max-w-md gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter institutional or personal email"
                  required
                  className="flex-1 bg-white text-[#0b1c30] px-4 py-2.5 rounded-lg border border-[#cbdbf5] focus:border-[#904d00] outline-none text-xs shadow-sm placeholder:text-[#76777d]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#000000] text-white rounded-lg text-xs font-semibold hover:bg-[#131b2e] transition-colors shrink-0 shadow-sm"
                >
                  {subscribed ? 'Subscribed' : 'Join Register'}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-[#20c997] mt-1 font-medium">
                  Confidential register confirmed. Welcome to Haven &amp; Key.
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Curated Portfolios */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-[11px] font-bold uppercase text-[#0b1c30] tracking-widest">
              Curated Portfolios
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li><Link to="/catalog?type=waterfront" className="hover:text-[#0b1c30] transition-colors">Coastal &amp; Waterfront</Link></li>
              <li><Link to="/catalog?type=penthouse" className="hover:text-[#0b1c30] transition-colors">Sky Penthouses</Link></li>
              <li><Link to="/catalog?type=historic" className="hover:text-[#0b1c30] transition-colors">Historic Wine Country</Link></li>
              <li><Link to="/catalog?type=modern" className="hover:text-[#0b1c30] transition-colors">Architectural Originals</Link></li>
              <li><Link to="/catalog?category=offmarket" className="hover:text-[#0b1c30] transition-colors">Private Off-Market</Link></li>
            </ul>
          </div>

          {/* Column 3: Advisory & Intelligence */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-[11px] font-bold uppercase text-[#0b1c30] tracking-widest">
              Advisory &amp; Intel
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li><Link to="/valuation" className="hover:text-[#0b1c30] transition-colors">Instant AI Valuation</Link></li>
              <li><Link to="/advisor" className="hover:text-[#0b1c30] transition-colors">Private Wealth Advisory</Link></li>
              <li><Link to="/dashboard/mortgage" className="hover:text-[#0b1c30] transition-colors">Mortgage Underwriting</Link></li>
              <li><Link to="/dashboard/risk" className="hover:text-[#0b1c30] transition-colors">Risk Intelligence</Link></li>
              <li><Link to="/dashboard/market" className="hover:text-[#0b1c30] transition-colors">Quarterly Market Index</Link></li>
            </ul>
          </div>

          {/* Column 4: Private Client Services */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-[11px] font-bold uppercase text-[#0b1c30] tracking-widest">
              Private Client Offices
            </h4>
            <p className="text-xs leading-relaxed text-[#45464d]">
              Pacific Heights Flagship<br />
              2840 Pacific Avenue, San Francisco, CA 94115<br />
              Direct: +1 (415) 890-4200 · advisory@havenkey.com
            </p>
            <div className="flex items-center gap-3 mt-2 text-[#76777d]">
              <span className="text-[11px] font-semibold text-[#0b1c30]">Member of</span>
              <span className="text-xs font-semibold tracking-wider text-[#904d00]">GLOBAL LUXURY ALLIANCE</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Disclosures */}
        <div className="border-t border-[#dce9ff] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#76777d]">
          <p>© 2026 Haven &amp; Key Real Estate Inc. Powered by PropWise AI Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-[#0b1c30] transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/compliance" className="hover:text-[#0b1c30] transition-colors">Equal Housing Opportunity</Link>
            <span>·</span>
            <Link to="/help" className="hover:text-[#0b1c30] transition-colors">Terms of Representation</Link>
            <span>·</span>
            <Link to="/dashboard" className="text-[#904d00] hover:underline font-semibold">Client Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
