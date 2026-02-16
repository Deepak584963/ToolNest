import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service governing your use of ToolNest online tools and website content.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return (
    <section className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: February 16, 2026</p>

      <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700 sm:text-base">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing or using ToolNest (&quot;the Site&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to all Terms, you must discontinue use of the Site immediately. These Terms apply to all visitors, users, and anyone who accesses the Site.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">2. Description of Service</h2>
          <p className="mt-2">
            ToolNest provides free, browser-based online tools and utilities for text processing, SEO analysis, developer workflows, and content optimization. All tools run client-side in your browser and do not require account creation, login, or payment. The Site also provides educational content related to each tool&apos;s use cases and best practices.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">3. Use License and Restrictions</h2>
          <p className="mt-2">You are granted a limited, non-exclusive, non-transferable license to use the Site for personal and lawful purposes. You agree not to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Use the Site for any unlawful purpose or in violation of applicable laws</li>
            <li>Attempt to disrupt, overload, or interfere with the Site&apos;s functionality or infrastructure</li>
            <li>Use automated scripts, bots, or scrapers to access the Site in a manner that degrades experience for other users</li>
            <li>Reproduce, distribute, or create derivative works from the Site&apos;s content without written permission</li>
            <li>Reverse-engineer, decompile, or attempt to extract source code from proprietary portions of the Site</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">4. Tool Output Disclaimer</h2>
          <p className="mt-2">
            Tool outputs are generated programmatically on the client side and provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. While we strive for accuracy, we make no warranties or representations regarding the correctness, completeness, or reliability of any output. You are solely responsible for reviewing, validating, and testing all tool outputs before using them in production, legal, financial, or business-critical contexts.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">5. Intellectual Property</h2>
          <p className="mt-2">
            All content, design, graphics, code, and trademarks displayed on the Site are the property of ToolNest or its licensors and are protected by intellectual property laws. Tool outputs generated from your input remain your property. However, the tools themselves, their interfaces, and accompanying educational content may not be copied or redistributed without permission.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">6. Third-Party Content and Links</h2>
          <p className="mt-2">
            The Site may contain links to external websites and display third-party advertisements (including Google AdSense). We are not responsible for the content, accuracy, or practices of third-party sites. Interactions with advertisers or third parties through the Site are solely between you and the third party.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">7. Limitation of Liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, ToolNest and its owners, operators, and contributors shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Site, its tools, or reliance on any tool output. This includes, without limitation, damages for loss of data, revenue, profits, business opportunities, or goodwill.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">8. Indemnification</h2>
          <p className="mt-2">
            You agree to indemnify and hold harmless ToolNest, its owners, operators, and contributors from and against any claims, losses, liabilities, damages, costs, or expenses (including reasonable attorney&apos;s fees) arising from your use of the Site or violation of these Terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">9. Modifications to Service and Terms</h2>
          <p className="mt-2">
            We reserve the right to modify, suspend, or discontinue any aspect of the Site at any time without notice. We may also update these Terms from time to time. Changes will be posted on this page with a revised date. Continued use of the Site after changes are posted constitutes your acceptance of the revised Terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">10. Governing Law</h2>
          <p className="mt-2">
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ToolNest operates, without regard to conflict of law provisions. Any disputes arising from these Terms shall be resolved in the appropriate courts of that jurisdiction.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">11. Contact</h2>
          <p className="mt-2">
            Questions or concerns about these Terms of Service can be directed to
            <a href="mailto:legal@toolnest.dev" className="ml-1 font-semibold text-indigo-700 hover:text-indigo-800">
              legal@toolnest.dev
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
