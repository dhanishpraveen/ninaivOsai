import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { TAMIL_STRINGS } from '../constants/tamilStrings';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Target destination after successful authentication
  const destination = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    if (!email.trim()) {
      setErrorMessage(TAMIL_STRINGS.auth.errors.emailRequired);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage(TAMIL_STRINGS.auth.errors.emailInvalid);
      return false;
    }
    if (!password) {
      setErrorMessage(TAMIL_STRINGS.auth.errors.passwordRequired);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMessage('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn({
        email: email.trim().toLowerCase(),
        password,
      });
      navigate(destination, { replace: true });
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setErrorMessage(TAMIL_STRINGS.auth.errors.invalidCredentials);
      } else {
        setErrorMessage(TAMIL_STRINGS.auth.errors.invalidCredentials);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('archivist@ninaivosai.org');
    setPassword('OralHistory2026!');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col justify-between text-[#141A17] font-sans selection:bg-[#ACD4C0]">
      {/* Header bar */}
      <header className="border-b border-[#E5DDCF] bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073D2B] text-[#52D19D] shadow-xs group-hover:bg-[#0F523B] transition-colors">
            <Sprout className="h-5 w-5 text-[#52D19D]" />
          </div>
          <div>
            <span className="font-bold text-lg text-[#073D2B] tracking-tight">{TAMIL_STRINGS.brand.name}</span>
            <p className="text-[10px] text-[#525A56] font-sans">{TAMIL_STRINGS.brand.tagline}</p>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-[#135C43] hover:text-[#073D2B] transition-colors flex items-center gap-1"
        >
          <span>{TAMIL_STRINGS.nav.landingPage}</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E5DDCF] shadow-sm p-6 sm:p-9 space-y-6">
          {/* Card Title */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[#EBF5F0] text-[#0F523B] border border-[#ACD4C0] mb-2">
              <KeyRound className="h-6 w-6 text-[#135C43]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#073D2B] tracking-tight">
              {TAMIL_STRINGS.auth.loginTitle}
            </h1>
            <p className="text-xs text-[#525A56]">
              {TAMIL_STRINGS.auth.loginSubtitle}
            </p>
          </div>

          {/* Target Route Notice if redirected */}
          {location.state?.from && (
            <div className="rounded-xl bg-[#EBF5F0] border border-[#ACD4C0] p-3 text-xs text-[#0F523B] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#1F684A] shrink-0" />
              <span>
                {TAMIL_STRINGS.auth.accessProtectedNotice} <strong className="font-semibold">{location.state.from.pathname}</strong>
              </span>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-800 flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email-input"
                className="block text-xs font-bold text-[#141A17] tracking-wide"
              >
                {TAMIL_STRINGS.auth.emailLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#525A56]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  autoComplete="email"
                  required
                  autoFocus
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={TAMIL_STRINGS.auth.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5DDCF] bg-[#FDFBF7] text-sm text-[#141A17] placeholder:text-[#8E9591] focus:bg-white focus:border-[#135C43] focus:ring-2 focus:ring-[#52D19D]/30 transition-all outline-hidden disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password-input"
                  className="block text-xs font-bold text-[#141A17] tracking-wide"
                >
                  {TAMIL_STRINGS.auth.passwordLabel} <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#525A56]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E5DDCF] bg-[#FDFBF7] text-sm text-[#141A17] placeholder:text-[#8E9591] focus:bg-white focus:border-[#135C43] focus:ring-2 focus:ring-[#52D19D]/30 transition-all outline-hidden disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#525A56] hover:text-[#141A17] transition-colors"
                  aria-label={showPassword ? 'கடவுச்சொல்லை மறை' : 'கடவுச்சொல்லைக் காட்டு'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#073D2B] hover:bg-[#0F523B] active:bg-[#04271B] text-white font-semibold text-sm py-3 px-4 shadow-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#52D19D]" />
                  <span>{TAMIL_STRINGS.auth.signingIn}</span>
                </>
              ) : (
                <>
                  <span>{TAMIL_STRINGS.auth.signInButton}</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-2 border-t border-[#E5DDCF]/80">
            <div className="flex items-center justify-between text-[11px] text-[#525A56]">
              <span>மாதிரி பயனர் கணக்கு:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="font-medium text-[#135C43] hover:text-[#073D2B] underline transition-colors cursor-pointer"
              >
                {TAMIL_STRINGS.auth.demoArchivistButton}
              </button>
            </div>
          </div>

          {/* Link to Signup */}
          <div className="text-center pt-2 text-xs text-[#525A56]">
            {TAMIL_STRINGS.auth.dontHaveAccount}{' '}
            <Link
              to="/signup"
              state={location.state}
              className="font-bold text-[#073D2B] hover:text-[#135C43] underline transition-colors"
            >
              {TAMIL_STRINGS.auth.signUpButton}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="border-t border-[#E5DDCF] bg-white/60 py-3 text-center text-xs text-[#525A56]">
        <span>{TAMIL_STRINGS.brand.hackathonLabel} • {TAMIL_STRINGS.brand.subTagline}</span>
      </footer>
    </div>
  );
}
