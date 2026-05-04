"use client";

import { useState } from "react";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
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

const inputCls =
  "w-full bg-white border border-[#DDD5F8] rounded-xl px-4 py-3 text-[0.9rem] font-medium text-[#111827] outline-none placeholder:text-[#C4BAD8] focus:border-[#6D4DB2] focus:ring-2 focus:ring-[#6D4DB2]/10 transition-all";

const labelCls =
  "block text-[0.72rem] font-bold text-[#4B3B72] uppercase tracking-[0.055em] mb-2";

const btnCls =
  "w-full flex items-center justify-center bg-[#2D1B4E] hover:bg-[#3d2568] text-white font-extrabold text-[0.92rem] rounded-xl py-3.5 transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !dob || !phone || !password || !confirmPass) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms of Use and Privacy Policy.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const form = (fnId, eId, dobId, phoneId, pId, cId) => (
    <>
      <div className="flex gap-2.5">
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#DDD5F8] rounded-xl py-2.5 text-[0.8rem] font-bold text-[#374151] hover:bg-[#F5F3FF] hover:border-[#C4B5E0] transition-all"
        >
          <GoogleIcon /> Google
        </button>

        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#DDD5F8] rounded-xl py-2.5 text-[0.8rem] font-bold text-[#374151] hover:bg-[#F5F3FF] hover:border-[#C4B5E0] transition-all"
        >
          <FacebookIcon /> Facebook
        </button>
      </div>

      <div className="flex items-center gap-2.5 my-5">
        <div className="flex-1 h-px bg-[#DDD5F8]" />
        <span className="text-[0.7rem] font-semibold text-[#C4BAD8] tracking-wide">
          or sign up with email
        </span>
        <div className="flex-1 h-px bg-[#DDD5F8]" />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="mb-4 text-sm font-semibold text-red-600">{error}</div>
        )}

        <div className="mb-4">
          <label htmlFor={fnId} className={labelCls}>Full Name</label>
          <input
            id={fnId}
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputCls}
            placeholder="John Doe"
          />
        </div>

        <div className="mb-4">
          <label htmlFor={eId} className={labelCls}>Email Address</label>
          <input
            id={eId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-4">
          <label htmlFor={dobId} className={labelCls}>Date of Birth</label>
          <input
            id={dobId}
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={`${inputCls} [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100`}
            style={{ minHeight: "50px" }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor={phoneId} className={labelCls}>Phone Number</label>

          <PhoneInput
            country={"ng"}
            enableSearch
            searchPlaceholder="Search country..."
            value={phone}
            onChange={(value) => setPhone(value)}
            inputProps={{
              name: "phone",
              required: true,
            }}
            containerClass="!w-full"
            buttonClass="!border-[#DDD5F8] !rounded-l-xl !bg-white hover:!bg-[#F9F7FF]"
            inputClass="!w-full !h-[50px] !pl-[60px] !rounded-xl !border-[#DDD5F8] !text-[0.9rem] !font-medium !text-[#111827] !outline-none !placeholder:text-[#C4BAD8] focus:!border-[#6D4DB2] focus:!ring-2 focus:!ring-[#6D4DB2]/10 transition-all"
            dropdownClass="!rounded-xl !border-[#DDD5F8] !shadow-xl"
          />
        </div>

        <div className="mb-4">
          <label htmlFor={pId} className={labelCls}>Password</label>
          <div className="relative">
            <input
              id={pId}
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputCls} pr-12`}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <EyeIcon open={showPass} />
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor={cId} className={labelCls}>Repeat Password</label>
          <div className="relative">
            <input
              id={cId}
              type={showConfirm ? "text" : "password"}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className={`${inputCls} pr-12`}
              placeholder="Repeat your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-[#4B3B72]">
              I agree to the{" "}
              <Link href="/terms" className="font-bold text-[#6D4DB2]">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-bold text-[#6D4DB2]">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>

        <button type="submit" disabled={loading} className={btnCls}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-[0.83rem] font-semibold text-[#7A6B98] mt-5">
        Already have an account?{" "}
        <Link href="/login" className="text-[#2D1B4E] font-extrabold">
          Sign in
        </Link>
      </p>
    </>
  );

  return (
    <div className="min-h-dvh bg-[#F7F5FF]">
      <div className="md:hidden flex flex-col min-h-dvh px-6 pt-12 pb-10">
        <h1 className="text-2xl font-extrabold text-[#1F1235] mb-1">
          Create account
        </h1>
        <p className="text-[0.875rem] font-medium text-[#7A6B98] mb-7">
          Join Odara and start shopping
        </p>

        {form(
          "m-name",
          "m-email",
          "m-dob",
          "m-phone",
          "m-password",
          "m-confirm"
        )}
      </div>

      <div className="hidden md:flex items-center justify-center min-h-dvh px-6 py-16">
        <div className="w-full max-w-[460px]">
          <h1 className="text-[1.85rem] font-extrabold text-[#1F1235] text-center mb-1.5">
            Create account
          </h1>

          <p className="text-[0.9rem] font-medium text-[#7A6B98] text-center mb-8">
            Join Odara and start shopping today
          </p>

          {form(
            "d-name",
            "d-email",
            "d-dob",
            "d-phone",
            "d-password",
            "d-confirm"
          )}
        </div>
      </div>

      <style jsx global>{`
        /* Fix for date input on iOS */
        input[type="date"] {
          -webkit-appearance: none;
          appearance: none;
          min-height: 50px;
        }
        
        input[type="date"]::-webkit-datetime-edit {
          padding: 0;
        }
        
        input[type="date"]::-webkit-datetime-edit-fields-wrapper {
          padding: 0;
        }
        
        input[type="date"]::-webkit-datetime-edit-text {
          padding: 0 0.2em;
        }
        
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-year-field {
          padding: 0;
        }
      `}</style>
    </div>
  );
}