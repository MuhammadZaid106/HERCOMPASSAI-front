"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import {
  forgotPasswordInitialValues,
  forgotPasswordValidationSchema,
  ForgotPasswordFormValues,
} from "@/lib/validation/authSchemas";

export default function ForgotPasswordPage() {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: forgotPasswordInitialValues,
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values) => {
      setIsSubmittingForm(true);
      setResendNotice(null);

      // Simulate recovery link dispatch
      setTimeout(() => {
        setIsSubmittingForm(false);
        setSubmittedEmail(values.email);
        setCooldown(60);
      }, 800);
    },
  });

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submittedEmail && cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [submittedEmail, cooldown]);

  const handleResend = () => {
    if (cooldown > 0) return;
    setIsSubmittingForm(true);
    setTimeout(() => {
      setIsSubmittingForm(false);
      setCooldown(60);
      setResendNotice("A new recovery link has been dispatched to your email.");
    }, 600);
  };

  return (
    <AuthLayout
      title={submittedEmail ? "Check Your Inbox" : "Reset Your Password"}
      subtitle={
        submittedEmail
          ? "We've dispatched a secure, single-use password recovery link."
          : "Enter your registered email address and we'll send you instructions to recover access."
      }
      badgeText="Encrypted Account Recovery"
      badgeIcon={<KeyRound className="h-3.5 w-3.5" />}
      alternateAction={{
        label: "Remember your password?",
        linkText: "Sign In",
        href: "/login",
      }}
    >
      {submittedEmail ? (
        /* State 2: Email Dispatched State - Mobile optimized */
        <div className="space-y-4 sm:space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-xs">
            <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <p className="text-xs sm:text-sm text-slate-700">
              Recovery instructions sent to:
            </p>
            <p className="inline-block px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 font-mono text-[11px] sm:text-xs font-semibold text-slate-900 border border-slate-200 max-w-full truncate">
              {submittedEmail}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed pt-1 sm:pt-2">
              Please check your spam or junk folder if you don&apos;t see it within a minute. The recovery link expires in <strong>15 minutes</strong>.
            </p>
          </div>

          {resendNotice && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs flex items-center justify-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-emerald-600" />
              <span>{resendNotice}</span>
            </div>
          )}

          {/* Resend Action */}
          <div className="pt-1">
            {cooldown > 0 ? (
              <p className="text-[11px] sm:text-xs text-slate-400">
                Resend link available in{" "}
                <span className="font-semibold text-slate-600">{cooldown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isSubmittingForm}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Didn&apos;t receive it? Resend link now</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1 sm:pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 sm:py-3 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/35 hover:-translate-y-0.5"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setSubmittedEmail(null);
                setResendNotice(null);
              }}
              className="w-full py-1.5 text-[11px] sm:text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Try a different email address
            </button>
          </div>
        </div>
      ) : (
        /* State 1: Input Email Form - Mobile optimized */
        <form onSubmit={formik.handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-700"
            >
              Registered Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full rounded-xl border bg-slate-50/50 py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.email && formik.errors.email
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                    : "border-slate-200 focus:border-violet-500 focus:ring-violet-200"
                }`}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="flex items-center gap-1 text-[10px] sm:text-[11px] text-rose-600">
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                <span>{formik.errors.email}</span>
              </p>
            )}
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3.5 text-[10px] sm:text-[11px] text-slate-500 space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-violet-600 flex-shrink-0" />
              <span>Zero-Knowledge Recovery</span>
            </div>
            <p className="leading-snug">
              We protect your privacy. Only the registered address will receive the single-use reset token.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmittingForm}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 sm:py-3 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSubmittingForm ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending Instructions...</span>
              </>
            ) : (
              <>
                <span>Send Recovery Instructions</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </>
            )}
          </button>

          <div className="pt-2 sm:pt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-violet-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
