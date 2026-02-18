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

const label = "block text-sm font-medium text-slate-700 mb-1";
const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";
const btn = "rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition";

/* ───── 1. Instagram Hashtag Generator ───── */
const hashtagDb: Record<string, string[]> = {
  fitness: ["#fitness", "#fitfam", "#gym", "#workout", "#healthylifestyle", "#motivation", "#bodybuilding", "#fitnessmotivation", "#training", "#exercise", "#strength", "#muscle", "#health", "#fitlife", "#gymlife", "#personaltrainer", "#homeworkout", "#fitnessjourney", "#weightloss", "#cardio"],
  tech: ["#technology", "#tech", "#coding", "#programming", "#developer", "#software", "#webdev", "#javascript", "#python", "#ai", "#machinelearning", "#startup", "#innovation", "#gadgets", "#techlife", "#code", "#devlife", "#frontend", "#backend", "#dataScience"],
  food: ["#food", "#foodie", "#instafood", "#foodphotography", "#cooking", "#yummy", "#recipe", "#delicious", "#homecooking", "#foodstagram", "#dinner", "#lunch", "#healthyfood", "#foodblog", "#chef", "#baking", "#vegan", "#dessert", "#breakfast", "#foodlover"],
  travel: ["#travel", "#travelgram", "#wanderlust", "#instatravel", "#explore", "#adventure", "#traveling", "#vacation", "#travelphotography", "#trip", "#holiday", "#nature", "#tourism", "#traveladdict", "#backpacking", "#solotravel", "#beach", "#mountains", "#roadtrip", "#passport"],
  fashion: ["#fashion", "#style", "#ootd", "#fashionblogger", "#instafashion", "#streetstyle", "#outfit", "#fashionstyle", "#trendy", "#fashionista", "#model", "#beauty", "#lookbook", "#clothing", "#stylish", "#shopping", "#mensfashion", "#womensfashion", "#accessories", "#luxury"],
  business: ["#business", "#entrepreneur", "#marketing", "#startup", "#success", "#branding", "#motivation", "#money", "#smallbusiness", "#digitalmarketing", "#socialmedia", "#hustle", "#growth", "#leadership", "#goals", "#mindset", "#strategy", "#ecommerce", "#investing", "#ceo"],
};

export function InstagramHashtagGenerator() {
  const [niche, setNiche] = useState("");
  const [count, setCount] = useState(20);
  const [result, setResult] = useState<string[]>([]);

  const generate = () => {
    const key = niche.toLowerCase().trim();
    const allNiches = Object.keys(hashtagDb);
    const match = allNiches.find((n) => key.includes(n)) || allNiches[Math.floor(Math.random() * allNiches.length)];
    const tags = [...hashtagDb[match]];
    // shuffle & slice
    for (let i = tags.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [tags[i], tags[j]] = [tags[j], tags[i]]; }
    // add niche-specific custom tag
    if (key && !tags.some((t) => t.includes(key.replace(/\s/g, "")))) {
      tags.unshift(`#${key.replace(/\s+/g, "")}`);
    }
    setResult(tags.slice(0, count));
  };

  return (
    <Panel title="Instagram Hashtag Generator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2"><label className={label}>Niche / Topic</label><input value={niche} onChange={(e) => setNiche(e.target.value)} className={input} placeholder="e.g. fitness, tech, food, travel" /></div>
        <div><label className={label}>Count</label>
          <select value={count} onChange={(e) => setCount(parseInt(e.target.value))} className={input}>
            {[10, 15, 20, 25, 30].map((n) => <option key={n} value={n}>{n} hashtags</option>)}
          </select>
        </div>
      </div>
      <button type="button" onClick={generate} className={`mt-4 ${btn}`}>Generate Hashtags</button>
      {result.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">{result.map((t) => <span key={t} className="rounded-full bg-pink-50 px-3 py-1 text-sm font-medium text-pink-700">{t}</span>)}</div>
          <CopyButton value={result.join(" ")} />
        </div>
      )}
    </Panel>
  );
}

