"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(79,70,229,0.08)]">
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

const label = "mb-1 block text-sm font-medium text-slate-700";
const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";
const btn = "rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700";

function sanitizeFileName(value: string, fallback: string) {
  const cleaned = value.trim().replace(/[^a-z0-9-_]+/gi, "-");
  return cleaned || fallback;
}

function downloadText(name: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

/* ───── 1. Instagram Hashtag Generator ───── */
const hashtagDb: Record<string, string[]> = {
  fitness: ["fitness", "fitfam", "workout", "gym", "training", "muscle", "cardio", "strength", "bodygoals", "health", "wellness", "active", "fitnessjourney", "homeworkout", "motivation"],
  tech: ["technology", "tech", "coding", "programming", "developer", "software", "webdev", "ai", "machinelearning", "javascript", "python", "startup", "innovation", "devlife", "buildinpublic"],
  food: ["food", "foodie", "cooking", "recipe", "delicious", "yummy", "foodphotography", "homecooking", "healthyfood", "dessert", "mealprep", "chef", "instafood", "foodlover", "kitchen"],
  travel: ["travel", "wanderlust", "travelgram", "adventure", "trip", "vacation", "explore", "travelphotography", "roadtrip", "nature", "passport", "solotravel", "backpacking", "holiday", "journey"],
  fashion: ["fashion", "style", "ootd", "streetstyle", "fashionblogger", "instafashion", "outfit", "trendy", "lookbook", "beauty", "wardrobe", "fashionista", "minimalstyle", "mensfashion", "womensfashion"],
  business: ["business", "entrepreneur", "startup", "branding", "marketing", "growth", "leadership", "strategy", "mindset", "smallbusiness", "founder", "success", "hustle", "ecommerce", "sales"],
};

export function InstagramHashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "youtube" | "linkedin" | "x">("instagram");
  const [tone, setTone] = useState<"balanced" | "broad" | "niche">("balanced");
  const [count, setCount] = useState(20);
  const [includeBranded, setIncludeBranded] = useState(true);
  const [brandTag, setBrandTag] = useState("toolnest");
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [caseMode, setCaseMode] = useState<"lower" | "title">("lower");
  const [banned, setBanned] = useState("");
  const [seed, setSeed] = useState("123456789");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const platformCaps = { instagram: 30, youtube: 15, linkedin: 8, x: 3 };

  const generate = () => {
    const normalizedTopic = topic.trim().toLowerCase();
    const foundKey = Object.keys(hashtagDb).find((key) => normalizedTopic.includes(key)) ?? "tech";
    const pool = [...hashtagDb[foundKey]];
    const extras = normalizedTopic
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.replace(/[^a-z0-9]/g, ""))
      .filter((word) => word.length > 2)
      .map((word) => (tone === "niche" ? `${word}tips` : tone === "broad" ? `best${word}` : word));

    const bannedSet = new Set(
      banned
        .toLowerCase()
        .split(",")
        .map((word) => word.trim())
        .filter(Boolean),
    );

    const pseudoRandom = Number(seed.replace(/\D/g, "").slice(0, 9)) || Date.now();
    const expanded = [...new Set([...extras, ...pool])].filter((word) => !bannedSet.has(word));

    const withPlatform = expanded.map((word, index) => {
      let tag = word;
      if (includeNumbers && index % 5 === 0) tag = `${tag}${(pseudoRandom + index) % 9}`;
      if (platform === "linkedin") tag = `${tag}community`;
      return tag;
    });

    if (includeBranded && brandTag.trim()) withPlatform.unshift(brandTag.trim().replace(/[^a-z0-9]/gi, ""));

    const shuffled = [...new Set(withPlatform)]
      .sort((left, right) => ((left.length + pseudoRandom) % 7) - ((right.length + pseudoRandom) % 7))
      .slice(0, Math.min(count, platformCaps[platform]));

    const formatted = shuffled.map((tag) => {
      const raw = `#${tag}`;
      if (caseMode === "title") return raw.replace(/(^#\w)|([a-z]\w*)/g, (match) => match.charAt(0).toUpperCase() + match.slice(1));
      return raw.toLowerCase();
    });

    setHashtags(formatted);
  };

  const categories = useMemo(() => {
    const grouped = { broad: [] as string[], medium: [] as string[], niche: [] as string[] };
    hashtags.forEach((tag) => {
      if (tag.length <= 8) grouped.broad.push(tag);
      else if (tag.length <= 14) grouped.medium.push(tag);
      else grouped.niche.push(tag);
    });
    return grouped;
  }, [hashtags]);

  return (
    <Panel title="Instagram Hashtag Generator">
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label className={label}>Topic / Niche</label>
          <input value={topic} onChange={(event) => setTopic(event.target.value)} className={input} placeholder="e.g. coding, fitness, travel" />
        </div>
        <div>
          <label className={label}>Platform</label>
          <select value={platform} onChange={(event) => setPlatform(event.target.value as "instagram" | "youtube" | "linkedin" | "x")} className={input}>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="linkedin">LinkedIn</option>
            <option value="x">X / Twitter</option>
          </select>
        </div>
        <div>
          <label className={label}>Style</label>
          <select value={tone} onChange={(event) => setTone(event.target.value as "balanced" | "broad" | "niche")} className={input}>
            <option value="balanced">Balanced</option>
            <option value="broad">Broad reach</option>
            <option value="niche">Niche intent</option>
          </select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div>
          <label className={label}>Count: {count}</label>
          <input type="range" min={3} max={30} value={count} onChange={(event) => setCount(Number(event.target.value))} className="w-full" />
        </div>
        <div>
          <label className={label}>Case</label>
          <select value={caseMode} onChange={(event) => setCaseMode(event.target.value as "lower" | "title")} className={input}>
            <option value="lower">lowercase</option>
            <option value="title">TitleCase</option>
          </select>
        </div>
        <div>
          <label className={label}>Brand tag</label>
          <input value={brandTag} onChange={(event) => setBrandTag(event.target.value)} className={input} placeholder="yourbrand" />
        </div>
        <div>
          <label className={label}>Seed</label>
          <input value={seed} onChange={(event) => setSeed(event.target.value)} className={input} />
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Blocked terms (comma-separated)</label>
          <input value={banned} onChange={(event) => setBanned(event.target.value)} className={input} placeholder="spam,follow4follow" />
        </div>
        <div className="flex items-end gap-4 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeBranded} onChange={(event) => setIncludeBranded(event.target.checked)} /> Include brand tag</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeNumbers} onChange={(event) => setIncludeNumbers(event.target.checked)} /> Include numeric variants</label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={generate} className={btn}>Generate Hashtags</button>
        <button type="button" onClick={() => setSeed(String(Date.now()))} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Shuffle</button>
        <button type="button" onClick={() => downloadText("hashtags.txt", hashtags.join(" "))} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={hashtags.length === 0}>Download</button>
      </div>

      {hashtags.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-slate-500">{hashtags.length} tags generated • platform cap {platformCaps[platform]} • broad {categories.broad.length}, medium {categories.medium.length}, niche {categories.niche.length}</p>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <span key={tag} className="rounded-full bg-pink-50 px-3 py-1 text-sm font-medium text-pink-700">{tag}</span>
            ))}
          </div>
          <CopyButton value={hashtags.join(" ")} />
        </div>
      )}
    </Panel>
  );
}

