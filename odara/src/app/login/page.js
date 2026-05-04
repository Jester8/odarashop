"use client";

import { useState } from 'react';
import Link from 'next/link';

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
    </svg>
  );

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const inputCls = "w-full bg-white border border-[#DDD5F8] rounded-xl px-4 py-3 text-[0.9rem] font-medium text-[#111827] outline-none placeholder:text-[#C4BAD8] focus:border-[#6D4DB2] focus:ring-2 focus:ring-[#6D4DB2]/10 transition-all";
const labelCls = "block text-[0.72rem] font-bold text-[#4B3B72] uppercase tracking-[0.055em] mb-2";
const btnCls   = "w-full flex items-center justify-center bg-[#2D1B4E] hover:bg-[#3d2568] text-white font-extrabold text-[0.92rem] rounded-xl py-3.5 transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed";

export default function LoginPage() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); }, 1500);
  };

  const form = (eId, pId) => (
    <>
      <div className="flex gap-2.5">
        <button type="button" className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#DDD5F8] rounded-xl py-2.5 text-[0.8rem] font-bold text-[#374151] hover:bg-[#F5F3FF] hover:border-[#C4B5E0] transition-all">
          <GoogleIcon /> Google
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#DDD5F8] rounded-xl py-2.5 text-[0.8rem] font-bold text-[#374151] hover:bg-[#F5F3FF] hover:border-[#C4B5E0] transition-all">
          <FacebookIcon /> Facebook
        </button>
      </div>

      <div className="flex items-center gap-2.5 my-5">
        <div className="flex-1 h-px bg-[#DDD5F8]" />
        <span className="text-[0.7rem] font-semibold text-[#C4BAD8] tracking-wide">or continue with email</span>
        <div className="flex-1 h-px bg-[#DDD5F8]" />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="flex items-center gap-2 bg-[#FFF0F0] border border-[#FFD5D5] rounded-xl px-3.5 py-2.5 mb-4 text-[0.82rem] font-semibold text-[#C0392B]" role="alert">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor={eId} className={labelCls}>Email Address</label>
          <input id={eId} type="email" placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className={inputCls} />
        </div>

        <div className="mb-4">
          <label htmlFor={pId} className={labelCls}>Password</label>
          <div className="relative">
            <input id={pId} type={showPass ? 'text' : 'password'} placeholder="Enter your password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" required className={`${inputCls} pr-12`} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9C8EC1] hover:text-[#2D1B4E] transition-colors">
              <EyeIcon open={showPass} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
              className="w-[17px] h-[17px] accent-[#2D1B4E] cursor-pointer rounded" />
            <span className="text-[0.82rem] font-semibold text-[#4B3B72]">Remember me</span>
          </label>
          <Link href="/reset" className="text-[0.78rem] font-bold text-[#6D4DB2] hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className={btnCls}>
          {loading
            ? <><svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Signing in…</>
            : 'Sign In'
          }
        </button>
      </form>

      <p className="text-center text-[0.83rem] font-semibold text-[#7A6B98] mt-5">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#2D1B4E] font-extrabold hover:underline">Signup</Link>
      </p>
    </>
  );

  return (
    <div className="min-h-dvh bg-[#F7F5FF]">
      {/* Mobile */}
      <div className="md:hidden flex flex-col min-h-dvh px-6 pt-12 pb-10">
        <h1 className="text-2xl font-extrabold text-[#1F1235] mb-1">Welcome back</h1>
        <p className="text-[0.875rem] font-medium text-[#7A6B98] mb-7">Sign in to your account</p>
        {form('m-email', 'm-password')}
      </div>
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center min-h-dvh px-6 py-16">
        <div className="w-full max-w-[460px]">
          <h1 className="text-[1.85rem] font-extrabold text-[#1F1235] text-center mb-1.5">Welcome back</h1>
          <p className="text-[0.9rem] font-medium text-[#7A6B98] text-center mb-8">Sign in to your Odara account</p>
          {form('d-email', 'd-password')}
          <div className="flex justify-center gap-4 mt-10">
            <Link href="/privacy" className="text-[0.7rem] font-medium text-[#C4BAD8] hover:text-[#9C8EC1] transition-colors">Privacy Policy</Link>
            <span className="text-[#DDD5F8]">·</span>
            <Link href="/terms" className="text-[0.7rem] font-medium text-[#C4BAD8] hover:text-[#9C8EC1] transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </div>
  );
}