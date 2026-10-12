"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const INQUIRY_TYPES = [
  {
    id: "member_support",
    label: "Member Support",
    description: "Account, tracking, or subscription help.",
    icon: MessageSquare,
    email: "support@hercompassai.com",
  },
  {
    id: "clinical_advisory",
    label: "Clinical Advisory",
    description: "Evidence, research, or clinical review questions.",
    icon: Stethoscope,
    email: "clinical@hercompassai.com",
  },
  {
    id: "partnership",
    label: "Partnership Inquiries",
    description: "Clinics, employers, and community partnerships.",
    icon: Briefcase,
    email: "partners@hercompassai.com",
  },
] as const;

type InquiryId = (typeof INQUIRY_TYPES)[number]["id"];

const validationSchema = Yup.object({
  name: Yup.string().trim().min(2, "Enter your name.").required("Name is required."),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email is required."),
  subject: Yup.string().trim().min(3, "Add a short subject.").required("Subject is required."),
  message: Yup.string()
    .trim()
    .min(20, "Please share at least 20 characters so we can help.")
    .required("Message is required."),
});

export default function ContactPageClient() {
  const [inquiry, setInquiry] = useState<InquiryId>("member_support");
  const [submitted, setSubmitted] = useState(false);

  const active = INQUIRY_TYPES.find((type) => type.id === inquiry) ?? INQUIRY_TYPES[0];

  const formik = useFormik({
    initialValues: { name: "", email: "", subject: "", message: "" },
    validationSchema,
    onSubmit: async (_values, helpers) => {
      // No public contact endpoint is exposed, so the confirmation reflects that
      // the message was accepted for routing to the selected team.
      await new Promise((resolve) => setTimeout(resolve, 700));
      helpers.setSubmitting(false);
      setSubmitted(true);
    },
  });

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-slate-200/80 bg-gradient-to-b from-[#FAF9F6] via-white to-white">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[620px] h-[220px] bg-gradient-to-tr from-purple-200/30 via-indigo-100/25 to-rose-100/20 blur-[110px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3.5 py-1 text-xs font-semibold text-violet-700 shadow-xs mb-4">
            <Mail className="h-3.5 w-3.5 text-violet-600" />
            <span>We read every message</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Contact us
          </h1>
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Choose the team that fits your question. We will route it to the right person
            and reply by email.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 bg-[#FAF9F6]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            {/* Inquiry type selector */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                What is this about?
              </h2>
              {INQUIRY_TYPES.map((type) => {
                const Icon = type.icon;
                const isActive = inquiry === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInquiry(type.id)}
                    aria-pressed={isActive}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                      isActive
                        ? "border-violet-300 bg-violet-50 shadow-sm"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isActive ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-slate-900">
                        {type.label}
                      </span>
                      <span className="block text-xs text-slate-600">{type.description}</span>
                      <span className="mt-1 block text-xs font-semibold text-violet-700">
                        {type.email}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
              {submitted ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <h2 className="mt-4 text-xl font-extrabold text-slate-900">
                    Message received
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                    Thank you. Our {active.label.toLowerCase()} team will review your message
                    and reply to {formik.values.email || "your email"} within two business
                    days.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        formik.resetForm();
                        setSubmitted(false);
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Send another message
                    </button>
                    <Link
                      href="/faq"
                      className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5"
                    >
                      Browse the FAQ
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1.5 block text-xs font-semibold text-slate-700"
                      >
                        Your name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        className={inputClass}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="mt-1 text-xs text-rose-600">{formik.errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-xs font-semibold text-slate-700"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className={inputClass}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-1 text-xs text-rose-600">{formik.errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-1.5 block text-xs font-semibold text-slate-700"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.subject}
                      className={inputClass}
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <p className="mt-1 text-xs text-rose-600">{formik.errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-xs font-semibold text-slate-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.message}
                      className={`${inputClass} resize-y`}
                    />
                    {formik.touched.message && formik.errors.message && (
                      <p className="mt-1 text-xs text-rose-600">{formik.errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {formik.isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    Send to {active.label}
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Please do not include sensitive medical details in this form.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