/* ───── 2. YouTube Title Analyzer ───── */
const powerWords = ["ultimate", "proven", "secret", "exclusive", "best", "free", "fast", "simple", "hack", "truth", "mistake", "guide", "tutorial", "easy", "complete"];
const emotionalWords = ["amazing", "shocking", "insane", "mind-blowing", "powerful", "dangerous", "surprising", "unbelievable", "genius"];

export function YouTubeTitleAnalyzer() {
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("beginners");
  const [yearTag, setYearTag] = useState("2026");
  const [withEmoji, setWithEmoji] = useState(false);
  const [generateVariants, setGenerateVariants] = useState(5);

  const analysis = useMemo(() => {
    const lowerTitle = title.toLowerCase();
    const words = title.trim().split(/\s+/).filter(Boolean);
    const charCount = title.length;

    let score = 0;
    const tips: string[] = [];

    if (charCount >= 45 && charCount <= 68) score += 25;
    else tips.push("Keep title between 45 and 68 characters for better CTR visibility.");

    const keywordHit = keyword.trim() ? lowerTitle.includes(keyword.toLowerCase()) : false;
    if (!keyword.trim() || keywordHit) score += 20;
    else tips.push("Place your target keyword in the first half of the title.");

    const powerHitCount = powerWords.filter((word) => lowerTitle.includes(word)).length;
    score += Math.min(powerHitCount * 7, 21);
    if (powerHitCount === 0) tips.push("Add at least one power word (guide, best, fast, proven).\n");

    const emotionHits = emotionalWords.filter((word) => lowerTitle.includes(word)).length;
    score += Math.min(emotionHits * 5, 10);

    if (/\d/.test(title)) score += 10;
    else tips.push("Titles with numbers often perform better (e.g., 7 tips).\n");

    if (/[\[\(].*[\]\)]/.test(title)) score += 8;
    if (words.length >= 6 && words.length <= 13) score += 6;

    const ctrBand = score >= 80 ? "High" : score >= 60 ? "Medium" : "Low";

    return {
      score: Math.min(100, score),
      tips: tips.slice(0, 6),
      charCount,
      wordCount: words.length,
      keywordHit,
      powerHitCount,
      emotionHits,
      ctrBand,
    };
  }, [title, keyword]);

  const variants = useMemo(() => {
    if (!title.trim()) return [];
    const base = title.replace(/\s+/g, " ").trim();
    const templates = [
      `How to ${base}`,
      `${base} (${audience})`,
      `${base} [${yearTag}]`,
      `${base} - ${powerWords[2]} Method`,
      `${base}: ${generateVariants} Mistakes to Avoid`,
      `The ${audience} Guide to ${base}`,
      `${base} in ${generateVariants} Steps`,
    ];

    return templates
      .slice(0, Math.max(3, Math.min(10, generateVariants)))
      .map((value, index) => (withEmoji && index % 2 === 0 ? `${value} 🚀` : value));
  }, [title, audience, yearTag, withEmoji, generateVariants]);

  return (
    <Panel title="YouTube Title Analyzer">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Video Title</label>
          <input value={title} onChange={(event) => setTitle(event.target.value)} className={input} placeholder="e.g. 7 React Performance Tricks for Faster Apps" />
        </div>
        <div>
          <label className={label}>Target Keyword</label>
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} className={input} placeholder="react performance" />
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div>
          <label className={label}>Audience</label>
          <select value={audience} onChange={(event) => setAudience(event.target.value)} className={input}>
            <option>beginners</option>
            <option>intermediate creators</option>
            <option>advanced users</option>
            <option>business owners</option>
          </select>
        </div>
        <div>
          <label className={label}>Year tag</label>
          <input value={yearTag} onChange={(event) => setYearTag(event.target.value)} className={input} />
        </div>
        <div>
          <label className={label}>Variant count</label>
          <input type="number" min={3} max={10} value={generateVariants} onChange={(event) => setGenerateVariants(Number(event.target.value) || 5)} className={input} />
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={withEmoji} onChange={(event) => setWithEmoji(event.target.checked)} /> Add emoji to variants</label>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">Score</p><p className="text-2xl font-bold text-slate-900">{analysis.score}/100</p></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">CTR band</p><p className="text-lg font-semibold text-slate-900">{analysis.ctrBand}</p></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">Length</p><p className="text-lg font-semibold text-slate-900">{analysis.charCount} chars</p></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">Keyword hit</p><p className="text-lg font-semibold text-slate-900">{analysis.keywordHit ? "Yes" : "No"}</p></div>
      </div>

      {analysis.tips.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {analysis.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      )}

      {variants.length > 0 && (
        <div className="mt-4 space-y-2">
          {variants.map((variant) => (
            <div key={variant} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
              <p className="flex-1 text-sm text-slate-800">{variant}</p>
              <CopyButton value={variant} />
            </div>
          ))}
          <button type="button" onClick={() => downloadText("youtube-title-variants.txt", variants.join("\n"))} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Download Variants</button>
        </div>
      )}
    </Panel>
  );
}

/* ───── 3. YouTube Tag Generator ───── */
export function YouTubeTagGenerator() {
  const [topic, setTopic] = useState("");
  const [secondary, setSecondary] = useState("");
  const [language, setLanguage] = useState("en");
  const [count, setCount] = useState(20);
  const [longTail, setLongTail] = useState(true);
  const [includeBrand, setIncludeBrand] = useState(false);
  const [brand, setBrand] = useState("toolnest");
  const [format, setFormat] = useState<"csv" | "lines" | "json">("csv");
  const [tags, setTags] = useState<string[]>([]);

  const generate = () => {
    const main = topic.trim().toLowerCase();
    if (!main) return;

    const words = main.split(/\s+/).filter(Boolean);
    const secondaryWords = secondary.trim().toLowerCase().split(/\s+/).filter(Boolean);

    const baseTags = new Set<string>([
      main,
      ...words,
      `${main} tutorial`,
      `${main} for beginners`,
      `${main} ${new Date().getFullYear()}`,
      `best ${main}`,
      `how to ${main}`,
      `${main} explained`,
      ...secondaryWords.map((word) => `${main} ${word}`),
      ...secondaryWords,
    ]);

    if (longTail) {
      ["step by step", "advanced", "tips", "mistakes", "complete guide", "examples"].forEach((suffix) => {
        baseTags.add(`${main} ${suffix}`);
      });
    }

    if (includeBrand && brand.trim()) {
      baseTags.add(`${brand.trim().toLowerCase()} ${main}`);
      baseTags.add(brand.trim().toLowerCase());
    }

    const localized = language !== "en" ? [...baseTags].map((tag) => `${tag} ${language}`) : [...baseTags];
    setTags(localized.slice(0, Math.max(5, Math.min(40, count))));
  };

  const output = useMemo(() => {
    if (format === "json") return JSON.stringify(tags, null, 2);
    if (format === "lines") return tags.join("\n");
    return tags.join(", ");
  }, [tags, format]);

  const charLength = output.length;

  return (
    <Panel title="YouTube Tag Generator">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Primary Topic</label>
          <input value={topic} onChange={(event) => setTopic(event.target.value)} className={input} placeholder="e.g. nextjs seo" />
        </div>
        <div>
          <label className={label}>Secondary Keywords</label>
          <input value={secondary} onChange={(event) => setSecondary(event.target.value)} className={input} placeholder="meta tags, sitemap, indexing" />
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div>
          <label className={label}>Language</label>
          <select value={language} onChange={(event) => setLanguage(event.target.value)} className={input}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
        <div>
          <label className={label}>Tag count</label>
          <input type="number" min={5} max={40} value={count} onChange={(event) => setCount(Number(event.target.value) || 20)} className={input} />
        </div>
        <div>
          <label className={label}>Output format</label>
          <select value={format} onChange={(event) => setFormat(event.target.value as "csv" | "lines" | "json")} className={input}>
            <option value="csv">CSV</option>
            <option value="lines">Line-by-line</option>
            <option value="json">JSON</option>
          </select>
        </div>
        <div>
          <label className={label}>Brand</label>
          <input value={brand} onChange={(event) => setBrand(event.target.value)} className={input} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={longTail} onChange={(event) => setLongTail(event.target.checked)} /> Add long-tail tags</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeBrand} onChange={(event) => setIncludeBrand(event.target.checked)} /> Include brand tags</label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={generate} className={btn}>Generate Tags</button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(output)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200" disabled={tags.length === 0}>Copy Output</button>
        <button type="button" onClick={() => downloadText("youtube-tags.txt", output)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={tags.length === 0}>Download</button>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className={`text-xs ${charLength > 500 ? "text-rose-600" : "text-slate-500"}`}>Output length: {charLength} chars {charLength > 500 ? "(YouTube recommends keeping tags concise)" : ""}</p>
          <textarea value={output} readOnly className="h-36 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm" />
        </div>
      )}
    </Panel>
  );
}

