import React, { useState } from 'react';
import { Sparkles, Lock, Mail, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SignInPage: React.FC = () => {
  const { signIn, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await signIn(email.trim(), password);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#e2e8f0] shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#4f46e5] text-white flex items-center justify-center mx-auto shadow-md shadow-[#4f46e5]/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#131b2e]">
            Sign in to ImageFix AI
          </h1>
          <p className="text-xs text-[#777587]">
            See the problem. Find the fix.
          </p>
        </div>

        {errorMessage && (
          <div aria-live="polite" className="p-3.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="signin-email" className="block text-xs font-medium text-[#464555] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#777587] absolute left-3 top-3" />
              <input
                id="signin-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? 'signin-error' : undefined}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#e2e8f0] rounded-lg focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 outline-none transition-all text-[#131b2e]"
                placeholder="tech@imagefix.ai"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="signin-password" className="block text-xs font-medium text-[#464555]">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#777587] absolute left-3 top-3" />
              <input
                id="signin-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errorMessage)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#e2e8f0] rounded-lg focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 outline-none transition-all text-[#131b2e]"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 text-white font-semibold rounded-lg text-sm shadow-md shadow-[#4f46e5]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#f1f5f9] text-xs text-[#777587]">
          Don't have an ImageFix account?{' '}
          <button
            type="button"
            onClick={() => navigateTo('signup')}
            className="font-semibold text-[#3525cd] hover:underline cursor-pointer"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export const SignUpPage: React.FC = () => {
  const { signUp, navigateTo } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setConfirmationNotice(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(name.trim(), email.trim(), password);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to create account.');
      } else if (result.requiresEmailConfirmation) {
        setConfirmationNotice(
          'Registration successful! Please check your email inbox to confirm your account before signing in.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#e2e8f0] shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#4f46e5] text-white flex items-center justify-center mx-auto shadow-md shadow-[#4f46e5]/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#131b2e]">
            Create your Account
          </h1>
          <p className="text-xs text-[#777587]">
            Set up your ImageFix AI diagnostic profile
          </p>
        </div>

        {errorMessage && (
          <div aria-live="polite" className="p-3.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {confirmationNotice && (
          <div aria-live="polite" className="p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>Check Your Email</span>
            </div>
            <p className="leading-relaxed">{confirmationNotice}</p>
            <button
              type="button"
              onClick={() => navigateTo('signin')}
              className="mt-2 px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {!confirmationNotice && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="signup-name" className="block text-xs font-medium text-[#464555] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#777587] absolute left-3 top-3" />
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#e2e8f0] rounded-lg focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 outline-none transition-all text-[#131b2e]"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-medium text-[#464555] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777587] absolute left-3 top-3" />
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#e2e8f0] rounded-lg focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 outline-none transition-all text-[#131b2e]"
                  placeholder="tech@imagefix.ai"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-xs font-medium text-[#464555] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777587] absolute left-3 top-3" />
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#e2e8f0] rounded-lg focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 outline-none transition-all text-[#131b2e]"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 text-white font-semibold rounded-lg text-sm shadow-md shadow-[#4f46e5]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-[#f1f5f9] text-xs text-[#777587]">
          Already have an account?{' '}
          <button
            onClick={() => navigateTo('signin')}
            className="font-semibold text-[#3525cd] hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
