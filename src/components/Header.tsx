import React, { useState } from 'react';

interface HeaderProps {
  activeTab: 'arrival' | 'routes' | 'trains' | 'alerts';
  setActiveTab: (tab: 'arrival' | 'routes' | 'trains' | 'alerts') => void;
  fontScale: number;
  setFontScale: (scale: (prev: number) => number) => void;
  onOpenHelp: () => void;
  onOpenUser: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  setFontScale,
  onOpenHelp,
  onOpenUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      {/* Top Advisory Banner */}
      <aside className="w-full bg-[#a73a00] text-white px-4 sm:px-6 py-1.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-[12px] font-semibold">
          <div className="flex items-center gap-2 truncate">
            <span className="material-symbols-outlined text-[16px] shrink-0">info</span>
            <span className="truncate">
              Service Alert: Downtown Line regular train frequency operating smoothly. Bus Bridging active for Bukit Panjang LRT segment.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('alerts')}
            className="underline hover:text-orange-200 transition-colors hidden sm:inline-block shrink-0 cursor-pointer ml-4"
          >
            View live status
          </button>
        </div>
      </aside>

      {/* Main Header Bar */}
      <div className="h-18 sm:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Logo & Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('arrival')}
            className="flex items-center gap-2.5 focus:outline-none text-left cursor-pointer group"
          >
            <img
              alt="SBS Transit Logo"
              className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VnoJORL1R_gQTRZ7qmrQ41oNC8To-gIRQmqEB11xZ4i-x3uF3fA2pPuHUTq8bjb9LaMJkBExC4H93-6x9-zKTOWIiy7EYYU9UHVofvW-pkfGUiqihZQ0kbHsE-52Hs0emKB4j4be-2KX7GHS170tSp7WhR5cLs9nrv5Ln3xe7xKU4uaBf48dHszV5pz7c26tAvaJRpe0hv8buBn9GVCgWXvYyePPyUNVbUEYtCSP3I2eGwukxoZdD8gY0"
            />
            <span className="hidden sm:inline-block font-headline font-bold text-[18px] sm:text-[20px] text-[#400050] tracking-tight">
              NextBus
            </span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('arrival')}
            className={`px-3.5 py-2 rounded-xl text-[13px] font-headline font-bold transition-all cursor-pointer ${
              activeTab === 'arrival'
                ? 'bg-[#5c186c] text-white shadow-sm'
                : 'text-[#4e434e] hover:bg-[#f3ebf8] hover:text-[#1d1a23]'
            }`}
          >
            Bus Arrival (NextBus)
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-3.5 py-2 rounded-xl text-[13px] font-headline font-bold transition-all cursor-pointer ${
              activeTab === 'routes'
                ? 'bg-[#5c186c] text-white shadow-sm'
                : 'text-[#4e434e] hover:bg-[#f3ebf8] hover:text-[#1d1a23]'
            }`}
          >
            Bus Services &amp; Routes
          </button>
          <button
            onClick={() => setActiveTab('trains')}
            className={`px-3.5 py-2 rounded-xl text-[13px] font-headline font-bold transition-all cursor-pointer ${
              activeTab === 'trains'
                ? 'bg-[#5c186c] text-white shadow-sm'
                : 'text-[#4e434e] hover:bg-[#f3ebf8] hover:text-[#1d1a23]'
            }`}
          >
            Train &amp; MRT Services
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-2 rounded-xl text-[13px] font-headline font-bold transition-all cursor-pointer relative ${
              activeTab === 'alerts'
                ? 'bg-[#5c186c] text-white shadow-sm'
                : 'text-[#4e434e] hover:bg-[#f3ebf8] hover:text-[#1d1a23]'
            }`}
          >
            Service Disruptions / Alerts
            <span className="w-2 h-2 rounded-full bg-[#fd651e] absolute top-1.5 right-1.5 animate-ping"></span>
          </button>
        </nav>

        {/* Right Action Icons: Font Size, Support, Profile, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Font Sizing Toggle */}
          <div
            className="flex items-center bg-[#ede5f2] rounded-full p-1"
            title="Adjust interface font scale"
          >
            <button
              onClick={() => setFontScale((s) => Math.max(0.85, s - 0.05))}
              aria-label="Decrease font size"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[12px] font-headline font-bold text-[#4e434e] hover:bg-[#f3ebf8] hover:text-[#1d1a23] transition-colors cursor-pointer"
              type="button"
            >
              A-
            </button>
            <button
              onClick={() => setFontScale((s) => Math.min(1.25, s + 0.05))}
              aria-label="Increase font size"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[13px] font-headline font-bold text-[#4e434e] hover:bg-[#f3ebf8] hover:text-[#1d1a23] transition-colors cursor-pointer"
              type="button"
            >
              A+
            </button>
          </div>

          {/* Customer Helpline Modal Button */}
          <button
            onClick={onOpenHelp}
            aria-label="Customer Transit Assistance"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#4e434e] hover:bg-[#f3ebf8] hover:text-[#1d1a23] transition-colors cursor-pointer"
            title="Customer Transit Assistance (1800-287-2727)"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
          </button>

          {/* Profile / Commuter Card Button */}
          <button
            onClick={onOpenUser}
            aria-label="Commuter Profile and Transit Card"
            className="w-8 h-8 rounded-full bg-[#400050] hover:bg-[#5c186c] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>

          {/* Mobile Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open navigation drawer"
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-[#4e434e] hover:bg-[#f3ebf8] hover:text-[#1d1a23] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#ede5f2] px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <button
            onClick={() => {
              setActiveTab('arrival');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-headline font-bold text-[14px] flex items-center gap-3 ${
              activeTab === 'arrival'
                ? 'bg-[#5c186c] text-white'
                : 'text-[#4e434e] hover:bg-[#f3ebf8]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">directions_bus</span>
            Bus Arrival (NextBus)
          </button>
          <button
            onClick={() => {
              setActiveTab('routes');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-headline font-bold text-[14px] flex items-center gap-3 ${
              activeTab === 'routes'
                ? 'bg-[#5c186c] text-white'
                : 'text-[#4e434e] hover:bg-[#f3ebf8]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">route</span>
            Bus Services &amp; Routes
          </button>
          <button
            onClick={() => {
              setActiveTab('trains');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-headline font-bold text-[14px] flex items-center gap-3 ${
              activeTab === 'trains'
                ? 'bg-[#5c186c] text-white'
                : 'text-[#4e434e] hover:bg-[#f3ebf8]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">subway</span>
            Train &amp; MRT Services
          </button>
          <button
            onClick={() => {
              setActiveTab('alerts');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-headline font-bold text-[14px] flex items-center gap-3 ${
              activeTab === 'alerts'
                ? 'bg-[#5c186c] text-white'
                : 'text-[#4e434e] hover:bg-[#f3ebf8]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            Service Disruptions / Alerts
          </button>
        </div>
      )}
    </header>
  );
};
