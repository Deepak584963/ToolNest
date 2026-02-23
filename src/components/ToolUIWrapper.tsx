"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CopyButton from "@/components/CopyButton";

import { PercentageCalculator, CgpaToPercentageConverter, AttendanceCalculator, AgeCalculator, DateDifferenceCalculator, ExamCountdownTimer, GpaCalculator, ResumeHeadlineGenerator, StudyTimePlanner, MarksRequiredCalculator, AttendanceShortageCalculator, SemesterGpaPredictor, StudyTimetablePrintableGenerator, PomodoroTimer, GradeScaleConverter, AssignmentDeadlineTracker } from "@/components/tools/StudentTools";
import { InstagramHashtagGenerator, YouTubeTitleAnalyzer, YouTubeTagGenerator, CaptionGenerator, BioGenerator, ThumbnailTextPreview, YouTubeDescriptionTemplateGenerator, VideoLengthEstimator, HookGeneratorForReels, ContentIdeaGenerator, YouTubeChapterTimestampGenerator, EngagementRateCalculator, ViralContentCalendarGenerator, BestTimeToPostPlanner, UtmLinkBuilderForCreators, YouTubeTitleLengthChecker, YouTubeShortsAspectRatioTool, ReelCaptionFormatter, HookIdeaGeneratorByNiche } from "@/components/tools/CreatorTools";
import { ImageToPdfConverter, CompressImage, ResizeImage, JpgToPngConverter, PngToJpgConverter, QrCodeGenerator, BarcodeGenerator, Base64ImageEncoder, ImageMetadataViewer, FaviconGenerator, WebpToPngConverter, PngToWebpConverter, ImageCropper, ImageRotateFlipTool, ImageWatermarkTool, ImageColorPaletteExtractor, ImageCollageMaker, ImageBlurTool, RoundedCornersTool, ImageToAsciiArt, ImageCompressorUnder100kb, PassportPhotoMaker, SvgToPngConverter, ImageNoiseGrainEffect, ScreenshotMockupGenerator, ImageBackgroundRemover } from "@/components/tools/ImageTools";
import { EmiCalculator, LoanInterestCalculator, GstCalculator, CurrencyConverter, SipCalculator, InflationCalculator, AgeInDaysCalculator, TimeZoneConverter, UnitConverter, ScientificCalculator, TipCalculator, BmiCalculator, ElectricityBillCalculator } from "@/components/tools/UtilityTools";

type ToolUIWrapperProps = {
  slug: string;
};

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-5">
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
        className="h-48 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-base leading-6 text-slate-800 sm:text-sm"
      />
      <CopyButton value={value} />
    </div>
  );
}

function sanitizeFileName(value: string, fallback: string) {
  const cleaned = value.trim().replace(/[^a-z0-9-_]+/gi, "-");
  return cleaned || fallback;
}

const SQL_KEYWORDS = ["select", "from", "where", "group by", "order by", "inner join", "left join", "right join", "join", "having", "limit", "offset", "insert", "update", "delete", "values", "set", "on", "and", "or"];

function downloadText(name: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function JsonFormatterValidator() {
  const [input, setInput] = useState('{"name":"ToolNest","version":1}');
  const [indent, setIndent] = useState(2);
  const [mode, setMode] = useState<"format" | "minify" | "validate">("format");
  const [sortKeys, setSortKeys] = useState(false);
  const [stripControlChars, setStripControlChars] = useState(false);
  const [stripComments, setStripComments] = useState(false);
  const [stripTrailingCommas, setStripTrailingCommas] = useState(false);
  const [escapeUnicode, setEscapeUnicode] = useState(false);
  const [jsonPath, setJsonPath] = useState("");
  const [fileName, setFileName] = useState("formatted-json");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const source = result || input;
    const lines = source ? source.split("\n").length : 0;
    return { lines, chars: source.length };
  }, [input, result]);

  const normalizeValue = (value: unknown): unknown => {
    if (!sortKeys || value === null || typeof value !== "object") return value;
    if (Array.isArray(value)) return value.map((item) => normalizeValue(item));
    const sorted = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((acc, [key, val]) => {
        acc[key] = normalizeValue(val);
        return acc;
      }, {});
    return sorted;
  };

  const handleRun = () => {
    try {
      let source = stripControlChars ? input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") : input;
      if (stripComments) source = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s+)\/\/.*$/gm, "");
      if (stripTrailingCommas) source = source.replace(/,\s*([}\]])/g, "$1");
      const parsed = JSON.parse(source);
      const normalized = normalizeValue(parsed);
      const selectedValue = jsonPath.trim()
        ? jsonPath
            .split(".")
            .filter(Boolean)
            .reduce<unknown>((acc, key) => {
              if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
                return (acc as Record<string, unknown>)[key];
              }
              throw new Error(`Path not found: ${jsonPath}`);
            }, normalized)
        : normalized;

      const toUnicodeEscaped = (value: string) => value.replace(/[\u007f-\uffff]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
      if (mode === "validate") {
        setResult("JSON is valid. No syntax errors detected.");
      } else if (mode === "minify") {
        const next = JSON.stringify(selectedValue);
        setResult(escapeUnicode ? toUnicodeEscaped(next) : next);
      } else {
        const next = JSON.stringify(selectedValue, null, indent);
        setResult(escapeUnicode ? toUnicodeEscaped(next) : next);
      }
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
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as "format" | "minify" | "validate")} className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm">
              <option value="format">Format</option>
              <option value="minify">Minify</option>
              <option value="validate">Validate only</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Indent</label>
            <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm">
              {[2, 4, 6, 8].map((step) => (
                <option key={step} value={step}>{step} spaces</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Download Name</label>
            <input value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm" />
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input value={jsonPath} onChange={(e) => setJsonPath(e.target.value)} className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm" placeholder="Optional JSON path (e.g. user.profile)" />
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={escapeUnicode} onChange={(e) => setEscapeUnicode(e.target.checked)} /> Escape Unicode</label>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} /> Sort object keys</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={stripControlChars} onChange={(e) => setStripControlChars(e.target.checked)} /> Strip control chars</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={stripComments} onChange={(e) => setStripComments(e.target.checked)} /> Strip comments</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={stripTrailingCommas} onChange={(e) => setStripTrailingCommas(e.target.checked)} /> Strip trailing commas</label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={handleRun} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Run</button>
          <button type="button" onClick={() => setInput('{"name":"ToolNest","features":["fast","private"]}')} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Load Sample</button>
          <button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Clear</button>
          <button type="button" onClick={() => downloadText(`${sanitizeFileName(fileName, "formatted-json")}.json`, result || input, "application/json;charset=utf-8")} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={!(result || input)}>Download</button>
        </div>
      </Panel>
      <Panel title="Output">
        {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : <OutputBlock value={result} />}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">Lines: <strong>{stats.lines}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">Characters: <strong>{stats.chars}</strong></div>
        </div>
      </Panel>
    </div>
  );
}

