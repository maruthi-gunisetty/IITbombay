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
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1222]/95 backdrop-blur-xl shadow-xl border-b border-[#23324A] text-[#F5F7FC]">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2457C5] to-[#29C5E8] flex items-center justify-center p-0.5 shadow-lg shadow-[#3978F6]/20">
                <div className="w-full h-full bg-[#0A1222] rounded-[10px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px] text-[#29C5E8]">domain</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-[20px] tracking-tight text-[#F5F7FC] uppercase font-bold leading-none">
                  PROPWISE <span className="text-[#3978F6]">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#29C5E8] font-semibold mt-0.5">
                  Haven &amp; Key Estates
                </span>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-6 pl-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-[14px] font-medium transition-colors py-1 ${
                    isActive(link.path)
                      ? 'text-[#29C5E8] font-semibold border-b-2 border-[#3978F6]'
                      : 'text-[#98A7BD] hover:text-[#F5F7FC]'
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
              className="flex items-center gap-1.5 text-[#98A7BD] hover:text-[#F5F7FC] py-1 px-2 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-[#29C5E8]">search</span>
              <span className="hidden 2xl:inline text-[12px] uppercase font-semibold tracking-wider">Search</span>
            </button>

            <Link
              to="/catalog"
              className="hidden lg:flex items-center gap-1 text-[#98A7BD] hover:text-[#F5F7FC] py-1 px-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3978F6]">location_on</span>
              <span className="text-[12px] font-semibold">SF / Bay Area</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </Link>

            <Link
              to="/catalog?filter=saved"
              onClick={onOpenSaved}
              className="flex items-center gap-1.5 py-1 px-2 text-[#98A7BD] hover:text-[#F5F7FC] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-[#EF5B67]">favorite</span>
              <span className="text-[12px] font-semibold text-[#F5F7FC]">Saved ({savedCount})</span>
            </Link>

            <Link
              to={user ? "/dashboard/properties" : "/login"}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#3978F6] text-white text-[12px] font-semibold hover:bg-[#2457C5] transition-all shadow-md shadow-[#3978F6]/20"
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
                  <div className="w-8 h-8 rounded-full bg-[#111D32] border border-[#3978F6]/50 flex items-center justify-center text-xs font-bold text-[#29C5E8]">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-[#F5F7FC] max-w-[100px] truncate">
                    {user.full_name?.split(' ')[0]}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#0D1628] rounded-xl shadow-2xl border border-[#23324A] py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-[#23324A]">
                      <p className="text-xs text-[#98A7BD]">Signed in as</p>
                      <p className="text-sm font-semibold text-[#F5F7FC] truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#111D32] text-[#29C5E8] border border-[#23324A]">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#F5F7FC] hover:bg-[#111D32] font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#3978F6]">dashboard</span>
                      Client Dashboard
                    </Link>
                    <Link
                      to="/dashboard/valuation"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#F5F7FC] hover:bg-[#111D32] font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#29C5E8]">calculate</span>
                      AI Valuation Studio
                    </Link>
                    <Link
                      to="/dashboard/mortgage"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#F5F7FC] hover:bg-[#111D32] font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#20C997]">account_balance</span>
                      Mortgage Desk
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#F5F7FC] hover:bg-[#111D32] font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#98A7BD]">settings</span>
                      Account Settings
                    </Link>

                    <div className="border-t border-[#23324A] mt-1 pt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-[#EF5B67] hover:bg-[#EF5B67]/10 font-medium cursor-pointer"
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
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#23324A] hover:border-[#3978F6] text-[#F5F7FC] text-[12px] font-semibold transition-all hover:bg-[#111D32]"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#F5F7FC] hover:bg-[#111D32] rounded-lg transition-colors"
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
          <div className="xl:hidden bg-[#0A1222] border-t border-[#23324A] px-6 py-6 flex flex-col gap-4 shadow-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-[15px] font-medium py-1.5 transition-colors ${
                  isActive(link.path)
                    ? 'text-[#29C5E8] font-bold'
                    : 'text-[#98A7BD] hover:text-[#F5F7FC]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#23324A] pt-4 flex flex-col gap-3">
              <Link
                to="/catalog?filter=saved"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-[#F5F7FC] font-semibold"
              >
                <span className="material-symbols-outlined text-[20px] text-[#EF5B67]">favorite</span>
                Saved Estates ({savedCount})
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-[#3978F6] text-white text-sm font-semibold"
                >
                  Enter Client Dashboard
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg border border-[#23324A] text-sm font-semibold text-[#F5F7FC]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg bg-[#3978F6] text-white text-sm font-semibold"
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
