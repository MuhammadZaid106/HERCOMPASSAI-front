import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-slate-900">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-slate-200/80 bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">HerCompassAI</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-sm text-slate-500">Last updated: September 27, 2026</p>
            <div className="mt-10 space-y-8 text-sm leading-7 text-slate-600 sm:text-base">
              <section>
                <h2 className="text-xl font-bold text-slate-900">Information we collect</h2>
                <p className="mt-2">We collect account details, onboarding responses, wellness check-ins, and consent settings that you choose to provide. We use this information to operate your account and personalize non-diagnostic wellness insights.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900">How we use your information</h2>
                <p className="mt-2">We use information to provide the HerCompassAI experience, protect account security, improve the service, and communicate with you about your account. We do not sell personal health information.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900">Partner privacy</h2>
                <p className="mt-2">Partners receive only the consented digest categories you enable. Raw health logs, private notes, and unfiltered personal data are not shared with partners. You can change or revoke consent at any time.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900">Your choices</h2>
                <p className="mt-2">You may review or update account information, manage sharing controls, request access or deletion, and contact us with privacy questions at <a className="font-semibold text-violet-700 hover:text-violet-800" href="mailto:privacy@hercompassai.com">privacy@hercompassai.com</a>.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900">Contact</h2>
                <p className="mt-2">For privacy requests or questions about this policy, email privacy@hercompassai.com. This page is general product information and does not replace a formal legal notice where one is required.</p>
              </section>
            </div>
            <Link href="/terms" className="mt-10 inline-flex text-sm font-semibold text-violet-700 hover:text-violet-800">Read the Terms of Service <span aria-hidden="true">-&gt;</span></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}