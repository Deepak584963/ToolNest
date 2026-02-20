import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the ToolNest team for feedback, bug reports, feature requests, or collaboration inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact ToolNest",
    description: "Reach ToolNest for feedback, bug reports, feature requests, partnerships, or support.",
    url: "/contact",
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact ToolNest",
    description: "Reach ToolNest for feedback, bug reports, feature requests, partnerships, or support.",
  },
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_34px_rgba(99,102,241,0.08)] sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-100/30 via-purple-50/20 to-cyan-100/30" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-linear-to-br from-indigo-200/15 to-violet-200/15 blur-3xl" />
      <div className="relative">
      <p className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
        Contact ToolNest
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">We&apos;d love your feedback</h1>

      <div className="gradient-divider mt-6" />
      <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        <p>
          We value your feedback and are here to help. Whether you have a question about a tool, want to report an issue, suggest a new feature, or explore collaboration opportunities, please do not hesitate to contact us.
        </p>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Email Us</h2>
          <p className="mt-2">
            For general inquiries and feedback:
            <a href="mailto:chaudharyjj87@gmail.com" className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700">chaudharyjj87@gmail.com</a>
          </p>
          <p className="mt-1">
            For privacy-related questions:
            <a href="mailto:chaudharyjj87@gmail.com" className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700">chaudharyjj87@gmail.com</a>
          </p>
          <p className="mt-1">
            For legal and terms inquiries:
            <a href="mailto:chaudharyjj87@gmail.com" className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700">chaudharyjj87@gmail.com</a>
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">What We Can Help With</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Bug reports:</strong> Found a tool that produces incorrect output or has a UI issue? Let us know the tool name, your input, and the expected versus actual result.</li>
            <li><strong>Feature requests:</strong> Have an idea for a new tool or an improvement to an existing one? We prioritize features based on user demand and practical impact.</li>
            <li><strong>Content corrections:</strong> If you spot inaccurate information in our educational content, we welcome corrections and will credit contributors when appropriate.</li>
            <li><strong>Collaboration:</strong> Interested in partnering, guest content, or integration opportunities? Reach out with details about your project.</li>
          </ul>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Response Time</h2>
          <p className="mt-2">
            We aim to respond to all inquiries within 2–3 business days. For urgent matters related to privacy or security, please include &quot;URGENT&quot; in your subject line.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Related Pages</h2>
          <p className="mt-2">
            You may also find answers in our{" "}
            <Link href="/about" className="font-semibold text-indigo-600 hover:text-indigo-700">About page</Link>,{" "}
            <Link href="/privacy-policy" className="font-semibold text-indigo-600 hover:text-indigo-700">Privacy Policy</Link>,{" "}
            <Link href="/terms-of-service" className="font-semibold text-indigo-600 hover:text-indigo-700">Terms of Service</Link>, or{" "}
            <Link href="/disclaimer" className="font-semibold text-indigo-600 hover:text-indigo-700">Disclaimer</Link>.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
