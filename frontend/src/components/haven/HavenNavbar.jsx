import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function HavenNavbar({ savedCount = 4, onOpenSaved, onOpenSearch }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Buy', path: '/catalog' },
    { label: 'Rent', path: '/catalog?type=Rent' },
    { label: 'Sell', path: '/valuation' },
    { label: 'Exclusive Estates', path: '/catalog?category=exclusive' },
    { label: 'Neighborhoods', path: '/catalog?view=neighborhoods' },
    { label: 'Agents', path: '/advisor' },
    { label: 'Market Insights', path: '/dashboard/market' }
  ];

  const isActive = (path) => {
    if (path === '/catalog' && location.pathname === '/catalog' && !location.search) return true;
    if (path.includes('?') && location.pathname + location.search === path) return true;
    if (!path.includes('?') && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e5eeff]">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                alt="Haven & Key Real Estate Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/ALJJyrAf8wxbxnaQNYaVA6z6lfB5jMc5LTtlN93GkdKrF0zMehykUb3DX877wyL8utZ0zaHuV-JhDYDIF6t5jPDUS-uYUb7RThCFbdjF-R3vz8fbdlbn61XvIBYsXofPeDldo_p1pGdoMUgQYTyHDA9qB9iprl_kVS3Tz9WT_ykZISk8S4FzAg4gZTHgCZTykdTTknvikFX0zVskFYSRYf2SLJV-_SOmzz6zzBUxuCAUZo4"
              />
              <span className="font-headline-sm text-[22px] tracking-tight text-[#0b1c30] uppercase font-medium">
                Haven &amp; Key
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-6 pl-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-[14px] font-medium transition-colors py-1 ${
                    isActive(link.path)
                      ? 'text-[#0b1c30] font-semibold border-b-2 border-[#904d00]'
                      : 'text-[#45464d] hover:text-[#0b1c30]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={onOpenSearch || (() => { window.location.href = '/catalog'; })}
              className="flex items-center gap-1.5 text-[#45464d] hover:text-[#0b1c30] py-1 px-2 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              <span className="hidden 2xl:inline text-[12px] uppercase font-semibold tracking-wider">Search</span>
            </button>

            <Link
              to="/catalog"
              className="hidden lg:flex items-center gap-1 text-[#45464d] hover:text-[#0b1c30] py-1 px-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span className="text-[12px] font-semibold">SF / Bay Area</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </Link>

            <Link
              to="/catalog?filter=saved"
              onClick={onOpenSaved}
              className="flex items-center gap-1.5 py-1 px-2 text-[#45464d] hover:text-[#0b1c30] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-[#904d00]">favorite</span>
              <span className="text-[12px] font-semibold">Saved ({savedCount})</span>
            </Link>

            <Link
              to={user ? "/dashboard/properties" : "/login"}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#904d00] text-white text-[12px] font-semibold hover:bg-[#663500] transition-all shadow-sm"
            >
              List Your Property
            </Link>

            {/* User Profile or Client Portal Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-1 cursor-pointer focus:outline-none"
                >
                  <img
                    alt={user.full_name || 'Profile'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#904d00]/30"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP6eIXPDtV2Ea6EwvAWUsuoMxRnnkmbNZovKBTfdjO5_0FY-4EaI4Qot3zPet0LooPdKPHzH_jNZ_4rVHBtVubY1vnwxNkXcGfkbwepudMUfE1sc88EDlWoUV138z-yRjwVpgZBBi_-R-N2trWC9lI-sxb2B4uRTLwr_v0FguuJcBC0vcnovDLKgEmadGXG8OQC3efmSmw0zXyLHq5yABZYe6fZqB3XCrZe7pb0aw"
                  />
                  <span className="hidden md:inline text-xs font-semibold text-[#0b1c30] max-w-[100px] truncate">
                    {user.full_name?.split(' ')[0]}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-[#e5eeff] py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-[#eff4ff]">
                      <p className="text-xs text-[#76777d]">Signed in as</p>
                      <p className="text-sm font-semibold text-[#0b1c30] truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#eff4ff] text-[#904d00]">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#0b1c30] hover:bg-[#f8f9ff] font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#904d00]">dashboard</span>
                      Client Dashboard
                    </Link>
                    <Link
                      to="/dashboard/valuation"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#0b1c30] hover:bg-[#f8f9ff] font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#904d00]">calculate</span>
                      AI Valuation Studio
                    </Link>
                    <Link
                      to="/dashboard/mortgage"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#0b1c30] hover:bg-[#f8f9ff] font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#904d00]">account_balance</span>
                      Mortgage Desk
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#0b1c30] hover:bg-[#f8f9ff] font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#76777d]">settings</span>
                      Account Settings
                    </Link>

                    <div className="border-t border-[#eff4ff] mt-1 pt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/30 font-medium cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#cbdbf5] hover:border-[#904d00] text-[#0b1c30] text-[12px] font-semibold transition-all hover:bg-white"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#f8f9ff] border-t border-[#e5eeff] px-6 py-6 flex flex-col gap-4 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-[15px] font-medium py-1.5 transition-colors ${
                  isActive(link.path)
                    ? 'text-[#0b1c30] font-bold'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#e5eeff] pt-4 flex flex-col gap-3">
              <Link
                to="/catalog?filter=saved"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-[#0b1c30] font-semibold"
              >
                <span className="material-symbols-outlined text-[20px] text-[#904d00]">favorite</span>
                Saved Estates ({savedCount})
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-[#000000] text-white text-sm font-semibold"
                >
                  Enter Client Dashboard
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg border border-[#cbdbf5] text-sm font-semibold text-[#0b1c30]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg bg-[#904d00] text-white text-sm font-semibold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}
