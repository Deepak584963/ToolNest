export type Tool = {
  name: string;
  slug: string;
  category: "text" | "seo" | "dev";
  shortDescription: string;
  longDescription: string;
  keywords: string[];
};

type ToolProfile = {
  purpose: string;
  inputs: string;
  outputs: string;
  bestFor: string;
  workflow: string[];
  examples: string[];
  mistakes: string[];
  faqs: { question: string; answer: string }[];
  related: string[];
};

export const tools: Tool[] = [
  {
    name: "JSON Formatter & Validator",
    slug: "json-formatter-validator",
    category: "dev",
    shortDescription: "Format messy JSON and validate syntax with readable error guidance.",
    longDescription:
      "Validate raw JSON, auto-format indentation, and understand where syntax breaks before it reaches production.",
    keywords: ["json formatter", "json validator", "pretty json", "json error checker"],
  },
  {
    name: "Text to URL Slug Generator",
    slug: "text-to-url-slug-generator",
    category: "seo",
    shortDescription: "Convert titles into clean, SEO-friendly slugs in one click.",
    longDescription:
      "Generate lowercase, hyphenated slugs that are readable, consistent, and safe for URLs.",
    keywords: ["slug generator", "seo slug", "url slug tool", "title to slug"],
  },
  {
    name: "Meta Title & Description Preview",
    slug: "meta-title-description-preview",
    category: "seo",
    shortDescription: "Preview search snippets for desktop and mobile before publishing.",
    longDescription:
      "Craft metadata with length checks and visual SERP previews to improve click-through rates.",
    keywords: ["meta title", "meta description", "serp preview", "seo snippet tool"],
  },
  {
    name: "Robots.txt Generator",
    slug: "robots-txt-generator",
    category: "seo",
    shortDescription: "Build robots.txt rules with practical presets and crawl guidance.",
    longDescription:
      "Create a robots.txt file for common site types and avoid accidental indexing mistakes.",
    keywords: ["robots txt", "crawl rules", "seo technical", "search bot directives"],
  },
  {
    name: "Sitemap.xml Generator",
    slug: "sitemap-xml-generator",
    category: "seo",
    shortDescription: "Generate XML sitemaps for static websites using URL lists.",
    longDescription:
      "Create valid sitemap XML output with optional frequency and priority values for static pages.",
    keywords: ["sitemap generator", "xml sitemap", "static site seo", "seo indexing"],
  },
  {
    name: "Word Counter & Reading Time",
    slug: "word-counter-reading-time",
    category: "text",
    shortDescription: "Count words, characters, and estimate reading time with SEO hints.",
    longDescription:
      "Analyze writing length, readability pacing, and optimization opportunities for content teams.",
    keywords: ["word counter", "reading time", "content seo", "character count"],
  },
  {
    name: "Password Strength Checker",
    slug: "password-strength-checker",
    category: "dev",
    shortDescription: "Check password strength and get actionable improvement suggestions.",
    longDescription:
      "Evaluate entropy signals, identify weak patterns, and create stronger credential habits.",
    keywords: ["password checker", "password strength", "security utility", "strong password"],
  },
  {
    name: "UUID Generator",
    slug: "uuid-generator",
    category: "dev",
    shortDescription: "Generate bulk UUIDs and understand common UUID versions quickly.",
    longDescription:
      "Create unique IDs for APIs, databases, and distributed systems directly in the browser.",
    keywords: ["uuid generator", "uuid v4", "unique id", "developer tools"],
  },
  {
    name: "Base64 Encoder / Decoder",
    slug: "base64-encoder-decoder",
    category: "dev",
    shortDescription: "Encode or decode text and files in Base64 format instantly.",
    longDescription:
      "Transform text and small files to Base64 and decode payloads safely for debugging workflows.",
    keywords: ["base64 encode", "base64 decode", "data uri", "developer converter"],
  },
  {
    name: "CSS Minifier & Beautifier",
    slug: "css-minifier-beautifier",
    category: "dev",
    shortDescription: "Minify CSS for production or beautify compressed styles for editing.",
    longDescription:
      "Switch between compact and readable CSS formats using one side-by-side utility.",
    keywords: ["css minifier", "css beautifier", "frontend utility", "optimize css"],
  },
  {
    name: "Canonical URL Checker",
    slug: "canonical-url-checker",
    category: "seo",
    shortDescription: "Compare page URL and canonical target to catch indexing conflicts.",
    longDescription:
      "Detect canonical mismatches and prevent duplicate-content signals from confusing search engines.",
    keywords: ["canonical checker", "duplicate content", "technical seo", "canonical tag"],
  },
  {
    name: "Open Graph / Social Preview",
    slug: "open-graph-social-preview",
    category: "seo",
    shortDescription: "Preview social link cards using Open Graph style fields.",
    longDescription:
      "Test how your page appears when shared on social platforms and tune metadata for engagement.",
    keywords: ["open graph", "social preview", "og tags", "share card tool"],
  },
  {
    name: "Keyword Density Checker",
    slug: "keyword-density-checker",
    category: "seo",
    shortDescription: "Measure keyword frequency and identify over-optimization risks.",
    longDescription:
      "Analyze density percentages and term distribution to write natural, intent-aligned content.",
    keywords: ["keyword density", "seo content", "keyword frequency", "on page seo"],
  },
  {
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum-generator",
    category: "text",
    shortDescription: "Generate placeholder text by words, sentences, or paragraphs.",
    longDescription:
      "Produce structured filler copy for wireframes, mockups, and UI content stress testing.",
    keywords: ["lorem ipsum", "placeholder text", "dummy text generator", "ui content"],
  },
  {
    name: "Text Cleaner",
    slug: "text-cleaner",
    category: "text",
    shortDescription: "Remove extra spaces, line noise, and hidden junk characters.",
    longDescription:
      "Clean pasted text from docs, spreadsheets, and AI drafts before publishing or processing.",
    keywords: ["text cleaner", "remove extra spaces", "cleanup text", "content utility"],
  },
];

