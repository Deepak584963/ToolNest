"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import CopyButton from "@/components/CopyButton";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-5 dark:border-slate-700/60 dark:bg-slate-800/60">
      <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

const label = "block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300";
const input = "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white";
const btn = "rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition";

function downloadBlob(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

/* ───── 1. HEIC to JPG Converter ───── */
export function HeicToJpgConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");

  const convert = useCallback(async () => {
    if (!file) { setStatus("Please select a HEIC file."); return; }
    setStatus("Converting…");
    try {
      const heic2any = (await import("heic2any")).default;
      const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
      const result = Array.isArray(blob) ? blob[0] : blob;
      const url = URL.createObjectURL(result);
      setPreview(url);
      downloadBlob(file.name.replace(/\.heic$/i, ".jpg"), result);
      setStatus("✅ Converted successfully!");
    } catch (err) {
      setStatus("❌ Error: " + (err instanceof Error ? err.message : String(err)));
    }
  }, [file]);

  return (
    <Panel title="HEIC to JPG Converter">
      <div className="space-y-4">
        <div>
          <label className={label}>Select HEIC/HEIF Image</label>
          <input type="file" accept=".heic,.heif" onChange={e => setFile(e.target.files?.[0] || null)} className={input} />
        </div>
        <button type="button" onClick={convert} className={btn}>Convert to JPG</button>
        {status && <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p>}
        {preview && <img src={preview} alt="Converted preview" className="max-h-64 rounded-xl border border-slate-200 dark:border-slate-600" />}
      </div>
    </Panel>
  );
}

/* ───── 2. Instagram Grid Maker ───── */
export function InstagramGridMaker() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState("");
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setPreview(ev.target?.result as string);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(f);
  };

  const split = useCallback(() => {
    if (!image) return;
    const size = Math.min(image.width, image.height);
    const cellSize = size / 3;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const idx = row * 3 + col;
        const canvas = canvasRefs.current[idx];
        if (!canvas) continue;
        canvas.width = cellSize;
        canvas.height = cellSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        const sx = (image.width - size) / 2 + col * cellSize;
        const sy = (image.height - size) / 2 + row * cellSize;
        ctx.drawImage(image, sx, sy, cellSize, cellSize, 0, 0, cellSize, cellSize);
      }
    }
  }, [image]);

  const download = (idx: number) => {
    const canvas = canvasRefs.current[idx];
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (blob) downloadBlob(`grid_${idx + 1}.png`, blob);
    }, "image/png");
  };

  const downloadAll = () => {
    for (let i = 0; i < 9; i++) download(i);
  };

  return (
    <Panel title="Instagram Grid Maker (3×3 Splitter)">
      <div className="space-y-4">
        <div>
          <label className={label}>Select Image</label>
          <input type="file" accept="image/*" onChange={handleFile} className={input} />
        </div>
        {preview && (
          <>
            <div className="flex gap-3 items-start flex-wrap">
              <img src={preview} alt="Original" className="h-40 rounded-xl border border-slate-200 dark:border-slate-600" />
              <button type="button" onClick={split} className={btn}>Split into 3×3 Grid</button>
            </div>
            <div className="grid grid-cols-3 gap-1.5 max-w-md">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="relative group">
                  <canvas ref={el => { canvasRefs.current[i] = el; }} className="w-full rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700" />
                  <button type="button" onClick={() => download(i)} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg text-white text-xs font-bold">⬇ {i + 1}</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={downloadAll} className={btn}>Download All 9 Tiles</button>
          </>
        )}
      </div>
    </Panel>
  );
}

