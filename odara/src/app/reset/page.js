"use client";

import { useState } from 'react';
import Link from 'next/link';

const inputCls = "w-full bg-white border border-[#DDD5F8] rounded-xl px-4 py-3 text-[0.9rem] font-medium text-[#111827] outline-none placeholder:text-[#C4BAD8] focus:border-[#6D4DB2] focus:ring-2 focus:ring-[#6D4DB2]/10 transition-all";
const labelCls = "block text-[0.72rem] font-bold text-[#4B3B72] uppercase tracking-[0.055em] mb-2";
const btnCls   = "w-full flex items-center justify-center bg-[#2D1B4E] hover:bg-[#3d2568] text-white font-extrabold text-[0.92rem] rounded-xl py-3.5 transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed";

const MailSentIcon = () => (
  <svg width="52" height="52" fill="none" stroke="#2D1B4E" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
    <path d="M14.5 2.5c1.5 0 3 .5 4.5 2 1.5 1.5 2 3 2 4.5M14.5 6.5A3.5 3.5 0 0118 10"/>
  </svg>
);

export default function ResetPasswordPage() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [sent, setSent]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  // ── Success state ──
  const successContent = (
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-[#EDE9F6] flex items-center justify-center mb-5">
        <MailSentIcon />
      </div>
      <h2 className="text-xl font-extrabold text-[#1F1235] mb-2">Check your inbox</h2>
      <p className="text-[0.875rem] font-medium text-[#7A6B98] leading-relaxed mb-1">
        We sent a reset link to
      </p>
      <p className="text-[0.9rem] font-extrabold text-[#2D1B4E] mb-6 break-all">{email}</p>
      <p className="text-[0.8rem] font-medium text-[#B0A8C8] mb-8">
        Didn&apos;t receive it? Check your spam folder or{' '}
        <button onClick={() => { setSent(false); }} className="text-[#6D4DB2] font-bold hover:underline bg-transparent border-none cursor-pointer p-0">
          try again
        </button>
        .
      </p>
      <Link href="/login" className={`${btnCls} no-underline`}>Back to Sign In</Link>
    </div>
  );

  // ── Form content ──
  const formContent = (eId) => (
    <>
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="flex items-center gap-2 bg-[#FFF0F0] border border-[#FFD5D5] rounded-xl px-3.5 py-2.5 mb-4 text-[0.82rem] font-semibold text-[#C0392B]" role="alert">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor={eId} className={labelCls}>Email Address</label>
          <input id={eId} type="email" placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className={inputCls} />
          <p className="text-[0.75rem] font-medium text-[#B0A8C8] mt-2 leading-snug">
            We&apos;ll send a secure link to reset your password.
          </p>
        </div>

        <button type="submit" disabled={loading} className={btnCls}>
          {loading
            ? <><svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Sending link…</>
            : 'Send Reset Link'
          }
        </button>
      </form>

      <p className="text-center text-[0.83rem] font-semibold text-[#7A6B98] mt-5">
        Remember your password?{' '}
        <Link href="/login" className="text-[#2D1B4E] font-extrabold hover:underline">Sign in</Link>
      </p>
    </>
  );

  return (
    <div className="min-h-dvh bg-[#F7F5FF]">
      {/* Mobile */}
      <div className="md:hidden flex flex-col min-h-dvh px-6 pt-12 pb-10">
        {sent ? (
          <div className="flex flex-col justify-center flex-1">
            {successContent}
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-[#1F1235] mb-1">Reset password</h1>
            <p className="text-[0.875rem] font-medium text-[#7A6B98] mb-7">
              Enter your email and we&apos;ll send you a reset link
            </p>
            {formContent('m-email')}
          </>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center min-h-dvh px-6 py-16">
        <div className="w-full max-w-[460px]">
          {sent ? (
            successContent
          ) : (
            <>
              <h1 className="text-[1.85rem] font-extrabold text-[#1F1235] text-center mb-1.5">Reset password</h1>
              <p className="text-[0.9rem] font-medium text-[#7A6B98] text-center mb-8">
                Enter your email and we&apos;ll send you a reset link
              </p>
              {formContent('d-email')}
              <div className="flex justify-center gap-4 mt-10">
                <Link href="/privacy" className="text-[0.7rem] font-medium text-[#C4BAD8] hover:text-[#9C8EC1] transition-colors">Privacy Policy</Link>
                <span className="text-[#DDD5F8]">·</span>
                <Link href="/terms" className="text-[0.7rem] font-medium text-[#C4BAD8] hover:text-[#9C8EC1] transition-colors">Terms of Use</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}