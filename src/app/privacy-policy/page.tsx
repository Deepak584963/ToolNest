import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for ToolNest covering data collection, cookies, advertising, and user rights.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "ToolNest Privacy Policy",
    description: "Read how ToolNest handles privacy, cookies, analytics, and advertising disclosures.",
    url: "/privacy-policy",
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNest Privacy Policy",
    description: "Read how ToolNest handles privacy, cookies, analytics, and advertising disclosures.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_34px_rgba(99,102,241,0.08)] sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-100/30 via-purple-50/20 to-cyan-100/30" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-linear-to-br from-indigo-200/15 to-violet-200/15 blur-3xl" />
      <div className="relative">
      <p className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
        Legal
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: February 16, 2026</p>

      <div className="gradient-divider mt-6" />`n        <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">1. Introduction</h2>
          <p className="mt-2">
            ToolNest (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website located at tool-nest.tech (the &quot;Site&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Site. By using ToolNest, you consent to the practices described in this policy. If you do not agree with the terms of this policy, please do not access the Site.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">2. Information We Collect</h2>
          <p className="mt-2">
            ToolNest is designed with a client-side processing model. Most tool inputs are handled directly in your browser and are never transmitted to our servers. We do not require account creation or login.
          </p>
          <p className="mt-2">We may automatically collect certain information when you visit the Site, including:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring and exit pages</li>
            <li>Pages and tools visited, and time spent on each</li>
            <li>Date and time of access</li>
            <li>Anonymized IP address</li>
            <li>Device type and screen resolution</li>
          </ul>
          <p className="mt-2">
            This data is collected through analytics services and is used solely to understand usage patterns and improve the Site. We do not collect names, email addresses, or payment information through normal Site use.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">3. Cookies and Tracking Technologies</h2>
          <p className="mt-2">
            Cookies are small data files stored on your device. We and our partners use cookies, web beacons, and similar technologies for the following purposes:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Essential cookies:</strong> Required for basic site functionality such as consent preferences.</li>
            <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with the Site by collecting aggregate, anonymous data.</li>
            <li><strong>Advertising cookies:</strong> Used by advertising partners, including Google AdSense, to serve relevant advertisements and measure ad campaign performance.</li>
          </ul>
          <p className="mt-2">
            You may control cookie preferences through the consent banner displayed on first visit, or by adjusting your browser settings. Disabling cookies may affect your experience on the Site.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">4. Google AdSense and Third-Party Advertising</h2>
          <p className="mt-2">
            We use Google AdSense to display advertisements on the Site. Google AdSense uses cookies to serve ads based on your prior visits to this Site and other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your browsing history.
          </p>
          <p className="mt-2">
            You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="font-semibold text-indigo-700 hover:text-indigo-800" target="_blank" rel="noopener noreferrer">Google&apos;s Ads Settings</a>. Alternatively, you may opt out of third-party vendor cookies by visiting the <a href="https://www.aboutads.info/choices/" className="font-semibold text-indigo-700 hover:text-indigo-800" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance opt-out page</a>.
          </p>
          <p className="mt-2">
            For more information about how Google uses data, please review the <a href="https://policies.google.com/technologies/partner-sites" className="font-semibold text-indigo-700 hover:text-indigo-800" target="_blank" rel="noopener noreferrer">Google Privacy &amp; Terms page</a>.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">5. How We Use Your Information</h2>
          <p className="mt-2">We use the information collected for the following purposes:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>To operate, maintain, and improve the Site and its tools</li>
            <li>To monitor aggregate usage trends and website performance</li>
            <li>To detect and prevent technical issues, abuse, or fraud</li>
            <li>To serve relevant advertisements through our advertising partners</li>
            <li>To comply with legal obligations and enforce our Terms of Service</li>
          </ul>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">6. Data Sharing and Disclosure</h2>
          <p className="mt-2">
            ToolNest does not sell, trade, or rent your personal data to third parties. We may share anonymized, aggregated data with analytics and advertising partners. We may disclose information if required by law, court order, or governmental request, or to protect the rights, safety, or property of ToolNest or its users.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">7. Data Security</h2>
          <p className="mt-2">
            We implement reasonable technical and organizational measures to protect the information we collect. However, no method of electronic transmission or storage is completely secure. We cannot guarantee absolute security of your data.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">8. Children&apos;s Privacy</h2>
          <p className="mt-2">
            ToolNest is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we learn that we have inadvertently collected such information, we will take steps to delete it promptly.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">9. Your Rights</h2>
          <p className="mt-2">Depending on your jurisdiction, you may have the right to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Withdraw consent at any time (without affecting prior lawful processing)</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at the email address listed below.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">10. External Links</h2>
          <p className="mt-2">
            The Site may contain links to third-party websites or resources. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of every site you visit.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">11. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised &quot;Last updated&quot; date. Your continued use of the Site after changes are posted constitutes acceptance of the revised policy.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">12. Contact Us</h2>
          <p className="mt-2">
            If you have any questions or concerns regarding this Privacy Policy, please contact us at
            <a href="mailto:chaudharyjj87@gmail.com" className="ml-1 font-semibold text-indigo-700 hover:text-indigo-800">
              chaudharyjj87@gmail.com
            </a>.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
