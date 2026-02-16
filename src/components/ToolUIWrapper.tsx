"use client";

import { ChangeEvent, useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

type ToolUIWrapperProps = {
  slug: string;
};

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(79,70,229,0.08)]">
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function OutputBlock({ value }: { value: string }) {
  return (
    <div className="space-y-3">
      <textarea
        value={value}
        readOnly
        className="h-48 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800"
      />
      <CopyButton value={value} />
    </div>
  );
}

function JsonFormatterValidator() {
  const [input, setInput] = useState('{"name":"ToolNest","version":1}');
  const [indent, setIndent] = useState(2);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleRun = () => {
    try {
      const parsed = JSON.parse(input);
      setResult(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid JSON input";
      setError(`Validation failed: ${message}`);
      setResult("");
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Input JSON">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-48 w-full rounded-xl border border-slate-200 p-3 text-sm" />
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm text-slate-600">Indent:</label>
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="rounded-lg border border-slate-200 px-2 py-1 text-sm">
            {[2, 4, 6].map((step) => (
              <option key={step} value={step}>
                {step} spaces
              </option>
            ))}
          </select>
          <button type="button" onClick={handleRun} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Format & Validate
          </button>
        </div>
      </Panel>
      <Panel title="Output">
        {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : <OutputBlock value={result} />}
      </Panel>
    </div>
  );
}

function TextToSlugGenerator() {
  const [text, setText] = useState("");
  const slug = useMemo(
    () =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
    [text],
  );

  return (
    <div className="space-y-4">
      <Panel title="Source text">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter title here" className="h-36 w-full rounded-xl border border-slate-200 p-3 text-sm" />
      </Panel>
      <Panel title="Generated slug">
        <OutputBlock value={slug} />
      </Panel>
    </div>
  );
}

function MetaPreviewTool() {
  const [title, setTitle] = useState("ToolNest — Free Online Tech Tools");
  const [description, setDescription] = useState("Use fast, SEO-friendly utilities for developers, bloggers, and site owners.");
  const [url, setUrl] = useState("https://toolnest.example/tools/meta-title-description-preview");

  const titleWarn = title.length > 58;
  const descWarn = description.length > 155;

  const Card = ({ compact = false }: { compact?: boolean }) => (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 ${compact ? "max-w-sm" : ""}`}>
      <p className="truncate text-xs text-emerald-700">{url}</p>
      <p className="mt-1 line-clamp-2 text-lg font-medium leading-tight text-blue-700">{title}</p>
      <p className="mt-1 line-clamp-3 text-sm text-slate-600">{description}</p>
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Meta input">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Meta title" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Meta description" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="URL" />
          <p className={`text-xs ${titleWarn ? "text-rose-600" : "text-emerald-600"}`}>Title length: {title.length}/58</p>
          <p className={`text-xs ${descWarn ? "text-rose-600" : "text-emerald-600"}`}>Description length: {description.length}/155</p>
        </div>
      </Panel>
      <Panel title="Search preview">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Desktop</p>
        <Card />
        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile</p>
        <Card compact />
      </Panel>
    </div>
  );
}

const ROBOTS_PRESETS: Record<string, string[]> = {
  blog: ["User-agent: *", "Allow: /", "Disallow: /wp-admin/", "Disallow: /private/"],
  ecommerce: ["User-agent: *", "Allow: /", "Disallow: /cart/", "Disallow: /checkout/", "Disallow: /account/"],
  staging: ["User-agent: *", "Disallow: /"],
};

function RobotsGenerator() {
  const [preset, setPreset] = useState<"blog" | "ecommerce" | "staging">("blog");
  const [sitemap, setSitemap] = useState("https://toolnest.example/sitemap.xml");

  const output = `${ROBOTS_PRESETS[preset].join("\n")}\n\nSitemap: ${sitemap}`;

  return (
    <div className="space-y-4">
      <Panel title="Robots preset">
        <div className="flex flex-wrap items-center gap-3">
          <select value={preset} onChange={(e) => setPreset(e.target.value as "blog" | "ecommerce" | "staging")} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="blog">Blog</option>
            <option value="ecommerce">E-commerce</option>
            <option value="staging">Staging block</option>
          </select>
          <input value={sitemap} onChange={(e) => setSitemap(e.target.value)} className="min-w-70 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
      </Panel>
      <Panel title="Generated robots.txt">
        <OutputBlock value={output} />
      </Panel>
    </div>
  );
}

function SitemapGenerator() {
  const [urls, setUrls] = useState("https://toolnest.example/\nhttps://toolnest.example/about");
  const [changefreq, setChangefreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");

  const output = useMemo(() => {
    const lines = urls
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map(
        (line) => `  <url>\n    <loc>${line}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
      );

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>`;
  }, [urls, changefreq, priority]);

  return (
    <div className="space-y-4">
      <Panel title="URL input (one per line)">
        <textarea value={urls} onChange={(e) => setUrls(e.target.value)} className="h-40 w-full rounded-xl border border-slate-200 p-3 text-sm" />
        <div className="mt-3 flex flex-wrap gap-3">
          <select value={changefreq} onChange={(e) => setChangefreq(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            {[
              "always",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly",
              "never",
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </Panel>
      <Panel title="Generated sitemap.xml">
        <OutputBlock value={output} />
      </Panel>
    </div>
  );
}

function WordCounterTool() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <Panel title="Word counter and reading time">
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-48 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Paste content for analysis" />
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Metric label="Words" value={String(words)} />
        <Metric label="Characters" value={String(chars)} />
        <Metric label="Sentences" value={String(sentences)} />
        <Metric label="Read time" value={`${readingTime} min`} />
      </div>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
        <li>Keep intros concise and place primary keyword naturally in the first section.</li>
        <li>Use descriptive subheadings every 150–250 words for scanability.</li>
        <li>Avoid repeated exact-match phrases that hurt readability.</li>
      </ul>
    </Panel>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");

  const { score, label, tips } = useMemo(() => {
    let currentScore = 0;
    if (password.length >= 12) currentScore += 2;
    else if (password.length >= 8) currentScore += 1;
    if (/[A-Z]/.test(password)) currentScore += 1;
    if (/[a-z]/.test(password)) currentScore += 1;
    if (/\d/.test(password)) currentScore += 1;
    if (/[^A-Za-z0-9]/.test(password)) currentScore += 1;
    if (/(1234|password|qwerty|admin)/i.test(password)) currentScore -= 2;

    const nextTips: string[] = [];
    if (password.length < 12) nextTips.push("Use at least 12 characters.");
    if (!/[A-Z]/.test(password)) nextTips.push("Add uppercase letters.");
    if (!/\d/.test(password)) nextTips.push("Add numbers.");
    if (!/[^A-Za-z0-9]/.test(password)) nextTips.push("Add symbols for variety.");

    const bounded = Math.max(0, Math.min(currentScore, 6));
    const status = bounded <= 2 ? "Weak" : bounded <= 4 ? "Moderate" : "Strong";

    return { score: bounded, label: status, tips: nextTips };
  }, [password]);

  return (
    <Panel title="Password strength">
      <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Enter password candidate" />
      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <p className="text-sm text-slate-600">Score: {score}/6</p>
        <p className="text-xl font-semibold text-slate-900">{label}</p>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {tips.length ? tips.map((tip) => <li key={tip}>{tip}</li>) : <li>Great balance. Keep it unique per account.</li>}
      </ul>
    </Panel>
  );
}

function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState("");

  const generate = () => {
    const output = Array.from({ length: Math.min(100, Math.max(1, count)) }, () => crypto.randomUUID()).join("\n");
    setUuids(output);
  };

  return (
    <Panel title="Bulk UUID generator (v4)">
      <div className="mb-3 flex items-center gap-3">
        <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <button type="button" onClick={generate} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          Generate
        </button>
      </div>
      <OutputBlock value={uuids} />
      <p className="mt-3 text-xs text-slate-500">Version note: v4 UUIDs are random and suitable for most application IDs.</p>
    </Panel>
  );
}

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const textToBase64 = () => {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    setOutput(btoa(binary));
  };

  const base64ToText = () => {
    try {
      const binary = atob(input);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      setOutput(new TextDecoder().decode(bytes));
    } catch {
      setOutput("Invalid Base64 input");
    }
  };

  const onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const base64 = result.split(",")[1] ?? "";
      setOutput(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Panel title="Base64 encode / decode">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-40 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Enter text or Base64" />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={textToBase64} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          Encode text
        </button>
        <button type="button" onClick={base64ToText} className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700">
          Decode text
        </button>
        <label className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
          Encode file
          <input type="file" onChange={onFileSelect} className="hidden" />
        </label>
      </div>
      <div className="mt-4">
        <OutputBlock value={output} />
      </div>
    </Panel>
  );
}

function CssTool() {
  const [css, setCss] = useState(".card {\n  color: #111827;\n  padding: 12px;\n}");

  const minified = useMemo(
    () =>
      css
        .replace(/\/\*[^]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{}:;,])\s*/g, "$1")
        .trim(),
    [css],
  );

  const beautified = useMemo(() => {
    return css
      .replace(/\s*{\s*/g, " {\n  ")
      .replace(/;\s*/g, ";\n  ")
      .replace(/\s*}\s*/g, "\n}\n")
      .replace(/\n\s*\n/g, "\n")
      .trim();
  }, [css]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel title="Input CSS">
        <textarea value={css} onChange={(e) => setCss(e.target.value)} className="h-56 w-full rounded-xl border border-slate-200 p-3 text-sm" />
      </Panel>
      <Panel title="Minified">
        <OutputBlock value={minified} />
      </Panel>
      <Panel title="Beautified">
        <OutputBlock value={beautified} />
      </Panel>
    </div>
  );
}

function CanonicalChecker() {
  const [pageUrl, setPageUrl] = useState("https://toolnest.example/blog/json-guide");
  const [canonical, setCanonical] = useState("https://toolnest.example/blog/json-guide");

  const result = useMemo(() => {
    try {
      const page = new URL(pageUrl);
      const can = new URL(canonical);
      if (page.href === can.href) return "Perfect: canonical URL exactly matches the page URL.";
      if (page.hostname === can.hostname && page.pathname === can.pathname) {
        return "Good: only minor normalization differences detected (protocol, slash, or query).";
      }
      return "Warning: canonical target points to different content path. Validate duplication intent.";
    } catch {
      return "Invalid URL format. Use full absolute URLs including protocol.";
    }
  }, [pageUrl, canonical]);

  return (
    <Panel title="Canonical URL checker">
      <div className="space-y-3">
        <input value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Page URL" />
        <input value={canonical} onChange={(e) => setCanonical(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Canonical URL" />
      </div>
      <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{result}</p>
    </Panel>
  );
}

function OpenGraphPreviewTool() {
  const [title, setTitle] = useState("ToolNest — Free Online Tech Tools");
  const [description, setDescription] = useState("Browser-based utilities for developers and SEO workflows.");
  const [url, setUrl] = useState("https://toolnest.example");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=1200");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Open Graph fields">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="og:title" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="og:description" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="og:url" />
          <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="og:image" />
        </div>
      </Panel>
      <Panel title="Social card preview">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="h-40 w-full bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Open Graph preview" className="h-full w-full object-cover" />
          </div>
          <div className="p-4">
            <p className="truncate text-xs text-slate-500">{url}</p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
        </article>
      </Panel>
    </div>
  );
}

function KeywordDensityChecker() {
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");

  const analysis = useMemo(() => {
    const tokens = (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((word) => word.length > 2);
    const total = tokens.length || 1;
    const counts = new Map<string, number>();
    tokens.forEach((token) => {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    });

    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([term, count]) => ({ term, count, density: ((count / total) * 100).toFixed(2) }));

    const target = keyword.trim().toLowerCase();
    const targetCount = target ? (counts.get(target) ?? 0) : 0;

    return {
      top,
      total,
      targetCount,
      targetDensity: target ? ((targetCount / total) * 100).toFixed(2) : "0.00",
    };
  }, [text, keyword]);

  return (
    <Panel title="Keyword density checker">
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-44 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Paste article text" />
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Optional target keyword" />
      <p className="mt-3 text-sm text-slate-700">
        Total indexed words: <strong>{analysis.total}</strong>
        {keyword ? (
          <>
            {" "}• Target density: <strong>{analysis.targetDensity}%</strong> ({analysis.targetCount} matches)
          </>
        ) : null}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {analysis.top.map((item) => (
          <div key={item.term} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <span className="font-semibold">{item.term}</span> — {item.count} ({item.density}%)
          </div>
        ))}
      </div>
    </Panel>
  );
}

const loremWords = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "integer",
  "vitae",
  "placerat",
  "nibh",
  "mauris",
  "ultrices",
  "maximus",
  "nisl",
  "primis",
  "faucibus",
  "orci",
  "luctus",
  "et",
  "ultrices",
  "posuere",
  "cubilia",
];

function LoremIpsumGenerator() {
  const [mode, setMode] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
  const [count, setCount] = useState(2);

  const output = useMemo(() => {
    const makeWords = (quantity: number) => Array.from({ length: quantity }, (_, i) => loremWords[i % loremWords.length]).join(" ");

    if (mode === "words") return makeWords(count);
    if (mode === "sentences") {
      return Array.from({ length: count }, (_, i) => `${makeWords(10 + (i % 6))}.`).join(" ");
    }

    return Array.from({ length: count }, (_, i) => `${makeWords(45 + (i % 12))}.`).join("\n\n");
  }, [mode, count]);

  return (
    <Panel title="Lorem ipsum generator">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <select value={mode} onChange={(e) => setMode(e.target.value as "words" | "sentences" | "paragraphs")} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option value="words">Words</option>
          <option value="sentences">Sentences</option>
          <option value="paragraphs">Paragraphs</option>
        </select>
        <input type="number" value={count} min={1} max={30} onChange={(e) => setCount(Number(e.target.value))} className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <OutputBlock value={output} />
    </Panel>
  );
}

function TextCleaner() {
  const [text, setText] = useState("");
  const [trimLines, setTrimLines] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [removeJunk, setRemoveJunk] = useState(true);

  const cleaned = useMemo(() => {
    let value = text;
    if (removeJunk) {
      value = value.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
    }
    if (trimLines) {
      value = value
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
    }
    if (collapseSpaces) {
      value = value.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
    }
    return value;
  }, [text, trimLines, collapseSpaces, removeJunk]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Source text">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-56 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Paste noisy text" />
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} />
            Trim lines
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={collapseSpaces} onChange={(e) => setCollapseSpaces(e.target.checked)} />
            Collapse spaces
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={removeJunk} onChange={(e) => setRemoveJunk(e.target.checked)} />
            Remove junk chars
          </label>
        </div>
      </Panel>
      <Panel title="Clean output">
        <OutputBlock value={cleaned} />
      </Panel>
    </div>
  );
}

export default function ToolUIWrapper({ slug }: ToolUIWrapperProps) {
  switch (slug) {
    case "json-formatter-validator":
      return <JsonFormatterValidator />;
    case "text-to-url-slug-generator":
      return <TextToSlugGenerator />;
    case "meta-title-description-preview":
      return <MetaPreviewTool />;
    case "robots-txt-generator":
      return <RobotsGenerator />;
    case "sitemap-xml-generator":
      return <SitemapGenerator />;
    case "word-counter-reading-time":
      return <WordCounterTool />;
    case "password-strength-checker":
      return <PasswordStrengthChecker />;
    case "uuid-generator":
      return <UuidGeneratorTool />;
    case "base64-encoder-decoder":
      return <Base64Tool />;
    case "css-minifier-beautifier":
      return <CssTool />;
    case "canonical-url-checker":
      return <CanonicalChecker />;
    case "open-graph-social-preview":
      return <OpenGraphPreviewTool />;
    case "keyword-density-checker":
      return <KeywordDensityChecker />;
    case "lorem-ipsum-generator":
      return <LoremIpsumGenerator />;
    case "text-cleaner":
      return <TextCleaner />;
    default:
      return <Panel title="Tool unavailable">This tool is not available.</Panel>;
  }
}