function TextToSlugGenerator() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const [maxLength, setMaxLength] = useState(80);
  const [forceLower, setForceLower] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [preserveNumbers, setPreserveNumbers] = useState(true);
  const [stripEmoji, setStripEmoji] = useState(true);
  const [basePath, setBasePath] = useState("https://tool-nest.tech/blog/");
  const [bulkMode, setBulkMode] = useState(false);
  const [appendYear, setAppendYear] = useState(false);

  const stopWords = useMemo(() => new Set(["a", "an", "the", "and", "or", "for", "to", "in", "of", "on", "with", "by", "at"]), []);

  const slugifyLine = useCallback((value: string) => {
    let source = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    if (stripEmoji) source = source.replace(/[\u{1F300}-\u{1FAFF}]/gu, "");
    if (!preserveNumbers) source = source.replace(/[0-9]/g, "");
    source = forceLower ? source.toLowerCase() : source;
    const terms = source
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => item.replace(/[^a-zA-Z0-9-]/g, ""));

    const filtered = removeStopWords ? terms.filter((term) => !stopWords.has(term.toLowerCase())) : terms;
    let next = filtered.join(separator).replace(new RegExp(`\\${separator}{2,}`, "g"), separator).replace(new RegExp(`^\\${separator}|\\${separator}$`, "g"), "");
    if (appendYear) next = `${next}${separator}${new Date().getFullYear()}`;
    return next.slice(0, Math.max(10, maxLength)).replace(new RegExp(`\\${separator}$`), "");
  }, [appendYear, forceLower, maxLength, preserveNumbers, removeStopWords, separator, stopWords, stripEmoji]);

  const results = useMemo(() => {
    const lines = bulkMode ? text.split("\n").map((line) => line.trim()).filter(Boolean) : [text.trim()].filter(Boolean);
    return lines.map((line) => ({ source: line, slug: slugifyLine(line) }));
  }, [text, bulkMode, slugifyLine]);

  const output = useMemo(() => results.map((item) => item.slug).join("\n"), [results]);

  return (
    <div className="space-y-4">
      <Panel title="Source text to slug">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={bulkMode ? "One title per line" : "Enter title here"} className="h-36 w-full rounded-xl border border-slate-200 p-3 text-sm" />
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Separator</label>
            <select value={separator} onChange={(e) => setSeparator(e.target.value as "-" | "_")} className="w-full rounded-xl border border-slate-200 px-2 py-2 text-sm">
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Max length</label>
            <input type="number" min={20} max={180} value={maxLength} onChange={(e) => setMaxLength(Number(e.target.value) || 80)} className="w-full rounded-xl border border-slate-200 px-2 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Base preview URL</label>
            <input value={basePath} onChange={(e) => setBasePath(e.target.value)} className="w-full rounded-xl border border-slate-200 px-2 py-2 text-sm" />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={bulkMode} onChange={(e) => setBulkMode(e.target.checked)} /> Bulk mode</label>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={forceLower} onChange={(e) => setForceLower(e.target.checked)} /> Force lowercase</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removeStopWords} onChange={(e) => setRemoveStopWords(e.target.checked)} /> Remove stop words</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={preserveNumbers} onChange={(e) => setPreserveNumbers(e.target.checked)} /> Preserve numbers</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={stripEmoji} onChange={(e) => setStripEmoji(e.target.checked)} /> Strip emoji</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={appendYear} onChange={(e) => setAppendYear(e.target.checked)} /> Append year</label>
        </div>
      </Panel>
      <Panel title="Generated slug output">
        <OutputBlock value={output} />
        {results.length > 0 && (
          <div className="mt-3 space-y-2">
            {results.slice(0, 8).map((item) => (
              <div key={`${item.source}-${item.slug}`} className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
                <p className="truncate"><strong>Source:</strong> {item.source}</p>
                <p className="truncate"><strong>Preview:</strong> {basePath}{item.slug}</p>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function MetaPreviewTool() {
  const [title, setTitle] = useState("ToolNest — Free Online SEO Tools");
  const [description, setDescription] = useState("Generate SEO-ready titles, descriptions, sitemaps, robots rules, and rich previews directly in your browser.");
  const [url, setUrl] = useState("https://tool-nest.tech/tools/meta-title-description-preview");
  const [keyword, setKeyword] = useState("seo tools");
  const [brandSuffix, setBrandSuffix] = useState("| ToolNest");
  const [appendBrand, setAppendBrand] = useState(true);
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [canonical, setCanonical] = useState("https://tool-nest.tech/tools/meta-title-description-preview");

  const finalTitle = appendBrand && !title.includes(brandSuffix) ? `${title} ${brandSuffix}`.trim() : title;
  const titleWarn = finalTitle.length > 60 || finalTitle.length < 30;
  const descWarn = description.length > 160 || description.length < 70;
  const keywordHitTitle = keyword.trim() ? finalTitle.toLowerCase().includes(keyword.toLowerCase()) : true;
  const keywordHitDesc = keyword.trim() ? description.toLowerCase().includes(keyword.toLowerCase()) : true;
  const score = Math.max(
    0,
    Math.min(
      100,
      (titleWarn ? 18 : 35) +
      (descWarn ? 20 : 30) +
      (keywordHitTitle ? 20 : 0) +
      (keywordHitDesc ? 15 : 0),
    ),
  );

  const metaTags = `<title>${finalTitle}</title>\n<meta name="description" content="${description}" />\n<meta name="robots" content="${robotsIndex ? "index" : "noindex"}, ${robotsFollow ? "follow" : "nofollow"}" />\n<link rel="canonical" href="${canonical}" />`;

  const renderCard = (compact = false) => (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 ${compact ? "max-w-sm" : ""}`}>
      <p className="truncate text-xs text-emerald-700">{url}</p>
      <p className="mt-1 line-clamp-2 text-lg font-medium leading-tight text-blue-700">{finalTitle}</p>
      <p className="mt-1 line-clamp-3 text-sm text-slate-600">{description}</p>
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Meta input and optimization">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Meta title" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Meta description" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="URL" />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Primary keyword" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={brandSuffix} onChange={(e) => setBrandSuffix(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Brand suffix" />
            <input value={canonical} onChange={(e) => setCanonical(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Canonical URL" />
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-700">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={appendBrand} onChange={(e) => setAppendBrand(e.target.checked)} /> Append brand suffix</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={robotsIndex} onChange={(e) => setRobotsIndex(e.target.checked)} /> Index</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={robotsFollow} onChange={(e) => setRobotsFollow(e.target.checked)} /> Follow</label>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className={`text-xs ${titleWarn ? "text-rose-600" : "text-emerald-600"}`}>Title length: {finalTitle.length}/60</p>
            <p className={`text-xs ${descWarn ? "text-rose-600" : "text-emerald-600"}`}>Description length: {description.length}/160</p>
            <p className={`text-xs ${keywordHitTitle ? "text-emerald-600" : "text-rose-600"}`}>Keyword in title: {keywordHitTitle ? "Yes" : "No"}</p>
            <p className={`text-xs ${keywordHitDesc ? "text-emerald-600" : "text-rose-600"}`}>Keyword in description: {keywordHitDesc ? "Yes" : "No"}</p>
          </div>
        </div>
      </Panel>
      <Panel title="SERP and meta output preview">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">SEO score</p>
        <p className="mb-3 rounded-xl bg-slate-50 p-2 text-sm text-slate-700">Score: <strong>{score}/100</strong></p>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Desktop</p>
        {renderCard()}
        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile</p>
        {renderCard(true)}
        <div className="mt-4">
          <OutputBlock value={metaTags} />
        </div>
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
  const [agents, setAgents] = useState("*\nGooglebot");
  const [allowRules, setAllowRules] = useState("/\n/blog/");
  const [disallowRules, setDisallowRules] = useState("/admin/\n/private/");
  const [crawlDelay, setCrawlDelay] = useState("0");
  const [host, setHost] = useState("tool-nest.tech");
  const [sitemaps, setSitemaps] = useState("https://tool-nest.tech/sitemap.xml");
  const [customDirectives, setCustomDirectives] = useState("");
  const [testPath, setTestPath] = useState("/admin/");

  const fromPreset = () => {
    const rules = ROBOTS_PRESETS[preset];
    const nextAllow = rules.filter((line) => line.startsWith("Allow:")).map((line) => line.replace("Allow: ", "")).join("\n") || "/";
    const nextDisallow = rules.filter((line) => line.startsWith("Disallow:")).map((line) => line.replace("Disallow: ", "")).join("\n") || "";
    setAllowRules(nextAllow);
    setDisallowRules(nextDisallow);
  };

  const parsedAgents = agents.split("\n").map((line) => line.trim()).filter(Boolean);
  const parsedAllow = allowRules.split("\n").map((line) => line.trim()).filter(Boolean);
  const parsedDisallow = disallowRules.split("\n").map((line) => line.trim()).filter(Boolean);
  const parsedSitemaps = sitemaps.split("\n").map((line) => line.trim()).filter(Boolean);

  const output = useMemo(() => {
    const rows: string[] = [];
    parsedAgents.forEach((agent) => {
      rows.push(`User-agent: ${agent}`);
      parsedAllow.forEach((rule) => rows.push(`Allow: ${rule}`));
      parsedDisallow.forEach((rule) => rows.push(`Disallow: ${rule}`));
      if (Number(crawlDelay) > 0) rows.push(`Crawl-delay: ${Math.round(Number(crawlDelay))}`);
      rows.push("");
    });
    if (host.trim()) rows.push(`Host: ${host.trim()}`);
    parsedSitemaps.forEach((item) => rows.push(`Sitemap: ${item}`));
    if (customDirectives.trim()) rows.push("", customDirectives.trim());
    return rows.join("\n").trim();
  }, [parsedAgents, parsedAllow, parsedDisallow, crawlDelay, host, parsedSitemaps, customDirectives]);

  const testResult = useMemo(() => {
    const path = testPath.trim();
    if (!path.startsWith("/")) return "Enter a path like /blog/post.";
    const blocked = parsedDisallow.some((rule) => rule && (path === rule || path.startsWith(rule)));
    const explicitlyAllowed = parsedAllow.some((rule) => rule && (path === rule || path.startsWith(rule)));
    if (blocked && !explicitlyAllowed) return "Likely blocked for crawlers.";
    return "Likely crawlable for crawlers.";
  }, [testPath, parsedAllow, parsedDisallow]);

  return (
    <div className="space-y-4">
      <Panel title="Robots policy builder">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Preset</label>
            <select value={preset} onChange={(e) => setPreset(e.target.value as "blog" | "ecommerce" | "staging")} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="blog">Blog</option>
              <option value="ecommerce">E-commerce</option>
              <option value="staging">Staging block</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Host</label>
            <input value={host} onChange={(e) => setHost(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Crawl delay</label>
            <input type="number" min={0} max={30} value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={fromPreset} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Apply preset rules</button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">User-agents (line-by-line)</label>
            <textarea value={agents} onChange={(e) => setAgents(e.target.value)} className="h-20 w-full rounded-xl border border-slate-200 p-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sitemaps (line-by-line)</label>
            <textarea value={sitemaps} onChange={(e) => setSitemaps(e.target.value)} className="h-20 w-full rounded-xl border border-slate-200 p-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Allow rules</label>
            <textarea value={allowRules} onChange={(e) => setAllowRules(e.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Disallow rules</label>
            <textarea value={disallowRules} onChange={(e) => setDisallowRules(e.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-2 text-sm" />
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Custom directives</label>
          <textarea value={customDirectives} onChange={(e) => setCustomDirectives(e.target.value)} className="h-20 w-full rounded-xl border border-slate-200 p-2 text-sm" placeholder="# Optional comments or directives" />
        </div>
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rule test</span>
            <input value={testPath} onChange={(e) => setTestPath(e.target.value)} className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-xs" />
          </div>
          <p className="mt-2 text-xs">{testResult}</p>
        </div>
      </Panel>
      <Panel title="Generated robots.txt">
        <OutputBlock value={output} />
      </Panel>
    </div>
  );
}

function SitemapGenerator() {
  const [urls, setUrls] = useState("https://tool-nest.tech/\nhttps://tool-nest.tech/about\nhttps://tool-nest.tech/tools/category/seo");
  const [changefreq, setChangefreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");
  const [includeLastmod, setIncludeLastmod] = useState(true);
  const [lastmodDate, setLastmodDate] = useState(new Date().toISOString().slice(0, 10));
  const [dedupe, setDedupe] = useState(true);
  const [sortUrls, setSortUrls] = useState(true);
  const [normalizeSlash, setNormalizeSlash] = useState(false);

  const parsed = useMemo(() => {
    let list = urls.split("\n").map((line) => line.trim()).filter(Boolean);
    const invalid = list.filter((line) => {
      try {
        new URL(line);
        return false;
      } catch {
        return true;
      }
    });
    if (normalizeSlash) {
      list = list.map((line) => line.endsWith("/") ? line : `${line}/`);
    }
    if (dedupe) {
      list = [...new Set(list)];
    }
    if (sortUrls) {
      list = [...list].sort((a, b) => a.localeCompare(b));
    }
    return { list, invalid };
  }, [urls, dedupe, sortUrls, normalizeSlash]);

  const output = useMemo(() => {
    const lines = parsed.list.map((line) => {
      const chunks = [
        `  <url>`,
        `    <loc>${line}</loc>`,
        includeLastmod ? `    <lastmod>${lastmodDate}</lastmod>` : "",
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        `  </url>`,
      ].filter(Boolean);
      return chunks.join("\n");
    });

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>`;
  }, [parsed.list, includeLastmod, lastmodDate, changefreq, priority]);

  return (
    <div className="space-y-4">
      <Panel title="Sitemap URL configuration">
        <textarea value={urls} onChange={(e) => setUrls(e.target.value)} className="h-44 w-full rounded-xl border border-slate-200 p-3 text-sm" />
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Changefreq</label>
            <select value={changefreq} onChange={(e) => setChangefreq(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Lastmod date</label>
            <input type="date" value={lastmodDate} onChange={(e) => setLastmodDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={includeLastmod} onChange={(e) => setIncludeLastmod(e.target.checked)} /> Include lastmod</label>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)} /> Remove duplicate URLs</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={sortUrls} onChange={(e) => setSortUrls(e.target.checked)} /> Sort URLs</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={normalizeSlash} onChange={(e) => setNormalizeSlash(e.target.checked)} /> Add trailing slash</label>
        </div>
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
          <p>Valid URLs: <strong>{parsed.list.length - parsed.invalid.length}</strong> • Invalid URLs: <strong>{parsed.invalid.length}</strong></p>
          {parsed.invalid.length > 0 ? <p className="mt-1 text-rose-600">Invalid entries detected and kept out of XML output.</p> : null}
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
  const [keyword, setKeyword] = useState("seo");
  const [targetWords, setTargetWords] = useState(1200);
  const [readingWpm, setReadingWpm] = useState(220);
  const [speakingWpm, setSpeakingWpm] = useState(140);
  const [excludeNumbers, setExcludeNumbers] = useState(false);
  const [ignoreStopWords, setIgnoreStopWords] = useState(false);
  const [topLimit, setTopLimit] = useState(10);

  const stopWords = useMemo(() => new Set(["the", "and", "for", "with", "that", "this", "from", "into", "you", "your", "are", "was", "were", "have", "has", "had", "to", "of", "in", "on", "at", "a", "an"]), []);

  const analysis = useMemo(() => {
    const normalized = text.replace(/\r/g, "");
    const lines = normalized.split("\n");
    const paragraphs = normalized.split(/\n\s*\n/).filter((item) => item.trim().length > 0);
    const sentences = normalized.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean);
    const rawTokens = (normalized.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter(Boolean);
    const tokens = rawTokens.filter((token) => (!excludeNumbers || !/^\d+$/.test(token)) && (!ignoreStopWords || !stopWords.has(token)));
    const words = tokens.length;
    const chars = normalized.length;
    const charsNoSpaces = normalized.replace(/\s/g, "").length;
    const avgWordLength = words ? (tokens.join("").length / words).toFixed(2) : "0.00";
    const avgSentenceLength = sentences.length ? (words / sentences.length).toFixed(1) : "0.0";
    const readingMinutes = words ? Math.max(1, Math.ceil(words / Math.max(80, readingWpm))) : 0;
    const speakingMinutes = words ? Math.max(1, Math.ceil(words / Math.max(80, speakingWpm))) : 0;
    const keywordTerm = keyword.trim().toLowerCase();
    const keywordCount = keywordTerm ? (normalized.toLowerCase().match(new RegExp(`\\b${keywordTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g")) ?? []).length : 0;
    const keywordDensity = words && keywordTerm ? ((keywordCount / words) * 100).toFixed(2) : "0.00";
    const uniqueWords = new Set(tokens).size;
    const lexicalVariety = words ? ((uniqueWords / words) * 100).toFixed(1) : "0.0";
    const longestWord = tokens.reduce((prev, cur) => (cur.length > prev.length ? cur : prev), "");
    const progress = targetWords > 0 ? Math.min(100, Math.round((words / targetWords) * 100)) : 0;
    const counts = new Map<string, number>();
    tokens.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));
    const topTerms = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, Math.max(5, topLimit)).map(([term, count]) => ({ term, count }));

    const tips: string[] = [];
    if (words < 300) tips.push("Content may be too short for competitive informational queries.");
    if (Number(avgSentenceLength) > 25) tips.push("Average sentence length is high; shorten sentences for readability.");
    if (keywordTerm && Number(keywordDensity) > 3.5) tips.push("Keyword density looks high; reduce repetition and add variants.");
    if (paragraphs.length > 0 && words / paragraphs.length > 120) tips.push("Paragraph blocks are long; split for mobile readability.");
    if (!tips.length) tips.push("Readability and pacing metrics look balanced.");

    return {
      words,
      chars,
      charsNoSpaces,
      lines: lines.length,
      paragraphs: paragraphs.length,
      sentences: sentences.length,
      avgWordLength,
      avgSentenceLength,
      readingMinutes,
      speakingMinutes,
      keywordCount,
      keywordDensity,
      uniqueWords,
      lexicalVariety,
      longestWord,
      progress,
      topTerms,
      tips,
    };
  }, [text, keyword, targetWords, readingWpm, speakingWpm, excludeNumbers, ignoreStopWords, topLimit, stopWords]);

  const summary = useMemo(() => [
    `Words: ${analysis.words}`,
    `Characters: ${analysis.chars}`,
    `Characters (no spaces): ${analysis.charsNoSpaces}`,
    `Sentences: ${analysis.sentences}`,
    `Paragraphs: ${analysis.paragraphs}`,
    `Reading time: ${analysis.readingMinutes} min`,
    `Speaking time: ${analysis.speakingMinutes} min`,
    `Keyword "${keyword || "-"}": ${analysis.keywordCount} (${analysis.keywordDensity}%)`,
    `Lexical variety: ${analysis.lexicalVariety}%`,
    `Avg sentence length: ${analysis.avgSentenceLength} words`,
  ].join("\n"), [analysis, keyword]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Content input and controls">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-56 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Paste content for analysis" />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Primary keyword" />
          <input type="number" value={targetWords} min={100} max={10000} onChange={(e) => setTargetWords(Number(e.target.value) || 1200)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Target word count" />
          <input type="number" value={readingWpm} min={80} max={400} onChange={(e) => setReadingWpm(Number(e.target.value) || 220)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Reading WPM" />
          <input type="number" value={speakingWpm} min={80} max={280} onChange={(e) => setSpeakingWpm(Number(e.target.value) || 140)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Speaking WPM" />
          <input type="number" value={topLimit} min={5} max={25} onChange={(e) => setTopLimit(Number(e.target.value) || 10)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Top terms" />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={excludeNumbers} onChange={(e) => setExcludeNumbers(e.target.checked)} /> Exclude numbers</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={ignoreStopWords} onChange={(e) => setIgnoreStopWords(e.target.checked)} /> Ignore stop words</label>
        </div>
      </Panel>
      <Panel title="Analysis and optimization insights">
        <div className="grid gap-2 sm:grid-cols-3">
          <Metric label="Words" value={String(analysis.words)} />
          <Metric label="Characters" value={String(analysis.chars)} />
          <Metric label="No-space chars" value={String(analysis.charsNoSpaces)} />
          <Metric label="Sentences" value={String(analysis.sentences)} />
          <Metric label="Paragraphs" value={String(analysis.paragraphs)} />
          <Metric label="Lines" value={String(analysis.lines)} />
          <Metric label="Read time" value={`${analysis.readingMinutes} min`} />
          <Metric label="Speak time" value={`${analysis.speakingMinutes} min`} />
          <Metric label="Keyword density" value={`${analysis.keywordDensity}%`} />
        </div>
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <p>Target progress: <strong>{analysis.progress}%</strong></p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-indigo-600" style={{ width: `${analysis.progress}%` }} /></div>
          <p className="mt-2">Avg word length: <strong>{analysis.avgWordLength}</strong> • Avg sentence: <strong>{analysis.avgSentenceLength}</strong> words</p>
          <p className="mt-1">Unique words: <strong>{analysis.uniqueWords}</strong> • Lexical variety: <strong>{analysis.lexicalVariety}%</strong></p>
          <p className="mt-1">Longest word: <strong>{analysis.longestWord || "-"}</strong></p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {analysis.topTerms.map((item) => (
            <div key={item.term} className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">
              <strong>{item.term}</strong> — {item.count}
            </div>
          ))}
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {analysis.tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton value={summary} />
          <button type="button" onClick={() => downloadText("text-analysis.txt", summary)} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700" disabled={!text.trim()}>Download report</button>
        </div>
      </Panel>
    </div>
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
  const [show, setShow] = useState(false);
  const [genLength, setGenLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasCommon = /(1234|password|qwerty|admin|letmein|welcome|iloveyou)/i.test(password);
  const hasSequential = /(abc|bcd|cde|123|234|345|456|567|678|789)/i.test(password);
  const hasRepeats = /(.)\1{2,}/.test(password);

  const { score, label, tips } = useMemo(() => {
    let currentScore = 0;
    if (password.length >= 12) currentScore += 2;
    else if (password.length >= 8) currentScore += 1;
    if (hasUpper) currentScore += 1;
    if (hasLower) currentScore += 1;
    if (hasDigit) currentScore += 1;
    if (hasSymbol) currentScore += 1;
    if (!hasSequential) currentScore += 1;
    if (!hasRepeats) currentScore += 1;
    if (hasCommon) currentScore -= 3;

    const nextTips: string[] = [];
    if (password.length < 12) nextTips.push("Use at least 12 characters.");
    if (!hasUpper) nextTips.push("Add uppercase letters.");
    if (!hasLower) nextTips.push("Add lowercase letters.");
    if (!hasDigit) nextTips.push("Add numbers.");
    if (!hasSymbol) nextTips.push("Add symbols for variety.");
    if (hasSequential) nextTips.push("Avoid obvious sequences.");
    if (hasRepeats) nextTips.push("Avoid repeating one character too much.");
    if (hasCommon) nextTips.push("Avoid common leaked-password patterns.");

    const bounded = Math.max(0, Math.min(currentScore, 10));
    const status = bounded <= 3 ? "Weak" : bounded <= 7 ? "Moderate" : "Strong";

    return { score: bounded, label: status, tips: nextTips };
  }, [password, hasUpper, hasLower, hasDigit, hasSymbol, hasCommon, hasSequential, hasRepeats]);

  const entropyBits = useMemo(() => {
    let pool = 0;
    if (hasLower) pool += 26;
    if (hasUpper) pool += 26;
    if (hasDigit) pool += 10;
    if (hasSymbol) pool += 32;
    if (pool === 0) return 0;
    return Math.round(password.length * Math.log2(pool));
  }, [password, hasLower, hasUpper, hasDigit, hasSymbol]);

  const crackEstimate = useMemo(() => {
    if (!password) return "—";
    if (entropyBits < 35) return "Instant to minutes";
    if (entropyBits < 50) return "Hours to days";
    if (entropyBits < 70) return "Months to years";
    return "Many years";
  }, [entropyBits, password]);

  const generatePassword = () => {
    const pools = [
      useLower ? "abcdefghijklmnopqrstuvwxyz" : "",
      useUpper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "",
      useDigits ? "0123456789" : "",
      useSymbols ? "!@#$%^&*()_+-=[]{}|;:,.<>?" : "",
    ].join("");
    if (!pools) return;
    const arr = crypto.getRandomValues(new Uint32Array(genLength));
    const generated = Array.from(arr, (value) => pools[value % pools.length]).join("");
    setPassword(generated);
  };

  const checks = [
    { label: "12+ characters", ok: password.length >= 12 },
    { label: "Uppercase", ok: hasUpper },
    { label: "Lowercase", ok: hasLower },
    { label: "Number", ok: hasDigit },
    { label: "Symbol", ok: hasSymbol },
    { label: "No sequence", ok: !hasSequential },
    { label: "No repeats", ok: !hasRepeats },
    { label: "No common pattern", ok: !hasCommon },
  ];

  return (
    <Panel title="Password strength">
      <div className="flex gap-2">
        <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Enter password candidate" />
        <button type="button" onClick={() => setShow((v) => !v)} className="rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700">{show ? "Hide" : "Show"}</button>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full ${score <= 3 ? "bg-rose-500" : score <= 7 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${(score / 10) * 100}%` }} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Score: {score}/10</p>
          <p className="text-xl font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-xs text-slate-600">Entropy: {entropyBits} bits • Crack time: {crackEstimate}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-slate-800">Generator</p>
          <label className="mb-1 block text-xs text-slate-600">Length: {genLength}</label>
          <input type="range" min={10} max={40} value={genLength} onChange={(e) => setGenLength(Number(e.target.value))} className="w-full" />
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-700">
            <label><input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} /> Upper</label>
            <label><input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} /> Lower</label>
            <label><input type="checkbox" checked={useDigits} onChange={(e) => setUseDigits(e.target.checked)} /> Digits</label>
            <label><input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} /> Symbols</label>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={generatePassword} className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">Generate</button>
            <button type="button" onClick={() => navigator.clipboard?.writeText(password)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200" disabled={!password}>Copy</button>
            <button type="button" onClick={() => setPassword("")} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200" disabled={!password}>Clear</button>
          </div>
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {checks.map((check) => (
          <div key={check.label} className={`rounded-lg border p-2 text-xs ${check.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            {check.ok ? "✓" : "•"} {check.label}
          </div>
        ))}
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {tips.length ? tips.map((tip) => <li key={tip}>{tip}</li>) : <li>Great balance. Keep it unique per account.</li>}
      </ul>
    </Panel>
  );
}

function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [layout, setLayout] = useState<"lines" | "comma" | "json">("lines");
  const [variant, setVariant] = useState<"standard" | "compact" | "upper" | "urn">("standard");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [fileName, setFileName] = useState("uuids");
  const [uuids, setUuids] = useState("");

  const generate = () => {
    const list = Array.from({ length: Math.min(1000, Math.max(1, count)) }, () => {
      let value = crypto.randomUUID();
      if (variant === "compact") value = value.replace(/-/g, "");
      if (variant === "upper") value = value.toUpperCase();
      if (variant === "urn") value = `urn:uuid:${value}`;
      return `${prefix}${value}${suffix}`;
    });
    const output = layout === "json" ? JSON.stringify(list, null, 2) : layout === "comma" ? list.join(", ") : list.join("\n");
    setUuids(output);
  };

  const parsedCount = useMemo(() => {
    if (!uuids) return 0;
    if (layout === "json") {
      try {
        const arr = JSON.parse(uuids);
        return Array.isArray(arr) ? arr.length : 0;
      } catch {
        return 0;
      }
    }
    return layout === "comma" ? uuids.split(",").filter(Boolean).length : uuids.split("\n").filter(Boolean).length;
  }, [uuids, layout]);

  return (
    <Panel title="Bulk UUID generator (v4)">
      <div className="mb-3 grid gap-3 sm:grid-cols-3">
        <div><label className="mb-1 block text-sm font-medium text-slate-700">Count</label><input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700">Variant</label><select value={variant} onChange={(e) => setVariant(e.target.value as "standard" | "compact" | "upper" | "urn")} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="standard">Standard</option><option value="compact">No hyphens</option><option value="upper">Uppercase</option><option value="urn">URN</option></select></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700">Layout</label><select value={layout} onChange={(e) => setLayout(e.target.value as "lines" | "comma" | "json")} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="lines">Line separated</option><option value="comma">Comma separated</option><option value="json">JSON array</option></select></div>
      </div>
      <div className="mb-3 grid gap-3 sm:grid-cols-3">
        <div><label className="mb-1 block text-sm font-medium text-slate-700">Prefix</label><input value={prefix} onChange={(e) => setPrefix(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700">Suffix</label><input value={suffix} onChange={(e) => setSuffix(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700">Download Name</label><input value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={generate} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Generate</button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(uuids)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200" disabled={!uuids}>Copy All</button>
        <button type="button" onClick={() => downloadText(`${sanitizeFileName(fileName, "uuids")}.${layout === "json" ? "json" : "txt"}`, uuids, layout === "json" ? "application/json;charset=utf-8" : "text/plain;charset=utf-8")} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={!uuids}>Download</button>
        <button type="button" onClick={() => setUuids("")} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200" disabled={!uuids}>Clear</button>
      </div>
      <OutputBlock value={uuids} />
      <p className="mt-3 text-xs text-slate-500">Generated: {parsedCount} UUIDs • Version note: v4 UUIDs are random and suitable for most application IDs.</p>
    </Panel>
  );
}

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"text" | "urlsafe" | "datauri">("text");
  const [mime, setMime] = useState("text/plain");
  const [lineWrap, setLineWrap] = useState(0);
  const [fileName, setFileName] = useState("decoded-output");

  const normalizeWrap = (value: string) => {
    if (lineWrap <= 0) return value;
    return value.match(new RegExp(`.{1,${lineWrap}}`, "g"))?.join("\n") ?? value;
  };

  const toUrlSafe = (value: string) => value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  const fromUrlSafe = (value: string) => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    return normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  };

  const textToBase64 = () => {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const encoded = btoa(binary);
    if (mode === "urlsafe") setOutput(normalizeWrap(toUrlSafe(encoded)));
    else if (mode === "datauri") setOutput(normalizeWrap(`data:${mime};base64,${encoded}`));
    else setOutput(normalizeWrap(encoded));
  };

  const base64ToText = () => {
    try {
      const raw = input.trim().startsWith("data:") ? (input.split(",")[1] ?? "") : input;
      const normalized = mode === "urlsafe" ? fromUrlSafe(raw.replace(/\s+/g, "")) : raw.replace(/\s+/g, "");
      const binary = atob(normalized);
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
      if (mode === "urlsafe") setOutput(normalizeWrap(toUrlSafe(base64)));
      else if (mode === "datauri") setOutput(normalizeWrap(result));
      else setOutput(normalizeWrap(base64));
    };
    reader.readAsDataURL(file);
  };

  const decodeToFile = () => {
    try {
      const raw = input.trim().startsWith("data:") ? (input.split(",")[1] ?? "") : input;
      const normalized = mode === "urlsafe" ? fromUrlSafe(raw.replace(/\s+/g, "")) : raw.replace(/\s+/g, "");
      const binary = atob(normalized);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const blob = new Blob([bytes], { type: mime || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = sanitizeFileName(fileName, "decoded-output");
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setOutput("Invalid Base64 input for file decoding");
    }
  };

  return (
    <Panel title="Base64 encode / decode">
      <div className="mb-3 grid gap-3 sm:grid-cols-4">
        <div><label className="mb-1 block text-sm font-medium text-slate-700">Mode</label><select value={mode} onChange={(e) => setMode(e.target.value as "text" | "urlsafe" | "datauri")} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="text">Standard</option><option value="urlsafe">URL-safe</option><option value="datauri">Data URI</option></select></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700">MIME type</label><input value={mime} onChange={(e) => setMime(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700">Line wrap</label><input type="number" min={0} max={200} value={lineWrap} onChange={(e) => setLineWrap(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700">File name</label><input value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
      </div>
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
        <button type="button" onClick={decodeToFile} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Decode to file</button>
        <button type="button" onClick={() => { setInput(""); setOutput(""); }} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Clear</button>
      </div>
      <div className="mt-4">
        <OutputBlock value={output} />
        <p className="mt-2 text-xs text-slate-500">Output length: {output.length} chars</p>
      </div>
    </Panel>
  );
}

function CssTool() {
  const [css, setCss] = useState(".card {\n  color: #111827;\n  padding: 12px;\n}");
  const [removeComments, setRemoveComments] = useState(true);
  const [trimSemicolons, setTrimSemicolons] = useState(false);
  const [tabSize, setTabSize] = useState(2);
  const [fileBase, setFileBase] = useState("styles");

  const minified = useMemo(
    () => {
      let value = css;
      if (removeComments) value = value.replace(/\/\*[^]*?\*\//g, "");
      value = value
        .replace(/\s+/g, " ")
        .replace(/\s*([{}:;,])\s*/g, "$1")
        .trim();
      if (trimSemicolons) value = value.replace(/;}/g, "}");
      return value;
    },
    [css, removeComments, trimSemicolons],
  );

  const beautified = useMemo(() => {
    const indent = " ".repeat(tabSize);
    return css
      .replace(removeComments ? /\/\*[^]*?\*\//g : /$^/, "")
      .replace(/\s*{\s*/g, ` {\n${indent}`)
      .replace(/;\s*/g, `;\n${indent}`)
      .replace(/\s*}\s*/g, "\n}\n")
      .replace(/\n\s*\n/g, "\n")
      .trim();
  }, [css, removeComments, tabSize]);

  const reduction = useMemo(() => {
    if (!css.length) return 0;
    return Math.max(0, Math.round((1 - minified.length / css.length) * 100));
  }, [css, minified]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel title="Input CSS">
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={removeComments} onChange={(e) => setRemoveComments(e.target.checked)} /> Remove comments</label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={trimSemicolons} onChange={(e) => setTrimSemicolons(e.target.checked)} /> Remove trailing ;</label>
          <div><label className="mb-1 block text-xs text-slate-600">Indent: {tabSize}</label><input type="range" min={2} max={6} value={tabSize} onChange={(e) => setTabSize(Number(e.target.value))} className="w-full" /></div>
          <div><label className="mb-1 block text-xs text-slate-600">File name</label><input value={fileBase} onChange={(e) => setFileBase(e.target.value)} className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm" /></div>
        </div>
        <textarea value={css} onChange={(e) => setCss(e.target.value)} className="h-56 w-full rounded-xl border border-slate-200 p-3 text-sm" />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => downloadText(`${sanitizeFileName(fileBase, "styles")}.min.css`, minified, "text/css;charset=utf-8")} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">Download Minified</button>
          <button type="button" onClick={() => downloadText(`${sanitizeFileName(fileBase, "styles")}.beautified.css`, beautified, "text/css;charset=utf-8")} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Download Beautified</button>
          <button type="button" onClick={() => setCss("")} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Clear</button>
        </div>
        <p className="mt-2 text-xs text-slate-500">Input chars: {css.length} • Minified chars: {minified.length} • Reduction: {reduction}%</p>
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

function RegexTesterTool() {
  const [pattern, setPattern] = useState("\\b[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}\\b");
  const [text, setText] = useState("Contact us at hello@tool-nest.tech and support@example.org");
  const [replacement, setReplacement] = useState("[EMAIL]");
  const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false, u: false });
  const [showGroups, setShowGroups] = useState(true);
  const [splitDelimiter, setSplitDelimiter] = useState("\\s+");

  const flagString = `${flags.g ? "g" : ""}${flags.i ? "i" : ""}${flags.m ? "m" : ""}${flags.s ? "s" : ""}${flags.u ? "u" : ""}`;

  const analysis = useMemo(() => {
    try {
      const reg = new RegExp(pattern, flagString || undefined);
      const iterableReg = new RegExp(pattern, flags.g ? flagString || "g" : `${flagString}g`);
      const matches = Array.from(text.matchAll(iterableReg)).map((match, index) => ({
        index: index + 1,
        value: match[0],
        position: match.index ?? -1,
        groups: match.slice(1).filter((item) => item !== undefined),
      }));
      const replaced = text.replace(reg, replacement);
      const splitPreview = text.split(new RegExp(splitDelimiter, flagString || undefined)).slice(0, 20);
      return { error: "", count: matches.length, matches, replaced, isMatch: reg.test(text), splitPreview };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Invalid pattern", count: 0, matches: [], replaced: "", isMatch: false, splitPreview: [] as string[] };
    }
  }, [pattern, text, replacement, flagString, flags.g, splitDelimiter]);

  const presets: Record<string, string> = {
    Email: "\\b[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}\\b",
    URL: "https?:\\/\\/[^\\s]+",
    IPv4: "\\b(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)){3}\\b",
    Hex: "#(?:[0-9a-fA-F]{3}){1,2}\\b",
    UUID: "\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\b",
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Regex input">
        <div className="space-y-3">
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 font-mono text-sm" placeholder="Regex pattern" />
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-40 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Paste text to test" />
          <input value={replacement} onChange={(e) => setReplacement(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Replacement text" />
          <input value={splitDelimiter} onChange={(e) => setSplitDelimiter(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Split delimiter regex" />
          <div className="flex flex-wrap gap-3 text-sm text-slate-700">
            {(["g", "i", "m", "s", "u"] as const).map((key) => (
              <label key={key} className="inline-flex items-center gap-2"><input type="checkbox" checked={flags[key]} onChange={(e) => setFlags((prev) => ({ ...prev, [key]: e.target.checked }))} /> {key}</label>
            ))}
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={showGroups} onChange={(e) => setShowGroups(e.target.checked)} /> Show capture groups</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(presets).map((name) => (
              <button key={name} type="button" onClick={() => setPattern(presets[name])} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">{name}</button>
            ))}
            <button type="button" onClick={() => setPattern(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">Escape text</button>
          </div>
        </div>
      </Panel>
      <Panel title="Regex result">
        {analysis.error ? (
          <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{analysis.error}</p>
        ) : (
          <>
            <div className="mb-3 grid gap-3 sm:grid-cols-2">
              <Metric label="Matches" value={String(analysis.count)} />
              <Metric label="Test" value={analysis.isMatch ? "Matched" : "No match"} />
            </div>
            <textarea value={analysis.replaced} readOnly className="h-32 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm" />
            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Split preview: {analysis.splitPreview.join(" | ") || "-"}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <CopyButton value={analysis.replaced} />
              <button type="button" onClick={() => navigator.clipboard?.writeText(JSON.stringify(analysis.matches, null, 2))} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">Copy match JSON</button>
              <button type="button" onClick={() => downloadText("regex-replaced.txt", analysis.replaced)} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">Download replaced</button>
            </div>
            <div className="mt-3 max-h-44 space-y-2 overflow-auto">
              {analysis.matches.slice(0, 30).map((match) => (
                <div key={`${match.index}-${match.position}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  #{match.index} @ {match.position}: <span className="font-mono">{match.value}</span>
                  {showGroups && match.groups.length > 0 ? <p className="mt-1 text-xs text-slate-500">Groups: {match.groups.join(" | ")}</p> : null}
                </div>
              ))}
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}

function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const [leeway, setLeeway] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [showClaimsTable, setShowClaimsTable] = useState(true);

  const setNow = () => setCurrentEpoch(Math.floor(Date.now() / 1000));

  const parsed = useMemo(() => {
    const decodePart = (part: string) => {
      const normalized = part.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (part.length % 4 || 4)) % 4);
      const value = atob(normalized);
      return JSON.parse(value);
    };

    try {
      const parts = token.trim().split(".");
      if (parts.length < 2) return { error: "Enter a valid JWT with header.payload.signature", header: null, payload: null, claims: [] as { key: string; value: string }[] };
      const header = decodePart(parts[0]);
      const payload = decodePart(parts[1]);
      const now = currentEpoch;
      const claims = Object.entries(payload as Record<string, unknown>).map(([key, value]) => ({ key, value: typeof value === "object" ? JSON.stringify(value) : String(value) }));
      const exp = typeof payload.exp === "number" ? payload.exp : null;
      const nbf = typeof payload.nbf === "number" ? payload.nbf : null;
      const iat = typeof payload.iat === "number" ? payload.iat : null;
      const ttl = exp ? exp - now : null;
      const state = exp && now > exp + leeway ? "Expired" : nbf && now + leeway < nbf ? "Not active" : "Valid time window";
      return { error: "", header, payload, claims, state, exp, nbf, iat, ttl };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Failed to decode token", header: null, payload: null, claims: [] as { key: string; value: string }[] };
    }
  }, [token, leeway, currentEpoch]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="JWT input">
        <textarea value={token} onChange={(e) => setToken(e.target.value)} className="h-56 w-full rounded-xl border border-slate-200 p-3 font-mono text-xs" placeholder="Paste JWT token" />
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm text-slate-600">Leeway (sec)</label>
          <input type="number" value={leeway} onChange={(e) => setLeeway(Number(e.target.value) || 0)} className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-sm" />
          <label className="text-sm text-slate-600">Current epoch</label>
          <input type="number" value={currentEpoch} onChange={(e) => setCurrentEpoch(Number(e.target.value) || 0)} className="w-32 rounded-lg border border-slate-200 px-2 py-1 text-sm" />
          <button type="button" onClick={setNow} className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">Set now</button>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={showClaimsTable} onChange={(e) => setShowClaimsTable(e.target.checked)} /> Show claims</label>
          <button type="button" onClick={() => setToken("")} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Clear</button>
        </div>
      </Panel>
      <Panel title="Decoded JWT">
        {parsed.error ? (
          <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{parsed.error}</p>
        ) : (
          <>
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">Token state: <strong>{(parsed as { state: string }).state}</strong></p>
            <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">TTL: <strong>{(parsed as { ttl?: number }).ttl ?? "N/A"}</strong> seconds</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Header</p>
                <textarea value={JSON.stringify((parsed as { header: unknown }).header, null, 2)} readOnly className="h-32 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 font-mono text-xs" />
                <CopyButton value={JSON.stringify((parsed as { header: unknown }).header, null, 2)} />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Payload</p>
                <textarea value={JSON.stringify((parsed as { payload: unknown }).payload, null, 2)} readOnly className="h-32 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 font-mono text-xs" />
                <div className="mt-2 flex flex-wrap gap-2">
                  <CopyButton value={JSON.stringify((parsed as { payload: unknown }).payload, null, 2)} />
                  <button type="button" onClick={() => downloadText("jwt-payload.json", JSON.stringify((parsed as { payload: unknown }).payload, null, 2), "application/json;charset=utf-8")} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Download payload</button>
                </div>
              </div>
            </div>
            {showClaimsTable ? (
              <div className="mt-3 max-h-40 overflow-auto rounded-xl border border-slate-200 bg-white p-2">
                {(parsed as { claims: { key: string; value: string }[] }).claims.map((item) => (
                  <div key={item.key} className="border-b border-slate-100 px-1 py-1 text-xs text-slate-700 last:border-b-0"><strong>{item.key}</strong>: {item.value}</div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </Panel>
    </div>
  );
}

function CronExpressionBuilderTool() {
  const [minute, setMinute] = useState("*/5");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const [timezone, setTimezone] = useState("UTC");
  const [command, setCommand] = useState("npm run sync");
  const [nickName, setNickName] = useState("Data sync schedule");

  const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  const valid = /^([\d\/*,-]+)\s+([\d\/*,-]+)\s+([\d\/*,-]+)\s+([\d\/*,-]+)\s+([\d\/*,-]+)$/.test(expression);
  const presets = [
    { label: "Every 5 min", value: ["*/5", "*", "*", "*", "*"] },
    { label: "Hourly", value: ["0", "*", "*", "*", "*"] },
    { label: "Daily 2AM", value: ["0", "2", "*", "*", "*"] },
    { label: "Weekdays 9AM", value: ["0", "9", "*", "*", "1-5"] },
    { label: "Monthly", value: ["0", "0", "1", "*", "*"] },
  ];

  const summary = useMemo(() => {
    if (!valid) return "Invalid cron expression format.";
    return `Runs at minute '${minute}', hour '${hour}', day '${dayOfMonth}', month '${month}', weekday '${dayOfWeek}' (${timezone}).`;
  }, [valid, minute, hour, dayOfMonth, month, dayOfWeek, timezone]);

  const examples = useMemo(() => {
    if (!valid) return [] as string[];
    return [
      `${nickName}: ${expression}`,
      `crontab => ${expression} ${command}`,
      `timezone => ${timezone}`,
    ];
  }, [valid, expression, command, timezone, nickName]);

  return (
    <Panel title="Cron expression builder">
      <div className="grid gap-3 sm:grid-cols-5">
        <div><label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Minute</label><input value={minute} onChange={(e) => setMinute(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm" /></div>
        <div><label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Hour</label><input value={hour} onChange={(e) => setHour(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm" /></div>
        <div><label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Day</label><input value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm" /></div>
        <div><label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Month</label><input value={month} onChange={(e) => setMonth(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm" /></div>
        <div><label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Weekday</label><input value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm" /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm" placeholder="Timezone" />
        <input value={command} onChange={(e) => setCommand(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm" placeholder="Command" />
        <input value={nickName} onChange={(e) => setNickName(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm sm:col-span-2" placeholder="Schedule label" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button key={preset.label} type="button" onClick={() => { setMinute(preset.value[0]); setHour(preset.value[1]); setDayOfMonth(preset.value[2]); setMonth(preset.value[3]); setDayOfWeek(preset.value[4]); }} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">{preset.label}</button>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="font-mono text-sm text-slate-800">{expression}</p>
        <p className={`mt-1 text-xs ${valid ? "text-emerald-600" : "text-rose-600"}`}>{summary}</p>
        <p className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">{expression} {command}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => navigator.clipboard?.writeText(expression)} className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700" disabled={!valid}>Copy expression</button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(`${expression} ${command}`)} className="rounded-full bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700" disabled={!valid}>Copy crontab line</button>
        <button type="button" onClick={() => downloadText("schedule.cron", `${expression} ${command}\n# TZ=${timezone}\n`)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200" disabled={!valid}>Download .cron</button>
        <button type="button" onClick={() => downloadText("cron-notes.txt", examples.join("\n"))} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700" disabled={!valid}>Download notes</button>
      </div>
      {examples.length > 0 ? (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">{examples.map((line) => <p key={line}>{line}</p>)}</div>
      ) : null}
    </Panel>
  );
}

function SqlFormatterTool() {
  const [sql, setSql] = useState("select id,name,email from users where status='active' order by created_at desc;");
  const [indent, setIndent] = useState(2);
  const [keywordUpper, setKeywordUpper] = useState(true);
  const [compact, setCompact] = useState(false);
  const [fileName, setFileName] = useState("query");
  const [stripComments, setStripComments] = useState(false);
  const [ensureSemicolon, setEnsureSemicolon] = useState(true);

  const formatted = useMemo(() => {
    const pad = " ".repeat(indent);
    let out = stripComments ? sql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "") : sql;
    out = out.replace(/\s+/g, " ").trim();
    SQL_KEYWORDS.forEach((key) => {
      const pattern = new RegExp(`\\b${key.replace(/\s+/g, "\\s+")}\\b`, "gi");
      const replacement = keywordUpper ? key.toUpperCase() : key.toLowerCase();
      out = out.replace(pattern, `\n${replacement}`);
    });
    out = out.replace(/\n\s*\n/g, "\n").trim();
    if (!compact) {
      out = out
        .split("\n")
        .map((line, index) => (index === 0 ? line.trim() : `${pad}${line.trim()}`))
        .join("\n");
    }
    if (ensureSemicolon && out && !out.trim().endsWith(";")) out = `${out};`;
    return out;
  }, [sql, indent, keywordUpper, compact, stripComments, ensureSemicolon]);

  const minified = useMemo(() => sql.replace(/\s+/g, " ").replace(/\s*([(),=<>;+\-/*])\s*/g, "$1").trim(), [sql]);
  const stats = useMemo(() => ({ chars: sql.length, lines: sql.split("\n").length, words: (sql.match(/\S+/g) ?? []).length }), [sql]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel title="SQL input">
        <textarea value={sql} onChange={(e) => setSql(e.target.value)} className="h-56 w-full rounded-xl border border-slate-200 p-3 font-mono text-sm" />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><label className="mb-1 block text-xs text-slate-600">Indent: {indent}</label><input type="range" min={2} max={8} value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="w-full" /></div>
          <div><label className="mb-1 block text-xs text-slate-600">File name</label><input value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm" /></div>
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-700">
          <label><input type="checkbox" checked={keywordUpper} onChange={(e) => setKeywordUpper(e.target.checked)} /> Uppercase keywords</label>
          <label><input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} /> Compact format</label>
          <label><input type="checkbox" checked={stripComments} onChange={(e) => setStripComments(e.target.checked)} /> Strip comments</label>
          <label><input type="checkbox" checked={ensureSemicolon} onChange={(e) => setEnsureSemicolon(e.target.checked)} /> Ensure semicolon</label>
        </div>
        <p className="mt-2 text-xs text-slate-500">Chars: {stats.chars} • Lines: {stats.lines} • Tokens: {stats.words}</p>
      </Panel>
      <Panel title="Formatted SQL">
        <OutputBlock value={formatted} />
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" onClick={() => downloadText(`${sanitizeFileName(fileName, "query")}.sql`, formatted, "text/plain;charset=utf-8")} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Download</button>
        </div>
      </Panel>
      <Panel title="Minified SQL">
        <OutputBlock value={minified} />
      </Panel>
    </div>
  );
}

const HTTP_STATUS_CODES = [
  { code: 200, text: "OK", category: "Success", details: "Request succeeded." },
  { code: 201, text: "Created", category: "Success", details: "Resource created successfully." },
  { code: 204, text: "No Content", category: "Success", details: "Success with empty response body." },
  { code: 301, text: "Moved Permanently", category: "Redirection", details: "Resource moved to a new permanent URL." },
  { code: 302, text: "Found", category: "Redirection", details: "Temporary redirect to a different URL." },
  { code: 400, text: "Bad Request", category: "Client Error", details: "Request payload or parameters are invalid." },
  { code: 401, text: "Unauthorized", category: "Client Error", details: "Authentication is required or invalid." },
  { code: 403, text: "Forbidden", category: "Client Error", details: "Request authenticated but not permitted." },
  { code: 404, text: "Not Found", category: "Client Error", details: "Requested resource was not found." },
  { code: 409, text: "Conflict", category: "Client Error", details: "Request conflicts with current resource state." },
  { code: 422, text: "Unprocessable Entity", category: "Client Error", details: "Semantic validation failed." },
  { code: 429, text: "Too Many Requests", category: "Client Error", details: "Rate limit exceeded." },
  { code: 500, text: "Internal Server Error", category: "Server Error", details: "Unexpected server-side failure." },
  { code: 502, text: "Bad Gateway", category: "Server Error", details: "Invalid upstream server response." },
  { code: 503, text: "Service Unavailable", category: "Server Error", details: "Service temporarily unavailable." },
  { code: 504, text: "Gateway Timeout", category: "Server Error", details: "Upstream service timed out." },
];

function HttpStatusCodeLookupTool() {
  const [query, setQuery] = useState("404");
  const [category, setCategory] = useState("All");
  const [apiStyle, setApiStyle] = useState<"rest" | "problem+json">("rest");
  const [includeTraceId, setIncludeTraceId] = useState(true);
  const [traceId, setTraceId] = useState("req_123456789");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HTTP_STATUS_CODES.filter((item) => {
      const byCategory = category === "All" || item.category === category;
      const byQuery = !q || String(item.code).includes(q) || item.text.toLowerCase().includes(q) || item.details.toLowerCase().includes(q);
      return byCategory && byQuery;
    });
  }, [query, category]);

  const primary = rows[0];
  const responseSample = primary
    ? JSON.stringify(
        apiStyle === "problem+json"
          ? {
              type: `https://httpstatuses.com/${primary.code}`,
              title: primary.text,
              status: primary.code,
              detail: primary.details,
              ...(includeTraceId ? { traceId } : {}),
            }
          : {
              status: primary.code,
              error: primary.text,
              message: primary.details,
              ...(includeTraceId ? { traceId } : {}),
            },
        null,
        2,
      )
    : "";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="HTTP status lookup">
        <div className="space-y-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Search by code or meaning" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm">
            {["All", "Success", "Redirection", "Client Error", "Server Error"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <div className="grid gap-2 sm:grid-cols-2">
            <select value={apiStyle} onChange={(e) => setApiStyle(e.target.value as "rest" | "problem+json")} className="w-full rounded-xl border border-slate-200 p-2 text-sm"><option value="rest">REST JSON</option><option value="problem+json">RFC 7807 problem+json</option></select>
            <input value={traceId} onChange={(e) => setTraceId(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm" placeholder="Trace ID" />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={includeTraceId} onChange={(e) => setIncludeTraceId(e.target.checked)} /> Include trace ID</label>
        </div>
        <div className="mt-3 max-h-64 space-y-2 overflow-auto">
          {rows.map((item) => (
            <div key={item.code} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{item.code} — {item.text}</p>
              <p className="text-xs text-slate-600">{item.category}</p>
              <p className="mt-1 text-xs text-slate-600">{item.details}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="API response template">
        {primary ? (
          <>
            <p className="mb-2 rounded-lg bg-slate-50 p-2 text-sm text-slate-700">Primary result: <strong>{primary.code} {primary.text}</strong></p>
            <OutputBlock value={responseSample} />
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => downloadText(`http-${primary.code}.json`, responseSample, "application/json;charset=utf-8")} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Download JSON</button>
              <CopyButton value={`HTTP ${primary.code} ${primary.text} — ${primary.details}`} />
            </div>
          </>
        ) : (
          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">No status code match for current filter.</p>
        )}
      </Panel>
    </div>
  );
}

function CanonicalChecker() {
  const [pageUrl, setPageUrl] = useState("https://tool-nest.tech/tools/meta-title-description-preview?ref=header");
  const [canonical, setCanonical] = useState("https://tool-nest.tech/tools/meta-title-description-preview");
  const [ignoreProtocol, setIgnoreProtocol] = useState(true);
  const [ignoreWww, setIgnoreWww] = useState(true);
  const [ignoreQuery, setIgnoreQuery] = useState(false);
  const [ignoreTrailingSlash, setIgnoreTrailingSlash] = useState(true);
  const [preferredDomain, setPreferredDomain] = useState("tool-nest.tech");

  const analysis = useMemo(() => {
    try {
      const page = new URL(pageUrl);
      const can = new URL(canonical);

      const normalize = (value: URL) => {
        let host = value.hostname;
        if (ignoreWww) host = host.replace(/^www\./, "");
        let path = value.pathname;
        if (ignoreTrailingSlash && path !== "/") path = path.replace(/\/$/, "");
        const proto = ignoreProtocol ? "*" : value.protocol;
        const search = ignoreQuery ? "" : value.search;
        return `${proto}//${host}${path}${search}`;
      };

      const normalizedPage = normalize(page);
      const normalizedCanonical = normalize(can);
      const exact = page.href === can.href;
      const normalizedMatch = normalizedPage === normalizedCanonical;
      const crossDomain = page.hostname.replace(/^www\./, "") !== can.hostname.replace(/^www\./, "");
      const queryOnlyDifference = page.pathname === can.pathname && page.search !== can.search;

      const issues: string[] = [];
      if (!exact && normalizedMatch) issues.push("Canonical differs only by normalization settings (protocol/www/slash/query).");
      if (crossDomain) issues.push("Canonical points to a different domain. Use only for intentional consolidation.");
      if (queryOnlyDifference) issues.push("Canonical and page differ by query parameters.");
      if (preferredDomain.trim() && !can.hostname.includes(preferredDomain.trim())) issues.push("Canonical does not use preferred domain.");
      if (!issues.length) issues.push("Canonical configuration looks healthy.");

      const status = exact ? "Perfect" : normalizedMatch ? "Good" : "Review";
      return {
        status,
        normalizedPage,
        normalizedCanonical,
        issues,
        tag: `<link rel="canonical" href="${can.toString()}" />`,
      };
    } catch {
      return {
        status: "Invalid",
        normalizedPage: "-",
        normalizedCanonical: "-",
        issues: ["Invalid URL format. Use full absolute URLs including https://"],
        tag: "",
      };
    }
  }, [pageUrl, canonical, ignoreProtocol, ignoreWww, ignoreQuery, ignoreTrailingSlash, preferredDomain]);

  return (
    <Panel title="Canonical URL checker">
      <div className="space-y-3">
        <input value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Page URL" />
        <input value={canonical} onChange={(e) => setCanonical(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Canonical URL" />
        <input value={preferredDomain} onChange={(e) => setPreferredDomain(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Preferred domain" />
        <div className="flex flex-wrap gap-4 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={ignoreProtocol} onChange={(e) => setIgnoreProtocol(e.target.checked)} /> Ignore protocol</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={ignoreWww} onChange={(e) => setIgnoreWww(e.target.checked)} /> Ignore www</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={ignoreQuery} onChange={(e) => setIgnoreQuery(e.target.checked)} /> Ignore query</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={ignoreTrailingSlash} onChange={(e) => setIgnoreTrailingSlash(e.target.checked)} /> Ignore trailing slash</label>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <p>Status: <strong>{analysis.status}</strong></p>
        <p className="mt-1 text-xs">Normalized page: {analysis.normalizedPage}</p>
        <p className="mt-1 text-xs">Normalized canonical: {analysis.normalizedCanonical}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
          {analysis.issues.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      {analysis.tag ? <div className="mt-3"><OutputBlock value={analysis.tag} /></div> : null}
    </Panel>
  );
}

function OpenGraphPreviewTool() {
  const [title, setTitle] = useState("ToolNest — Free Online SEO Tools");
  const [description, setDescription] = useState("Preview Open Graph and Twitter card metadata before publishing pages.");
  const [url, setUrl] = useState("https://tool-nest.tech");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=1200");
  const [siteName, setSiteName] = useState("ToolNest");
  const [locale, setLocale] = useState("en_US");
  const [imageAlt, setImageAlt] = useState("ToolNest Open Graph preview image");
  const [type, setType] = useState<"website" | "article" | "product">("website");
  const [twitterCard, setTwitterCard] = useState<"summary" | "summary_large_image">("summary_large_image");

  const titleWarn = title.length > 95;
  const descWarn = description.length > 200;
  const imageLikelyValid = /^https?:\/\//.test(image);

  const metaOutput = `<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${description}" />\n<meta property="og:url" content="${url}" />\n<meta property="og:image" content="${image}" />\n<meta property="og:image:alt" content="${imageAlt}" />\n<meta property="og:type" content="${type}" />\n<meta property="og:site_name" content="${siteName}" />\n<meta property="og:locale" content="${locale}" />\n<meta name="twitter:card" content="${twitterCard}" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${description}" />\n<meta name="twitter:image" content="${image}" />`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Open Graph and Twitter fields">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="og:title" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="og:description" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="og:url" />
          <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="og:image" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="og:site_name" />
            <input value={locale} onChange={(e) => setLocale(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="og:locale" />
            <select value={type} onChange={(e) => setType(e.target.value as "website" | "article" | "product")} className="w-full rounded-xl border border-slate-200 p-3 text-sm"><option value="website">website</option><option value="article">article</option><option value="product">product</option></select>
            <select value={twitterCard} onChange={(e) => setTwitterCard(e.target.value as "summary" | "summary_large_image")} className="w-full rounded-xl border border-slate-200 p-3 text-sm"><option value="summary_large_image">summary_large_image</option><option value="summary">summary</option></select>
          </div>
          <input value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="og:image:alt" />
          <div className="grid gap-2 sm:grid-cols-2">
            <p className={`text-xs ${titleWarn ? "text-rose-600" : "text-emerald-600"}`}>Title chars: {title.length}</p>
            <p className={`text-xs ${descWarn ? "text-rose-600" : "text-emerald-600"}`}>Description chars: {description.length}</p>
            <p className={`text-xs ${imageLikelyValid ? "text-emerald-600" : "text-rose-600"}`}>Image URL: {imageLikelyValid ? "Looks valid" : "Invalid"}</p>
            <p className="text-xs text-slate-600">Twitter card: {twitterCard}</p>
          </div>
        </div>
      </Panel>
      <Panel title="Social card preview and tags">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="h-40 w-full bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={imageAlt || "Open Graph preview"} className="h-full w-full object-cover" />
          </div>
          <div className="p-4">
            <p className="truncate text-xs text-slate-500">{url}</p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
        </article>
        <div className="mt-4">
          <OutputBlock value={metaOutput} />
        </div>
      </Panel>
    </div>
  );
}

function KeywordDensityChecker() {
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("seo");
  const [ngram, setNgram] = useState<1 | 2 | 3>(1);
  const [minLength, setMinLength] = useState(3);
  const [topLimit, setTopLimit] = useState(12);
  const [excludeStopWords, setExcludeStopWords] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const stopWords = useMemo(() => new Set(["the", "and", "for", "with", "that", "this", "from", "into", "your", "you", "are", "was", "were", "have", "has", "had", "to", "of", "in", "on", "at", "a", "an"]), []);

  const analysis = useMemo(() => {
    const source = caseSensitive ? text : text.toLowerCase();
    const words = (source.match(/[a-z0-9]+/gi) ?? []).map((item) => item.trim()).filter(Boolean);
    const filtered = words.filter((word) => word.length >= minLength && (!excludeStopWords || !stopWords.has(word.toLowerCase())));

    const terms: string[] = [];
    for (let i = 0; i < filtered.length; i += 1) {
      if (ngram === 1) terms.push(filtered[i]);
      if (ngram === 2 && i + 1 < filtered.length) terms.push(`${filtered[i]} ${filtered[i + 1]}`);
      if (ngram === 3 && i + 2 < filtered.length) terms.push(`${filtered[i]} ${filtered[i + 1]} ${filtered[i + 2]}`);
    }

    const total = terms.length || 1;
    const counts = new Map<string, number>();
    terms.forEach((term) => counts.set(term, (counts.get(term) ?? 0) + 1));

    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, Math.max(5, topLimit))
      .map(([term, count]) => ({ term, count, density: ((count / total) * 100).toFixed(2) }));

    const target = (caseSensitive ? keyword : keyword.toLowerCase()).trim();
    const targetCount = target ? (counts.get(target) ?? 0) : 0;
    const targetDensity = target ? ((targetCount / total) * 100).toFixed(2) : "0.00";
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const avgSentence = sentences.length ? (words.length / sentences.length).toFixed(1) : "0.0";
    return { top, total, targetCount, targetDensity, words: words.length, sentences: sentences.length, avgSentence };
  }, [text, keyword, ngram, minLength, topLimit, excludeStopWords, caseSensitive, stopWords]);

  const csv = useMemo(() => {
    const lines = analysis.top.map((item) => `${item.term},${item.count},${item.density}`);
    return ["term,count,density", ...lines].join("\n");
  }, [analysis.top]);

  return (
    <Panel title="Keyword density checker">
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-44 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Paste article text" />
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Target keyword/phrase" />
        <select value={ngram} onChange={(e) => setNgram(Number(e.target.value) as 1 | 2 | 3)} className="w-full rounded-xl border border-slate-200 p-3 text-sm"><option value={1}>Unigram</option><option value={2}>Bigram</option><option value={3}>Trigram</option></select>
        <input type="number" min={2} max={8} value={minLength} onChange={(e) => setMinLength(Number(e.target.value) || 3)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Min word length" />
        <input type="number" min={5} max={30} value={topLimit} onChange={(e) => setTopLimit(Number(e.target.value) || 12)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Top terms" />
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={excludeStopWords} onChange={(e) => setExcludeStopWords(e.target.checked)} /> Exclude stop words</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} /> Case sensitive</label>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Indexed terms: <strong>{analysis.total}</strong></p>
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Target density: <strong>{analysis.targetDensity}%</strong> ({analysis.targetCount})</p>
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Avg sentence length: <strong>{analysis.avgSentence}</strong> words</p>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {analysis.top.map((item) => (
          <div key={item.term} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <span className="font-semibold">{item.term}</span> — {item.count} ({item.density}%)
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => downloadText("keyword-density.csv", csv, "text/csv;charset=utf-8")} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700" disabled={analysis.top.length === 0}>Download CSV</button>
      </div>
    </Panel>
  );
}

function SchemaMarkupGeneratorTool() {
  const [schemaType, setSchemaType] = useState<"article" | "product" | "faq">("article");
  const [title, setTitle] = useState("Technical SEO Checklist for 2026");
  const [description, setDescription] = useState("A practical technical SEO checklist covering crawlability, rendering, indexing, and structured data.");
  const [url, setUrl] = useState("https://tool-nest.tech/blog/technical-seo-checklist");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200");
  const [brand, setBrand] = useState("ToolNest");
  const [price, setPrice] = useState("49.00");
  const [currency, setCurrency] = useState("USD");
  const [availability, setAvailability] = useState("https://schema.org/InStock");
  const [faqItems, setFaqItems] = useState("What is technical SEO?|Technical SEO improves crawling, rendering, and indexing quality.\nHow often should I audit? | Run a full audit monthly and after major releases.");

  const parsedFaqs = useMemo(() => faqItems.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [question, answer] = line.split("|").map((item) => item.trim());
    return { question: question || "Untitled question", answer: answer || "Add answer" };
  }), [faqItems]);

  const output = useMemo(() => {
    const base = {
      "@context": "https://schema.org",
      "@type": schemaType === "article" ? "Article" : schemaType === "product" ? "Product" : "FAQPage",
    } as Record<string, unknown>;

    if (schemaType === "article") {
      Object.assign(base, {
        headline: title,
        description,
        url,
        image,
        author: { "@type": "Organization", name: brand },
        publisher: { "@type": "Organization", name: brand },
      });
    }

    if (schemaType === "product") {
      Object.assign(base, {
        name: title,
        description,
        image,
        brand: { "@type": "Brand", name: brand },
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: currency,
          availability,
          url,
        },
      });
    }

    if (schemaType === "faq") {
      Object.assign(base, {
        mainEntity: parsedFaqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      });
    }

    return `<script type="application/ld+json">\n${JSON.stringify(base, null, 2)}\n</script>`;
  }, [schemaType, title, description, url, image, brand, price, currency, availability, parsedFaqs]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Schema builder">
        <div className="space-y-3">
          <select value={schemaType} onChange={(e) => setSchemaType(e.target.value as "article" | "product" | "faq")} className="w-full rounded-xl border border-slate-200 p-3 text-sm"><option value="article">Article</option><option value="product">Product</option><option value="faq">FAQ</option></select>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Title" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Description" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Canonical URL" />
          <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Image URL" />
          <input value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Brand / Publisher" />
          {schemaType === "product" ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Price" />
              <input value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Currency" />
              <input value={availability} onChange={(e) => setAvailability(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Availability URL" />
            </div>
          ) : null}
          {schemaType === "faq" ? <textarea value={faqItems} onChange={(e) => setFaqItems(e.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-3 font-mono text-xs" placeholder="Question|Answer" /> : null}
        </div>
      </Panel>
      <Panel title="JSON-LD output">
        <p className="mb-3 rounded-xl bg-slate-50 p-2 text-xs text-slate-700">Required-field check: {title && description && url ? "Ready" : "Missing required values"}</p>
        <OutputBlock value={output} />
      </Panel>
    </div>
  );
}

function HreflangTagGeneratorTool() {
  const [entries, setEntries] = useState("en-US|https://tool-nest.tech/seo-checklist\nen-GB|https://tool-nest.tech/uk/seo-checklist\nhi-IN|https://tool-nest.tech/in/seo-checklist");
  const [includeXDefault, setIncludeXDefault] = useState(true);
  const [xDefaultUrl, setXDefaultUrl] = useState("https://tool-nest.tech/seo-checklist");

  const parsed = useMemo(() => entries.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [lang, href] = line.split("|").map((item) => item.trim());
    return { lang: lang || "en-US", href: href || "" };
  }), [entries]);

  const tags = useMemo(() => {
    const lines = parsed
      .filter((item) => item.href)
      .map((item) => `<link rel="alternate" hreflang="${item.lang}" href="${item.href}" />`);
    if (includeXDefault && xDefaultUrl.trim()) lines.push(`<link rel="alternate" hreflang="x-default" href="${xDefaultUrl.trim()}" />`);
    return lines.join("\n");
  }, [parsed, includeXDefault, xDefaultUrl]);

  const sitemapFragment = useMemo(() => {
    const alternates = parsed
      .filter((item) => item.href)
      .map((item) => `  <xhtml:link rel="alternate" hreflang="${item.lang}" href="${item.href}" />`)
      .join("\n");
    return `<url>\n  <loc>${parsed[0]?.href || "https://example.com/page"}</loc>\n${alternates}\n</url>`;
  }, [parsed]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Hreflang mapping input">
        <textarea value={entries} onChange={(e) => setEntries(e.target.value)} className="h-44 w-full rounded-xl border border-slate-200 p-3 font-mono text-xs" placeholder="lang|url" />
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeXDefault} onChange={(e) => setIncludeXDefault(e.target.checked)} /> Include x-default</label>
          <input value={xDefaultUrl} onChange={(e) => setXDefaultUrl(e.target.value)} className="min-w-65 flex-1 rounded-xl border border-slate-200 p-2 text-sm" placeholder="x-default URL" />
        </div>
      </Panel>
      <Panel title="Generated hreflang tags">
        <OutputBlock value={tags || ""} />
        <div className="mt-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Sitemap fragment</p>
          <OutputBlock value={sitemapFragment} />
        </div>
      </Panel>
    </div>
  );
}

function RedirectRuleGeneratorTool() {
  const [pairs, setPairs] = useState("/old-seo-guide,/seo-guide\n/old-contact,/contact");
  const [domain, setDomain] = useState("https://tool-nest.tech");
  const [status, setStatus] = useState<"301" | "302">("301");

  const parsed = useMemo(() => pairs.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [from, to] = line.split(",").map((item) => item.trim());
    return { from: from || "", to: to || "" };
  }), [pairs]);

  const htaccess = useMemo(() => parsed.filter((item) => item.from && item.to).map((item) => `Redirect ${status} ${item.from} ${item.to.startsWith("http") ? item.to : `${domain}${item.to}`}`).join("\n"), [parsed, status, domain]);
  const nginx = useMemo(() => parsed.filter((item) => item.from && item.to).map((item) => `rewrite ^${item.from}$ ${item.to.startsWith("http") ? item.to : `${domain}${item.to}`} ${status === "301" ? "permanent" : "redirect"};`).join("\n"), [parsed, status, domain]);
  const netlify = useMemo(() => parsed.filter((item) => item.from && item.to).map((item) => `${item.from} ${item.to.startsWith("http") ? item.to : item.to} ${status}!`).join("\n"), [parsed, status]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Redirect mapping input">
        <textarea value={pairs} onChange={(e) => setPairs(e.target.value)} className="h-44 w-full rounded-xl border border-slate-200 p-3 font-mono text-xs" placeholder="/old,/new" />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Domain" />
          <select value={status} onChange={(e) => setStatus(e.target.value as "301" | "302")} className="w-full rounded-xl border border-slate-200 p-3 text-sm"><option value="301">301 Permanent</option><option value="302">302 Temporary</option></select>
        </div>
      </Panel>
      <Panel title="Redirect rules output">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Apache (.htaccess)</p>
        <OutputBlock value={htaccess} />
        <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Nginx</p>
        <OutputBlock value={nginx} />
        <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Netlify _redirects</p>
        <OutputBlock value={netlify} />
      </Panel>
    </div>
  );
}

function RobotsMetaTagGeneratorTool() {
  const [index, setIndex] = useState(true);
  const [follow, setFollow] = useState(true);
  const [noarchive, setNoarchive] = useState(false);
  const [nosnippet, setNosnippet] = useState(false);
  const [noimageindex, setNoimageindex] = useState(false);
  const [maxSnippet, setMaxSnippet] = useState("-1");
  const [maxImagePreview, setMaxImagePreview] = useState<"none" | "standard" | "large">("large");
  const [maxVideoPreview, setMaxVideoPreview] = useState("-1");

  const directives = [index ? "index" : "noindex", follow ? "follow" : "nofollow"];
  if (noarchive) directives.push("noarchive");
  if (nosnippet) directives.push("nosnippet");
  if (noimageindex) directives.push("noimageindex");
  directives.push(`max-snippet:${maxSnippet}`);
  directives.push(`max-image-preview:${maxImagePreview}`);
  directives.push(`max-video-preview:${maxVideoPreview}`);

  const meta = `<meta name="robots" content="${directives.join(", ")}" />`;
  const header = `X-Robots-Tag: ${directives.join(", ")}`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Robots directives">
        <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={index} onChange={(e) => setIndex(e.target.checked)} /> Index</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} /> Follow</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={noarchive} onChange={(e) => setNoarchive(e.target.checked)} /> noarchive</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={nosnippet} onChange={(e) => setNosnippet(e.target.checked)} /> nosnippet</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={noimageindex} onChange={(e) => setNoimageindex(e.target.checked)} /> noimageindex</label>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input value={maxSnippet} onChange={(e) => setMaxSnippet(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="max-snippet" />
          <select value={maxImagePreview} onChange={(e) => setMaxImagePreview(e.target.value as "none" | "standard" | "large")} className="w-full rounded-xl border border-slate-200 p-3 text-sm"><option value="none">none</option><option value="standard">standard</option><option value="large">large</option></select>
          <input value={maxVideoPreview} onChange={(e) => setMaxVideoPreview(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="max-video-preview" />
        </div>
      </Panel>
      <Panel title="Meta and header output">
        <OutputBlock value={meta} />
        <div className="mt-3">
          <OutputBlock value={header} />
        </div>
      </Panel>
    </div>
  );
}

function KeywordClusterGeneratorTool() {
  const [keywordsInput, setKeywordsInput] = useState("technical seo audit\nseo audit checklist\nseo checklist for ecommerce\nseo crawl budget optimization\non page seo checklist");
  const [brand, setBrand] = useState("ToolNest");
  const [audience, setAudience] = useState("marketers");

  const keywords = useMemo(() => keywordsInput.split("\n").map((line) => line.trim().toLowerCase()).filter(Boolean), [keywordsInput]);

  const clusters = useMemo(() => {
    const map = new Map<string, string[]>();
    keywords.forEach((key) => {
      const seed = key.split(" ")[0] || "general";
      map.set(seed, [...(map.get(seed) ?? []), key]);
    });
    return [...map.entries()].map(([seed, terms]) => ({
      seed,
      terms,
      title: `${seed.toUpperCase()} Guide for ${audience} | ${brand}`,
      h1: `${seed} strategy and checklist`,
      intent: terms.some((item) => item.includes("buy") || item.includes("price")) ? "Commercial" : terms.some((item) => item.includes("how") || item.includes("what")) ? "Informational" : "Mixed",
    }));
  }, [keywords, brand, audience]);

  const csv = useMemo(() => {
    const rows = clusters.flatMap((cluster) => cluster.terms.map((term) => `${cluster.seed},${term},${cluster.intent},${cluster.title},${cluster.h1}`));
    return ["cluster,keyword,intent,title,h1", ...rows].join("\n");
  }, [clusters]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Keyword input">
        <textarea value={keywordsInput} onChange={(e) => setKeywordsInput(e.target.value)} className="h-44 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="One keyword per line" />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Brand" />
          <input value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Audience" />
        </div>
      </Panel>
      <Panel title="Keyword clusters and outlines">
        <div className="max-h-72 space-y-2 overflow-auto">
          {clusters.map((cluster) => (
            <div key={cluster.seed} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              <p><strong>Cluster:</strong> {cluster.seed}</p>
              <p><strong>Intent:</strong> {cluster.intent}</p>
              <p><strong>SEO title:</strong> {cluster.title}</p>
              <p><strong>H1:</strong> {cluster.h1}</p>
              <p><strong>Keywords:</strong> {cluster.terms.join(", ")}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => downloadText("keyword-clusters.csv", csv, "text/csv;charset=utf-8")} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700" disabled={clusters.length === 0}>Download CSV</button>
          <CopyButton value={csv} />
        </div>
      </Panel>
    </div>
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
  const [mode, setMode] = useState<"words" | "sentences" | "paragraphs" | "list">("paragraphs");
  const [count, setCount] = useState(3);
  const [style, setStyle] = useState<"classic" | "tech" | "marketing">("classic");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [wordsPerSentence, setWordsPerSentence] = useState(14);
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState(4);
  const [includeCommas, setIncludeCommas] = useState(true);
  const [capitalizeSentences, setCapitalizeSentences] = useState(true);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [seed, setSeed] = useState("toolnest-seed");

  const dictionary = useMemo(() => {
    if (style === "tech") return [...loremWords, "platform", "deploy", "scalable", "latency", "indexing", "pipeline", "automation", "semantic"];
    if (style === "marketing") return [...loremWords, "conversion", "audience", "campaign", "insight", "retention", "growth", "funnel", "engagement"];
    return loremWords;
  }, [style]);

  const seedOffset = useMemo(() => seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0), [seed]);

  const output = useMemo(() => {
    const wordAt = (index: number) => dictionary[(index + seedOffset) % dictionary.length];
    const makeWords = (quantity: number, startIndex: number) => Array.from({ length: quantity }, (_, i) => wordAt(startIndex + i));
    const punctuate = (words: string[], sentenceIndex: number) => {
      const next = [...words];
      if (includeCommas && next.length > 7) {
        const commaPos = 3 + (sentenceIndex % Math.max(2, next.length - 4));
        next[commaPos] = `${next[commaPos]},`;
      }
      let sentence = next.join(" ");
      if (capitalizeSentences) sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      return `${sentence}.`;
    };

    if (mode === "words") {
      const content = makeWords(count, 0).join(" ");
      return startWithLorem ? `Lorem ipsum ${content}`.trim() : content;
    }

    if (mode === "sentences") {
      const lines = Array.from({ length: count }, (_, i) => punctuate(makeWords(wordsPerSentence + (i % 4), i * wordsPerSentence), i));
      return startWithLorem && lines.length > 0 ? `Lorem ipsum ${lines.join(" ")}` : lines.join(" ");
    }

    if (mode === "list") {
      const items = Array.from({ length: count }, (_, i) => punctuate(makeWords(wordsPerSentence, i * wordsPerSentence), i));
      if (includeHtml) return `<ul>\n${items.map((item) => `  <li>${item}</li>`).join("\n")}\n</ul>`;
      return items.map((item) => `- ${item}`).join("\n");
    }

    const paragraphs = Array.from({ length: count }, (_, p) => {
      const paraSentences = Array.from({ length: sentencesPerParagraph }, (_, s) => punctuate(makeWords(wordsPerSentence + ((p + s) % 5), (p * sentencesPerParagraph + s) * wordsPerSentence), p + s));
      const paragraph = paraSentences.join(" ");
      if (includeHtml) return `<p>${paragraph}</p>`;
      return paragraph;
    });

    const merged = paragraphs.join(includeHtml ? "\n" : "\n\n");
    return startWithLorem ? `Lorem ipsum ${merged}` : merged;
  }, [mode, count, dictionary, seedOffset, includeCommas, capitalizeSentences, startWithLorem, wordsPerSentence, sentencesPerParagraph, includeHtml]);

  const stats = useMemo(() => {
    const words = (output.match(/[a-z0-9']+/gi) ?? []).length;
    const chars = output.length;
    const paragraphs = includeHtml ? (output.match(/<p>/g) ?? []).length : output.split(/\n\s*\n/).filter(Boolean).length;
    return { words, chars, paragraphs };
  }, [output, includeHtml]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Lorem ipsum generator controls">
        <div className="grid gap-3 sm:grid-cols-2">
          <select value={mode} onChange={(e) => setMode(e.target.value as "words" | "sentences" | "paragraphs" | "list")} className="w-full rounded-xl border border-slate-200 p-3 text-sm"><option value="words">Words</option><option value="sentences">Sentences</option><option value="paragraphs">Paragraphs</option><option value="list">Bullet list</option></select>
          <select value={style} onChange={(e) => setStyle(e.target.value as "classic" | "tech" | "marketing")} className="w-full rounded-xl border border-slate-200 p-3 text-sm"><option value="classic">Classic</option><option value="tech">Tech tone</option><option value="marketing">Marketing tone</option></select>
          <input type="number" value={count} min={1} max={40} onChange={(e) => setCount(Number(e.target.value) || 3)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Count" />
          <input type="number" value={wordsPerSentence} min={6} max={30} onChange={(e) => setWordsPerSentence(Number(e.target.value) || 14)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Words per sentence" />
          <input type="number" value={sentencesPerParagraph} min={2} max={10} onChange={(e) => setSentencesPerParagraph(Number(e.target.value) || 4)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Sentences per paragraph" />
          <input value={seed} onChange={(e) => setSeed(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Seed" />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} /> Start with &quot;Lorem ipsum&quot;</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeCommas} onChange={(e) => setIncludeCommas(e.target.checked)} /> Include commas</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={capitalizeSentences} onChange={(e) => setCapitalizeSentences(e.target.checked)} /> Capitalize sentences</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeHtml} onChange={(e) => setIncludeHtml(e.target.checked)} /> HTML output</label>
        </div>
      </Panel>
      <Panel title="Generated output and stats">
        <OutputBlock value={output} />
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Metric label="Words" value={String(stats.words)} />
          <Metric label="Characters" value={String(stats.chars)} />
          <Metric label="Paragraphs" value={String(stats.paragraphs)} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => downloadText("lorem-ipsum.txt", output)} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700" disabled={!output}>Download</button>
        </div>
      </Panel>
    </div>
  );
}

function TextCleaner() {
  const [text, setText] = useState("");
  const [trimLines, setTrimLines] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [removeJunk, setRemoveJunk] = useState(true);
  const [removeExtraBlankLines, setRemoveExtraBlankLines] = useState(true);
  const [removeBlankLines, setRemoveBlankLines] = useState(false);
  const [dedupeLines, setDedupeLines] = useState(false);
  const [normalizeQuotes, setNormalizeQuotes] = useState(false);
  const [normalizeDashes, setNormalizeDashes] = useState(false);
  const [stripHtml, setStripHtml] = useState(false);
  const [removePunctuation, setRemovePunctuation] = useState(false);
  const [removeNumbers, setRemoveNumbers] = useState(false);
  const [caseMode, setCaseMode] = useState<"none" | "lower" | "upper" | "title">("none");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [regexFlags, setRegexFlags] = useState("g");

  const cleaned = useMemo(() => {
    let value = text.replace(/\r/g, "");
    if (stripHtml) value = value.replace(/<[^>]*>/g, " ");
    if (removeJunk) value = value.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
    if (normalizeQuotes) value = value.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    if (normalizeDashes) value = value.replace(/[–—]/g, "-");
    if (removeNumbers) value = value.replace(/\d+/g, "");
    if (removePunctuation) value = value.replace(/[.,/#!$%^&*;:{}=\-_`~()\[\]"'?<>\\|+]/g, " ");

    if (findText.trim()) {
      if (useRegex) {
        try {
          value = value.replace(new RegExp(findText, regexFlags), replaceText);
        } catch {
          value = value;
        }
      } else {
        value = value.split(findText).join(replaceText);
      }
    }

    let lines = value.split("\n");
    if (trimLines) lines = lines.map((line) => line.trim());
    if (removeBlankLines) lines = lines.filter((line) => line.length > 0);
    if (dedupeLines) {
      const seen = new Set<string>();
      lines = lines.filter((line) => {
        if (seen.has(line)) return false;
        seen.add(line);
        return true;
      });
    }
    value = lines.join("\n");

    if (collapseSpaces) value = value.replace(/[ \t]+/g, " ");
    if (removeExtraBlankLines) value = value.replace(/\n{3,}/g, "\n\n");

    if (caseMode === "lower") value = value.toLowerCase();
    if (caseMode === "upper") value = value.toUpperCase();
    if (caseMode === "title") {
      value = value
        .split("\n")
        .map((line) => line.split(/\s+/).map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part)).join(" "))
        .join("\n");
    }

    return value.trim();
  }, [text, trimLines, collapseSpaces, removeJunk, removeExtraBlankLines, removeBlankLines, dedupeLines, normalizeQuotes, normalizeDashes, stripHtml, removePunctuation, removeNumbers, caseMode, findText, replaceText, useRegex, regexFlags]);

  const stats = useMemo(() => {
    const inputWords = (text.match(/\S+/g) ?? []).length;
    const outputWords = (cleaned.match(/\S+/g) ?? []).length;
    const inputChars = text.length;
    const outputChars = cleaned.length;
    const reducedChars = Math.max(0, inputChars - outputChars);
    const reducedPct = inputChars ? ((reducedChars / inputChars) * 100).toFixed(1) : "0.0";
    const inputLines = text ? text.split("\n").length : 0;
    const outputLines = cleaned ? cleaned.split("\n").length : 0;
    return { inputWords, outputWords, inputChars, outputChars, reducedChars, reducedPct, inputLines, outputLines };
  }, [text, cleaned]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Source text and cleaning rules">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-56 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Paste noisy text" />
        <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} /> Trim lines</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={collapseSpaces} onChange={(e) => setCollapseSpaces(e.target.checked)} /> Collapse spaces</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removeJunk} onChange={(e) => setRemoveJunk(e.target.checked)} /> Remove junk chars</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removeExtraBlankLines} onChange={(e) => setRemoveExtraBlankLines(e.target.checked)} /> Limit blank lines</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removeBlankLines} onChange={(e) => setRemoveBlankLines(e.target.checked)} /> Remove all blank lines</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={dedupeLines} onChange={(e) => setDedupeLines(e.target.checked)} /> Dedupe lines</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={normalizeQuotes} onChange={(e) => setNormalizeQuotes(e.target.checked)} /> Normalize quotes</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={normalizeDashes} onChange={(e) => setNormalizeDashes(e.target.checked)} /> Normalize dashes</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={stripHtml} onChange={(e) => setStripHtml(e.target.checked)} /> Strip HTML tags</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removePunctuation} onChange={(e) => setRemovePunctuation(e.target.checked)} /> Remove punctuation</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removeNumbers} onChange={(e) => setRemoveNumbers(e.target.checked)} /> Remove numbers</label>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input value={findText} onChange={(e) => setFindText(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Find" />
          <input value={replaceText} onChange={(e) => setReplaceText(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Replace" />
          <select value={caseMode} onChange={(e) => setCaseMode(e.target.value as "none" | "lower" | "upper" | "title")} className="w-full rounded-xl border border-slate-200 p-3 text-sm"><option value="none">Case: none</option><option value="lower">lowercase</option><option value="upper">UPPERCASE</option><option value="title">Title Case</option></select>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} /> Regex find</label>
          <input value={regexFlags} onChange={(e) => setRegexFlags(e.target.value)} className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm" placeholder="flags" />
        </div>
      </Panel>
      <Panel title="Clean output and diff stats">
        <OutputBlock value={cleaned} />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Input words: <strong>{stats.inputWords}</strong> • Output words: <strong>{stats.outputWords}</strong></p>
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Input chars: <strong>{stats.inputChars}</strong> • Output chars: <strong>{stats.outputChars}</strong></p>
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Input lines: <strong>{stats.inputLines}</strong> • Output lines: <strong>{stats.outputLines}</strong></p>
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Reduced: <strong>{stats.reducedChars}</strong> chars ({stats.reducedPct}%)</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setText(cleaned)} className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700" disabled={!cleaned}>Use as input</button>
          <button type="button" onClick={() => downloadText("cleaned-text.txt", cleaned)} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700" disabled={!cleaned}>Download</button>
          <button type="button" onClick={() => { setText(""); }} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200" disabled={!text}>Clear source</button>
        </div>
      </Panel>
    </div>
  );
}

/* ───── FAQ Schema Generator Page Template ───── */
function FaqSchemaGeneratorPageTemplate() {
  const [pairs, setPairs] = useState<{q: string; a: string}[]>([{q: "", a: ""}, {q: "", a: ""}, {q: "", a: ""}]);

  const updatePair = (idx: number, field: "q" | "a", value: string) => {
    setPairs(prev => prev.map((p, i) => i === idx ? {...p, [field]: value} : p));
  };

  const addPair = () => setPairs(prev => [...prev, {q: "", a: ""}]);
  const removePair = (idx: number) => setPairs(prev => prev.filter((_, i) => i !== idx));

  const validPairs = pairs.filter(p => p.q.trim() && p.a.trim());

  const schema = useMemo(() => {
    if (validPairs.length === 0) return "";
    const obj = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: validPairs.map(p => ({
        "@type": "Question",
        name: p.q.trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: p.a.trim(),
        },
      })),
    };
    return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
  }, [validPairs]);

  return (
    <div className="space-y-4">
      <Panel title="FAQ Schema Generator">
        <p className="mb-3 text-sm text-slate-600">Add question-answer pairs to generate FAQPage JSON-LD schema markup.</p>
        <div className="space-y-4">
          {pairs.map((pair, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600">Q{idx + 1}</span>
                {pairs.length > 1 && <button type="button" onClick={() => removePair(idx)} className="text-xs text-red-500 hover:text-red-700">✕ Remove</button>}
              </div>
              <input value={pair.q} onChange={(e) => updatePair(idx, "q", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" placeholder={`Question ${idx + 1}`} />
              <textarea value={pair.a} onChange={(e) => updatePair(idx, "a", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none h-20" placeholder="Answer" />
            </div>
          ))}
        </div>
        <button type="button" onClick={addPair} className="mt-3 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">+ Add Q&A Pair</button>
      </Panel>
      {validPairs.length > 0 && (
        <Panel title="Generated JSON-LD Schema">
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4">
            <pre className="text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">{schema}</pre>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton value={schema} />
            <span className="text-xs text-slate-500 self-center">{validPairs.length} Q&A pair(s) • {schema.length} chars</span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Rich Result Preview</h3>
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
              {validPairs.map((p, i) => (
                <details key={i} className="group border border-slate-100 rounded-lg">
                  <summary className="cursor-pointer p-3 text-sm font-medium text-blue-700 hover:bg-slate-50 list-none flex items-center gap-2">
                    <span className="text-slate-400 group-open:rotate-90 transition-transform">▶</span>
                    {p.q}
                  </summary>
                  <p className="px-3 pb-3 text-sm text-slate-600">{p.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

/* ───── Internal Link Suggestion Tool ───── */
function InternalLinkSuggestionTool() {
  const [pagesInput, setPagesInput] = useState("https://example.com/seo-guide | seo guide\nhttps://example.com/keyword-research | keyword research\nhttps://example.com/link-building | link building");
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState<{keyword: string; url: string; count: number; positions: number[]}[]>([]);

  const analyze = useCallback(() => {
    if (!content.trim() || !pagesInput.trim()) { setSuggestions([]); return; }
    const pages = pagesInput.split("\n").map(line => {
      const parts = line.split("|").map(s => s.trim());
      return { url: parts[0] || "", keyword: parts[1] || "" };
    }).filter(p => p.url && p.keyword);

    const contentLower = content.toLowerCase();
    const results: typeof suggestions = [];
    for (const page of pages) {
      const kw = page.keyword.toLowerCase();
      const positions: number[] = [];
      let idx = contentLower.indexOf(kw);
      while (idx !== -1) {
        positions.push(idx);
        idx = contentLower.indexOf(kw, idx + kw.length);
      }
      if (positions.length > 0) {
        results.push({ keyword: page.keyword, url: page.url, count: positions.length, positions });
      }
    }
    results.sort((a, b) => b.count - a.count);
    setSuggestions(results);
  }, [content, pagesInput]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Page URLs & Keywords">
        <p className="mb-2 text-xs text-slate-500">One per line: URL | keyword</p>
        <textarea value={pagesInput} onChange={(e) => setPagesInput(e.target.value)} className="h-36 w-full rounded-xl border border-slate-200 p-3 text-sm font-mono focus:border-indigo-400 focus:outline-none" placeholder="https://example.com/page | target keyword" />
        <div className="mt-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">Content to Analyze</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="h-48 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-400 focus:outline-none" placeholder="Paste the content of the page you want to optimize for internal links..." />
        </div>
        <button type="button" onClick={analyze} className="mt-3 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition" disabled={!content.trim() || !pagesInput.trim()}>Find Link Opportunities</button>
      </Panel>
      <Panel title={`Suggestions (${suggestions.length})`}>
        {suggestions.length === 0 ? (
          <p className="text-sm text-slate-500">No matches yet. Enter pages and content, then click analyze.</p>
        ) : (
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">"{s.keyword}"</p>
                    <p className="text-xs text-indigo-600 break-all">{s.url}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">{s.count}×</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Found at position{s.positions.length > 1 ? "s" : ""}: {s.positions.slice(0, 5).join(", ")}{s.positions.length > 5 ? " ..." : ""}</p>
              </div>
            ))}
            <div className="mt-2 flex gap-2">
              <CopyButton value={suggestions.map(s => `${s.keyword} → ${s.url} (${s.count}× found)`).join("\n")} />
              <span className="text-xs text-slate-500 self-center">{suggestions.reduce((a, s) => a + s.count, 0)} total matches across {suggestions.length} keywords</span>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ───── SERP Snippet Pixel Checker ───── */
function SerpSnippetPixelChecker() {
  const [title, setTitle] = useState("ToolNest — Free Online SEO Tools for Webmasters");
  const [description, setDescription] = useState("ToolNest provides 110+ free browser-based SEO, image, student, creator, and utility tools. No sign-up needed. Run everything locally in your browser.");
  const [url, setUrl] = useState("https://tool-nest.tech");
  const titleRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLSpanElement>(null);
  const [titlePx, setTitlePx] = useState(0);
  const [descPx, setDescPx] = useState(0);

  const TITLE_LIMIT = 580;
  const DESC_LIMIT = 920;

  useEffect(() => {
    if (titleRef.current) setTitlePx(titleRef.current.offsetWidth);
    if (descRef.current) setDescPx(descRef.current.offsetWidth);
  }, [title, description]);

  const titleOk = titlePx <= TITLE_LIMIT;
  const descOk = descPx <= DESC_LIMIT;

  return (
    <div className="space-y-4">
      <Panel title="SERP Snippet Pixel Checker">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Page Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" placeholder="Your page title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none h-20" placeholder="Your meta description" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" placeholder="https://example.com/page" />
          </div>
        </div>

        {/* Pixel measurement bars */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className={`rounded-xl border p-3 text-center ${titleOk ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
            <p className="text-xs text-slate-500">Title Width</p>
            <p className={`text-xl font-bold ${titleOk ? "text-emerald-700" : "text-red-700"}`}>{titlePx}px</p>
            <p className="text-xs text-slate-500">Limit: {TITLE_LIMIT}px {titleOk ? "✓ Fits" : "✕ Truncated"}</p>
            <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${titleOk ? "bg-emerald-500" : "bg-red-500"}`} style={{width: `${Math.min(100, (titlePx / TITLE_LIMIT) * 100)}%`}} />
            </div>
            <p className="mt-1 text-xs text-slate-400">{title.length} chars</p>
          </div>
          <div className={`rounded-xl border p-3 text-center ${descOk ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
            <p className="text-xs text-slate-500">Description Width</p>
            <p className={`text-xl font-bold ${descOk ? "text-emerald-700" : "text-red-700"}`}>{descPx}px</p>
            <p className="text-xs text-slate-500">Limit: {DESC_LIMIT}px {descOk ? "✓ Fits" : "✕ Truncated"}</p>
            <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${descOk ? "bg-emerald-500" : "bg-red-500"}`} style={{width: `${Math.min(100, (descPx / DESC_LIMIT) * 100)}%`}} />
            </div>
            <p className="mt-1 text-xs text-slate-400">{description.length} chars</p>
          </div>
        </div>
      </Panel>

      {/* SERP Preview */}
      <Panel title="Google SERP Preview">
        <div className="rounded-xl border border-slate-200 bg-white p-4 max-w-2xl">
          <p className="text-xs text-slate-500 mb-1">{url || "https://example.com"}</p>
          <h3 className="text-lg font-medium text-blue-700 hover:underline cursor-pointer leading-snug" style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "600px"}}>
            {title || "Page Title"}
          </h3>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed" style={{display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: "600px"}}>
            {description || "Meta description will appear here..."}
          </p>
        </div>
        {/* Hidden measurement spans */}
        <span ref={titleRef} className="invisible absolute whitespace-nowrap text-lg font-medium" style={{fontFamily: "arial, sans-serif"}}>{title}</span>
        <span ref={descRef} className="invisible absolute" style={{fontFamily: "arial, sans-serif", fontSize: "14px", maxWidth: "600px", display: "inline"}}>{description}</span>
      </Panel>
    </div>
  );
}

/* ── HTML Minifier Beautifier ── */
function HtmlMinifierBeautifier() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const minify = () => {
    setOutput(code.replace(/<!--[\s\S]*?-->/g, "").replace(/\s{2,}/g, " ").replace(/>\s+</g, "><").trim());
  };
  const beautify = () => {
    let indent = 0;
    const result = code.replace(/></g, ">\n<").split("\n").map(line => {
      line = line.trim();
      if (line.match(/^<\//)) indent = Math.max(0, indent - 1);
      const indented = "  ".repeat(indent) + line;
      if (line.match(/^<[^/!]/) && !line.match(/\/>$/) && !line.match(/^<(br|hr|img|input|meta|link)/i)) indent++;
      return indented;
    }).join("\n");
    setOutput(result);
  };
  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono focus:border-indigo-400 focus:outline-none";
  const origSize = new Blob([code]).size;
  const outSize = new Blob([output]).size;
  return (
    <Panel title="HTML Minifier / Beautifier">
      <label className={label}>Input HTML</label>
      <textarea value={code} onChange={e => setCode(e.target.value)} className={`${input} h-40`} placeholder="<html>..." />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={minify} className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Minify</button>
        <button type="button" onClick={beautify} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Beautify</button>
      </div>
      {output && (<><label className={`${label} mt-3`}>Output ({origSize} → {outSize} bytes)</label><textarea value={output} readOnly className={`${input} h-40`} /><CopyButton value={output} /></>)}
    </Panel>
  );
}

/* ── JavaScript Minifier Beautifier ── */
function JsMinifierBeautifier() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const minify = () => {
    setOutput(code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").replace(/\s{2,}/g, " ").replace(/\n\s*/g, "").trim());
  };
  const beautify = () => {
    let indent = 0;
    let result = "";
    const chars = code.replace(/\s{2,}/g, " ").trim();
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (c === "{" || c === "[") { result += c + "\n" + "  ".repeat(++indent); }
      else if (c === "}" || c === "]") { result += "\n" + "  ".repeat(--indent) + c; }
      else if (c === ";") { result += ";\n" + "  ".repeat(indent); }
      else { result += c; }
    }
    setOutput(result);
  };
  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono focus:border-indigo-400 focus:outline-none";
  return (
    <Panel title="JavaScript Minifier / Beautifier">
      <label className={label}>Input JavaScript</label>
      <textarea value={code} onChange={e => setCode(e.target.value)} className={`${input} h-40`} placeholder="function hello() {..." />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={minify} className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Minify</button>
        <button type="button" onClick={beautify} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Beautify</button>
      </div>
      {output && (<><label className={`${label} mt-3`}>Output</label><textarea value={output} readOnly className={`${input} h-40`} /><CopyButton value={output} /></>)}
    </Panel>
  );
}

/* ── Markdown Preview Editor ── */
function MarkdownPreviewEditor() {
  const [md, setMd] = useState("# Hello World\n\nThis is **bold** and *italic*.\n\n## Features\n- List item 1\n- List item 2\n\n```js\nconsole.log('Hello');\n```\n\n[Link](https://example.com)\n\n> A blockquote here");
  const html = useMemo(() => {
    return md
      .replace(/^### (.+)/gm, "<h3>$1</h3>")
      .replace(/^## (.+)/gm, "<h2>$1</h2>")
      .replace(/^# (.+)/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code style='background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:0.85em'>$1</code>")
      .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre style='background:#1e293b;color:#e2e8f0;padding:16px;border-radius:12px;overflow-x:auto;font-size:0.85em'><code>$2</code></pre>")
      .replace(/^\> (.+)/gm, "<blockquote style='border-left:4px solid #6366f1;padding-left:16px;color:#64748b;margin:12px 0'>$1</blockquote>")
      .replace(/^\- (.+)/gm, "<li>$1</li>")
      .replace(/(<li>[\s\S]*<\/li>)/, "<ul style='padding-left:20px'>$1</ul>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' style='color:#6366f1;text-decoration:underline'>$1</a>")
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");
  }, [md]);
  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono focus:border-indigo-400 focus:outline-none";
  return (
    <Panel title="Markdown Preview Editor">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Markdown</label>
          <textarea value={md} onChange={e => setMd(e.target.value)} className={`${input} h-96`} />
        </div>
        <div>
          <label className={label}>Preview</label>
          <div className="h-96 overflow-auto rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
      <CopyButton value={html} />
    </Panel>
  );
}

/* ── Color Picker Converter ── */
function ColorPickerConverter() {
  const [hex, setHex] = useState("#6366f1");
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
  const l = (max + min) / 2;
  const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  let h = 0;
  if (max !== min) {
    if (max === rNorm) h = ((gNorm - bNorm) / (max - min)) % 6;
    else if (max === gNorm) h = (bNorm - rNorm) / (max - min) + 2;
    else h = (rNorm - gNorm) / (max - min) + 4;
    h = Math.round(h * 60); if (h < 0) h += 360;
  }
  const k = 1 - max;
  const c = max === 0 ? 0 : (1 - rNorm / max);
  const m = max === 0 ? 0 : (1 - gNorm / max);
  const y = max === 0 ? 0 : (1 - bNorm / max);
  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";
  return (
    <Panel title="Color Picker / Converter">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Pick a Color</label>
          <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-1 cursor-pointer" />
          <label className={`${label} mt-3`}>Or enter HEX</label>
          <input value={hex} onChange={e => setHex(e.target.value)} className={input} placeholder="#6366f1" />
        </div>
        <div>
          <div className="h-24 w-full rounded-xl border border-slate-200" style={{ backgroundColor: hex }} />
          <div className="mt-3 space-y-2">
            {[
              { label: "HEX", value: hex.toUpperCase() },
              { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
              { label: "HSL", value: `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)` },
              { label: "CMYK", value: `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)` },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
                <span className="text-xs font-bold text-slate-500 w-12">{f.label}</span>
                <span className="flex-1 text-sm font-mono text-slate-800">{f.value}</span>
                <CopyButton value={f.value} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ── Diff Text Compare ── */
function DiffTextCompare() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const diff = useMemo(() => {
    if (!left && !right) return [];
    const lLines = left.split("\n");
    const rLines = right.split("\n");
    const maxLen = Math.max(lLines.length, rLines.length);
    const result: { left: string; right: string; type: "same" | "changed" | "added" | "removed" }[] = [];
    for (let i = 0; i < maxLen; i++) {
      const l = lLines[i] ?? "";
      const r = rLines[i] ?? "";
      if (i >= lLines.length) result.push({ left: "", right: r, type: "added" });
      else if (i >= rLines.length) result.push({ left: l, right: "", type: "removed" });
      else if (l === r) result.push({ left: l, right: r, type: "same" });
      else result.push({ left: l, right: r, type: "changed" });
    }
    return result;
  }, [left, right]);
  const changes = diff.filter(d => d.type !== "same").length;
  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono focus:border-indigo-400 focus:outline-none";
  const colors = { same: "bg-white", changed: "bg-amber-50", added: "bg-emerald-50", removed: "bg-red-50" };
  return (
    <Panel title="Diff / Text Compare">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Original</label><textarea value={left} onChange={e => setLeft(e.target.value)} className={`${input} h-40`} placeholder="Paste original text..." /></div>
        <div><label className={label}>Modified</label><textarea value={right} onChange={e => setRight(e.target.value)} className={`${input} h-40`} placeholder="Paste modified text..." /></div>
      </div>
      {diff.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-slate-600 mb-2">{changes} difference{changes !== 1 ? "s" : ""} found</p>
          <div className="max-h-96 overflow-auto rounded-xl border border-slate-200">
            {diff.map((d, i) => (
              <div key={i} className={`grid grid-cols-[40px_1fr_1fr] text-xs font-mono ${colors[d.type]} border-b border-slate-100`}>
                <span className="text-slate-400 py-1 px-2 text-right">{i + 1}</span>
                <span className={`py-1 px-2 border-r border-slate-200 ${d.type === "removed" ? "text-red-700 line-through" : d.type === "changed" ? "text-amber-800" : ""}`}>{d.left}</span>
                <span className={`py-1 px-2 ${d.type === "added" ? "text-emerald-700" : d.type === "changed" ? "text-emerald-800" : ""}`}>{d.right}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ── URL Encoder Decoder ── */
function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => { try { setOutput(decodeURIComponent(input)); } catch { setOutput("Invalid encoded string"); } };
  const lab = "text-sm font-medium text-slate-700 mb-1 block";
  const inp = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono focus:border-indigo-400 focus:outline-none";
  return (
    <Panel title="URL Encoder / Decoder">
      <label className={lab}>Input</label>
      <textarea value={input} onChange={e => setInput(e.target.value)} className={`${inp} h-24`} placeholder="Enter text or encoded URL..." />
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={encode} className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Encode</button>
        <button type="button" onClick={decode} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Decode</button>
      </div>
      {output && (<><label className={`${lab} mt-3`}>Output</label><textarea value={output} readOnly className={`${inp} h-24`} /><CopyButton value={output} /></>)}
    </Panel>
  );
}

/* ── Hash Generator ── */
function HashGeneratorTool() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!text) { setHashes({}); return; }
    const compute = async () => {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const results: Record<string, string> = {};
      for (const algo of ["SHA-1", "SHA-256", "SHA-512"] as const) {
        const hash = await crypto.subtle.digest(algo, data);
        results[algo] = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
      }
      // MD5 — simple implementation
      results["MD5"] = md5(text);
      setHashes(results);
    };
    compute();
  }, [text]);
  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono focus:border-indigo-400 focus:outline-none";
  return (
    <Panel title="Hash Generator">
      <label className={label}>Input Text</label>
      <textarea value={text} onChange={e => setText(e.target.value)} className={`${input} h-24`} placeholder="Enter text to hash..." />
      {Object.keys(hashes).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <span className="text-xs font-bold text-slate-500 w-16">{algo}</span>
              <span className="flex-1 text-xs font-mono text-slate-800 break-all">{hash}</span>
              <CopyButton value={hash} />
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
// Simple MD5 implementation
function md5(str: string): string {
  function rotl(v: number, s: number) { return (v << s) | (v >>> (32 - s)); }
  const k = Array.from({length: 64}, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000));
  const s = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  const bytes = new TextEncoder().encode(str);
  const bits = bytes.length * 8;
  const padded = new Uint8Array(((bytes.length + 9 + 63) & ~63));
  padded.set(bytes); padded[bytes.length] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, bits, true);
  let [a0, b0, c0, d0] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  for (let i = 0; i < padded.length; i += 64) {
    const m = Array.from({length: 16}, (_, j) => dv.getUint32(i + j * 4, true));
    let [a, b, c, d] = [a0, b0, c0, d0];
    for (let j = 0; j < 64; j++) {
      let f, g;
      if (j < 16) { f = (b & c) | (~b & d); g = j; }
      else if (j < 32) { f = (d & b) | (~d & c); g = (5 * j + 1) % 16; }
      else if (j < 48) { f = b ^ c ^ d; g = (3 * j + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * j) % 16; }
      const temp = d; d = c; c = b; b = (b + rotl((a + f + k[j] + m[g]) | 0, s[j])) | 0; a = temp;
    }
    a0 = (a0 + a) | 0; b0 = (b0 + b) | 0; c0 = (c0 + c) | 0; d0 = (d0 + d) | 0;
  }
  return [a0, b0, c0, d0].map(v => v.toString(16).padStart(8, "0").match(/../g)!.reverse().join("")).join("");
}

/* ── JSON to CSV Converter ── */
function JsonToCsvConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json2csv" | "csv2json">("json2csv");
  const convert = () => {
    try {
      if (mode === "json2csv") {
        const data = JSON.parse(input);
        if (!Array.isArray(data) || data.length === 0) { setOutput("Input must be a non-empty JSON array"); return; }
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(","), ...data.map((row: Record<string, unknown>) =>
          headers.map(h => { const v = String(row[h] ?? ""); return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v; }).join(",")
        )];
        setOutput(csvRows.join("\n"));
      } else {
        const lines = input.trim().split("\n");
        if (lines.length < 2) { setOutput("CSV must have headers and at least one row"); return; }
        const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
        const data = lines.slice(1).map(line => {
          const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => obj[h] = vals[i] || "");
          return obj;
        });
        setOutput(JSON.stringify(data, null, 2));
      }
    } catch (e) { setOutput("Error: " + (e instanceof Error ? e.message : "Invalid input")); }
  };
  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const inp = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono focus:border-indigo-400 focus:outline-none";
  return (
    <Panel title="JSON ↔ CSV Converter">
      <div className="mb-3 flex gap-2">
        <button type="button" onClick={() => setMode("json2csv")} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${mode === "json2csv" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}>JSON → CSV</button>
        <button type="button" onClick={() => setMode("csv2json")} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${mode === "csv2json" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}>CSV → JSON</button>
      </div>
      <label className={label}>{mode === "json2csv" ? "JSON Array" : "CSV Data"}</label>
      <textarea value={input} onChange={e => setInput(e.target.value)} className={`${inp} h-40`} placeholder={mode === "json2csv" ? '[{"name":"John","age":30}]' : 'name,age\nJohn,30'} />
      <button type="button" onClick={convert} className="mt-3 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Convert</button>
      {output && (<><label className={`${label} mt-3`}>Output</label><textarea value={output} readOnly className={`${inp} h-40`} /><CopyButton value={output} /></>)}
    </Panel>
  );
}

/* ── Case Converter ── */
function CaseConverterTool() {
  const [text, setText] = useState("");
  const cases = useMemo(() => {
    if (!text) return [];
    const toWords = (s: string) => s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_\-\.]+/g, " ").trim().split(/\s+/);
    const words = toWords(text);
    return [
      { label: "UPPERCASE", value: text.toUpperCase() },
      { label: "lowercase", value: text.toLowerCase() },
      { label: "Title Case", value: words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") },
      { label: "Sentence case", value: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() },
      { label: "camelCase", value: words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("") },
      { label: "PascalCase", value: words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("") },
      { label: "snake_case", value: words.map(w => w.toLowerCase()).join("_") },
      { label: "kebab-case", value: words.map(w => w.toLowerCase()).join("-") },
      { label: "CONSTANT_CASE", value: words.map(w => w.toUpperCase()).join("_") },
      { label: "dot.case", value: words.map(w => w.toLowerCase()).join(".") },
    ];
  }, [text]);
  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";
  return (
    <Panel title="Case Converter">
      <label className={label}>Input Text</label>
      <textarea value={text} onChange={e => setText(e.target.value)} className={`${input} h-24`} placeholder="Type or paste text..." />
      {cases.length > 0 && (
        <div className="mt-4 space-y-2">
          {cases.map(c => (
            <div key={c.label} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <span className="text-xs font-bold text-slate-500 w-28 shrink-0">{c.label}</span>
              <span className="flex-1 text-sm font-mono text-slate-800 truncate">{c.value}</span>
              <CopyButton value={c.value} />
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ── Text to Handwriting ── */
function TextToHandwriting() {
  const [text, setText] = useState("Hello, this is a handwriting sample!\nThe quick brown fox jumps over the lazy dog.");
  const [color, setColor] = useState("#1a365d");
  const [fontSize, setFontSize] = useState(22);
  const [paper, setPaper] = useState<"lined" | "blank">("lined");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const render = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 800; canvas.height = 1100;
    ctx.fillStyle = "#fffef5"; ctx.fillRect(0, 0, 800, 1100);
    if (paper === "lined") {
      ctx.strokeStyle = "#c7d0dc"; ctx.lineWidth = 0.5;
      for (let y = 80; y < 1060; y += 36) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(740, y); ctx.stroke(); }
      ctx.strokeStyle = "#e8b4b8"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(80, 40); ctx.lineTo(80, 1060); ctx.stroke();
    }
    ctx.fillStyle = color; ctx.font = `${fontSize}px 'Segoe Script', 'Comic Sans MS', cursive`;
    const lines = text.split("\n");
    let y = paper === "lined" ? 72 : 60;
    for (const line of lines) {
      const words = line.split(" ");
      let currentLine = ""; let x = paper === "lined" ? 90 : 60;
      for (const word of words) {
        const test = currentLine + (currentLine ? " " : "") + word;
        if (ctx.measureText(test).width > 640) {
          ctx.fillText(currentLine, x + (Math.random() - 0.5) * 2, y + (Math.random() - 0.5) * 2);
          currentLine = word; y += 36;
        } else { currentLine = test; }
      }
      if (currentLine) { ctx.fillText(currentLine, x + (Math.random() - 0.5) * 2, y + (Math.random() - 0.5) * 2); }
      y += 36;
    }
  }, [text, color, fontSize, paper]);
  useEffect(() => { render(); }, [render]);
  const download = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const link = document.createElement("a"); link.download = "handwriting.png"; link.href = canvas.toDataURL("image/png"); link.click();
  };
  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const inp = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";
  return (
    <Panel title="Text to Handwriting">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Ink Color</label><input type="color" value={color} onChange={e => setColor(e.target.value)} className={`${inp} h-10 p-1`} /></div>
        <div><label className={label}>Font Size: {fontSize}px</label><input type="range" min={14} max={36} value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full accent-indigo-600" /></div>
        <div><label className={label}>Paper</label><select value={paper} onChange={e => setPaper(e.target.value as "lined" | "blank")} className={inp}><option value="lined">Lined</option><option value="blank">Blank</option></select></div>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} className={`${inp} h-24 mt-3`} placeholder="Type your text..." />
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={render} className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Render</button>
        <button type="button" onClick={download} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700">Download PNG</button>
      </div>
      <canvas ref={canvasRef} className="mt-4 w-full max-h-96 rounded-xl border border-slate-200 object-contain" />
    </Panel>
  );
}

/* ── Fancy Text Generator ── */
function FancyTextGenerator() {
  const [text, setText] = useState("Hello World");
  const styles = useMemo(() => {
    if (!text) return [];
    const maps: { name: string; fn: (s: string) => string }[] = [
      { name: "𝐁𝐨𝐥𝐝", fn: s => [...s].map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + code - 97); return c; }).join("") },
      { name: "𝑰𝒕𝒂𝒍𝒊𝒄", fn: s => [...s].map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D44E + code - 97); return c; }).join("") },
      { name: "𝕯𝖔𝖚𝖇𝖑𝖊", fn: s => [...s].map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D504 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D51E + code - 97); return c; }).join("") },
      { name: "𝙼𝚘𝚗𝚘", fn: s => [...s].map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + code - 97); return c; }).join("") },
      { name: "Ⓒⓘⓡⓒⓛⓔ", fn: s => [...s].map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97); return c; }).join("") },
      { name: "🅂🅀🅄🄰🅁🄴", fn: s => [...s].map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F130 + code - 65); return c; }).join("") },
      { name: "ᵗⁱⁿʸ", fn: s => { const m: Record<string, string> = {a:"ᵃ",b:"ᵇ",c:"ᶜ",d:"ᵈ",e:"ᵉ",f:"ᶠ",g:"ᵍ",h:"ʰ",i:"ⁱ",j:"ʲ",k:"ᵏ",l:"ˡ",m:"ᵐ",n:"ⁿ",o:"ᵒ",p:"ᵖ",r:"ʳ",s:"ˢ",t:"ᵗ",u:"ᵘ",v:"ᵛ",w:"ʷ",x:"ˣ",y:"ʸ",z:"ᶻ"}; return [...s.toLowerCase()].map(c => m[c] || c).join(""); }},
      { name: "ɟlᴉd", fn: s => { const m: Record<string, string> = {a:"ɐ",b:"q",c:"ɔ",d:"p",e:"ǝ",f:"ɟ",g:"ƃ",h:"ɥ",i:"ᴉ",j:"ɾ",k:"ʞ",l:"l",m:"ɯ",n:"u",o:"o",p:"d",q:"b",r:"ɹ",s:"s",t:"ʇ",u:"n",v:"ʌ",w:"ʍ",x:"x",y:"ʎ",z:"z"}; return [...s.toLowerCase()].reverse().map(c => m[c] || c).join(""); }},
    ];
    return maps.map(m => ({ name: m.name, value: m.fn(text) }));
  }, [text]);
  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";
  return (
    <Panel title="Fancy Text Generator">
      <label className={label}>Enter Text</label>
      <input value={text} onChange={e => setText(e.target.value)} className={input} placeholder="Type something..." />
      {styles.length > 0 && (
        <div className="mt-4 space-y-2">
          {styles.map(s => (
            <div key={s.name} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="flex-1 text-lg">{s.value}</span>
              <CopyButton value={s.value} />
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ── Text Repeater ── */
function TextRepeaterTool() {
  const [text, setText] = useState("Hello ");
  const [count, setCount] = useState("10");
  const [sep, setSep] = useState("");
  const output = useMemo(() => {
    const n = Math.min(parseInt(count) || 0, 10000);
    if (!text || n <= 0) return "";
    return Array(n).fill(text).join(sep);
  }, [text, count, sep]);
  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";
  return (
    <Panel title="Text Repeater">
      <div className="grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Text to Repeat</label><input value={text} onChange={e => setText(e.target.value)} className={input} /></div>
        <div><label className={label}>Times</label><input type="number" min={1} max={10000} value={count} onChange={e => setCount(e.target.value)} className={input} /></div>
        <div><label className={label}>Separator</label><select value={sep} onChange={e => setSep(e.target.value)} className={input}><option value="">None</option><option value=" ">Space</option><option value={"\n"}>New Line</option><option value=", ">Comma</option></select></div>
      </div>
      {output && (
        <div className="mt-4">
          <label className={label}>Output ({output.length} characters)</label>
          <textarea value={output} readOnly className={`${input} h-40 font-mono`} />
          <CopyButton value={output} />
        </div>
      )}
    </Panel>
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
    case "regex-tester-replacer":
      return <RegexTesterTool />;
    case "jwt-decoder-inspector":
      return <JwtDecoderTool />;
    case "cron-expression-builder":
      return <CronExpressionBuilderTool />;
    case "sql-formatter-beautifier":
      return <SqlFormatterTool />;
    case "http-status-code-lookup":
      return <HttpStatusCodeLookupTool />;
    case "canonical-url-checker":
      return <CanonicalChecker />;
    case "html-minifier-beautifier":
      return <HtmlMinifierBeautifier />;
    case "javascript-minifier-beautifier":
      return <JsMinifierBeautifier />;
    case "markdown-preview-editor":
      return <MarkdownPreviewEditor />;
    case "color-picker-converter":
      return <ColorPickerConverter />;
    case "diff-text-compare":
      return <DiffTextCompare />;
    case "url-encoder-decoder":
      return <UrlEncoderDecoder />;
    case "hash-generator":
      return <HashGeneratorTool />;
    case "json-to-csv-converter":
      return <JsonToCsvConverter />;
    case "open-graph-social-preview":
      return <OpenGraphPreviewTool />;
    case "keyword-density-checker":
      return <KeywordDensityChecker />;
    case "schema-markup-generator":
      return <SchemaMarkupGeneratorTool />;
    case "hreflang-tag-generator":
      return <HreflangTagGeneratorTool />;
    case "redirect-rule-generator":
      return <RedirectRuleGeneratorTool />;
    case "robots-meta-tag-generator":
      return <RobotsMetaTagGeneratorTool />;
    case "keyword-cluster-generator":
      return <KeywordClusterGeneratorTool />;
    case "faq-schema-generator-page-template":
      return <FaqSchemaGeneratorPageTemplate />;
    case "internal-link-suggestion-tool":
      return <InternalLinkSuggestionTool />;
    case "serp-snippet-pixel-checker":
      return <SerpSnippetPixelChecker />;
    case "lorem-ipsum-generator":
      return <LoremIpsumGenerator />;
    case "text-cleaner":
      return <TextCleaner />;
    case "case-converter":
      return <CaseConverterTool />;
    case "text-to-handwriting":
      return <TextToHandwriting />;
    case "fancy-text-generator":
      return <FancyTextGenerator />;
    case "text-repeater":
      return <TextRepeaterTool />;
    /* ── Student Tools ── */
    case "percentage-calculator":
      return <PercentageCalculator />;
    case "cgpa-to-percentage-converter":
      return <CgpaToPercentageConverter />;
    case "attendance-calculator":
      return <AttendanceCalculator />;
    case "age-calculator":
      return <AgeCalculator />;
    case "date-difference-calculator":
      return <DateDifferenceCalculator />;
    case "exam-countdown-timer":
      return <ExamCountdownTimer />;
    case "gpa-calculator":
      return <GpaCalculator />;
    case "resume-headline-generator":
      return <ResumeHeadlineGenerator />;
    case "study-time-planner":
      return <StudyTimePlanner />;
    case "marks-required-calculator":
      return <MarksRequiredCalculator />;
    case "attendance-shortage-calculator":
      return <AttendanceShortageCalculator />;
    case "semester-gpa-predictor":
      return <SemesterGpaPredictor />;
    case "study-timetable-printable-generator":
      return <StudyTimetablePrintableGenerator />;
    case "pomodoro-timer":
      return <PomodoroTimer />;
    case "grade-scale-converter":
      return <GradeScaleConverter />;
    case "assignment-deadline-tracker":
      return <AssignmentDeadlineTracker />;
    /* ── Creator Tools ── */
    case "instagram-hashtag-generator":
      return <InstagramHashtagGenerator />;
    case "youtube-title-analyzer":
      return <YouTubeTitleAnalyzer />;
    case "youtube-tag-generator":
      return <YouTubeTagGenerator />;
    case "caption-generator":
      return <CaptionGenerator />;
    case "bio-generator":
      return <BioGenerator />;
    case "thumbnail-text-preview":
      return <ThumbnailTextPreview />;
    case "youtube-description-template-generator":
      return <YouTubeDescriptionTemplateGenerator />;
    case "video-length-estimator":
      return <VideoLengthEstimator />;
    case "hook-generator-for-reels":
      return <HookGeneratorForReels />;
    case "content-idea-generator":
      return <ContentIdeaGenerator />;
    case "youtube-chapter-timestamp-generator":
      return <YouTubeChapterTimestampGenerator />;
    case "engagement-rate-calculator":
      return <EngagementRateCalculator />;
    case "viral-content-calendar-generator":
      return <ViralContentCalendarGenerator />;
    case "best-time-to-post-planner":
      return <BestTimeToPostPlanner />;
    case "utm-link-builder-for-creators":
      return <UtmLinkBuilderForCreators />;
    case "youtube-title-length-checker":
      return <YouTubeTitleLengthChecker />;
    case "youtube-shorts-aspect-ratio-tool":
      return <YouTubeShortsAspectRatioTool />;
    case "reel-caption-formatter":
      return <ReelCaptionFormatter />;
    case "hook-idea-generator-by-niche":
      return <HookIdeaGeneratorByNiche />;
    /* ── Image Tools ── */
    case "image-to-pdf-converter":
      return <ImageToPdfConverter />;
    case "compress-image":
      return <CompressImage />;
    case "resize-image":
      return <ResizeImage />;
    case "jpg-to-png-converter":
      return <JpgToPngConverter />;
    case "png-to-jpg-converter":
      return <PngToJpgConverter />;
    case "qr-code-generator":
      return <QrCodeGenerator />;
    case "barcode-generator":
      return <BarcodeGenerator />;
    case "base64-image-encoder":
      return <Base64ImageEncoder />;
    case "image-metadata-viewer":
      return <ImageMetadataViewer />;
    case "favicon-generator":
      return <FaviconGenerator />;
    case "webp-to-png-converter":
      return <WebpToPngConverter />;
    case "png-to-webp-converter":
      return <PngToWebpConverter />;
    case "image-cropper":
      return <ImageCropper />;
    case "image-rotate-flip-tool":
      return <ImageRotateFlipTool />;
    case "image-watermark-tool":
      return <ImageWatermarkTool />;
    case "image-color-palette-extractor":
      return <ImageColorPaletteExtractor />;
    case "image-collage-maker":
      return <ImageCollageMaker />;
    case "image-blur-tool":
      return <ImageBlurTool />;
    case "rounded-corners-image-tool":
      return <RoundedCornersTool />;
    case "image-to-ascii-art":
      return <ImageToAsciiArt />;
    case "image-compressor-under-100kb":
      return <ImageCompressorUnder100kb />;
    case "passport-photo-maker":
      return <PassportPhotoMaker />;
    case "svg-to-png-converter":
      return <SvgToPngConverter />;
    case "image-noise-grain-effect":
      return <ImageNoiseGrainEffect />;
    case "screenshot-mockup-generator":
      return <ScreenshotMockupGenerator />;
    case "image-background-remover":
      return <ImageBackgroundRemover />;
    /* ── Utility Tools ── */
    case "emi-calculator":
      return <EmiCalculator />;
    case "loan-interest-calculator":
      return <LoanInterestCalculator />;
    case "gst-calculator":
      return <GstCalculator />;
    case "currency-converter":
      return <CurrencyConverter />;
    case "sip-calculator":
      return <SipCalculator />;
    case "inflation-calculator":
      return <InflationCalculator />;
    case "age-in-days-calculator":
      return <AgeInDaysCalculator />;
    case "time-zone-converter":
      return <TimeZoneConverter />;
    case "unit-converter":
      return <UnitConverter />;
    case "scientific-calculator":
      return <ScientificCalculator />;
    case "tip-calculator":
      return <TipCalculator />;
    case "bmi-calculator":
      return <BmiCalculator />;
    case "electricity-bill-calculator":
      return <ElectricityBillCalculator />;
    default:
      return <Panel title="Tool unavailable">This tool is not available.</Panel>;
  }
}