/* ───── 2. YouTube Title Analyzer ───── */
const powerWords = ["ultimate", "proven", "secret", "exclusive", "insane", "shocking", "incredible", "amazing", "best", "worst", "free", "hack", "trick", "easy", "fast", "complete", "guide", "tutorial", "how to", "why", "truth", "mistake", "avoid", "never", "always"];
const emotionWords = ["love", "hate", "fear", "angry", "happy", "sad", "surprise", "wow", "OMG", "crazy", "mind-blowing", "unbelievable", "heartbreaking"];

export function YouTubeTitleAnalyzer() {
  const [title, setTitle] = useState("");
  const analysis = useMemo(() => {
    if (!title.trim()) return null;
    const lower = title.toLowerCase();
    const words = title.split(/\s+/).filter(Boolean);
    let score = 0;
    const tips: string[] = [];

    // Length check
    if (title.length >= 40 && title.length <= 70) { score += 25; } else {
      score += 10;
      tips.push(title.length < 40 ? "Title is short — aim for 40-70 characters." : "Title may truncate — keep it under 70 characters.");
    }

    // Power words
    const pw = powerWords.filter((w) => lower.includes(w));
    if (pw.length >= 1) score += 20; else tips.push("Add power words like 'Ultimate', 'Proven', 'Secret' to boost CTR.");

    // Numbers
    if (/\d/.test(title)) score += 15; else tips.push("Adding a number (e.g., '5 Tips...') sets expectations and improves clicks.");

    // Emotion
    const ew = emotionWords.filter((w) => lower.includes(w));
    if (ew.length >= 1) score += 15; else tips.push("Consider emotional triggers like 'Shocking', 'Amazing', or 'Mind-Blowing'.");

    // Brackets
    if (/[\[\(]/.test(title)) score += 10; else tips.push("Brackets like [2026] or (Step-by-Step) increase CTR by ~33%.");

    // Capitalization
    const caps = words.filter((w) => w[0] === w[0]?.toUpperCase()).length;
    if (caps >= words.length * 0.5) score += 10;

    // Keyword front-loading
    if (words.length >= 3) score += 5;

    return { score: Math.min(100, score), pw, ew, length: title.length, wordCount: words.length, tips };
  }, [title]);

  const scoreColor = (s: number) => s >= 70 ? "text-emerald-700 bg-emerald-50" : s >= 40 ? "text-amber-700 bg-amber-50" : "text-rose-700 bg-rose-50";

  return (
    <Panel title="YouTube Title Analyzer">
      <label className={label}>Video Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} placeholder="e.g. 10 Python Tricks Every Developer Should Know [2026]" />
      {analysis && (
        <div className="mt-4 space-y-3">
          <div className={`rounded-xl p-4 text-center ${scoreColor(analysis.score)}`}>
            <p className="text-3xl font-bold">{analysis.score}/100</p>
            <p className="text-sm font-medium">{analysis.score >= 70 ? "Great title!" : analysis.score >= 40 ? "Good, but can be improved" : "Needs improvement"}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-lg bg-slate-100 px-2 py-1">{analysis.length} chars</span>
            <span className="rounded-lg bg-slate-100 px-2 py-1">{analysis.wordCount} words</span>
            <span className="rounded-lg bg-blue-50 px-2 py-1 text-blue-700">{analysis.pw.length} power words</span>
            <span className="rounded-lg bg-pink-50 px-2 py-1 text-pink-700">{analysis.ew.length} emotion words</span>
          </div>
          {analysis.tips.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-700">Suggestions:</p>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">{analysis.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

/* ───── 3. YouTube Tag Generator ───── */
export function YouTubeTagGenerator() {
  const [topic, setTopic] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const generate = () => {
    const t = topic.trim();
    if (!t) return;
    const words = t.toLowerCase().split(/\s+/);
    const base = [t.toLowerCase(), ...words];
    const suffixes = ["tutorial", "explained", "for beginners", "2026", "guide", "tips", "how to", "best", "review", "vs"];
    const prefixes = ["how to", "best", "learn", "top", "what is"];
    const generated = new Set<string>(base);
    suffixes.forEach((s) => generated.add(`${t.toLowerCase()} ${s}`));
    prefixes.forEach((p) => generated.add(`${p} ${t.toLowerCase()}`));
    words.forEach((w) => suffixes.slice(0, 3).forEach((s) => generated.add(`${w} ${s}`)));
    setTags(Array.from(generated).slice(0, 20));
  };

  return (
    <Panel title="YouTube Tag Generator">
      <div className="flex gap-3">
        <div className="flex-1"><label className={label}>Video Topic</label><input value={topic} onChange={(e) => setTopic(e.target.value)} className={input} placeholder="e.g. JavaScript array methods" /></div>
      </div>
      <button type="button" onClick={generate} className={`mt-4 ${btn}`}>Generate Tags</button>
      {tags.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">{tags.map((t) => <span key={t} className="rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-700">{t}</span>)}</div>
          <CopyButton value={tags.join(", ")} />
        </div>
      )}
    </Panel>
  );
}

/* ───── 4. Caption Generator ───── */
const captionTemplates: Record<string, string[]> = {
  casual: [
    "Just vibing with {topic} today ✨ What about you?",
    "Living my best {topic} life 🌟 Drop a ❤️ if you relate!",
    "{topic} hits different when you actually enjoy it 💯",
    "Can't stop thinking about {topic} — anyone else? 🙋",
    "Here's your sign to try {topic} today 🚀",
  ],
  professional: [
    "Excited to share my latest work on {topic}. Here's what I learned →",
    "Key insight from working on {topic}: consistency beats perfection.",
    "The future of {topic} is here, and we're just getting started.",
    "Proud to announce our latest milestone in {topic}. More details below.",
    "If you're serious about {topic}, these 3 principles will change everything.",
  ],
  witty: [
    "Me: I should be productive. Also me: *researches {topic} for 3 hours* 😅",
    "Plot twist: {topic} was the answer all along 🎬",
    "They said {topic} was impossible. Challenge accepted 💪",
    "My {topic} game is strong and my coffee is stronger ☕",
    "Breaking: local person becomes obsessed with {topic}. More at 11.",
  ],
  motivational: [
    "Your {topic} journey starts with a single step. Take it today. 🔥",
    "Don't wait for the perfect moment to start {topic}. Start now.",
    "Every expert in {topic} was once a beginner. Keep going! 💪",
    "The only limit to your {topic} success is your belief in yourself.",
    "Dream it. Plan it. Do it. {topic} is waiting for you. 🌟",
  ],
};

export function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<keyof typeof captionTemplates>("casual");
  const [captions, setCaptions] = useState<string[]>([]);

  const generate = () => {
    const t = topic.trim() || "this";
    setCaptions(captionTemplates[tone].map((tpl) => tpl.replace(/{topic}/g, t)));
  };

  return (
    <Panel title="Caption Generator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Topic</label><input value={topic} onChange={(e) => setTopic(e.target.value)} className={input} placeholder="e.g. morning routine, new product" /></div>
        <div><label className={label}>Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value as keyof typeof captionTemplates)} className={input}>
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
            <option value="witty">Witty</option>
            <option value="motivational">Motivational</option>
          </select>
        </div>
      </div>
      <button type="button" onClick={generate} className={`mt-4 ${btn}`}>Generate Captions</button>
      {captions.length > 0 && (
        <div className="mt-4 space-y-2">
          {captions.map((c, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg bg-pink-50/50 p-3">
              <p className="flex-1 text-sm text-slate-800">{c}</p>
              <CopyButton value={c} />
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
  const [interests, setInterests] = useState("");
  const [bios, setBios] = useState<string[]>([]);

  const generate = () => {
    const n = name.trim() || "Creative";
    const r = role.trim() || "Professional";
    const int = interests.split(",").map((s) => s.trim()).filter(Boolean);
    const i1 = int[0] || "innovation";
    const i2 = int[1] || "growth";
    setBios([
      `${r} | ${i1} & ${i2} enthusiast | Building cool stuff ✨`,
      `${n} • ${r} • Passionate about ${i1} 🚀`,
      `${r} by day, ${i1} geek by night 🌙 | ${i2} advocate`,
      `Helping people with ${i1} | ${r} | 📍 Open to collaborate`,
      `${n} | ${r} | ${int.slice(0, 3).join(" • ") || "Tech • Life • Growth"}`,
      `☕ ${r} | Exploring ${i1} | Living for ${i2}`,
    ]);
  };

  return (
    <Panel title="Bio Generator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Your Name</label><input value={name} onChange={(e) => setName(e.target.value)} className={input} placeholder="Alex" /></div>
        <div><label className={label}>Role / Profession</label><input value={role} onChange={(e) => setRole(e.target.value)} className={input} placeholder="Software Developer" /></div>
        <div><label className={label}>Interests (comma-separated)</label><input value={interests} onChange={(e) => setInterests(e.target.value)} className={input} placeholder="coding, design, music" /></div>
      </div>
      <button type="button" onClick={generate} className={`mt-4 ${btn}`}>Generate Bios</button>
      {bios.length > 0 && (
        <div className="mt-4 space-y-2">
          {bios.map((b, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-pink-50/50 p-3">
              <p className="flex-1 text-sm text-slate-800">{b}</p>
              <CopyButton value={b} />
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ───── 6. Thumbnail Text Preview ───── */
export function ThumbnailTextPreview() {
  const [text, setText] = useState("MUST WATCH");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#1e1b4b");
  const [bold, setBold] = useState(true);
  const [stroke, setStroke] = useState(true);

  return (
    <Panel title="Thumbnail Text Preview">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div><label className={label}>Headline Text</label><input value={text} onChange={(e) => setText(e.target.value)} className={input} /></div>
        <div><label className={label}>Font Size ({fontSize}px)</label><input type="range" min={16} max={96} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full" /></div>
        <div className="flex gap-3">
          <div className="flex-1"><label className={label}>Text Color</label><input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-slate-200" /></div>
          <div className="flex-1"><label className={label}>BG Color</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-slate-200" /></div>
        </div>
      </div>
      <div className="mt-2 flex gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={bold} onChange={(e) => setBold(e.target.checked)} />Bold</label>
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={stroke} onChange={(e) => setStroke(e.target.checked)} />Text Stroke</label>
      </div>
      <div className="mt-4 flex items-center justify-center overflow-hidden rounded-xl" style={{ backgroundColor: bgColor, aspectRatio: "16/9", maxHeight: 360 }}>
        <p style={{ fontSize, color: textColor, fontWeight: bold ? 800 : 400, WebkitTextStroke: stroke ? `2px rgba(0,0,0,0.5)` : "none", textAlign: "center", padding: "1rem", lineHeight: 1.2, wordBreak: "break-word" }}>
          {text || "Your Text Here"}
        </p>
      </div>
      <p className="mt-2 text-xs text-slate-500">Preview shown at 16:9 aspect ratio (standard YouTube thumbnail)</p>
    </Panel>
  );
}

/* ───── 7. YouTube Description Template Generator ───── */
export function YouTubeDescriptionTemplateGenerator() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [timestamps, setTimestamps] = useState("0:00 Intro");
  const [socials, setSocials] = useState("");
  const [cta, setCta] = useState("Subscribe for more!");

  const description = useMemo(() => {
    const parts = [
      title.trim() ? `${title.trim()}\n` : "",
      summary.trim() ? `${summary.trim()}\n` : "",
      "📌 Timestamps:\n" + timestamps.trim(),
      "\n\n🔔 Don't forget to Like, Share & Subscribe!",
      cta.trim() ? `\n${cta.trim()}` : "",
      socials.trim() ? `\n\n📱 Connect with me:\n${socials.trim()}` : "",
      "\n\n#youtube #content",
    ];
    return parts.join("\n");
  }, [title, summary, timestamps, socials, cta]);

  return (
    <Panel title="YouTube Description Template">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Video Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className={input} placeholder="My Awesome Video" /></div>
        <div><label className={label}>Call to Action</label><input value={cta} onChange={(e) => setCta(e.target.value)} className={input} /></div>
      </div>
      <div className="mt-4"><label className={label}>Summary (2-3 lines)</label><textarea value={summary} onChange={(e) => setSummary(e.target.value)} className={`${input} h-20`} placeholder="In this video, I show you..." /></div>
      <div className="mt-4"><label className={label}>Timestamps (one per line)</label><textarea value={timestamps} onChange={(e) => setTimestamps(e.target.value)} className={`${input} h-24`} placeholder="0:00 Intro\n1:30 Main Topic" /></div>
      <div className="mt-4"><label className={label}>Social Links (one per line)</label><textarea value={socials} onChange={(e) => setSocials(e.target.value)} className={`${input} h-20`} placeholder="Instagram: https://instagram.com/you" /></div>
      <div className="mt-4 space-y-2">
        <label className={label}>Preview</label>
        <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">{description}</pre>
        <CopyButton value={description} />
      </div>
    </Panel>
  );
}

/* ───── 8. Video Length Estimator ───── */
export function VideoLengthEstimator() {
  const [words, setWords] = useState("");
  const [wpm, setWpm] = useState("150");
  const [rpm, setRpm] = useState("");

  const result = useMemo(() => {
    const w = parseInt(words);
    const s = parseInt(wpm);
    if (isNaN(w) || isNaN(s) || s === 0) return null;
    const minutes = w / s;
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.round((minutes % 1) * 60);
    const rpmVal = parseFloat(rpm);
    const views1k = !isNaN(rpmVal) ? `$${(rpmVal * (minutes / 1)).toFixed(2)}` : null;
    return { hrs, mins, secs, totalMins: minutes.toFixed(1), revenue: views1k };
  }, [words, wpm, rpm]);

  return (
    <Panel title="Video Length Estimator & RPM Calculator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Script Word Count</label><input type="number" value={words} onChange={(e) => setWords(e.target.value)} className={input} placeholder="e.g. 1500" /></div>
        <div><label className={label}>Speaking Speed (WPM)</label><input type="number" value={wpm} onChange={(e) => setWpm(e.target.value)} className={input} /></div>
        <div><label className={label}>RPM ($ per 1000 views)</label><input type="number" step="0.01" value={rpm} onChange={(e) => setRpm(e.target.value)} className={input} placeholder="Optional" /></div>
      </div>
      {result && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <div className="rounded-xl bg-indigo-50 px-4 py-3 text-center">
            <p className="text-xl font-bold text-indigo-700">{result.hrs > 0 ? `${result.hrs}h ` : ""}{result.mins}m {result.secs}s</p>
            <p className="text-xs text-indigo-500">Estimated Duration</p>
          </div>
          {result.revenue && (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center">
              <p className="text-xl font-bold text-emerald-700">{result.revenue}</p>
              <p className="text-xs text-emerald-500">Est. Revenue / 1K views</p>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

/* ───── 9. Hook Generator for Reels ───── */
const hookTemplates: Record<string, string[]> = {
  curiosity: [
    "Nobody is talking about this {topic} hack...",
    "I can't believe this {topic} trick actually works",
    "Here's what they don't tell you about {topic}",
    "The secret to {topic} that changed everything for me",
    "What if I told you everything you know about {topic} is wrong?",
  ],
  shock: [
    "STOP doing {topic} like this immediately!",
    "This {topic} mistake is costing you everything",
    "I was today years old when I learned this about {topic}",
    "This {topic} fact will blow your mind 🤯",
    "You've been doing {topic} wrong your entire life",
  ],
  humor: [
    "POV: You finally understand {topic} 😂",
    "When someone tells you they don't need {topic}... 🤡",
    "Me trying to explain {topic} to my friends:",
    "{topic} be like... *chaos ensues*",
    "Nobody: Me at 3am researching {topic}: 🕐",
  ],
  urgency: [
    "You NEED to know this about {topic} RIGHT NOW",
    "Do this {topic} trick before it's too late ⏰",
    "If you're into {topic}, watch this before scrolling",
    "Last chance to learn this {topic} hack",
    "Save this {topic} tip — you'll thank me later 📌",
  ],
};

export function HookGeneratorForReels() {
  const [topic, setTopic] = useState("");
  const [emotion, setEmotion] = useState<keyof typeof hookTemplates>("curiosity");
  const [hooks, setHooks] = useState<string[]>([]);

  const generate = () => {
    const t = topic.trim() || "this thing";
    setHooks(hookTemplates[emotion].map((h) => h.replace(/{topic}/g, t)));
  };

  return (
    <Panel title="Hook Generator for Reels & Shorts">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Topic</label><input value={topic} onChange={(e) => setTopic(e.target.value)} className={input} placeholder="e.g. productivity, cooking, coding" /></div>
        <div><label className={label}>Emotion Trigger</label>
          <select value={emotion} onChange={(e) => setEmotion(e.target.value as keyof typeof hookTemplates)} className={input}>
            <option value="curiosity">🧐 Curiosity</option>
            <option value="shock">😱 Shock</option>
            <option value="humor">😂 Humor</option>
            <option value="urgency">⏰ Urgency</option>
          </select>
        </div>
      </div>
      <button type="button" onClick={generate} className={`mt-4 ${btn}`}>Generate Hooks</button>
      {hooks.length > 0 && (
        <div className="mt-4 space-y-2">
          {hooks.map((h, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-pink-50/50 p-3">
              <p className="flex-1 text-sm font-medium text-slate-800">{h}</p>
              <CopyButton value={h} />
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ───── 10. Content Idea Generator ───── */
const ideaFormats = ["Tutorial", "Listicle", "Comparison", "Behind the Scenes", "Day in the Life", "Q&A", "Review", "Case Study", "Challenge", "Tips & Tricks"];
const ideaTemplates = [
  "{n} Things Nobody Tells You About {topic}",
  "How I Mastered {topic} in {n} Days",
  "Beginner's Guide to {topic} — Everything You Need to Know",
  "{topic} vs {topic2}: Which is Better in 2026?",
  "Why Most People Fail at {topic} (And How to Fix It)",
  "I Tried {topic} for 30 Days — Here's What Happened",
  "Top {n} {topic} Mistakes to Avoid",
  "The Complete {topic} Toolkit for {audience}",
  "How to Start {topic} with Zero Experience",
  "{n} {topic} Hacks That Actually Work",
  "What I Wish I Knew Before Starting {topic}",
  "Is {topic} Still Worth It in 2026? Honest Review",
];

export function ContentIdeaGenerator() {
  const [niche, setNiche] = useState("");
  const [ideas, setIdeas] = useState<{ title: string; format: string }[]>([]);

  const generate = () => {
    const t = niche.trim() || "your niche";
    const result = ideaTemplates.map((tpl) => ({
      title: tpl.replace(/{topic}/g, t).replace(/{topic2}/g, `Alt ${t}`).replace(/{n}/g, String(Math.floor(Math.random() * 8) + 3)).replace(/{audience}/g, "Beginners"),
      format: ideaFormats[Math.floor(Math.random() * ideaFormats.length)],
    }));
    setIdeas(result);
  };

  return (
    <Panel title="Content Idea Generator">
      <div className="flex gap-3">
        <div className="flex-1"><label className={label}>Your Niche / Topic</label><input value={niche} onChange={(e) => setNiche(e.target.value)} className={input} placeholder="e.g. personal finance, web development" /></div>
      </div>
      <button type="button" onClick={generate} className={`mt-4 ${btn}`}>Generate Ideas</button>
      {ideas.length > 0 && (
        <div className="mt-4 space-y-2">
          {ideas.map((idea, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-pink-50/50 p-3">
              <span className="shrink-0 rounded-full bg-pink-100 px-2 py-0.5 text-xs font-semibold text-pink-700">{idea.format}</span>
              <p className="flex-1 text-sm text-slate-800">{idea.title}</p>
              <CopyButton value={idea.title} />
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
