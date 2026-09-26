import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-slate-900">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-slate-200/80 bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">HerCompassAI</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Terms of Service</h1>
            <p className="mt-4 text-sm text-slate-500">Last updated: September 27, 2026</p>
            <div className="mt-10 space-y-8 text-sm leading-7 text-slate-600 sm:text-base">
              <section>
                <h2 className="text-xl font-bold text-slate-900">Using HerCompassAI</h2>
                <p className="mt-2">HerCompassAI provides relationship-centered wellness tracking, educational content, and observational insights. You agree to use the service lawfully, keep your account secure, and provide accurate information.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900">Wellness notice</h2>
                <p className="mt-2">The service is not a medical diagnostic tool and does not provide diagnoses, prescriptions, or prognoses. Content is educational and should not replace advice from a qualified healthcare professional. Seek urgent care for emergencies.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900">Accounts and consent</h2>
                <p className="mt-2">You are responsible for activity under your account. Partner sharing is controlled by your active consent settings, and you may revoke those settings at any time. Do not use another person&apos;s account or attempt to bypass access controls.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900">Content and availability</h2>
                <p className="mt-2">We may update, suspend, or discontinue parts of the service as it evolves. We aim to keep information useful and evidence-informed, but do not guarantee uninterrupted availability or that every insight is suitable for your circumstances.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900">Contact</h2>
                <p className="mt-2">Questions about these terms can be sent to <a className="font-semibold text-violet-700 hover:text-violet-800" href="mailto:privacy@hercompassai.com">privacy@hercompassai.com</a>. These terms should be reviewed by qualified counsel before being treated as a final legal agreement.</p>
              </section>
            </div>
            <Link href="/privacy" className="mt-10 inline-flex text-sm font-semibold text-violet-700 hover:text-violet-800">Read the Privacy Policy <span aria-hidden="true">-&gt;</span></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}