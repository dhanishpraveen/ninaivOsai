import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  Library,
  Sparkles,
  Settings,
  ScrollText,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import Badge from './Badge';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'முகப்பு பலகை',
    subLabel: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/preserve',
    label: 'வாய்மொழிப் பதிவு',
    subLabel: 'Preserve a Story',
    icon: Mic,
  },
  {
    to: '/archive',
    label: 'களஞ்சியம்',
    subLabel: 'Story Archive',
    icon: Library,
  },
  {
    to: '/ask-ai',
    label: 'மரபு AI உதவியாளர்',
    subLabel: 'Ask Heritage AI',
    icon: Sparkles,
  },
  {
    to: '/settings',
    label: 'அமைப்புகள்',
    subLabel: 'Settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-ivory-300 bg-white/95 backdrop-blur-sm p-4 sticky top-0 h-screen overflow-y-auto">
      <div>
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-ivory-100 transition-colors group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-maroon-800 text-gold-300 shadow-sm group-hover:bg-maroon-900 transition-colors">
            <ScrollText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-maroon-900 tracking-tight">தமிழ் மரபு</span>
              <span className="text-[10px] text-gold-700 bg-gold-100 px-1.5 py-0.2 rounded font-semibold border border-gold-200">2026</span>
            </div>
            <p className="text-xs text-charcoal-500 font-sans">Tamil Oral History</p>
          </div>
        </Link>

        {/* Phase 1 Indicator */}
        <div className="mt-4 mb-5 px-3 py-2 rounded-lg bg-ivory-100 border border-ivory-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider">
              Hackathon Status
            </span>
            <Badge variant="phase">Phase 1</Badge>
          </div>
          <p className="text-[11px] text-charcoal-600 mt-1 leading-tight">
            UI Shell & Foundation Active
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 pt-1 text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
            முதன்மை வழிகாட்டல் (Menu)
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-maroon-800 text-white font-medium shadow-sm'
                      : 'text-charcoal-700 hover:bg-ivory-100 hover:text-maroon-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-gold-300' : 'text-charcoal-500'}`} />
                    <div className="flex flex-col text-left">
                      <span className="leading-tight text-xs font-semibold">{item.label}</span>
                      <span className={`text-[11px] font-sans ${isActive ? 'text-maroon-200' : 'text-charcoal-400'}`}>
                        {item.subLabel}
                      </span>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info in Sidebar */}
      <div className="border-t border-ivory-200 pt-4 px-2 space-y-3">
        <div className="rounded-lg bg-ivory-100 p-2.5 text-xs text-charcoal-600 border border-ivory-200">
          <div className="flex items-center gap-1.5 text-maroon-800 font-medium mb-1">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-600" />
            <span>Problem Statement P4</span>
          </div>
          <p className="text-[11px] text-charcoal-500 leading-snug">
            Digital Preservation of Tamil Oral History. Tamizh Hack Fest.
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center justify-between text-xs text-charcoal-500 hover:text-maroon-800 px-1 py-1"
        >
          <span>அறிமுகம் (Landing Page)</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}
