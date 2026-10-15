import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Mic,
  Compass,
  Settings,
  Sprout,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TAMIL_STRINGS } from '../constants/tamilStrings';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: TAMIL_STRINGS.nav.home,
    icon: Home,
  },
  {
    to: '/ask-ai',
    label: TAMIL_STRINGS.nav.askAi,
    icon: Sparkles,
  },
  {
    to: '/preserve',
    label: TAMIL_STRINGS.nav.preserve,
    icon: Mic,
  },
  {
    to: '/archive',
    label: TAMIL_STRINGS.nav.archive,
    icon: Compass,
  },
  {
    to: '/settings',
    label: TAMIL_STRINGS.nav.settings,
    icon: Settings,
  },
];

export default function Sidebar() {
  const { user, userName, userInitials, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('[Sidebar] Logout error:', err);
    }
  };

  const userEmail = user?.email || 'archivist@ninaivosai.org';

  return (
    <aside
      className="hidden lg:flex w-64 shrink-0 flex-col justify-between sidebar-forest-bg bg-[#073D2B] text-[#F8F5EF] p-4 sticky top-0 h-screen max-h-screen overflow-hidden border-r border-[#135C43]/70 select-none z-20 font-sans"
      style={{
        backgroundColor: '#073D2B',
        width: '256px',
        minWidth: '256px',
        maxWidth: '256px',
      }}
    >
      {/* Brand Header */}
      <div className="shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-[#0F523B]/60 transition-colors group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F523B] text-[#52D19D] shadow-xs border border-[#166E50] group-hover:bg-[#135C43] transition-colors">
            <Sprout className="h-5 w-5 text-[#52D19D]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">{TAMIL_STRINGS.brand.name}</span>
            </div>
            <p className="text-[11px] text-[#9EC4B3] font-tamil tracking-wide truncate">
              {TAMIL_STRINGS.brand.tagline}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Items in Pure Tamil */}
      <nav className="flex-1 overflow-y-auto space-y-1.5 my-4 pr-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'sidebar-nav-active bg-[#0F523B] text-white shadow-xs font-semibold border-l-4 border-[#52D19D]'
                    : 'sidebar-nav-hover text-[#F8F5EF] hover:bg-[#0B4633] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#52D19D]' : 'text-[#9EC4B3]'
                    }`}
                  />
                  <span className="text-sm font-tamil tracking-tight text-white">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile and logout section */}
      <div className="shrink-0 pt-3 mt-auto border-t border-[#135C43]/70 space-y-2">
        <Link
          to="/settings"
          className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0B4633]/70 hover:bg-[#0F523B] border border-[#135C43] transition-colors"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F523B] text-[#52D19D] font-bold text-xs border border-[#166E50]">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate font-tamil">{userName}</h4>
            <span className="text-[10px] text-[#9EC4B3] block truncate font-tamil">{TAMIL_STRINGS.nav.roleArchivist}</span>
          </div>
          <span className="text-[10px] text-[#52D19D] font-semibold px-1.5 py-0.5 rounded bg-[#073D2B] border border-[#166E50] shrink-0 font-tamil">
            {TAMIL_STRINGS.nav.authenticated}
          </span>
        </Link>

        {/* Action Row: Logout & Landing Page Link */}
        <div className="flex items-center justify-between px-1 pt-1 text-xs font-tamil">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[#9EC4B3] hover:text-white transition-colors"
          >
            <span>{TAMIL_STRINGS.nav.landingPage}</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1 text-[#F87171] hover:text-[#EF4444] hover:bg-[#0B4633] px-2 py-1 rounded-lg transition-colors cursor-pointer"
            title="கணக்கிலிருந்து வெளியேறுக"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{TAMIL_STRINGS.nav.logout}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
