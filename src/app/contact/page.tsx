import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the ToolNest team for feedback, bug reports, feature requests, or collaboration inquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_12px_34px_rgba(79,70,229,0.1)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-indigo-100/35 via-sky-100/20 to-cyan-100/35" />
      <div className="relative">
      <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">Contact ToolNest</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">We’d love your feedback</h1>

      <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700 sm:text-base">
        <p>
          We value your feedback and are here to help. Whether you have a question about a tool, want to report an issue, suggest a new feature, or explore collaboration opportunities, please do not hesitate to contact us.
        </p>

        <div className="rounded-xl border border-slate-200 bg-white/80 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Email Us</h2>
          <p className="mt-2">
            For general inquiries and feedback:
            <a href="mailto:chaudharyjj87@gmail.com" className="ml-1 font-semibold text-indigo-700 hover:text-indigo-800">chaudharyjj87@gmail.com</a>
          </p>
          <p className="mt-1">
            For privacy-related questions:
            <a href="mailto:chaudharyjj87@gmail.com" className="ml-1 font-semibold text-indigo-700 hover:text-indigo-800">chaudharyjj87@gmail.com</a>
          </p>
          <p className="mt-1">
            For legal and terms inquiries:
            <a href="mailto:chaudharyjj87@gmail.com" className="ml-1 font-semibold text-indigo-700 hover:text-indigo-800">chaudharyjj87@gmail.com</a>
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">What We Can Help With</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Bug reports:</strong> Found a tool that produces incorrect output or has a UI issue? Let us know the tool name, your input, and the expected versus actual result.</li>
            <li><strong>Feature requests:</strong> Have an idea for a new tool or an improvement to an existing one? We prioritize features based on user demand and practical impact.</li>
            <li><strong>Content corrections:</strong> If you spot inaccurate information in our educational content, we welcome corrections and will credit contributors when appropriate.</li>
            <li><strong>Collaboration:</strong> Interested in partnering, guest content, or integration opportunities? Reach out with details about your project.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Response Time</h2>
          <p className="mt-2">
            We aim to respond to all inquiries within 2–3 business days. For urgent matters related to privacy or security, please include &quot;URGENT&quot; in your subject line.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Related Pages</h2>
          <p className="mt-2">
            You may also find answers in our{" "}
            <Link href="/about" className="font-semibold text-indigo-700 hover:text-indigo-800">About page</Link>,{" "}
            <Link href="/privacy-policy" className="font-semibold text-indigo-700 hover:text-indigo-800">Privacy Policy</Link>,{" "}
            <Link href="/terms-of-service" className="font-semibold text-indigo-700 hover:text-indigo-800">Terms of Service</Link>, or{" "}
            <Link href="/disclaimer" className="font-semibold text-indigo-700 hover:text-indigo-800">Disclaimer</Link>.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