const toolProfiles: Record<string, ToolProfile> = {
  "json-formatter-validator": {
    purpose:
      "This tool parses JSON input in real time, normalizes indentation, and reports parsing failures with practical explanations. It helps developers move faster when APIs fail or configuration files break because of one missing comma or quote.",
    inputs: "Raw JSON from APIs, logs, config files, webhook payloads, or local mock data.",
    outputs: "Beautified JSON output, validation status, and error location details.",
    bestFor: "frontend and backend debugging, API QA, docs preparation, and schema reviews.",
    workflow: [
      "Paste JSON and pick indentation depth for readability.",
      "Run validate to parse safely in the browser without network calls.",
      "If invalid, inspect the exact parser message and surrounding context.",
      "Copy corrected output for use in code, tests, or API clients.",
    ],
    examples: [
      "An API response fails due to a trailing comma after the last property.",
      "A deployment config uses single quotes instead of double quotes.",
      "A webhook payload contains escaped line breaks that need normalization.",
    ],
    mistakes: [
      "Confusing JSON with JavaScript object literals that allow comments.",
      "Forgetting that property names must be quoted strings.",
      "Assuming valid minified JSON is unreadable when it simply needs formatting.",
    ],
    faqs: [
      { question: "Does formatting change values?", answer: "No. It only changes whitespace and line breaks while preserving data." },
      { question: "Can I validate large payloads?", answer: "Yes for typical browser-safe sizes. Extremely large files may slow down in older devices." },
      { question: "Why does JSON fail when JavaScript works?", answer: "JSON is stricter than JavaScript syntax and does not allow comments or trailing commas." },
    ],
    related: ["base64-encoder-decoder", "uuid-generator", "text-cleaner"],
  },
  "text-to-url-slug-generator": {
    purpose:
      "This tool converts plain language titles into clean URL slugs that are lowercase, hyphen-separated, and easier for users and crawlers to read. It standardizes naming across blogs, docs, and category pages.",
    inputs: "Headlines, article titles, product names, and category labels.",
    outputs: "SEO-safe slug strings with optional stop-word trimming.",
    bestFor: "blog publishing workflows, CMS migrations, and static site content planning.",
    workflow: [
      "Enter or paste a title with punctuation, symbols, or mixed case.",
      "Normalize to lowercase and replace spacing with single hyphens.",
      "Strip unsupported characters and collapse duplicate separators.",
      "Copy slug and use it in routes, canonical tags, and sitemap entries.",
    ],
    examples: [
      "Turning 'Top 10 JavaScript Tips for 2026!' into a concise route slug.",
      "Converting multilingual draft titles during content migration.",
      "Standardizing URLs across blog authors and editors.",
    ],
    mistakes: [
      "Leaving uppercase and symbols that create inconsistent URLs.",
      "Keyword stuffing slugs until they become unreadable.",
      "Changing established slugs without redirects.",
    ],
    faqs: [
      { question: "Should slugs be short?", answer: "Yes. Keep them meaningful but concise so humans and search engines can scan intent quickly." },
      { question: "Do stop words always hurt SEO?", answer: "Not always. Remove only when clarity improves." },
      { question: "Can I use dates in slugs?", answer: "Use dates only when they add context and won’t make the URL feel outdated." },
    ],
    related: ["meta-title-description-preview", "keyword-density-checker", "canonical-url-checker"],
  },
  "meta-title-description-preview": {
    purpose:
      "This preview utility simulates desktop and mobile search snippets so you can tune metadata length and messaging before publishing. Better snippets often increase click-through rate without changing rankings directly.",
    inputs: "Meta title, meta description, optional URL path, and brand name.",
    outputs: "Desktop and mobile snippet previews plus length indicators.",
    bestFor: "SEO on-page optimization, content refreshes, and launch QA.",
    workflow: [
      "Draft a compelling title focused on search intent and topic value.",
      "Write a concise description that sets expectations clearly.",
      "Check truncation risks on desktop and mobile previews.",
      "Iterate wording for clarity, benefit, and brand consistency.",
    ],
    examples: [
      "Testing two title angles for the same landing page before publishing.",
      "Preventing description truncation on mobile results.",
      "Aligning metadata language with ad copy and social snippets.",
    ],
    mistakes: [
      "Stuffing too many keywords into a title tag.",
      "Reusing identical descriptions across multiple pages.",
      "Ignoring mobile preview where truncation is more common.",
    ],
    faqs: [
      { question: "Is there a perfect title length?", answer: "There is no guaranteed length, but concise titles under roughly 60 characters reduce truncation risk." },
      { question: "Should every page have unique metadata?", answer: "Yes. Unique metadata improves relevance and helps avoid cannibalization." },
      { question: "Can search engines rewrite snippets?", answer: "Yes. Engines may rewrite snippets, but strong metadata still improves your baseline." },
    ],
    related: ["text-to-url-slug-generator", "open-graph-social-preview", "keyword-density-checker"],
  },
  "robots-txt-generator": {
    purpose:
      "This generator creates a valid robots.txt file using practical presets so site owners can control crawler access without memorizing directive syntax. It reduces accidental indexing and crawl-budget waste.",
    inputs: "Site type preset, disallow paths, allow paths, and sitemap URL.",
    outputs: "Ready-to-copy robots.txt content with plain-language explanations.",
    bestFor: "technical SEO setup for blogs, docs sites, e-commerce, and staging environments.",
    workflow: [
      "Choose a preset that matches your project structure.",
      "Add disallow paths for admin, private, or duplicate sections.",
      "Keep key public pages crawlable and include sitemap location.",
      "Review output and publish in your site root.",
    ],
    examples: [
      "Blocking /admin and /checkout while allowing product pages.",
      "Protecting staging environments from indexing.",
      "Declaring sitemap location for faster discovery.",
    ],
    mistakes: [
      "Blocking the entire site accidentally with `Disallow: /`.",
      "Assuming robots.txt hides confidential data.",
      "Forgetting to update rules after site migrations.",
    ],
    faqs: [
      { question: "Does robots.txt deindex pages?", answer: "No. It controls crawling, not guaranteed indexing removal." },
      { question: "Should I block CSS and JS?", answer: "Usually no. Crawlers need assets to render pages properly." },
      { question: "Where do I place robots.txt?", answer: "At your root domain path: /robots.txt." },
    ],
    related: ["sitemap-xml-generator", "canonical-url-checker", "meta-title-description-preview"],
  },
  "sitemap-xml-generator": {
    purpose:
      "This tool converts a list of URLs into valid sitemap XML for static sites, helping search engines discover and recrawl key pages more efficiently.",
    inputs: "Absolute URLs, optional change frequency, priority, and last modified date.",
    outputs: "Well-formed sitemap XML suitable for direct upload.",
    bestFor: "Next.js static sites, docs portals, portfolio sites, and niche blogs.",
    workflow: [
      "Paste one canonical URL per line.",
      "Select optional metadata values where useful.",
      "Generate XML and verify all URLs are absolute and indexable.",
      "Upload sitemap file and reference it in robots.txt.",
    ],
    examples: [
      "Publishing a sitemap for a 40-page marketing website.",
      "Regenerating sitemap after adding new category pages.",
      "Cleaning duplicate URL variants before submission.",
    ],
    mistakes: [
      "Including redirected or noindex URLs in the sitemap.",
      "Mixing HTTP and HTTPS URLs.",
      "Publishing relative paths instead of absolute links.",
    ],
    faqs: [
      { question: "Do I need priority values?", answer: "Optional. Most teams leave defaults unless they have a strong reason to tune them." },
      { question: "How often should I update sitemap.xml?", answer: "Regenerate whenever significant URL additions or removals happen." },
      { question: "Can I include canonicalized duplicates?", answer: "No. Use only preferred canonical URLs." },
    ],
    related: ["robots-txt-generator", "canonical-url-checker", "text-to-url-slug-generator"],
  },
  "word-counter-reading-time": {
    purpose:
      "This writing utility counts words, characters, sentences, and approximate reading time while surfacing lightweight SEO tips that keep copy concise and useful.",
    inputs: "Articles, landing page drafts, product descriptions, and social copy.",
    outputs: "Word metrics, reading time estimate, and quality suggestions.",
    bestFor: "bloggers, students, technical writers, and SEO content editors.",
    workflow: [
      "Paste draft content and review headline-to-body balance.",
      "Check total words and estimated reading duration.",
      "Use tips to improve clarity, scannability, and keyword placement.",
      "Revise and compare versions quickly.",
    ],
    examples: [
      "Keeping FAQ answers concise for support docs.",
      "Matching article length to search intent depth.",
      "Reducing bloated intros in landing pages.",
    ],
    mistakes: [
      "Treating reading time as exact for every audience.",
      "Padding words to hit arbitrary targets.",
      "Ignoring paragraph structure and readability flow.",
    ],
    faqs: [
      { question: "How is reading time calculated?", answer: "A common baseline uses average adult reading speed, then rounds to practical minutes." },
      { question: "Is longer always better for SEO?", answer: "No. Intent match and quality matter more than raw length." },
      { question: "Can this replace editorial review?", answer: "No. Use it as a fast signal, then apply human judgment." },
    ],
    related: ["keyword-density-checker", "text-cleaner", "meta-title-description-preview"],
  },
  "password-strength-checker": {
    purpose:
      "This checker evaluates password quality using length, character diversity, predictable pattern detection, and common weak-string checks, then suggests concrete improvements.",
    inputs: "Candidate passwords entered locally in your browser.",
    outputs: "Strength score, severity label, and fix suggestions.",
    bestFor: "individual account hygiene, onboarding flows, and security awareness.",
    workflow: [
      "Type a password candidate into the local checker.",
      "Inspect score contribution from length and entropy signals.",
      "Address warnings such as repetition, dictionary fragments, and year patterns.",
      "Regenerate a stronger phrase and verify improvement.",
    ],
    examples: [
      "Upgrading a reused password into a unique passphrase.",
      "Teaching teams why `Company2026!` is still weak.",
      "Testing policy compliance before deployment.",
    ],
    mistakes: [
      "Relying on symbol substitution only (like `a` to `@`).",
      "Using personal data such as birthdays or names.",
      "Reusing one strong password across many services.",
    ],
    faqs: [
      { question: "Are passwords stored?", answer: "No. Evaluation runs client-side only with no server submission." },
      { question: "Is length more important than symbols?", answer: "Length and unpredictability together provide the best practical improvement." },
      { question: "Should I use a manager?", answer: "Yes. Password managers help create and store unique credentials safely." },
    ],
    related: ["uuid-generator", "text-cleaner", "base64-encoder-decoder"],
  },
  "uuid-generator": {
    purpose:
      "This utility creates random UUIDs in bulk for IDs used in distributed apps, API payloads, testing fixtures, and logging correlation workflows.",
    inputs: "Requested quantity and UUID version preference guidance.",
    outputs: "Copy-ready UUID list with version notes.",
    bestFor: "backend APIs, client state keys, queue messages, and test data generation.",
    workflow: [
      "Select quantity and generate locally in browser.",
      "Choose v4 randomness for most modern app scenarios.",
      "Copy output as newline or comma-separated values.",
      "Use IDs in fixtures, seed scripts, and import pipelines.",
    ],
    examples: [
      "Generating 200 mock order IDs for QA.",
      "Creating deterministic-looking placeholders for UI states.",
      "Assigning collision-resistant IDs to client-side records.",
    ],
    mistakes: [
      "Using sequential integers where global uniqueness is required.",
      "Assuming UUIDs are secret tokens.",
      "Mixing ID formats inconsistently across services.",
    ],
    faqs: [
      { question: "Which UUID version should I use?", answer: "For most apps, v4 is a strong default because of high randomness and broad support." },
      { question: "Can UUIDs collide?", answer: "Theoretically yes, but practical collision probability for v4 is extremely low." },
      { question: "Are UUIDs safe for public URLs?", answer: "Yes for identifiers, but do not treat them as authorization secrets." },
    ],
    related: ["json-formatter-validator", "base64-encoder-decoder", "password-strength-checker"],
  },
  "base64-encoder-decoder": {
    purpose:
      "This converter encodes text or small files into Base64 and decodes Base64 payloads back into readable text, helping developers inspect transfer-safe formats.",
    inputs: "Plain text, Base64 text, or selected file input for encoding.",
    outputs: "Encoded/decoded result with quick copy workflow.",
    bestFor: "debugging API payloads, creating data URIs, and transport-safe conversion tests.",
    workflow: [
      "Choose text or file mode for the conversion task.",
      "Encode raw input to Base64 or decode existing payload.",
      "Validate output readability and expected format.",
      "Copy result for API clients, docs, or test scripts.",
    ],
    examples: [
      "Encoding SVG snippets to data URIs for prototypes.",
      "Decoding JWT segments for payload inspection (non-signature validation).",
      "Testing webhook payload transformations in QA.",
    ],
    mistakes: [
      "Assuming Base64 equals encryption.",
      "Decoding binary payloads as plain text without format checks.",
      "Forgetting Unicode-safe conversion for non-ASCII text.",
    ],
    faqs: [
      { question: "Is Base64 secure?", answer: "No. It is an encoding format, not encryption." },
      { question: "Why does decoded text look broken?", answer: "Input may represent binary content or use a different character encoding." },
      { question: "Can I encode files client-side?", answer: "Yes. Small files are ideal for quick browser-based conversions." },
    ],
    related: ["json-formatter-validator", "css-minifier-beautifier", "text-cleaner"],
  },
  "css-minifier-beautifier": {
    purpose:
      "This side-by-side CSS utility minifies styles for production payload reduction and beautifies compressed CSS for debugging, review, and team collaboration.",
    inputs: "Raw or minified CSS text.",
    outputs: "Minified output, beautified output, and side-by-side comparison.",
    bestFor: "frontend optimization, performance tuning, and debugging third-party style bundles.",
    workflow: [
      "Paste CSS from source files or build outputs.",
      "Run minify to remove unnecessary whitespace and comments.",
      "Run beautify to restore readable formatting and blocks.",
      "Compare outputs and copy the desired version.",
    ],
    examples: [
      "Compressing landing page CSS before deployment.",
      "Readable reformatting of minified vendor CSS for issue triage.",
      "Quickly validating brace structure after manual edits.",
    ],
    mistakes: [
      "Using minified CSS in active development where readability matters.",
      "Removing all comments when licensing notices are legally required.",
      "Treating minification as a replacement for proper code splitting.",
    ],
    faqs: [
      { question: "Does minification change rendering?", answer: "It should not when done correctly; it removes non-functional whitespace and comments." },
      { question: "Can I beautify invalid CSS?", answer: "Formatting still works best when braces and semicolons are structurally valid." },
      { question: "Is this better than build tools?", answer: "Use this for quick tasks; production pipelines should still use automated build tooling." },
    ],
    related: ["base64-encoder-decoder", "text-cleaner", "json-formatter-validator"],
  },
  "canonical-url-checker": {
    purpose:
      "This checker compares an actual page URL with a canonical target and explains whether the canonical relationship is valid, risky, or potentially conflicting.",
    inputs: "Current URL, canonical URL value, and optional indexability flags.",
    outputs: "Status verdict with technical explanation and remediation tips.",
    bestFor: "preventing duplicate-content confusion and consolidating ranking signals.",
    workflow: [
      "Paste the page URL and canonical URL.",
      "Normalize protocol, host, and trailing slash differences.",
      "Review mismatch diagnostics including cross-domain and path conflicts.",
      "Apply fixes in page head tags and internal linking patterns.",
    ],
    examples: [
      "Detecting canonical to non-equivalent category page.",
      "Comparing HTTP variant canonicalized to HTTPS preferred URL.",
      "Auditing blog pagination canonical strategy.",
    ],
    mistakes: [
      "Pointing canonical to unrelated content.",
      "Using canonical chains instead of a direct preferred URL.",
      "Ignoring canonical consistency in sitemaps.",
    ],
    faqs: [
      { question: "Can canonical tags force indexing?", answer: "No. They are hints, not absolute directives." },
      { question: "Should canonical be absolute?", answer: "Absolute URLs reduce ambiguity and are usually preferred." },
      { question: "Can cross-domain canonical work?", answer: "Yes when content ownership and duplication intent are legitimate." },
    ],
    related: ["sitemap-xml-generator", "robots-txt-generator", "meta-title-description-preview"],
  },
  "open-graph-social-preview": {
    purpose:
      "This tool previews social cards from Open Graph-style fields so teams can tune titles, descriptions, and images before links are shared publicly.",
    inputs: "OG title, description, URL, site name, and image URL.",
    outputs: "Visual preview card and field completeness checks.",
    bestFor: "marketing launches, blog distribution, and social engagement optimization.",
    workflow: [
      "Add title and description focused on social context.",
      "Provide a high-quality image URL with correct aspect ratio.",
      "Review preview layout and text clipping risk.",
      "Align social metadata with page intent and CTAs.",
    ],
    examples: [
      "Testing share card messaging for product announcement posts.",
      "Verifying image-safe areas to avoid cropped headlines.",
      "Adapting tone between search snippets and social copy.",
    ],
    mistakes: [
      "Using low-resolution images that look blurry in feeds.",
      "Repeating the exact same title for every page.",
      "Ignoring platform cache refresh delays after updates.",
    ],
    faqs: [
      { question: "Do all networks use identical previews?", answer: "No. Most respect OG basics but rendering details vary by platform." },
      { question: "What image ratio works best?", answer: "Wide social card ratios are usually safer for mainstream platforms." },
      { question: "Should OG and meta title be the same?", answer: "They can be similar, but social messaging often performs better with context-specific wording." },
    ],
    related: ["meta-title-description-preview", "text-to-url-slug-generator", "keyword-density-checker"],
  },
  "keyword-density-checker": {
    purpose:
      "This analyzer calculates term frequency and density percentages so writers can detect underused focus phrases or over-optimized copy that feels unnatural.",
    inputs: "Body text and optional target keyword phrase.",
    outputs: "Density table, top repeated terms, and optimization guidance.",
    bestFor: "SEO content editing, topic targeting, and readability balancing.",
    workflow: [
      "Paste draft copy and enter optional target keyword.",
      "Tokenize words, remove common stop words, and count occurrences.",
      "Review top term density and contextual relevance.",
      "Revise language to match intent naturally.",
    ],
    examples: [
      "Reducing repetitive product terms on commercial pages.",
      "Checking whether a target phrase appears in key sections.",
      "Comparing old and revised drafts for balance.",
    ],
    mistakes: [
      "Optimizing only for density while ignoring search intent.",
      "Repeating exact-match keywords unnaturally.",
      "Ignoring synonyms and semantic variations.",
    ],
    faqs: [
      { question: "What is ideal keyword density?", answer: "There is no universal ideal. Natural language and intent coverage matter more." },
      { question: "Should I remove all repeated words?", answer: "No. Repetition is normal; focus on avoiding awkward overuse." },
      { question: "Does density guarantee ranking?", answer: "No. It is one small on-page signal among many factors." },
    ],
    related: ["word-counter-reading-time", "meta-title-description-preview", "text-to-url-slug-generator"],
  },
  "lorem-ipsum-generator": {
    purpose:
      "This generator creates structured placeholder text by words, sentences, or paragraphs so designers and developers can test layouts before final copy is ready.",
    inputs: "Mode selection, quantity, and optional startup phrase.",
    outputs: "Clean placeholder text matching chosen format.",
    bestFor: "wireframes, UI prototypes, onboarding flows, and content stress testing.",
    workflow: [
      "Choose generation mode based on your design task.",
      "Set quantity for realistic block lengths.",
      "Generate text and preview how components wrap.",
      "Copy output into design systems or staging content.",
    ],
    examples: [
      "Testing card heights for variable-length descriptions.",
      "Creating paragraph placeholders for CMS templates.",
      "Stress-testing mobile typography spacing.",
    ],
    mistakes: [
      "Leaving placeholder text in production pages.",
      "Using unrealistic sentence lengths that hide layout issues.",
      "Generating too little content for meaningful QA.",
    ],
    faqs: [
      { question: "Can I start with classic lorem ipsum?", answer: "Yes. You can prepend the traditional opening when needed." },
      { question: "Is this only for designers?", answer: "No. Developers, PMs, and QA teams also use placeholder text heavily." },
      { question: "Should placeholder mirror final tone?", answer: "For better QA, rough length and structure should resemble final copy." },
    ],
    related: ["word-counter-reading-time", "text-cleaner", "meta-title-description-preview"],
  },
  "text-cleaner": {
    purpose:
      "This cleaning utility removes extra spaces, inconsistent line breaks, and hidden control characters from messy pasted text so it is easier to publish, parse, or process.",
    inputs: "Raw text from documents, spreadsheets, PDFs, and AI drafts.",
    outputs: "Normalized, cleaner text with optional transformations.",
    bestFor: "content prep, CSV cleanup, migration tasks, and code snippet hygiene.",
    workflow: [
      "Paste noisy text that contains odd spacing or hidden symbols.",
      "Apply cleanup options such as trim lines and collapse spaces.",
      "Review before-and-after text quality quickly.",
      "Copy clean output into CMS, docs, or dev tools.",
    ],
    examples: [
      "Fixing copied content from PDFs with broken whitespace.",
      "Removing zero-width characters that break search matching.",
      "Normalizing bullet lists before publishing.",
    ],
    mistakes: [
      "Blindly removing all line breaks from structured content.",
      "Not checking unicode punctuation after cleanup.",
      "Over-cleaning text that intentionally includes formatting.",
    ],
    faqs: [
      { question: "Will this change meaning?", answer: "It should preserve meaning while normalizing structure, but always review important legal or technical text." },
      { question: "What are junk characters?", answer: "They include control and zero-width symbols often introduced during copy-paste." },
      { question: "Can I clean multiline data?", answer: "Yes. It is designed for both single-line and paragraph-level content." },
    ],
    related: ["word-counter-reading-time", "keyword-density-checker", "json-formatter-validator"],
  },
};

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getRelatedTools(slug: string): Tool[] {
  const profile = toolProfiles[slug];
  if (!profile) return tools.filter((tool) => tool.slug !== slug).slice(0, 3);
  return profile.related.map((relatedSlug) => getToolBySlug(relatedSlug)).filter((tool): tool is Tool => Boolean(tool));
}

