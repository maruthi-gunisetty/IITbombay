import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Menu, X, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-[#080E1B]/90 backdrop-blur-md border-b border-[#23324A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2457C5] to-[#29C5E8] flex items-center justify-center p-0.5 shadow-lg shadow-[#3978F6]/20">
              <div className="w-full h-full bg-[#080E1B] rounded-[10px] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#29C5E8]" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#F5F7FC] block leading-none">
                PROPWISE <span className="text-[#3978F6]">AI</span>
              </span>
              <span className="text-[10px] tracking-wider text-[#98A7BD] uppercase block font-semibold mt-1">
                FinTech Valuation Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#98A7BD]">
            <a href="#platform" className="hover:text-[#F5F7FC] transition-colors">Platform</a>
            <a href="#features" className="hover:text-[#F5F7FC] transition-colors">Features</a>
            <a href="#workflow" className="hover:text-[#F5F7FC] transition-colors">How It Works</a>
            <a href="#security" className="hover:text-[#F5F7FC] transition-colors">Security</a>
            <a href="#about" className="hover:text-[#F5F7FC] transition-colors">About</a>
            <a href="#contact" className="hover:text-[#F5F7FC] transition-colors">Contact</a>
          </div>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-lg bg-[#3978F6] hover:bg-[#2457C5] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-[#3978F6]/25 flex items-center space-x-2"
              >
                <span>Open Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#F5F7FC] hover:text-[#3978F6] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-lg bg-[#3978F6] hover:bg-[#2457C5] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-[#3978F6]/25 flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#98A7BD] hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D1628] border-b border-[#23324A] px-4 pt-3 pb-6 space-y-3">
          <a
            href="#platform"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#98A7BD] hover:text-white py-2 text-base font-medium"
          >
            Platform
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#98A7BD] hover:text-white py-2 text-base font-medium"
          >
            Features
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#98A7BD] hover:text-white py-2 text-base font-medium"
          >
            How It Works
          </a>
          <a
            href="#security"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#98A7BD] hover:text-white py-2 text-base font-medium"
          >
            Security
          </a>
          <div className="pt-4 border-t border-[#23324A] flex flex-col space-y-3">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full py-2.5 rounded-lg bg-[#3978F6] text-white font-semibold text-center"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-[#F5F7FC] font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-lg bg-[#3978F6] text-white font-semibold text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
