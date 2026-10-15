import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Sprout,
  Home,
  Sparkles,
  Mic,
  Compass,
  Settings,
  Activity,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import Badge from './Badge';
import { useAuth } from '../context/AuthContext';
import { TAMIL_STRINGS } from '../constants/tamilStrings';

const NAV_ITEMS = [
  { to: '/dashboard', label: TAMIL_STRINGS.nav.home, icon: Home },
  { to: '/ask-ai', label: TAMIL_STRINGS.nav.askAi, icon: Sparkles },
  { to: '/preserve', label: TAMIL_STRINGS.nav.preserve, icon: Mic },
  { to: '/archive', label: TAMIL_STRINGS.nav.archive, icon: Compass },
  { to: '/settings', label: TAMIL_STRINGS.nav.settings, icon: Settings },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userName, userInitials, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      setMobileMenuOpen(false);
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('[Navbar] Logout error:', err);
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return TAMIL_STRINGS.nav.dashboard;
      case '/preserve':
        return TAMIL_STRINGS.preserve.pageTitle;
      case '/archive':
        return TAMIL_STRINGS.archive.title;
      case '/ask-ai':
        return TAMIL_STRINGS.aiAgent.title;
      case '/settings':
        return TAMIL_STRINGS.settings.title;
      default:
        return TAMIL_STRINGS.brand.name;
    }
  };

  const title = getPageTitle();

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-16 w-full items-center justify-between border-b border-[#E5DDCF] bg-[#F8F5EF]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-2 font-sans">
        {/* Left: Hamburger & Brand on Mobile; Title on Desktop */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5DDCF] bg-white text-[#141A17] hover:bg-[#F0EBE0] lg:hidden"
            aria-label="பட்டி மெனுவைத் திற"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Mobile Brand */}
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#073D2B] text-[#52D19D]">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-[#073D2B] text-sm font-tamil">{TAMIL_STRINGS.brand.name}</span>
            </div>
          </Link>

          {/* Desktop Breadcrumb: Pure Tamil Title */}
          <div className="hidden lg:flex items-center gap-2.5">
            <h1 className="text-base font-bold text-[#141A17] tracking-tight font-tamil">{title}</h1>
          </div>
        </div>

        {/* Right Header Controls: Hackathon Badge & Demo Data indicator + Logout */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#CDE5D8] bg-[#E8F3EE] px-3 py-1 text-xs text-[#073D2B] font-tamil">
            <Activity className="h-3.5 w-3.5 text-[#1F684A]" />
            <span className="font-semibold tracking-wide">தமிழ் ஹேக் ஃபெஸ்ட் 2026</span>
          </div>

          <Badge variant="demo">{TAMIL_STRINGS.nav.demoBadge}</Badge>

          {user && (
            <button
              type="button"
              onClick={handleSignOut}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#8C333A] bg-[#FFF5F5] hover:bg-[#FFEBEB] border border-[#F5C2C7] rounded-lg transition-colors cursor-pointer font-tamil"
              title="கணக்கிலிருந்து வெளியேறுக"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{TAMIL_STRINGS.nav.logout}</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#141A17]/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div
            className="fixed inset-y-0 left-0 w-72 max-w-full bg-[#073D2B] text-[#F8F5EF] p-5 shadow-2xl flex flex-col justify-between"
            style={{ backgroundColor: '#073D2B' }}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#135C43]/70">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F523B] text-[#52D19D] border border-[#166E50]">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-base font-tamil">{TAMIL_STRINGS.brand.name}</h2>
                    <p className="text-[10px] text-[#9EC4B3] font-tamil">{TAMIL_STRINGS.brand.tagline}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#9EC4B3] hover:text-white hover:bg-[#0F523B]"
                  aria-label="மெனுவை மூடுக"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-5 space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'bg-[#0F523B] text-white font-semibold border-l-4 border-[#52D19D]'
                            : 'text-[#F8F5EF] hover:bg-[#0B4633] hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 text-[#52D19D]" />
                      <span className="text-sm font-tamil">{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-[#135C43]/70 pt-4 space-y-3">
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0B4633] border border-[#135C43]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F523B] text-[#52D19D] font-bold text-xs">
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate font-tamil">{userName}</h4>
                  <span className="text-[10px] text-[#9EC4B3] block truncate font-tamil">{TAMIL_STRINGS.nav.roleArchivist}</span>
                </div>
              </Link>

              <div className="flex items-center justify-between pt-1 font-tamil">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 py-1 text-xs text-[#9EC4B3] hover:text-white"
                >
                  <span>{TAMIL_STRINGS.nav.landingPage}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                {user && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-1 text-xs text-[#F87171] hover:text-[#EF4444] px-2 py-1 rounded-lg hover:bg-[#0B4633] transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{TAMIL_STRINGS.nav.logout}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
