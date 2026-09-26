"use client";

import React, { useState, Suspense } from "react";
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
} from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import {
  loginInitialValues,
  loginValidationSchema,
  LoginFormValues,
  UserPersona,
} from "@/lib/validation/authSchemas";
import { useAuth } from "@/lib/auth/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Redirect destination after login: respects ?from= param from middleware, but admins always go to /admin
  const fromParam = searchParams.get("from");
  // Only allow safe internal paths (must start with /) to prevent open redirect
  const safeFrom = fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//") ? fromParam : null;

  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const formik = useFormik<LoginFormValues>({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setIsSubmittingForm(true);
      setAuthSuccess(null);
      setAuthError(null);

      try {
        const res = await login({
          email: values.email,
          password: values.password,
        });

        if (!res.success) {
          setAuthError(res.message || "Invalid email or password");
          setIsSubmittingForm(false);
          return;
        }

        const userName = res.data?.user.name || "Member";
        const userRole = res.data?.user.role;

        // Synchronously ensure cookies are stored for Next.js edge middleware
        if (res.data?.accessToken) {
          document.cookie = `hercompass_access_token=${res.data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        }
        if (userRole) {
          document.cookie = `hercompass_user_role=${userRole}; path=/; max-age=604800; SameSite=Lax`;
        }

        // Admins go to /admin.
        // Partners NEVER go to /onboarding (onboarding is for members only).
        // Members go to safeFrom (e.g. /onboarding) or /welcome.
        const destination =
          userRole === "admin"
            ? "/admin"
            : userRole === "partner"
            ? "/welcome"
            : (safeFrom || "/welcome");

        setAuthSuccess(
          userRole === "admin"
            ? `Welcome back, ${userName}! Entering admin panel...`
            : userRole === "partner"
            ? `Welcome back, ${userName}! Entering Partner Support Portal...`
            : safeFrom && safeFrom !== "/welcome"
            ? `Welcome back, ${userName}! Continuing where you left off...`
            : `Welcome back, ${userName}! Opening your wellness space...`
        );

        setTimeout(() => {
          window.location.href = destination;
        }, 500);
      } catch (err: unknown) {
        setAuthError("Failed to connect to authentication server. Please try again.");
        setIsSubmittingForm(false);
      }
    },
  });

  const handleSelectPersona = (persona: UserPersona) => {
    formik.setFieldValue("persona", persona);
  };


  const handleGoogleSignIn = () => {
    const selectedPersona = formik.values.persona || "member";
    document.cookie = `hercompass_selected_role=${selectedPersona}; path=/; max-age=900; SameSite=Lax`;
    localStorage.setItem("hercompass_selected_role", selectedPersona);
    signIn("google", { callbackUrl: `/welcome?role=${selectedPersona}` });
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your private, clinician-grounded wellness space."
      badgeText="Secure Member &amp; Partner Access"
      badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
      alternateAction={{
        label: "Don't have an account?",
        linkText: "Start Free Trial",
        href: "/register",
      }}
    >
      {/* Persona / Account Role Tabs - Fully responsive on all screens */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 sm:mb-2">
          Signing in as:
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100/90 rounded-xl sm:rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleSelectPersona("member")}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all ${
              formik.values.persona === "member"
                ? "bg-white text-violet-700 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-600 flex-shrink-0" />
            <span className="truncate">Woman / Member</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectPersona("partner")}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all ${
              formik.values.persona === "partner"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <HeartHandshake className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600 flex-shrink-0" />
            <span className="truncate">Partner / Spouse</span>
          </button>
        </div>

        <p className="mt-1.5 text-[10px] sm:text-[11px] text-slate-500 leading-snug">
          {formik.values.persona === "member"
            ? "Access your daily symptom logs, trend forecasts, and cooling protocols."
            : "Access your Consented Partner Digest, Men's Academy, and empathy tips."}
        </p>
      </div>

      {/* Social Login - Google OAuth via NextAuth */}
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

      {/* Divider */}
      <div className="relative my-4 sm:my-6 flex items-center justify-center">
        <div className="w-full border-t border-slate-200" />
        <span className="absolute bg-white px-2.5 sm:px-3 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Or sign in with email
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

        {/* Email Field */}
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
              autoComplete="email"
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-700"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] sm:text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
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
          {formik.touched.password && formik.errors.password && (
            <p className="flex items-center gap-1 text-[10px] sm:text-[11px] text-rose-600">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span>{formik.errors.password}</span>
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formik.values.rememberMe}
              onChange={formik.handleChange}
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-[11px] sm:text-xs text-slate-600">Keep me signed in</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmittingForm}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 sm:py-3 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
        >
          {isSubmittingForm ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In to Compass</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-semibold text-violet-600 hover:text-violet-700 hover:underline"
          >
            Start Free Trial
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9]">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