/* ───── 3. YouTube Thumbnail Downloader ───── */
export function YoutubeThumbnailDownloader() {
  const [url, setUrl] = useState("");

  const videoId = useMemo(() => {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }, [url]);

  const thumbnails = useMemo(() => {
    if (!videoId) return [];
    return [
      { label: "Max Resolution (1280×720)", url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
      { label: "Standard (640×480)", url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
      { label: "High Quality (480×360)", url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
      { label: "Medium Quality (320×180)", url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
      { label: "Default (120×90)", url: `https://img.youtube.com/vi/${videoId}/default.jpg` },
    ];
  }, [videoId]);

  return (
    <Panel title="YouTube Thumbnail Downloader">
      <div className="space-y-4">
        <div>
          <label className={label}>YouTube Video URL</label>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)} className={input} placeholder="https://www.youtube.com/watch?v=..." />
        </div>
        {videoId ? (
          <div className="space-y-4">
            {thumbnails.map((t) => (
              <div key={t.label} className="rounded-xl border border-slate-200 p-3 dark:border-slate-600">
                <p className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">{t.label}</p>
                <img src={t.url} alt={t.label} className="w-full max-w-lg rounded-xl" loading="lazy" />
                <div className="mt-2 flex gap-2">
                  <a href={t.url} target="_blank" rel="noopener noreferrer" className={btn}>Open in New Tab</a>
                  <CopyButton value={t.url} />
                </div>
              </div>
            ))}
          </div>
        ) : url.length > 5 ? (
          <p className="text-sm text-red-500">Could not extract video ID. Please enter a valid YouTube URL.</p>
        ) : null}
      </div>
    </Panel>
  );
}

/* ───── 4. Random Password Generator ───── */
export function RandomPasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    let chars = "";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) { setPassword("Select at least one option"); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    const pw = Array.from(arr).map(n => chars[n % chars.length]).join("");
    setPassword(pw);
    setHistory(prev => [pw, ...prev].slice(0, 10));
  }, [length, upper, lower, numbers, symbols]);

  const strength = useMemo(() => {
    if (!password || password.startsWith("Select")) return { label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (score <= 2) return { label: "Weak", color: "text-red-500" };
    if (score <= 3) return { label: "Medium", color: "text-amber-500" };
    if (score <= 4) return { label: "Strong", color: "text-emerald-500" };
    return { label: "Very Strong", color: "text-emerald-600" };
  }, [password]);

  return (
    <Panel title="Random Password Generator">
      <div className="space-y-4">
        <div>
          <label className={label}>Length: {length}</label>
          <input type="range" min={4} max={64} value={length} onChange={e => setLength(Number(e.target.value))} className="w-full" />
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} /> Uppercase (A-Z)</label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} /> Lowercase (a-z)</label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><input type="checkbox" checked={numbers} onChange={e => setNumbers(e.target.checked)} /> Numbers (0-9)</label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} /> Symbols (!@#$...)</label>
        </div>
        <button type="button" onClick={generate} className={btn}>Generate Password</button>
        {password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-base dark:border-slate-600 dark:bg-slate-700 dark:text-white">{password}</code>
              <CopyButton value={password} />
            </div>
            {strength.label && <p className={`text-sm font-bold ${strength.color}`}>Strength: {strength.label}</p>}
          </div>
        )}
        {history.length > 1 && (
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Recent ({history.length})</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {history.map((pw, i) => <p key={i} className="font-mono text-xs text-slate-500 dark:text-slate-400 truncate">{pw}</p>)}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

/* ───── 5. Binary ↔ Text Converter ───── */
export function BinaryTextConverter() {
  const [text, setText] = useState("Hello ToolNest!");
  const [binary, setBinary] = useState("");
  const [mode, setMode] = useState<"textToBin" | "binToText">("textToBin");

  const result = useMemo(() => {
    if (mode === "textToBin") {
      return text.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    } else {
      try {
        return binary.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join("");
      } catch {
        return "⚠ Invalid binary input";
      }
    }
  }, [text, binary, mode]);

  return (
    <Panel title="Binary ↔ Text Converter">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button type="button" onClick={() => setMode("textToBin")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${mode === "textToBin" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>Text → Binary</button>
          <button type="button" onClick={() => setMode("binToText")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${mode === "binToText" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>Binary → Text</button>
        </div>
        {mode === "textToBin" ? (
          <div><label className={label}>Text Input</label><textarea value={text} onChange={e => setText(e.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white" /></div>
        ) : (
          <div><label className={label}>Binary Input (space-separated)</label><textarea value={binary} onChange={e => setBinary(e.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white" placeholder="01001000 01100101 01101100 01101100 01101111" /></div>
        )}
        <div>
          <label className={label}>Result</label>
          <textarea readOnly value={result} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
          <div className="mt-2"><CopyButton value={result} /></div>
        </div>
      </div>
    </Panel>
  );
}

/* ───── 6. Text to Speech Reader ───── */
export function TextToSpeechReader() {
  const [text, setText] = useState("Welcome to ToolNest! This is a text to speech reader. Paste your text here and click speak to hear it aloud.");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState(0);

  const loadVoices = useCallback(() => {
    const v = speechSynthesis.getVoices();
    setVoices(v);
  }, []);

  // load voices
  if (typeof window !== "undefined" && voices.length === 0) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  const speak = useCallback(() => {
    if (!text.trim()) return;
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    utter.pitch = pitch;
    if (voices[selectedVoice]) utter.voice = voices[selectedVoice];
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    speechSynthesis.speak(utter);
  }, [text, rate, pitch, voices, selectedVoice]);

  const stop = () => { speechSynthesis.cancel(); setSpeaking(false); };

  return (
    <Panel title="Text to Speech Reader">
      <div className="space-y-4">
        <div>
          <label className={label}>Text to Read</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={6} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className={label}>Voice</label>
            <select value={selectedVoice} onChange={e => setSelectedVoice(Number(e.target.value))} className={input}>
              {voices.map((v, i) => <option key={i} value={i}>{v.name} ({v.lang})</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Speed: {rate.toFixed(1)}x</label>
            <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className={label}>Pitch: {pitch.toFixed(1)}</label>
            <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={e => setPitch(Number(e.target.value))} className="w-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={speak} disabled={speaking} className={`${btn} ${speaking ? "opacity-50" : ""}`}>🔊 Speak</button>
          <button type="button" onClick={stop} className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition">⏹ Stop</button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Characters: {text.length} • Words: {text.trim().split(/\s+/).filter(Boolean).length}</p>
      </div>
    </Panel>
  );
}

/* ───── 7. Twitch Emote Resizer ───── */
export function TwitchEmoteResizer() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState("");
  const sizes = [28, 56, 112];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => { setImage(img); setPreview(ev.target?.result as string); };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(f);
  };

  const downloadSize = useCallback((size: number) => {
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(image, 0, 0, size, size);
    canvas.toBlob(blob => {
      if (blob) downloadBlob(`emote_${size}x${size}.png`, blob);
    }, "image/png");
  }, [image]);

  const downloadAll = () => sizes.forEach(s => downloadSize(s));

  return (
    <Panel title="Twitch Emote Resizer">
      <div className="space-y-4">
        <div>
          <label className={label}>Upload Emote Image</label>
          <input type="file" accept="image/*" onChange={handleFile} className={input} />
        </div>
        {preview && (
          <>
            <div className="flex items-end gap-4">
              {sizes.map(size => {
                const canvas = document.createElement("canvas");
                canvas.width = size;
                canvas.height = size;
                if (image) {
                  const ctx = canvas.getContext("2d");
                  ctx?.drawImage(image, 0, 0, size, size);
                }
                return (
                  <div key={size} className="text-center">
                    <div className="rounded-lg border border-slate-200 p-1 dark:border-slate-600 inline-block" style={{ width: size + 8, height: size + 8 }}>
                      {image && <img src={canvas.toDataURL()} alt={`${size}x${size}`} width={size} height={size} />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{size}×{size}</p>
                    <button type="button" onClick={() => downloadSize(size)} className="mt-1 text-xs text-indigo-600 hover:underline dark:text-indigo-400">Download</button>
                  </div>
                );
              })}
            </div>
            <button type="button" onClick={downloadAll} className={btn}>Download All Sizes</button>
          </>
        )}
      </div>
    </Panel>
  );
}
