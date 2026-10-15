import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ScrollText,
  LayoutDashboard,
  Mic,
  Library,
  Sparkles,
  Settings,
  Activity,
} from 'lucide-react';
import Badge from './Badge';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'முகப்பு பலகை', subLabel: 'Dashboard', icon: LayoutDashboard },
  { to: '/preserve', label: 'வாய்மொழிப் பதிவு', subLabel: 'Preserve Story', icon: Mic },
  { to: '/archive', label: 'களஞ்சியம்', subLabel: 'Archive', icon: Library },
  { to: '/ask-ai', label: 'மரபு AI', subLabel: 'Heritage AI', icon: Sparkles },
  { to: '/settings', label: 'அமைப்புகள்', subLabel: 'Settings', icon: Settings },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { ta: 'முகப்பு பலகை', en: 'Dashboard' };
      case '/preserve':
        return { ta: 'வாய்மொழிப் பதிவு', en: 'Preserve a Story' };
      case '/archive':
        return { ta: 'வாய்மொழி வரலாற்றுக் களஞ்சியம்', en: 'Story Archive' };
      case '/ask-ai':
        return { ta: 'மரபு AI உரையாடல்', en: 'Ask Heritage AI' };
      case '/settings':
        return { ta: 'அமைப்புகள்', en: 'Settings' };
      default:
        return { ta: 'தமிழ் மரபு', en: 'Tamil Oral History' };
    }
  };

  const title = getPageTitle();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-ivory-300 bg-white/90 backdrop-blur-md px-4 sm:px-6">
        {/* Left: Mobile hamburger & Brand / Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-ivory-300 text-charcoal-700 hover:bg-ivory-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-maroon-800 text-gold-300">
              <ScrollText className="h-5 w-5" />
            </div>
            <span className="font-bold text-maroon-900 text-sm">தமிழ் மரபு</span>
          </Link>

          {/* Desktop page breadcrumb */}
          <div className="hidden lg:flex items-center gap-2">
            <h1 className="text-base font-bold text-charcoal-900">{title.ta}</h1>
            <span className="text-xs text-charcoal-400 font-sans">({title.en})</span>
          </div>
        </div>

        {/* Right Header Status info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-ivory-300 bg-ivory-50 px-3 py-1 text-xs text-charcoal-600">
            <Activity className="h-3 w-3 text-emerald-600" />
            <span className="font-medium text-emerald-800">Backend Ready: GET /health (Phase 1)</span>
          </div>

          <Badge variant="demo">Demo Shell</Badge>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-full bg-white p-5 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-800 text-gold-300">
                    <ScrollText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-maroon-900 text-sm">தமிழ் மரபு</h2>
                    <p className="text-[11px] text-charcoal-500 font-sans">Tamil Heritage</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-charcoal-500 hover:bg-ivory-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-lg text-sm ${
                          isActive
                            ? 'bg-maroon-800 text-white font-medium'
                            : 'text-charcoal-700 hover:bg-ivory-100'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold">{item.label}</span>
                        <span className="text-[11px] opacity-80">{item.subLabel}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-ivory-200 pt-3 text-xs text-charcoal-500">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-lg bg-ivory-100 text-maroon-900 font-medium"
              >
                அறிமுகம் (Landing Page)
              </Link>
              <p className="text-[10px] text-center mt-2 text-charcoal-400">
                TAMIZH HACK FEST 2026 - Problem P4
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