/* ───── 4. Caption Generator ───── */
const captionTemplates: Record<string, string[]> = {
  casual: [
    "{hook} Working on {topic} today ✨",
    "If you care about {topic}, save this post 📌",
    "Small wins in {topic} are still wins 💯",
  ],
  professional: [
    "New insight from my {topic} workflow: {point}.",
    "What I learned from shipping {topic} this week.",
    "Framework for improving {topic} outcomes consistently.",
  ],
  witty: [
    "Me pretending {topic} is easy after 14 tabs open 😅",
    "Nobody: ... Me: Let me optimize {topic} one more time.",
    "Plot twist: {topic} was the bottleneck all along.",
  ],
  motivational: [
    "Start where you are. Improve {topic} by 1% today.",
    "Consistency in {topic} beats intensity every time.",
    "Your next {topic} breakthrough is one attempt away.",
  ],
};

export function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<keyof typeof captionTemplates>("casual");
  const [platform, setPlatform] = useState<"instagram" | "linkedin" | "x" | "youtube">("instagram");
  const [count, setCount] = useState(5);
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [ctaText, setCtaText] = useState("Comment your take below 👇");
  const [hashtagCount, setHashtagCount] = useState(4);
  const [captions, setCaptions] = useState<string[]>([]);

  const platformLimit = { instagram: 2200, linkedin: 3000, x: 280, youtube: 5000 };

  const generate = () => {
    const normalizedTopic = topic.trim() || "your niche";
    const hooks = ["Hot take:", "Today:", "Quick breakdown:", "Creator note:", "Practical tip:"];
    const templates = captionTemplates[tone];

    const next = Array.from({ length: Math.max(3, Math.min(10, count)) }, (_, index) => {
      const template = templates[index % templates.length];
      let caption = template
        .replace("{topic}", normalizedTopic)
        .replace("{point}", "small process improvements compound");

      caption = caption.replace("{hook}", hooks[index % hooks.length]);
      if (includeCTA) caption += `\n\n${ctaText}`;
      const hashtags = Array.from({ length: hashtagCount }, (__, hashtagIndex) => `#${normalizedTopic.replace(/\s+/g, "").toLowerCase()}${hashtagIndex === 0 ? "" : hashtagIndex + 1}`);
      if (platform !== "x") caption += `\n\n${hashtags.join(" ")}`;
      if (includeEmoji && !/[\u{1F300}-\u{1FAFF}]/u.test(caption)) caption += " 🚀";
      return caption;
    });

    setCaptions(next);
  };

  return (
    <Panel title="Caption Generator">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Topic</label>
          <input value={topic} onChange={(event) => setTopic(event.target.value)} className={input} placeholder="e.g. personal branding for developers" />
        </div>
        <div>
          <label className={label}>Tone</label>
          <select value={tone} onChange={(event) => setTone(event.target.value as keyof typeof captionTemplates)} className={input}>
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
            <option value="witty">Witty</option>
            <option value="motivational">Motivational</option>
          </select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div>
          <label className={label}>Platform</label>
          <select value={platform} onChange={(event) => setPlatform(event.target.value as "instagram" | "linkedin" | "x" | "youtube")} className={input}>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="x">X / Twitter</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
        <div>
          <label className={label}>Captions</label>
          <input type="number" min={3} max={10} value={count} onChange={(event) => setCount(Number(event.target.value) || 5)} className={input} />
        </div>
        <div>
          <label className={label}>Hashtags</label>
          <input type="number" min={0} max={10} value={hashtagCount} onChange={(event) => setHashtagCount(Number(event.target.value) || 0)} className={input} />
        </div>
        <div className="flex items-end gap-3 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeEmoji} onChange={(event) => setIncludeEmoji(event.target.checked)} /> Emoji</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeCTA} onChange={(event) => setIncludeCTA(event.target.checked)} /> CTA</label>
        </div>
      </div>

      <div className="mt-3">
        <label className={label}>CTA text</label>
        <input value={ctaText} onChange={(event) => setCtaText(event.target.value)} className={input} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={generate} className={btn}>Generate Captions</button>
        <button type="button" onClick={() => downloadText("captions.txt", captions.join("\n\n---\n\n"))} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={captions.length === 0}>Download</button>
      </div>

      {captions.length > 0 && (
        <div className="mt-4 space-y-2">
          {captions.map((caption, index) => (
            <div key={index} className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="whitespace-pre-wrap text-sm text-slate-700">{caption}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className={`text-xs ${caption.length > platformLimit[platform] ? "text-rose-600" : "text-slate-500"}`}>Length: {caption.length} / {platformLimit[platform]}</p>
                <CopyButton value={caption} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ───── 5. Bio Generator ───── */
export function BioGenerator() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [valueProp, setValueProp] = useState("");
  const [interests, setInterests] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "linkedin" | "x" | "youtube">("instagram");
  const [tone, setTone] = useState<"clean" | "bold" | "friendly">("clean");
  const [emojiStyle, setEmojiStyle] = useState<"none" | "light" | "full">("light");
  const [includeLink, setIncludeLink] = useState(true);
  const [linkText, setLinkText] = useState("↓ Free tools and resources");
  const [lengthTarget, setLengthTarget] = useState(120);
  const [bios, setBios] = useState<string[]>([]);

  const platformLimit = { instagram: 150, linkedin: 220, x: 160, youtube: 1000 };

  const generate = () => {
    const safeName = name.trim() || "Creator";
    const safeRole = role.trim() || "Content Strategist";
    const safeValue = valueProp.trim() || "Helping people get better outcomes";
    const interestList = interests
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, 3);

    const bullet = emojiStyle === "none" ? "•" : emojiStyle === "light" ? "✨" : "🚀";

    const templates = [
      `${safeName} ${bullet} ${safeRole}\n${safeValue}`,
      `${safeRole} | ${safeName}\n${interestList.join(" • ") || "Growth • Systems • Creativity"}`,
      `${safeName} — ${safeRole}\n${safeValue}\n${interestList[0] ? `${bullet} ${interestList[0]}` : ""}`,
      `${safeRole} helping with ${interestList[0] || "execution"}\n${safeValue}`,
      `${safeName}\n${safeRole}\n${safeValue}`,
    ];

    const normalized = templates.map((template) => {
      let output = template;
      if (tone === "bold") output = output.toUpperCase();
      if (tone === "friendly") output = `${output} :)`;
      if (includeLink) output += `\n${linkText}`;
      if (output.length > lengthTarget) output = `${output.slice(0, Math.max(60, lengthTarget - 3)).trim()}...`;
      return output;
    });

    setBios(normalized.slice(0, 5));
  };

  return (
    <Panel title="Bio Generator">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Name</label><input value={name} onChange={(event) => setName(event.target.value)} className={input} placeholder="Alex" /></div>
        <div><label className={label}>Role</label><input value={role} onChange={(event) => setRole(event.target.value)} className={input} placeholder="Developer Educator" /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Value proposition</label><input value={valueProp} onChange={(event) => setValueProp(event.target.value)} className={input} placeholder="Helping creators build systems" /></div>
        <div><label className={label}>Interests (comma-separated)</label><input value={interests} onChange={(event) => setInterests(event.target.value)} className={input} placeholder="automation, growth, design" /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div><label className={label}>Platform</label><select value={platform} onChange={(event) => setPlatform(event.target.value as "instagram" | "linkedin" | "x" | "youtube")} className={input}><option value="instagram">Instagram</option><option value="linkedin">LinkedIn</option><option value="x">X</option><option value="youtube">YouTube</option></select></div>
        <div><label className={label}>Tone</label><select value={tone} onChange={(event) => setTone(event.target.value as "clean" | "bold" | "friendly")} className={input}><option value="clean">Clean</option><option value="bold">Bold</option><option value="friendly">Friendly</option></select></div>
        <div><label className={label}>Emoji style</label><select value={emojiStyle} onChange={(event) => setEmojiStyle(event.target.value as "none" | "light" | "full")} className={input}><option value="none">None</option><option value="light">Light</option><option value="full">Full</option></select></div>
        <div><label className={label}>Target length</label><input type="number" value={lengthTarget} onChange={(event) => setLengthTarget(Number(event.target.value) || 120)} className={input} /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={includeLink} onChange={(event) => setIncludeLink(event.target.checked)} /> Include link line</label>
        <input value={linkText} onChange={(event) => setLinkText(event.target.value)} className={input} placeholder="↓ Your main link" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={generate} className={btn}>Generate Bios</button>
        <button type="button" onClick={() => downloadText("bios.txt", bios.join("\n\n---\n\n"))} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={bios.length === 0}>Download</button>
      </div>
      {bios.length > 0 && (
        <div className="mt-4 space-y-2">
          {bios.map((bio, index) => (
            <div key={index} className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="whitespace-pre-wrap text-sm text-slate-700">{bio}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className={`text-xs ${bio.length > platformLimit[platform] ? "text-rose-600" : "text-slate-500"}`}>Length: {bio.length} / {platformLimit[platform]}</p>
                <CopyButton value={bio} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ───── 6. Thumbnail Text Preview ───── */
export function ThumbnailTextPreview() {
  const [headline, setHeadline] = useState("5 MISTAKES TO AVOID");
  const [subline, setSubline] = useState("Beginner Guide");
  const [fontSize, setFontSize] = useState(58);
  const [subSize, setSubSize] = useState(30);
  const [weight, setWeight] = useState(800);
  const [headlineColor, setHeadlineColor] = useState("#ffffff");
  const [subColor, setSubColor] = useState("#fde047");
  const [bgColor, setBgColor] = useState("#1e1b4b");
  const [shadow, setShadow] = useState(true);
  const [stroke, setStroke] = useState(true);
  const [uppercase, setUppercase] = useState(true);
  const [align, setAlign] = useState<"left" | "center" | "right">("center");

  const shownHeadline = uppercase ? headline.toUpperCase() : headline;
  const shownSubline = uppercase ? subline.toUpperCase() : subline;

  const templatePreset = (type: "warning" | "tutorial" | "result") => {
    if (type === "warning") {
      setHeadline("DON'T DO THIS");
      setSubline("Huge Growth Killer");
      setSubColor("#fca5a5");
    }
    if (type === "tutorial") {
      setHeadline("STEP-BY-STEP");
      setSubline("No Fluff Tutorial");
      setSubColor("#86efac");
    }
    if (type === "result") {
      setHeadline("+300% CTR");
      setSubline("What Changed?");
      setSubColor("#93c5fd");
    }
  };

  return (
    <Panel title="Thumbnail Text Preview">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Headline</label><input value={headline} onChange={(event) => setHeadline(event.target.value)} className={input} /></div>
        <div><label className={label}>Subline</label><input value={subline} onChange={(event) => setSubline(event.target.value)} className={input} /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div><label className={label}>Headline size: {fontSize}</label><input type="range" min={26} max={110} value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} className="w-full" /></div>
        <div><label className={label}>Subline size: {subSize}</label><input type="range" min={14} max={56} value={subSize} onChange={(event) => setSubSize(Number(event.target.value))} className="w-full" /></div>
        <div><label className={label}>Weight: {weight}</label><input type="range" min={400} max={900} step={100} value={weight} onChange={(event) => setWeight(Number(event.target.value))} className="w-full" /></div>
        <div><label className={label}>Align</label><select value={align} onChange={(event) => setAlign(event.target.value as "left" | "center" | "right")} className={input}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Headline color</label><input type="color" value={headlineColor} onChange={(event) => setHeadlineColor(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>
        <div><label className={label}>Subline color</label><input type="color" value={subColor} onChange={(event) => setSubColor(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>
        <div><label className={label}>Background</label><input type="color" value={bgColor} onChange={(event) => setBgColor(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={shadow} onChange={(event) => setShadow(event.target.checked)} /> Text shadow</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={stroke} onChange={(event) => setStroke(event.target.checked)} /> Text stroke</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)} /> Uppercase</label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => templatePreset("warning")} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">Warning style</button>
        <button type="button" onClick={() => templatePreset("tutorial")} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">Tutorial style</button>
        <button type="button" onClick={() => templatePreset("result")} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">Result style</button>
      </div>
      <div className="mt-4 flex aspect-video items-center justify-center rounded-xl border border-slate-200 p-6" style={{ backgroundColor: bgColor }}>
        <div style={{ width: "100%", textAlign: align }}>
          <p
            style={{
              fontSize,
              fontWeight: weight,
              color: headlineColor,
              lineHeight: 1.05,
              letterSpacing: "0.5px",
              textShadow: shadow ? "2px 2px 6px rgba(0,0,0,0.45)" : "none",
              WebkitTextStroke: stroke ? "1.5px rgba(0,0,0,0.45)" : "0px",
            }}
          >
            {shownHeadline}
          </p>
          <p style={{ marginTop: 8, fontSize: subSize, fontWeight: 700, color: subColor, textShadow: shadow ? "1px 1px 4px rgba(0,0,0,0.45)" : "none" }}>{shownSubline}</p>
        </div>
      </div>
    </Panel>
  );
}

/* ───── 7. YouTube Description Template Generator ───── */
export function YouTubeDescriptionTemplateGenerator() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [points, setPoints] = useState("Point 1\nPoint 2\nPoint 3");
  const [timestamps, setTimestamps] = useState("00:00 Intro\n01:25 Main Topic\n04:50 Outro");
  const [links, setLinks] = useState("Website: https://tool-nest.tech\nInstagram: https://instagram.com/toolnest");
  const [hashtags, setHashtags] = useState("#creator #youtube #growth");
  const [cta, setCta] = useState("Like, comment, and subscribe for weekly creator systems.");
  const [includeChapters, setIncludeChapters] = useState(true);
  const [includeAffiliate, setIncludeAffiliate] = useState(false);
  const [includeCredits, setIncludeCredits] = useState(false);
  const [fileName, setFileName] = useState("youtube-description");

  const description = useMemo(() => {
    const blocks: string[] = [];
    if (title.trim()) blocks.push(`${title.trim()}\n`);
    if (summary.trim()) blocks.push(summary.trim());

    if (points.trim()) {
      blocks.push("\nWhat you will learn:\n" + points.split("\n").filter(Boolean).map((point) => `- ${point}`).join("\n"));
    }

    if (includeChapters && timestamps.trim()) {
      blocks.push("\nChapters:\n" + timestamps.trim());
    }

    if (links.trim()) {
      blocks.push("\nResources & Links:\n" + links.trim());
    }

    blocks.push(`\n${cta.trim()}`);

    if (includeAffiliate) blocks.push("\nDisclosure: Some links may be affiliate links at no extra cost to you.");
    if (includeCredits) blocks.push("\nCredits: Music and assets belong to their respective owners.");
    if (hashtags.trim()) blocks.push(`\n${hashtags.trim()}`);

    return blocks.join("\n").trim();
  }, [title, summary, points, timestamps, links, hashtags, cta, includeChapters, includeAffiliate, includeCredits]);

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

  return (
    <Panel title="YouTube Description Template Generator">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Video title</label><input value={title} onChange={(event) => setTitle(event.target.value)} className={input} /></div>
        <div><label className={label}>Download filename</label><input value={fileName} onChange={(event) => setFileName(event.target.value)} className={input} /></div>
      </div>
      <div className="mt-3"><label className={label}>Summary</label><textarea value={summary} onChange={(event) => setSummary(event.target.value)} className="h-20 w-full rounded-xl border border-slate-200 p-3 text-sm" /></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Key points (line-by-line)</label><textarea value={points} onChange={(event) => setPoints(event.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" /></div>
        <div><label className={label}>Timestamps</label><textarea value={timestamps} onChange={(event) => setTimestamps(event.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Links</label><textarea value={links} onChange={(event) => setLinks(event.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" /></div>
        <div><label className={label}>Hashtags</label><textarea value={hashtags} onChange={(event) => setHashtags(event.target.value)} className="h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" /></div>
      </div>
      <div className="mt-3"><label className={label}>Call to action</label><input value={cta} onChange={(event) => setCta(event.target.value)} className={input} /></div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeChapters} onChange={(event) => setIncludeChapters(event.target.checked)} /> Include chapters</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeAffiliate} onChange={(event) => setIncludeAffiliate(event.target.checked)} /> Include affiliate disclosure</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeCredits} onChange={(event) => setIncludeCredits(event.target.checked)} /> Include credits section</label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton value={description} />
        <button type="button" onClick={() => downloadText(`${sanitizeFileName(fileName, "youtube-description")}.txt`, description)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Download</button>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-xs text-slate-500">Words: {wordCount} • Characters: {description.length}</p>
        <textarea value={description} readOnly className="h-56 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm" />
      </div>
    </Panel>
  );
}

/* ───── 8. Video Length Estimator ───── */
export function VideoLengthEstimator() {
  const [words, setWords] = useState(1200);
  const [wpm, setWpm] = useState(150);
  const [pauseSeconds, setPauseSeconds] = useState(20);
  const [introSeconds, setIntroSeconds] = useState(8);
  const [outroSeconds, setOutroSeconds] = useState(10);
  const [cuts, setCuts] = useState(6);
  const [cutSeconds, setCutSeconds] = useState(1.2);
  const [rpm, setRpm] = useState(3.5);
  const [retention, setRetention] = useState(42);
  const [target, setTarget] = useState<"short" | "standard" | "long">("standard");

  const calculation = useMemo(() => {
    const speechSeconds = (words / Math.max(80, wpm)) * 60;
    const editOverhead = cuts * cutSeconds;
    const total = speechSeconds + pauseSeconds + introSeconds + outroSeconds + editOverhead;
    const minutes = total / 60;
    const estimatedRevenuePer1k = rpm * (retention / 100);

    let fit = "Good";
    if (target === "short" && total > 60) fit = "Too long for Shorts";
    if (target === "standard" && (minutes < 4 || minutes > 12)) fit = "Consider 4-12 minutes";
    if (target === "long" && minutes < 12) fit = "May be short for long-form";

    return {
      total,
      minutes,
      estimatedRevenuePer1k,
      fit,
    };
  }, [words, wpm, pauseSeconds, introSeconds, outroSeconds, cuts, cutSeconds, rpm, retention, target]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <Panel title="Video Length Estimator">
      <div className="grid gap-3 sm:grid-cols-4">
        <div><label className={label}>Words</label><input type="number" value={words} onChange={(event) => setWords(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Speaking speed (WPM)</label><input type="number" value={wpm} onChange={(event) => setWpm(Number(event.target.value) || 150)} className={input} /></div>
        <div><label className={label}>Intro sec</label><input type="number" value={introSeconds} onChange={(event) => setIntroSeconds(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Outro sec</label><input type="number" value={outroSeconds} onChange={(event) => setOutroSeconds(Number(event.target.value) || 0)} className={input} /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div><label className={label}>Pause sec</label><input type="number" value={pauseSeconds} onChange={(event) => setPauseSeconds(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Cuts</label><input type="number" value={cuts} onChange={(event) => setCuts(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Cut overhead sec</label><input type="number" step="0.1" value={cutSeconds} onChange={(event) => setCutSeconds(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Target format</label><select value={target} onChange={(event) => setTarget(event.target.value as "short" | "standard" | "long")} className={input}><option value="short">Shorts</option><option value="standard">Standard video</option><option value="long">Long-form</option></select></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>RPM ($/1000 views)</label><input type="number" step="0.1" value={rpm} onChange={(event) => setRpm(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Estimated retention: {retention}%</label><input type="range" min={10} max={90} value={retention} onChange={(event) => setRetention(Number(event.target.value))} className="w-full" /></div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">Estimated Duration</p><p className="text-lg font-semibold text-slate-900">{formatDuration(calculation.total)}</p></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">Minutes</p><p className="text-lg font-semibold text-slate-900">{calculation.minutes.toFixed(1)}</p></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">Revenue / 1k</p><p className="text-lg font-semibold text-slate-900">${calculation.estimatedRevenuePer1k.toFixed(2)}</p></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">Fit</p><p className="text-lg font-semibold text-slate-900">{calculation.fit}</p></div>
      </div>
    </Panel>
  );
}

/* ───── 9. Hook Generator for Reels ───── */
const hookTemplates: Record<string, string[]> = {
  curiosity: ["Nobody talks about this {topic} trick...", "This changed how I do {topic} forever.", "If you're serious about {topic}, read this."],
  urgency: ["Stop doing {topic} like this right now.", "Do this before your next {topic} post.", "You have 24h to fix this {topic} mistake."],
  authority: ["After 100+ tests, this is my {topic} framework.", "I audited 50 creators and found this {topic} pattern.", "Here's the exact {topic} system we use."],
  humor: ["POV: you said {topic} is easy 😅", "Me pretending I understand {topic} at 2AM.", "{topic} in theory vs {topic} in real life."],
};

export function HookGeneratorForReels() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("creators");
  const [emotion, setEmotion] = useState<keyof typeof hookTemplates>("curiosity");
  const [platform, setPlatform] = useState<"instagram" | "youtube" | "linkedin">("instagram");
  const [count, setCount] = useState(6);
  const [includeQuestion, setIncludeQuestion] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [hooks, setHooks] = useState<string[]>([]);

  const generate = () => {
    const safeTopic = topic.trim() || "content";
    const base = hookTemplates[emotion];
    const next = Array.from({ length: Math.max(3, Math.min(12, count)) }, (_, index) => {
      let hook = base[index % base.length].replaceAll("{topic}", safeTopic);
      if (includeNumber && index % 2 === 0) hook = `${index + 1}) ${hook}`;
      if (includeQuestion && !hook.endsWith("?") && index % 3 === 0) hook += " Why?";
      if (platform === "linkedin") hook = hook.replace("😅", "");
      if (includeEmoji && platform !== "linkedin" && !/[\u{1F300}-\u{1FAFF}]/u.test(hook)) hook += " 🚀";
      hook += ` (${audience})`;
      return hook;
    });
    setHooks(next);
  };

  return (
    <Panel title="Hook Generator for Reels">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Topic</label><input value={topic} onChange={(event) => setTopic(event.target.value)} className={input} placeholder="e.g. video editing" /></div>
        <div><label className={label}>Audience</label><input value={audience} onChange={(event) => setAudience(event.target.value)} className={input} placeholder="e.g. beginner creators" /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div><label className={label}>Emotion trigger</label><select value={emotion} onChange={(event) => setEmotion(event.target.value as keyof typeof hookTemplates)} className={input}><option value="curiosity">Curiosity</option><option value="urgency">Urgency</option><option value="authority">Authority</option><option value="humor">Humor</option></select></div>
        <div><label className={label}>Platform</label><select value={platform} onChange={(event) => setPlatform(event.target.value as "instagram" | "youtube" | "linkedin")} className={input}><option value="instagram">Instagram</option><option value="youtube">YouTube Shorts</option><option value="linkedin">LinkedIn</option></select></div>
        <div><label className={label}>Hook count</label><input type="number" min={3} max={12} value={count} onChange={(event) => setCount(Number(event.target.value) || 6)} className={input} /></div>
        <div className="flex items-end gap-3 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeQuestion} onChange={(event) => setIncludeQuestion(event.target.checked)} /> Question</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeNumber} onChange={(event) => setIncludeNumber(event.target.checked)} /> Number</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeEmoji} onChange={(event) => setIncludeEmoji(event.target.checked)} /> Emoji</label>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={generate} className={btn}>Generate Hooks</button>
        <button type="button" onClick={() => downloadText("reels-hooks.txt", hooks.join("\n"))} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={hooks.length === 0}>Download</button>
      </div>
      {hooks.length > 0 && (
        <div className="mt-4 space-y-2">
          {hooks.map((hook, index) => (
            <div key={index} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
              <p className="flex-1 text-sm text-slate-700">{hook}</p>
              <CopyButton value={hook} />
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ───── 10. Content Idea Generator ───── */
const ideaFormats = ["Tutorial", "List", "Comparison", "Myth Busting", "Case Study", "Story", "Framework", "Checklist", "Breakdown", "Reaction"];
const ideaAngles = ["for beginners", "for advanced users", "without paid tools", "in 30 days", "with examples", "that actually works", "from scratch", "step-by-step", "with templates", "with mistakes to avoid"];

export function ContentIdeaGenerator() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "youtube" | "linkedin" | "blog">("youtube");
  const [goal, setGoal] = useState<"reach" | "engagement" | "leads" | "sales">("reach");
  const [pillars, setPillars] = useState("education, storytelling, behind-the-scenes");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "advanced">("medium");
  const [count, setCount] = useState(12);
  const [ideas, setIdeas] = useState<Array<{ title: string; format: string; hook: string; cta: string; pillar: string }>>([]);

  const generate = () => {
    const safeNiche = niche.trim() || "creator growth";
    const pillarList = pillars
      .split(",")
      .map((pillar) => pillar.trim())
      .filter(Boolean);
    const ctaMap = {
      reach: "Share this with one creator.",
      engagement: "Comment your biggest blocker.",
      leads: "DM me 'SYSTEM' for the checklist.",
      sales: "Book a free strategy call.",
    };

    const next = Array.from({ length: Math.max(6, Math.min(30, count)) }, (_, index) => {
      const format = ideaFormats[index % ideaFormats.length];
      const angle = ideaAngles[index % ideaAngles.length];
      const pillar = pillarList[index % (pillarList.length || 1)] || "general";
      const title = `${format}: ${safeNiche} ${angle}`;
      const hook = `${index + 1}. ${safeNiche} ${difficulty === "easy" ? "made simple" : difficulty === "advanced" ? "deep dive" : "playbook"}`;
      return {
        title,
        format,
        hook,
        cta: ctaMap[goal],
        pillar,
      };
    });

    setIdeas(next);
  };

  const csv = useMemo(() => {
    const header = "Title,Format,Hook,CTA,Pillar,Platform";
    const rows = ideas.map((idea) => `"${idea.title.replaceAll("\"", "\"\"")}","${idea.format}","${idea.hook}","${idea.cta}","${idea.pillar}","${platform}"`);
    return [header, ...rows].join("\n");
  }, [ideas, platform]);

  return (
    <Panel title="Content Idea Generator">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Niche</label><input value={niche} onChange={(event) => setNiche(event.target.value)} className={input} placeholder="e.g. AI tools for students" /></div>
        <div><label className={label}>Pillars (comma-separated)</label><input value={pillars} onChange={(event) => setPillars(event.target.value)} className={input} /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div><label className={label}>Platform</label><select value={platform} onChange={(event) => setPlatform(event.target.value as "instagram" | "youtube" | "linkedin" | "blog")} className={input}><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option><option value="blog">Blog</option></select></div>
        <div><label className={label}>Goal</label><select value={goal} onChange={(event) => setGoal(event.target.value as "reach" | "engagement" | "leads" | "sales")} className={input}><option value="reach">Reach</option><option value="engagement">Engagement</option><option value="leads">Leads</option><option value="sales">Sales</option></select></div>
        <div><label className={label}>Difficulty</label><select value={difficulty} onChange={(event) => setDifficulty(event.target.value as "easy" | "medium" | "advanced")} className={input}><option value="easy">Easy</option><option value="medium">Medium</option><option value="advanced">Advanced</option></select></div>
        <div><label className={label}>Ideas count</label><input type="number" min={6} max={30} value={count} onChange={(event) => setCount(Number(event.target.value) || 12)} className={input} /></div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={generate} className={btn}>Generate Ideas</button>
        <button type="button" onClick={() => downloadText("content-ideas.csv", csv, "text/csv;charset=utf-8")} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={ideas.length === 0}>Export CSV</button>
      </div>

      {ideas.length > 0 && (
        <div className="mt-4 space-y-2">
          {ideas.map((idea, index) => (
            <div key={index} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">{idea.format}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">{idea.pillar}</span>
                <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-semibold text-cyan-700">{platform}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">{idea.title}</p>
              <p className="mt-1 text-sm text-slate-600">Hook: {idea.hook}</p>
              <p className="mt-1 text-sm text-slate-600">CTA: {idea.cta}</p>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ───── 11. YouTube Chapter Timestamp Generator ───── */
function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hours > 0) return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function YouTubeChapterTimestampGenerator() {
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [introSeconds, setIntroSeconds] = useState(20);
  const [outroSeconds, setOutroSeconds] = useState(25);
  const [includeIntroOutro, setIncludeIntroOutro] = useState(true);
  const [topics, setTopics] = useState("Setup\nStrategy\nLive Demo\nOptimization\nCommon Mistakes");
  const [prefix, setPrefix] = useState("Chapter");
  const [output, setOutput] = useState("");

  const build = () => {
    const items = topics.split("\n").map((line) => line.trim()).filter(Boolean);
    if (items.length === 0) {
      setOutput("");
      return;
    }
    const totalSeconds = Math.max(120, Math.round(durationMinutes * 60));
    const intro = includeIntroOutro ? Math.max(0, introSeconds) : 0;
    const outro = includeIntroOutro ? Math.max(0, outroSeconds) : 0;
    const coreDuration = Math.max(30, totalSeconds - intro - outro);
    const chunk = coreDuration / items.length;

    const lines: string[] = [];
    if (includeIntroOutro) lines.push(`${formatTime(0)} Intro`);

    let cursor = intro;
    items.forEach((item, index) => {
      const title = prefix.trim() ? `${prefix.trim()} ${index + 1}: ${item}` : item;
      lines.push(`${formatTime(cursor)} ${title}`);
      cursor += chunk;
    });

    if (includeIntroOutro) {
      lines.push(`${formatTime(Math.max(0, totalSeconds - outro))} Outro`);
    }

    setOutput(lines.join("\n"));
  };

  return (
    <Panel title="YouTube Chapter Timestamp Generator">
      <div className="grid gap-3 sm:grid-cols-4">
        <div><label className={label}>Video length (min)</label><input type="number" min={2} max={240} value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value) || 10)} className={input} /></div>
        <div><label className={label}>Intro sec</label><input type="number" min={0} max={120} value={introSeconds} onChange={(event) => setIntroSeconds(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Outro sec</label><input type="number" min={0} max={120} value={outroSeconds} onChange={(event) => setOutroSeconds(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Prefix</label><input value={prefix} onChange={(event) => setPrefix(event.target.value)} className={input} placeholder="Chapter" /></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeIntroOutro} onChange={(event) => setIncludeIntroOutro(event.target.checked)} /> Include intro/outro entries</label>
      </div>
      <div className="mt-3">
        <label className={label}>Topics (line-by-line)</label>
        <textarea value={topics} onChange={(event) => setTopics(event.target.value)} className="h-32 w-full rounded-xl border border-slate-200 p-3 text-sm" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={build} className={btn}>Generate Chapters</button>
        <button type="button" onClick={() => downloadText("youtube-chapters.txt", output)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={!output}>Download</button>
      </div>
      {output && (
        <div className="mt-4 space-y-2">
          <textarea value={output} readOnly className="h-44 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm" />
          <CopyButton value={output} />
        </div>
      )}
    </Panel>
  );
}

/* ───── 12. Engagement Rate Calculator ───── */
export function EngagementRateCalculator() {
  const [platform, setPlatform] = useState<"instagram" | "youtube" | "tiktok" | "linkedin">("instagram");
  const [likes, setLikes] = useState(1200);
  const [comments, setComments] = useState(140);
  const [shares, setShares] = useState(90);
  const [saves, setSaves] = useState(210);
  const [followers, setFollowers] = useState(25000);
  const [reach, setReach] = useState(18000);
  const [views, setViews] = useState(22000);

  const metrics = useMemo(() => {
    const total = Math.max(0, likes) + Math.max(0, comments) + Math.max(0, shares) + Math.max(0, saves);
    const byFollowers = followers > 0 ? (total / followers) * 100 : 0;
    const byReach = reach > 0 ? (total / reach) * 100 : 0;
    const byViews = views > 0 ? (total / views) * 100 : 0;
    const band = byReach >= 6 ? "Excellent" : byReach >= 3 ? "Good" : byReach >= 1.5 ? "Average" : "Low";
    return { total, byFollowers, byReach, byViews, band };
  }, [likes, comments, shares, saves, followers, reach, views]);

  return (
    <Panel title="Engagement Rate Calculator">
      <div className="grid gap-3 sm:grid-cols-4">
        <div>
          <label className={label}>Platform</label>
          <select value={platform} onChange={(event) => setPlatform(event.target.value as "instagram" | "youtube" | "tiktok" | "linkedin")} className={input}>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <div><label className={label}>Likes</label><input type="number" value={likes} onChange={(event) => setLikes(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Comments</label><input type="number" value={comments} onChange={(event) => setComments(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Shares</label><input type="number" value={shares} onChange={(event) => setShares(Number(event.target.value) || 0)} className={input} /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div><label className={label}>Saves</label><input type="number" value={saves} onChange={(event) => setSaves(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Followers</label><input type="number" value={followers} onChange={(event) => setFollowers(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Reach</label><input type="number" value={reach} onChange={(event) => setReach(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Views</label><input type="number" value={views} onChange={(event) => setViews(Number(event.target.value) || 0)} className={input} /></div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">Total Engagements</p><p className="text-lg font-semibold text-slate-900">{metrics.total}</p></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">ER by Followers</p><p className="text-lg font-semibold text-slate-900">{metrics.byFollowers.toFixed(2)}%</p></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">ER by Reach</p><p className="text-lg font-semibold text-slate-900">{metrics.byReach.toFixed(2)}%</p></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">Performance</p><p className="text-lg font-semibold text-slate-900">{metrics.band}</p></div>
      </div>
      <p className="mt-3 text-xs text-slate-500">Tip: For short-form, ER by reach is usually the most reliable comparison metric.</p>
    </Panel>
  );
}

/* ───── 13. Viral Content Calendar Generator ───── */
export function ViralContentCalendarGenerator() {
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2026);
  const [postsPerWeek, setPostsPerWeek] = useState(4);
  const [platform, setPlatform] = useState<"instagram" | "youtube" | "linkedin" | "x">("instagram");
  const [pillars, setPillars] = useState("education, authority, story, conversion");
  const [calendar, setCalendar] = useState<Array<{ date: string; pillar: string; angle: string; format: string }>>([]);

  const angles = ["how-to", "mistakes", "checklist", "behind-the-scenes", "case study", "opinion", "framework", "trend response"];
  const formats = {
    instagram: ["Reel", "Carousel", "Story", "Single post"],
    youtube: ["Short", "Long-form", "Community post", "Live"],
    linkedin: ["Text post", "Carousel PDF", "Video clip", "Poll"],
    x: ["Thread", "Single post", "Reply strategy", "Visual post"],
  };

  const generate = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const step = Math.max(1, Math.floor(7 / Math.max(1, postsPerWeek)));
    const pillarList = pillars.split(",").map((value) => value.trim()).filter(Boolean);
    const result: Array<{ date: string; pillar: string; angle: string; format: string }> = [];

    for (let day = 1, index = 0; day <= daysInMonth; day += step, index += 1) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      result.push({
        date,
        pillar: pillarList[index % (pillarList.length || 1)] || "general",
        angle: angles[index % angles.length],
        format: formats[platform][index % formats[platform].length],
      });
    }

    setCalendar(result);
  };

  const csv = useMemo(() => {
    const rows = calendar.map((item) => `${item.date},${item.pillar},${item.angle},${item.format}`);
    return ["Date,Pillar,Angle,Format", ...rows].join("\n");
  }, [calendar]);

  return (
    <Panel title="Viral Content Calendar Generator">
      <div className="grid gap-3 sm:grid-cols-4">
        <div><label className={label}>Month</label><input type="number" min={1} max={12} value={month} onChange={(event) => setMonth(Number(event.target.value) || 1)} className={input} /></div>
        <div><label className={label}>Year</label><input type="number" min={2024} max={2035} value={year} onChange={(event) => setYear(Number(event.target.value) || 2026)} className={input} /></div>
        <div><label className={label}>Posts per week</label><input type="number" min={1} max={14} value={postsPerWeek} onChange={(event) => setPostsPerWeek(Number(event.target.value) || 4)} className={input} /></div>
        <div><label className={label}>Platform</label><select value={platform} onChange={(event) => setPlatform(event.target.value as "instagram" | "youtube" | "linkedin" | "x")} className={input}><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option><option value="x">X</option></select></div>
      </div>
      <div className="mt-3">
        <label className={label}>Content pillars (comma-separated)</label>
        <input value={pillars} onChange={(event) => setPillars(event.target.value)} className={input} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={generate} className={btn}>Generate Calendar</button>
        <button type="button" onClick={() => downloadText("content-calendar.csv", csv, "text/csv;charset=utf-8")} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={calendar.length === 0}>Export CSV</button>
      </div>
      {calendar.length > 0 && (
        <div className="mt-4 max-h-72 space-y-2 overflow-auto">
          {calendar.map((item) => (
            <div key={`${item.date}-${item.pillar}-${item.angle}`} className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{item.date}</p>
              <p>Pillar: {item.pillar} • Angle: {item.angle} • Format: {item.format}</p>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ───── 14. Best Time to Post Planner ───── */
export function BestTimeToPostPlanner() {
  const [timezoneOffset, setTimezoneOffset] = useState(5.5);
  const [audienceRegions, setAudienceRegions] = useState("India:45, USA:30, UK:25");
  const [platform, setPlatform] = useState<"instagram" | "youtube" | "linkedin" | "x">("instagram");
  const [schedule, setSchedule] = useState<string[]>([]);

  const windows = {
    instagram: ["08:00", "12:30", "18:30", "21:00"],
    youtube: ["11:00", "15:00", "19:00"],
    linkedin: ["08:30", "10:30", "17:30"],
    x: ["09:00", "13:00", "20:00"],
  };

  const build = () => {
    const parsedRegions = audienceRegions
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [namePart, sharePart] = entry.split(":");
        return { name: namePart?.trim() || "Region", share: Number(sharePart) || 0 };
      });

    const totalShare = parsedRegions.reduce((sum, item) => sum + item.share, 0) || 1;
    const normalized = parsedRegions.map((item) => ({ ...item, share: (item.share / totalShare) * 100 }));
    const bestRegion = normalized.sort((left, right) => right.share - left.share)[0];
    const note = `Focus region: ${bestRegion?.name || "General"} (${(bestRegion?.share || 0).toFixed(1)}%)`;

    const converted = windows[platform].map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const utc = hours - timezoneOffset;
      const localHours = ((utc % 24) + 24) % 24;
      return `${String(Math.floor(localHours)).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    });

    setSchedule([note, ...converted.map((slot, index) => `Window ${index + 1}: ${slot}`)]);
  };

  return (
    <Panel title="Best Time to Post Planner">
      <div className="grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Platform</label><select value={platform} onChange={(event) => setPlatform(event.target.value as "instagram" | "youtube" | "linkedin" | "x")} className={input}><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option><option value="x">X</option></select></div>
        <div><label className={label}>Your timezone (UTC offset)</label><input type="number" step="0.5" value={timezoneOffset} onChange={(event) => setTimezoneOffset(Number(event.target.value) || 0)} className={input} /></div>
        <div><label className={label}>Audience mix</label><input value={audienceRegions} onChange={(event) => setAudienceRegions(event.target.value)} className={input} /></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={build} className={btn}>Calculate Best Times</button>
        <button type="button" onClick={() => downloadText("best-posting-times.txt", schedule.join("\n"))} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={schedule.length === 0}>Download</button>
      </div>
      {schedule.length > 0 && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {schedule.map((line) => (
            <p key={line} className="text-sm text-slate-700">{line}</p>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ───── 15. UTM Link Builder for Creators ───── */
export function UtmLinkBuilderForCreators() {
  const [url, setUrl] = useState("https://tool-nest.tech/tools/content-idea-generator");
  const [source, setSource] = useState("instagram");
  const [medium, setMedium] = useState("social");
  const [campaign, setCampaign] = useState("creator-growth");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("bio-link");
  const [built, setBuilt] = useState("");

  const build = () => {
    try {
      const target = new URL(url.trim());
      target.searchParams.set("utm_source", source.trim().toLowerCase());
      target.searchParams.set("utm_medium", medium.trim().toLowerCase());
      target.searchParams.set("utm_campaign", campaign.trim().toLowerCase().replace(/\s+/g, "-"));
      if (term.trim()) target.searchParams.set("utm_term", term.trim().toLowerCase().replace(/\s+/g, "-"));
      if (content.trim()) target.searchParams.set("utm_content", content.trim().toLowerCase().replace(/\s+/g, "-"));
      setBuilt(target.toString());
    } catch {
      setBuilt("Invalid URL. Please enter a full URL including https://");
    }
  };

  return (
    <Panel title="UTM Link Builder for Creators">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className={label}>Target URL</label><input value={url} onChange={(event) => setUrl(event.target.value)} className={input} placeholder="https://example.com/page" /></div>
        <div><label className={label}>Source</label><input value={source} onChange={(event) => setSource(event.target.value)} className={input} placeholder="instagram" /></div>
        <div><label className={label}>Medium</label><input value={medium} onChange={(event) => setMedium(event.target.value)} className={input} placeholder="social" /></div>
        <div><label className={label}>Campaign</label><input value={campaign} onChange={(event) => setCampaign(event.target.value)} className={input} placeholder="spring-launch" /></div>
        <div><label className={label}>Term</label><input value={term} onChange={(event) => setTerm(event.target.value)} className={input} placeholder="optional" /></div>
        <div><label className={label}>Content</label><input value={content} onChange={(event) => setContent(event.target.value)} className={input} placeholder="story-link-a" /></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={build} className={btn}>Build UTM Link</button>
        <button type="button" onClick={() => downloadText("utm-link.txt", built)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" disabled={!built}>Download</button>
      </div>
      {built && (
        <div className="mt-4 space-y-2">
          <textarea value={built} readOnly className="h-28 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm" />
          <CopyButton value={built} />
        </div>
      )}
    </Panel>
  );
}
