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
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNest Disclaimer",
    description: "Read the ToolNest disclaimer for tool output accuracy, liability limits, and third-party content notices.",
  },
};

export default function DisclaimerPage() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_12px_34px_rgba(79,70,229,0.1)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-indigo-100/35 via-sky-100/20 to-cyan-100/35" />
      <div className="relative">
      <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">Legal</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Disclaimer</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: February 16, 2026</p>

      <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700 sm:text-base">
        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">General Information</h2>
          <p className="mt-2">
            The information and tool outputs provided on ToolNest are for general informational and productivity purposes only. While we strive to keep the tools accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, tools, or outputs contained on the website.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Tool Output Accuracy</h2>
          <p className="mt-2">
            All tools on ToolNest run entirely in your browser using client-side JavaScript. Outputs are generated programmatically and should be treated as starting points, not definitive or authoritative results. You are solely responsible for verifying and validating all tool outputs before using them in any professional, legal, financial, security, or production context.
          </p>
          <p className="mt-2">
            For example, password strength evaluations are based on heuristic checks and should not be treated as definitive security assessments. SEO-related tools provide guidance based on general best practices and may not reflect the latest search engine algorithm changes.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">No Professional Advice</h2>
          <p className="mt-2">
            Nothing on this website constitutes professional advice, including but not limited to legal, financial, security, or technical consulting advice. If you need specialized guidance, consult a qualified professional in the relevant field.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Third-Party Content and Advertisements</h2>
          <p className="mt-2">
            ToolNest may display third-party advertisements through Google AdSense and similar platforms. We do not endorse or guarantee any products, services, or claims made in third-party advertisements. Any interaction with advertisers is at your own risk and subject to the advertiser&apos;s terms and policies.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">External Links</h2>
          <p className="mt-2">
            This website may contain links to external websites that are not operated by us. We have no control over the content, privacy policies, or practices of third-party sites and accept no responsibility for them. We encourage users to read the terms and privacy policies of any external site they visit.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Limitation of Liability</h2>
          <p className="mt-2">
            In no event shall ToolNest, its owners, operators, or contributors be liable for any loss or damage, including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from the use of the Site or reliance on any tool output.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Changes to This Disclaimer</h2>
          <p className="mt-2">
            We reserve the right to update this Disclaimer at any time. Changes will be reflected on this page with a revised date. By continuing to use the Site, you agree to be bound by the updated Disclaimer.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Related Policies</h2>
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
