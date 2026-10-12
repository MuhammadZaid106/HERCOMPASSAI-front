import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us & Support — HerCompassAI",
  description:
    "Have questions or need assistance? Reach out to the HerCompassAI support team for member assistance, clinical inquiries, or partnership opportunities.",
  openGraph: {
    title: "Contact HerCompassAI",
    description: "Get in touch with our team.",
    url: "https://hercompassai.com/contact",
    siteName: "HerCompassAI",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-rose-100/60 bg-gradient-to-b from-rose-50/40 to-[#FBFBF9] py-16 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto">
              We&apos;re here to help. Reach out with questions about your membership, our clinical methodology, or partner support.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="Jane"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Inquiry Topic</label>
                <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none">
                  <option>Member Support & Account</option>
                  <option>Personal Menopause Snapshot™ Inquiries</option>
                  <option>Partner Experience & Academy</option>
                  <option>Clinical Research & Evidence Inquiries</option>
                  <option>Feedback & Suggestions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Message</label>
                <textarea
                  rows={5}
                  placeholder="How can we assist you today?"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-rose-700 transition"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>

              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Direct Email: <a href="mailto:support@hercompassai.com" className="font-semibold text-rose-600 hover:underline">support@hercompassai.com</a> &bull; Response time within 24 hours.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
