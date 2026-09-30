"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import { KeyRound, Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { authClient } from "@/lib/auth/authClient";
import {
  resetPasswordInitialValues,
  resetPasswordValidationSchema,
  type ResetPasswordFormValues,
} from "@/lib/validation/authSchemas";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const formik = useFormik<ResetPasswordFormValues>({
    initialValues: resetPasswordInitialValues,
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values) => {
      setMessage(null);
      if (!token) {
        setMessage("This reset link is missing. Request a new one.");
        return;
      }
      const result = await authClient.resetPassword(token, values.password);
      if (!result.success) {
        setMessage(result.message || "This reset link has expired. Request a new one.");
        return;
      }
      setDone(true);
    },
  });

  if (done) {
    return (
      <AuthLayout
        title="Password updated"
        subtitle="You can sign in with the new password."
        badgeText="Account recovery"
        badgeIcon={<KeyRound className="h-3.5 w-3.5" />}
      >
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white"
        >
          Sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="This link works once. HerCompassAI does not diagnose or prescribe."
      badgeText="Account recovery"
      badgeIcon={<KeyRound className="h-3.5 w-3.5" />}
      alternateAction={{ label: "Remembered it?", linkText: "Sign in", href: "/login" }}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <label className="block text-sm font-semibold text-slate-800">
          New password
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          />
        </label>
        {formik.touched.password && formik.errors.password && (
          <p className="text-xs text-rose-700">{formik.errors.password}</p>
        )}
        <label className="block text-sm font-semibold text-slate-800">
          Confirm password
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          />
        </label>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-xs text-rose-700">{formik.errors.confirmPassword}</p>
        )}
        {message && <p className="text-sm text-rose-700">{message}</p>}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-70"
        >
          {formik.isSubmitting ? "Saving..." : "Update password"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FBFBF9]">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