export function getToolFaqs(slug: string): { question: string; answer: string }[] {
  return toolProfiles[slug]?.faqs ?? [];
}

export function getToolArticleSections(slug: string) {
  const tool = getToolBySlug(slug);
  const profile = toolProfiles[slug];

  if (!tool || !profile) {
    return [] as { heading: string; content: string }[];
  }

  const workflowText = profile.workflow.map((step, index) => `${index + 1}. ${step}`).join(" ");
  const exampleText = profile.examples.join(" ");
  const mistakesText = profile.mistakes.join(" ");

  return [
    {
      heading: `What this ${tool.name} does`,
      content: `${profile.purpose} The goal is to remove friction from routine technical tasks so you can focus on decisions, not repetitive cleanup. Because everything runs client-side, your input remains in the browser session and never needs a backend call. This is especially useful for teams that handle private drafts, internal configs, or pre-release metadata where external processing is not preferred. In practical day-to-day work, this tool behaves like a fast utility layer between raw input and publish-ready output.`,
    },
    {
      heading: "When to use it",
      content: `Use this utility when speed and consistency matter more than heavy software setup. Typical inputs include: ${profile.inputs} Typical outputs include: ${profile.outputs} It is most useful for ${profile.bestFor}. Teams often run this step during editorial QA, pull-request review, release checklists, or migration prep. Running a lightweight check early can prevent hard-to-debug issues later, especially when the same content is reused across websites, documentation portals, and social surfaces.`,
    },
    {
      heading: "How it works",
      content: `The workflow is intentionally simple and deterministic so results are predictable: ${workflowText} The interface is built for short feedback loops: edit, evaluate, and copy. This reduces context switching and makes the output easy to share with teammates. For production workflows, treat this as a fast validation and transformation layer before your final build or publishing step. The most reliable pattern is to pair the generated output with one final human review for relevance, formatting, and policy compliance.`,
    },
    {
      heading: "Examples and practical scenarios",
      content: `Real-world usage usually appears in small but frequent moments that add up over time. Examples include: ${exampleText} In each case, the tool shortens the path from rough input to usable output. Instead of manually adjusting formatting or guessing whether data is valid, you get a repeatable process that is easy for new team members to adopt. This consistency becomes valuable when many contributors publish content or ship code changes on a regular cadence.`,
    },
    {
      heading: "Common mistakes to avoid",
      content: `The most common failures are process related, not technical limitations. Watch for these pitfalls: ${mistakesText} Another common issue is skipping final intent checks after mechanical cleanup. A technically valid result can still be misaligned with page goals, search intent, or brand tone. Build a quick habit: run the tool, review output, then verify context. This three-step loop keeps quality high without slowing down delivery.`,
    },
    {
      heading: "Best-practice checklist",
      content: `For reliable results, keep your input focused, avoid mixing unrelated tasks in one run, and save canonical final outputs in your content or code workflow. If your team has recurring use cases, document your preferred settings so everyone applies the same standards. Pair this utility with related tools for a full optimization pass and stronger internal linking strategy. Over time, this approach improves publishing quality, reduces avoidable errors, and supports a more scalable SEO and development process.`,
    },
    {
      heading: "How this tool fits real workflows",
      content: `Most teams get the highest value when this utility is used as a repeatable checkpoint instead of a one-time helper. For example, content teams can run this before publishing metadata, developers can run it during pull request review, and technical SEO teams can run it during routine site audits. The payoff is consistency: fewer edge-case regressions, fewer manual fixes after release, and better alignment between contributors. A lightweight but dependable utility layer becomes a force multiplier when multiple people edit technical content across pages, repositories, and channels.`,
    },
    {
      heading: "Final recommendations",
      content: `Treat this tool as part of a broader quality system rather than an isolated action. Pair outputs with internal linking checks, metadata review, and content intent validation to maximize long-term impact. Keep examples and preferred settings documented for your team so onboarding is easier and results stay consistent across projects. If a page or payload is business-critical, perform one final manual review after using the generated output. This balanced approach preserves speed while reducing avoidable mistakes, improving user trust, and strengthening technical SEO and developer reliability over time.`,
    },
  ];
}
