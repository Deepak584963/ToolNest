import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for ToolNest regarding tool accuracy, third-party content, and liability limitations.",
  alternates: {
    canonical: "/disclaimer",
  },
  openGraph: {
    title: "ToolNest Disclaimer",
    description: "Read the ToolNest disclaimer for tool output accuracy, liability limits, and third-party content notices.",
    url: "/disclaimer",
    siteName: siteConfig.name,
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNest Disclaimer",
    description: "Read the ToolNest disclaimer for tool output accuracy, liability limits, and third-party content notices.",
    site: "@toolnest",
  },
};

export default function DisclaimerPage() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_34px_rgba(99,102,241,0.08)] sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-100/30 via-purple-50/20 to-cyan-100/30" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-linear-to-br from-indigo-200/15 to-violet-200/15 blur-3xl" />
      <div className="relative">
      <p className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
        Legal
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Disclaimer</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: February 16, 2026</p>

      <div className="gradient-divider mt-6" />`n        <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">General Information</h2>
          <p className="mt-2">
            The information and tool outputs provided on ToolNest are for general informational and productivity purposes only. While we strive to keep the tools accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, tools, or outputs contained on the website.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Tool Output Accuracy</h2>
          <p className="mt-2">
            All tools on ToolNest run entirely in your browser using client-side JavaScript. Outputs are generated programmatically and should be treated as starting points, not definitive or authoritative results. You are solely responsible for verifying and validating all tool outputs before using them in any professional, legal, financial, security, or production context.
          </p>
          <p className="mt-2">
            For example, password strength evaluations are based on heuristic checks and should not be treated as definitive security assessments. SEO-related tools provide guidance based on general best practices and may not reflect the latest search engine algorithm changes.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">No Professional Advice</h2>
          <p className="mt-2">
            Nothing on this website constitutes professional advice, including but not limited to legal, financial, security, or technical consulting advice. If you need specialized guidance, consult a qualified professional in the relevant field.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Third-Party Content and Advertisements</h2>
          <p className="mt-2">
            ToolNest may display third-party advertisements through Google AdSense and similar platforms. We do not endorse or guarantee any products, services, or claims made in third-party advertisements. Any interaction with advertisers is at your own risk and subject to the advertiser&apos;s terms and policies.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">External Links</h2>
          <p className="mt-2">
            This website may contain links to external websites that are not operated by us. We have no control over the content, privacy policies, or practices of third-party sites and accept no responsibility for them. We encourage users to read the terms and privacy policies of any external site they visit.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Limitation of Liability</h2>
          <p className="mt-2">
            In no event shall ToolNest, its owners, operators, or contributors be liable for any loss or damage, including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from the use of the Site or reliance on any tool output.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Changes to This Disclaimer</h2>
          <p className="mt-2">
            We reserve the right to update this Disclaimer at any time. Changes will be reflected on this page with a revised date. By continuing to use the Site, you agree to be bound by the updated Disclaimer.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Related Policies</h2>
          <p className="mt-2">
            Please also review our{" "}
            <Link href="/privacy-policy" className="font-semibold text-indigo-700 hover:text-indigo-800">Privacy Policy</Link> and{" "}
            <Link href="/terms-of-service" className="font-semibold text-indigo-700 hover:text-indigo-800">Terms of Service</Link> for complete legal information about using ToolNest.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
