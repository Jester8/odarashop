"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAuth } from "@/lib/firebase/useAuth";

// ─── Icons ────────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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

const MailIcon = () => (
  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth={1.5}
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth={1.5}
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M7 12.5l3.5 3.5 6-7" />
  </svg>
);

const Spinner = ({ sm } = {}) => (
  <svg className={`animate-spin ${sm ? "w-4 h-4 mr-2" : "w-5 h-5"}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
  </svg>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const inputCls = "w-full bg-white border border-[#DDD5F8] rounded-xl px-4 py-3 text-[0.9rem] font-medium text-[#111827] outline-none placeholder:text-[#C4BAD8] focus:border-[#6D4DB2] focus:ring-2 focus:ring-[#6D4DB2]/10 transition-all";
const labelCls = "block text-[0.72rem] font-bold text-[#4B3B72] uppercase tracking-[0.055em] mb-2";
const btnCls   = "w-full flex items-center justify-center bg-[#2D1B4E] hover:bg-[#3d2568] text-white font-extrabold text-[0.92rem] rounded-xl py-3.5 transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed";

// ─── Verify Email Screen ──────────────────────────────────────────────────────
function VerifyEmailScreen({ email, onResend, onCheckNow, resendCooldown, checking, verified, error }) {
  return (
    <div className="flex flex-col items-center text-center px-2">
      <div className={`mb-6 flex items-center justify-center w-20 h-20 rounded-2xl transition-colors duration-700 ${
        verified ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#EDE9FF] text-[#6D4DB2]"
      }`}>
        <div className={`transition-all duration-500 ${verified ? "scale-110" : "scale-100"}`}>
          {verified ? <CheckCircleIcon /> : <MailIcon />}
        </div>
      </div>

      <h2 className="text-[1.4rem] font-extrabold text-[#1F1235] mb-2">
        {verified ? "Email verified!" : "Check your inbox"}
      </h2>

      {verified ? (
        <p className="text-[0.87rem] font-medium text-[#7A6B98] mb-8">
          You're all set. Redirecting you now…
        </p>
      ) : (
        <>
          <p className="text-[0.87rem] font-medium text-[#7A6B98] mb-1">We sent a verification link to</p>
          <p className="text-[0.9rem] font-bold text-[#2D1B4E] mb-6 break-all">{email}</p>
          <p className="text-[0.82rem] text-[#9C8EC1] mb-8 leading-relaxed max-w-xs">
            Click the link in the email to verify your account. Check your spam folder if you don't see it.
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-[#FFF0F0] border border-[#FFD5D5] rounded-xl px-3.5 py-2.5 mb-4 w-full text-[0.82rem] font-semibold text-[#C0392B]" role="alert">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button onClick={onCheckNow} disabled={checking || verified} className={`${btnCls} mb-3`}>
            {checking ? <><Spinner sm />Checking…</> : "I've verified — continue"}
          </button>

          <button
            onClick={onResend} disabled={resendCooldown > 0}
            className="text-[0.83rem] font-semibold text-[#6D4DB2] hover:text-[#2D1B4E] disabled:text-[#C4BAD8] disabled:cursor-not-allowed transition-colors"
          >
            {resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : "Resend verification email"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Signup Form ──────────────────────────────────────────────────────────────
// Defined OUTSIDE SignupPage so React never sees it as a new component type
// on re-render, which would cause inputs to lose focus on every keystroke.
function SignupForm({
  prefix,
  fullName, setFullName,
  email, setEmail,
  dob, setDob,
  phone, setPhone,
  password, setPassword,
  confirmPass, setConfirmPass,
  showPass, setShowPass,
  showConfirm, setShowConfirm,
  agreed, setAgreed,
  handleSubmit, handleGoogle,
  loading, googleLoading, error,
}) {
  const isAnythingLoading = loading || googleLoading;

  return (
    <>
      {/* Google */}
      <button
        type="button" onClick={handleGoogle} disabled={isAnythingLoading}
        className="w-full flex items-center justify-center gap-2 bg-white border border-[#DDD5F8] rounded-xl py-2.5 text-[0.8rem] font-bold text-[#374151] hover:bg-[#F5F3FF] hover:border-[#C4B5E0] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {googleLoading ? <Spinner sm /> : <GoogleIcon />}
        {googleLoading ? "Signing in…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-2.5 my-5">
        <div className="flex-1 h-px bg-[#DDD5F8]" />
        <span className="text-[0.7rem] font-semibold text-[#C4BAD8] tracking-wide">or sign up with email</span>
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
          <label htmlFor={`${prefix}-name`} className={labelCls}>Full Name</label>
          <input id={`${prefix}-name`} type="text" value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputCls} placeholder="John Doe" autoComplete="name" />
        </div>

        <div className="mb-4">
          <label htmlFor={`${prefix}-email`} className={labelCls}>Email Address</label>
          <input id={`${prefix}-email`} type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls} placeholder="you@example.com" autoComplete="email" />
        </div>

        <div className="mb-4">
          <label htmlFor={`${prefix}-dob`} className={labelCls}>Date of Birth</label>
          <input id={`${prefix}-dob`} type="date" value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={`${inputCls} [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100`}
            style={{ minHeight: "50px" }} />
        </div>

        <div className="mb-4">
          <label htmlFor={`${prefix}-phone`} className={labelCls}>Phone Number</label>
          <PhoneInput
            country={"ng"} enableSearch searchPlaceholder="Search country..."
            value={phone} onChange={(value) => setPhone(value)}
            inputProps={{ id: `${prefix}-phone`, name: "phone", required: true }}
            containerClass="!w-full"
            buttonClass="!border-[#DDD5F8] !rounded-l-xl !bg-white hover:!bg-[#F9F7FF]"
            inputClass="!w-full !h-[50px] !pl-[60px] !rounded-xl !border-[#DDD5F8] !text-[0.9rem] !font-medium !text-[#111827] !outline-none focus:!border-[#6D4DB2] focus:!ring-2 focus:!ring-[#6D4DB2]/10 transition-all"
            dropdownClass="!rounded-xl !border-[#DDD5F8] !shadow-xl"
          />
        </div>

        <div className="mb-4">
          <label htmlFor={`${prefix}-password`} className={labelCls}>Password</label>
          <div className="relative">
            <input
              id={`${prefix}-password`}
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputCls} pr-12`}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              aria-label={showPass ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8EC1] hover:text-[#2D1B4E] transition-colors">
              <EyeIcon open={showPass} />
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor={`${prefix}-confirm`} className={labelCls}>Repeat Password</label>
          <div className="relative">
            <input
              id={`${prefix}-confirm`}
              type={showConfirm ? "text" : "password"}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className={`${inputCls} pr-12`}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8EC1] hover:text-[#2D1B4E] transition-colors">
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-[17px] h-[17px] accent-[#2D1B4E] cursor-pointer rounded" />
            <span className="text-sm text-[#4B3B72]">
              I agree to the{" "}
              <Link href="/terms" className="font-bold text-[#6D4DB2]">Terms of Use</Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-bold text-[#6D4DB2]">Privacy Policy</Link>
            </span>
          </label>
        </div>

        <button type="submit" disabled={isAnythingLoading} className={btnCls}>
          {loading ? <><Spinner sm />Creating Account…</> : "Create Account"}
        </button>
      </form>

      <p className="text-center text-[0.83rem] font-semibold text-[#7A6B98] mt-5">
        Already have an account?{" "}
        <Link href="/login" className="text-[#2D1B4E] font-extrabold hover:underline">Sign in</Link>
      </p>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle, sendVerificationEmail, reloadUser, loading, error, setError } = useAuth();

  const [fullName,    setFullName]    = useState("");
  const [email,       setEmail]       = useState("");
  const [dob,         setDob]         = useState("");
  const [phone,       setPhone]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed,      setAgreed]      = useState(false);

  const [googleLoading,  setGoogleLoading]  = useState(false);
  const [awaitingVerify, setAwaitingVerify] = useState(false);
  const [checking,       setChecking]       = useState(false);
  const [verified,       setVerified]       = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const cooldownRef = useRef(null);
  const pollRef     = useRef(null);

  // ── Auto-poll every 4 s ───────────────────────────────────────────────────
  useEffect(() => {
    if (!awaitingVerify || verified) return;
    pollRef.current = setInterval(async () => {
      const ok = await reloadUser?.();
      if (ok) {
        setVerified(true);
        clearInterval(pollRef.current);
        setTimeout(() => router.push("/"), 1800);
      }
    }, 4000);
    return () => clearInterval(pollRef.current);
  }, [awaitingVerify, verified]);

  useEffect(() => () => {
    clearInterval(cooldownRef.current);
    clearInterval(pollRef.current);
  }, []);

  const startCooldown = () => {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) { clearInterval(cooldownRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!fullName || !email || !dob || !phone || !password || !confirmPass) {
      setError("Please fill in all fields."); return;
    }
    if (password !== confirmPass) {
      setError("Passwords do not match."); return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Use and Privacy Policy."); return;
    }
    const user = await signup({ fullName, email, password, phone, dob });
    if (user) { setAwaitingVerify(true); startCooldown(); }
  };

  const handleCheckNow = async () => {
    setChecking(true);
    setError("");
    const ok = await reloadUser?.();
    setChecking(false);
    if (ok) {
      setVerified(true);
      clearInterval(pollRef.current);
      setTimeout(() => router.push("/"), 1800);
    } else {
      setError("Email not verified yet — please click the link in your inbox.");
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await sendVerificationEmail?.();
    startCooldown();
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) router.push("/");
    } finally {
      setGoogleLoading(false);
    }
  };

  const formProps = {
    fullName, setFullName, email, setEmail, dob, setDob,
    phone, setPhone, password, setPassword, confirmPass, setConfirmPass,
    showPass, setShowPass, showConfirm, setShowConfirm,
    agreed, setAgreed, handleSubmit, handleGoogle,
    loading, googleLoading, error,
  };

  return (
    <div className="min-h-dvh bg-[#F7F5FF]">

      {/* Mobile */}
      <div className="md:hidden flex flex-col min-h-dvh px-6 pt-12 pb-10">
        {!awaitingVerify && (
          <>
            <h1 className="text-2xl font-extrabold text-[#1F1235] mb-1">Create account</h1>
            <p className="text-[0.875rem] font-medium text-[#7A6B98] mb-7">Join Odara and start shopping</p>
          </>
        )}
        {awaitingVerify
          ? <VerifyEmailScreen email={email} onResend={handleResend} onCheckNow={handleCheckNow}
              resendCooldown={resendCooldown} checking={checking} verified={verified} error={error} />
          : <SignupForm prefix="m" {...formProps} />
        }
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center min-h-dvh px-6 py-16">
        <div className="w-full max-w-[460px]">
          {!awaitingVerify && (
            <>
              <h1 className="text-[1.85rem] font-extrabold text-[#1F1235] text-center mb-1.5">Create account</h1>
              <p className="text-[0.9rem] font-medium text-[#7A6B98] text-center mb-8">Join Odara and start shopping today</p>
            </>
          )}
          {awaitingVerify
            ? <VerifyEmailScreen email={email} onResend={handleResend} onCheckNow={handleCheckNow}
                resendCooldown={resendCooldown} checking={checking} verified={verified} error={error} />
            : <SignupForm prefix="d" {...formProps} />
          }
          {!awaitingVerify && (
            <div className="flex justify-center gap-4 mt-10">
              <Link href="/privacy" className="text-[0.7rem] font-medium text-[#C4BAD8] hover:text-[#9C8EC1] transition-colors">Privacy Policy</Link>
              <span className="text-[#DDD5F8]">·</span>
              <Link href="/terms" className="text-[0.7rem] font-medium text-[#C4BAD8] hover:text-[#9C8EC1] transition-colors">Terms of Use</Link>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        input[type="date"] { -webkit-appearance: none; appearance: none; min-height: 50px; }
        input[type="date"]::-webkit-datetime-edit { padding: 0; }
        input[type="date"]::-webkit-datetime-edit-fields-wrapper { padding: 0; }
        input[type="date"]::-webkit-datetime-edit-text { padding: 0 0.2em; }
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-year-field { padding: 0; }
      `}</style>
    </div>
  );
}