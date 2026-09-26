"use client";

import React, { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import {
  registerInitialValues,
  registerValidationSchema,
  RegisterFormValues,
  calculatePasswordStrength,
} from "@/lib/validation/authSchemas";
import { useAuth } from "@/lib/auth/AuthContext";

function RegisterContent() {
  const router = useRouter();
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const planQuery = searchParams.get("plan");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const formik = useFormik<RegisterFormValues>({
    initialValues: registerInitialValues,
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setIsSubmittingForm(true);
      setAuthSuccess(null);
      setAuthError(null);

      const planValue: "free" | "plus" | "premium" =
        planQuery === "plus" || planQuery === "premium" ? planQuery : "free";

      try {
        const res = await register({
          name: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          role: values.role,
          plan: planValue,
        });

        if (!res.success) {
          let errMsg = res.message || "Registration failed";
          if (res.errors) {
            const firstErr = Object.values(res.errors)[0];
            if (firstErr && firstErr.length > 0) {
              errMsg = firstErr[0];
            }
          }
          setAuthError(errMsg);
          setIsSubmittingForm(false);
          return;
        }

        const userName = res.data?.user.name || values.fullName;
        if (res.data?.accessToken) {
          document.cookie = `hercompass_access_token=${res.data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        }
        if (values.role) {
          document.cookie = `hercompass_user_role=${values.role}; path=/; max-age=604800; SameSite=Lax`;
        }
        setAuthSuccess(`Welcome to HerCompass, ${userName}! Opening your wellness space...`);
        setTimeout(() => {
          window.location.href = "/welcome";
        }, 500);
      } catch (err: unknown) {
        setAuthError("Failed to connect to registration server. Please try again.");
        setIsSubmittingForm(false);
      }
    },
  });

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(formik.values.password),
    [formik.values.password]
  );

  const planInfo = useMemo(() => {
    if (planQuery === "plus") {
      return {
        name: "Plus Plan ($19/mo)",
        tag: "14-Day Free Trial",
        badgeColor: "bg-indigo-50 border-indigo-200 text-indigo-700",
      };
    }
    if (planQuery === "premium") {
      return {
        name: "Premium Couple Plan ($34/mo)",
        tag: "14-Day Free Trial",
        badgeColor: "bg-purple-50 border-purple-200 text-purple-700",
      };
    }
    return {
      name: "14-Day Free Trial",
      tag: "No Credit Card Required",
      badgeColor: "bg-violet-50 border-violet-200 text-violet-700",
    };
  }, [planQuery]);

  const handleGoogleSignIn = () => {
    const selectedRole = formik.values.role || "member";
    document.cookie = `hercompass_selected_role=${selectedRole}; path=/; max-age=900; SameSite=Lax`;
    localStorage.setItem("hercompass_selected_role", selectedRole);
    signIn("google", { callbackUrl: `/welcome?role=${selectedRole}` });
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join thousands of women & couples experiencing clarity, relief, and deeper connection."
      badgeText={planInfo.tag}
      badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
      alternateAction={{
        label: "Already registered?",
        linkText: "Sign In",
        href: "/login",
      }}
    >
      {/* Selected Plan Banner if chosen - Responsive wrap */}
      {planQuery && (
        <div className={`mb-4 sm:mb-6 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-xs flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 sm:gap-2 ${planInfo.badgeColor}`}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-violet-600 text-white text-[9px] sm:text-[10px] font-bold flex-shrink-0">
              ✓
            </span>
            <span className="font-semibold truncate">Selected: {planInfo.name}</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium opacity-80 whitespace-nowrap">Cancel anytime</span>
        </div>
      )}

      {/* Role / Persona Selector - Mobile-friendly cards */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          I am joining as:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* Member Option */}
          <button
            type="button"
            onClick={() => formik.setFieldValue("role", "member")}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all ${
              formik.values.role === "member"
                ? "border-violet-500 bg-violet-50/50 ring-2 ring-violet-200 shadow-xs"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg sm:rounded-xl bg-violet-100 text-violet-700 flex-shrink-0">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900">Woman / Member</span>
              </div>
              {formik.values.role === "member" && (
                <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-violet-600 text-white text-[10px] sm:text-xs flex-shrink-0">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </div>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug">
              Track daily symptoms, sleep &amp; mood; get tailored AI cooling routines.
            </p>
          </button>

          {/* Partner Option */}
          <button
            type="button"
            onClick={() => formik.setFieldValue("role", "partner")}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all ${
              formik.values.role === "partner"
                ? "border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-200 shadow-xs"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg sm:rounded-xl bg-indigo-100 text-indigo-700 flex-shrink-0">
                  <HeartHandshake className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900">Partner / Spouse</span>
              </div>
              {formik.values.role === "partner" && (
                <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] sm:text-xs flex-shrink-0">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </div>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug">
              Consented weekly digests, practical empathy tips, and Men&apos;s Academy.
            </p>
          </button>
        </div>
      </div>

      {/* Social Register - Google OAuth via NextAuth */}
      <div className="mb-4 sm:mb-6">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition-all shadow-xs hover:border-slate-300 hover:shadow-sm group cursor-pointer"
        >
          <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      <div className="relative my-4 sm:my-6 flex items-center justify-center">
        <div className="w-full border-t border-slate-200" />
        <span className="absolute bg-white px-2.5 sm:px-3 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Or register with email
        </span>
      </div>

      {/* Formik Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Success Alert */}
        {authSuccess && (
          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* Error Alert */}
        {authError && (
          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
            <span>{authError}</span>
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-1">
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold text-slate-700"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. Maria Santos"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-xl border bg-slate-50/50 py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                formik.touched.fullName && formik.errors.fullName
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-200 focus:border-violet-500 focus:ring-violet-200"
              }`}
            />
          </div>
          {formik.touched.fullName && formik.errors.fullName && (
            <p className="flex items-center gap-1 text-[10px] sm:text-[11px] text-rose-600">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span>{formik.errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-slate-700"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
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

        {/* Password Field */}
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-xl border bg-slate-50/50 py-2 sm:py-2.5 pl-9 sm:pl-10 pr-9 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                formik.touched.password && formik.errors.password
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-200 focus:border-violet-500 focus:ring-violet-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password Strength Meter */}
          {formik.values.password && (
            <div className="mt-1.5 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Security</span>
                <span className="font-semibold text-slate-700">
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${passwordStrength.colorClass} ${passwordStrength.widthClass}`}
                />
              </div>
            </div>
          )}

          {formik.touched.password && formik.errors.password && (
            <p className="flex items-center gap-1 text-[10px] sm:text-[11px] text-rose-600">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span>{formik.errors.password}</span>
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-slate-700"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-xl border bg-slate-50/50 py-2 sm:py-2.5 pl-9 sm:pl-10 pr-9 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-200 focus:border-violet-500 focus:ring-violet-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="flex items-center gap-1 text-[10px] sm:text-[11px] text-rose-600">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span>{formik.errors.confirmPassword}</span>
            </p>
          )}
        </div>

        {/* Consent & Clinical Scope Checkbox */}
        <div className="pt-1 space-y-1">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formik.values.agreeToTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 flex-shrink-0"
            />
            <span className="text-[10px] sm:text-xs text-slate-600 leading-snug">
              I agree to the{" "}
              <Link href="/terms" className="text-violet-600 hover:underline font-medium">
                Terms
              </Link>{" "}
              &amp;{" "}
              <Link href="/privacy" className="text-violet-600 hover:underline font-medium">
                Privacy Policy
              </Link>
              , and acknowledge educational wellness scope (not medical diagnoses).
            </span>
          </label>
          {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
            <p className="flex items-center gap-1 text-[10px] sm:text-[11px] text-rose-600 pl-6">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span>{formik.errors.agreeToTerms}</span>
            </p>
          )}
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmittingForm}
          className="w-full mt-3 sm:mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 sm:py-3 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
        >
          {isSubmittingForm ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account &amp; Start Snapshot</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-violet-600 hover:text-violet-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9]">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
