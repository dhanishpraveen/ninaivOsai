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
  CheckCircle2,
  Loader2,
  ArrowRight,
  UserPlus,
  Info,
  User,
} from 'lucide-react';
import { TAMIL_STRINGS } from '../constants/tamilStrings';

export default function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingConfirmationNotice, setPendingConfirmationNotice] = useState(false);

  const destination = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    if (!fullName.trim()) {
      setErrorMessage(TAMIL_STRINGS.auth.errors.nameRequired);
      return false;
    }
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
    if (password.length < 6) {
      setErrorMessage(TAMIL_STRINGS.auth.errors.passwordTooShort);
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage(TAMIL_STRINGS.auth.errors.passwordsDoNotMatch);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMessage('');
    setPendingConfirmationNotice(false);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await signUp({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      // Case A: Immediate session established (Email confirmation disabled in Supabase)
      if (data?.session) {
        navigate(destination, { replace: true });
        return;
      }

      // Case B: User created but session is null (Email confirmation is enabled in Supabase)
      if (data?.user) {
        setPendingConfirmationNotice(true);
      }
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('already registered')) {
        setErrorMessage(TAMIL_STRINGS.auth.errors.alreadyRegistered);
      } else if (msg.toLowerCase().includes('rate limit')) {
        setErrorMessage(TAMIL_STRINGS.auth.errors.rateLimitExceeded);
      } else {
        setErrorMessage(TAMIL_STRINGS.auth.errors.unknownError);
      }
    } finally {
      setLoading(false);
    }
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

      {/* Main Signup Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E5DDCF] shadow-sm p-6 sm:p-9 space-y-6">
          {/* Card Title */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[#EBF5F0] text-[#0F523B] border border-[#ACD4C0] mb-2">
              <UserPlus className="h-6 w-6 text-[#135C43]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#073D2B] tracking-tight">
              {TAMIL_STRINGS.auth.signupTitle}
            </h1>
            <p className="text-xs text-[#525A56]">
              {TAMIL_STRINGS.auth.signupSubtitle}
            </p>
          </div>

          {/* Pending Email Confirmation Banner */}
          {pendingConfirmationNotice ? (
            <div className="rounded-2xl bg-[#EBF5F0] border border-[#52D19D] p-5 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#1F684A] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#073D2B]">
                    {TAMIL_STRINGS.auth.confirmation.title}
                  </h3>
                  <p className="text-xs text-[#141A17] leading-relaxed">
                    {TAMIL_STRINGS.auth.confirmation.message} (<strong className="font-semibold">{email}</strong>).
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-white/80 p-3 border border-[#ACD4C0] text-[11px] text-[#525A56] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#073D2B]">
                  <Info className="h-3.5 w-3.5 text-[#135C43]" />
                  <span>{TAMIL_STRINGS.auth.confirmation.evaluatorNoteTitle}</span>
                </div>
                <p>
                  {TAMIL_STRINGS.auth.confirmation.evaluatorNoteDesc}
                </p>
              </div>

              <div className="pt-1">
                <Link
                  to="/login"
                  state={location.state}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#073D2B] hover:bg-[#0F523B] text-white font-semibold text-xs py-2.5 px-4 shadow-sm transition-colors"
                >
                  <span>{TAMIL_STRINGS.auth.confirmation.proceedToLogin}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
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

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Full Name Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="signup-name"
                    className="block text-xs font-bold text-[#141A17] tracking-wide"
                  >
                    {TAMIL_STRINGS.auth.fullNameLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#525A56]">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      required
                      autoFocus
                      disabled={loading}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={TAMIL_STRINGS.auth.fullNamePlaceholder}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5DDCF] bg-[#FDFBF7] text-sm text-[#141A17] placeholder:text-[#8E9591] focus:bg-white focus:border-[#135C43] focus:ring-2 focus:ring-[#52D19D]/30 transition-all outline-hidden disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="signup-email"
                    className="block text-xs font-bold text-[#141A17] tracking-wide"
                  >
                    {TAMIL_STRINGS.auth.emailLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#525A56]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      required
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
                  <label
                    htmlFor="signup-password"
                    className="block text-xs font-bold text-[#141A17] tracking-wide"
                  >
                    {TAMIL_STRINGS.auth.passwordLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#525A56]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={TAMIL_STRINGS.auth.passwordPlaceholder}
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

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="signup-confirm-password"
                    className="block text-xs font-bold text-[#141A17] tracking-wide"
                  >
                    {TAMIL_STRINGS.auth.confirmPasswordLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#525A56]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={TAMIL_STRINGS.auth.confirmPasswordPlaceholder}
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E5DDCF] bg-[#FDFBF7] text-sm text-[#141A17] placeholder:text-[#8E9591] focus:bg-white focus:border-[#135C43] focus:ring-2 focus:ring-[#52D19D]/30 transition-all outline-hidden disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#525A56] hover:text-[#141A17] transition-colors"
                      aria-label={showConfirmPassword ? 'கடவுச்சொல்லை மறை' : 'கடவுச்சொல்லைக் காட்டு'}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                      <span>{TAMIL_STRINGS.auth.signingUp}</span>
                    </>
                  ) : (
                    <>
                      <span>{TAMIL_STRINGS.auth.signUpButton}</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Link to Login */}
              <div className="text-center pt-2 text-xs text-[#525A56]">
                {TAMIL_STRINGS.auth.alreadyHaveAccount}{' '}
                <Link
                  to="/login"
                  state={location.state}
                  className="font-bold text-[#073D2B] hover:text-[#135C43] underline transition-colors"
                >
                  {TAMIL_STRINGS.auth.signInButton}
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer info */}
      <footer className="border-t border-[#E5DDCF] bg-white/60 py-3 text-center text-xs text-[#525A56]">
        <span>{TAMIL_STRINGS.brand.hackathonLabel} • {TAMIL_STRINGS.brand.subTagline}</span>
      </footer>
    </div>
  );
}
