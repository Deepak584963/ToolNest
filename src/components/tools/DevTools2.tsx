"use client";

import { useCallback, useMemo, useState } from "react";
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

/* ───── 1. JSON Minifier ───── */
export function JsonMinifier() {
  const [input_, setInput_] = useState('{\n  "name": "ToolNest",\n  "version": 1,\n  "free": true\n}');
  const output = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(input_));
    } catch {
      return "⚠ Invalid JSON";
    }
  }, [input_]);

  const savings = useMemo(() => {
    if (output.startsWith("⚠")) return null;
    const saved = input_.length - output.length;
    const pct = ((saved / input_.length) * 100).toFixed(1);
    return { saved, pct };
  }, [input_, output]);

  return (
    <Panel title="JSON Minifier">
      <div className="space-y-4">
        <div>
          <label className={label}>Input JSON</label>
          <textarea value={input_} onChange={e => setInput_(e.target.value)} rows={8} className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
        </div>
        {savings && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Saved <strong className="text-indigo-600 dark:text-indigo-400">{savings.saved}</strong> characters ({savings.pct}% reduction)
          </p>
        )}
        <div>
          <label className={label}>Minified Output</label>
          <textarea readOnly value={output} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
          <div className="mt-2"><CopyButton value={output} /></div>
        </div>
      </div>
    </Panel>
  );
}

/* ───── 2. CSV to JSON Converter ───── */
export function CsvToJsonConverter() {
  const [csv, setCsv] = useState("name,age,city\nAlice,30,New York\nBob,25,London\nCharlie,35,Tokyo");
  const [delimiter, setDelimiter] = useState(",");

  const output = useMemo(() => {
    try {
      const lines = csv.trim().split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return "[]";
      const headers = lines[0].split(delimiter).map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const vals = line.split(delimiter).map(v => v.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
        return obj;
      });
      return JSON.stringify(rows, null, 2);
    } catch {
      return "⚠ Could not parse CSV";
    }
  }, [csv, delimiter]);

  return (
    <Panel title="CSV to JSON Converter">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-3">
            <label className={label}>CSV Input</label>
            <textarea value={csv} onChange={e => setCsv(e.target.value)} rows={8} className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
          </div>
          <div>
            <label className={label}>Delimiter</label>
            <select value={delimiter} onChange={e => setDelimiter(e.target.value)} className={input}>
              <option value=",">,  (comma)</option>
              <option value=";">; (semicolon)</option>
              <option value="\t">Tab</option>
              <option value="|">| (pipe)</option>
            </select>
          </div>
        </div>
        <div>
          <label className={label}>JSON Output</label>
          <textarea readOnly value={output} rows={10} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
          <div className="mt-2"><CopyButton value={output} /></div>
        </div>
      </div>
    </Panel>
  );
}

/* ───── 3. Markdown to HTML Converter ───── */
export function MarkdownToHtmlConverter() {
  const [md, setMd] = useState("# Hello World\n\nThis is **bold** and *italic* text.\n\n- Item 1\n- Item 2\n- Item 3\n\n```js\nconsole.log('ToolNest');\n```\n\n[Visit ToolNest](https://toolnest.com)");

  const html = useMemo(() => {
    let h = md;
    // Code blocks
    h = h.replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>");
    // Inline code
    h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
    // Headings
    h = h.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
    h = h.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
    h = h.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
    h = h.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
    h = h.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
    h = h.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");
    // Bold and italic
    h = h.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/\*(.+?)\*/g, "<em>$1</em>");
    // Links
    h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    // Images
    h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
    // Unordered list
    h = h.replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>");
    h = h.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");
    h = h.replace(/<\/ul>\s*<ul>/g, "");
    // Ordered list
    h = h.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");
    // Blockquote
    h = h.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");
    // Horizontal rule
    h = h.replace(/^---$/gm, "<hr />");
    // Paragraphs (remaining lines)
    h = h.replace(/^(?!<[a-z])((?!\n).+)$/gm, "<p>$1</p>");
    return h.trim();
  }, [md]);

  return (
    <Panel title="Markdown to HTML Converter">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className={label}>Markdown Input</label>
          <textarea value={md} onChange={e => setMd(e.target.value)} rows={14} className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
        </div>
        <div>
          <label className={label}>HTML Output</label>
          <textarea readOnly value={html} rows={14} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
          <div className="mt-2"><CopyButton value={html} /></div>
        </div>
      </div>
    </Panel>
  );
}

/* ───── 4. HTML to Markdown Converter ───── */
export function HtmlToMarkdownConverter() {
  const [html, setHtml] = useState('<h1>Welcome</h1>\n<p>This is <strong>bold</strong> and <em>italic</em> text.</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n<a href="https://toolnest.com">Visit ToolNest</a>');

  const md = useMemo(() => {
    let m = html;
    // Headings
    m = m.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n");
    m = m.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n");
    m = m.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n");
    m = m.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n");
    m = m.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n");
    m = m.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n");
    // Bold and italic
    m = m.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
    m = m.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
    m = m.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
    m = m.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
    // Links
    m = m.replace(/<a[^>]+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
    // Images
    m = m.replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
    // Lists
    m = m.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
    m = m.replace(/<\/?[ou]l[^>]*>/gi, "\n");
    // Code
    m = m.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n");
    m = m.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
    // Blockquote
    m = m.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "> $1\n");
    // Paragraphs
    m = m.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
    // HR
    m = m.replace(/<hr\s*\/?>/gi, "---\n");
    // BR
    m = m.replace(/<br\s*\/?>/gi, "\n");
    // Strip remaining tags
    m = m.replace(/<\/?[^>]+(>|$)/g, "");
    // Clean multiple blank lines
    m = m.replace(/\n{3,}/g, "\n\n");
    return m.trim();
  }, [html]);

  return (
    <Panel title="HTML to Markdown Converter">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className={label}>HTML Input</label>
          <textarea value={html} onChange={e => setHtml(e.target.value)} rows={14} className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
        </div>
        <div>
          <label className={label}>Markdown Output</label>
          <textarea readOnly value={md} rows={14} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
          <div className="mt-2"><CopyButton value={md} /></div>
        </div>
      </div>
    </Panel>
  );
}

/* ───── 5. CSS Gradient Generator ───── */
export function CssGradientGenerator() {
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#06b6d4");
  const [angle, setAngle] = useState("135");
  const [type, setType] = useState<"linear" | "radial">("linear");

  const gradient = useMemo(() => {
    if (type === "radial") return `radial-gradient(circle, ${color1}, ${color2})`;
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  }, [color1, color2, angle, type]);

  const css = `background: ${gradient};`;

  return (
    <Panel title="CSS Gradient Generator">
      <div className="space-y-4">
        <div className="h-40 w-full rounded-2xl border border-slate-200 dark:border-slate-600" style={{ background: gradient }} />
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className={label}>Color 1</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
              <input type="text" value={color1} onChange={e => setColor1(e.target.value)} className={input} />
            </div>
          </div>
          <div>
            <label className={label}>Color 2</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
              <input type="text" value={color2} onChange={e => setColor2(e.target.value)} className={input} />
            </div>
          </div>
          <div>
            <label className={label}>Type</label>
            <select value={type} onChange={e => setType(e.target.value as "linear" | "radial")} className={input}>
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>
          {type === "linear" && (
            <div>
              <label className={label}>Angle: {angle}°</label>
              <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(e.target.value)} className="w-full mt-2" />
            </div>
          )}
        </div>
        <div>
          <label className={label}>CSS Code</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-mono dark:border-slate-600 dark:bg-slate-700 dark:text-white">{css}</code>
            <CopyButton value={css} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ───── 6. CSS Box Shadow Generator ───── */
export function CssBoxShadowGenerator() {
  const [x, setX] = useState("4");
  const [y, setY] = useState("4");
  const [blur, setBlur] = useState("16");
  const [spread, setSpread] = useState("0");
  const [color, setColor] = useState("#6366f1");
  const [opacity, setOpacity] = useState("25");
  const [inset, setInset] = useState(false);

  const shadow = useMemo(() => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const a = parseInt(opacity) / 100;
    return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${a})`;
  }, [x, y, blur, spread, color, opacity, inset]);

  const css = `box-shadow: ${shadow};`;

  return (
    <Panel title="CSS Box Shadow Generator">
      <div className="space-y-4">
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-10 dark:border-slate-600 dark:bg-slate-700">
          <div className="h-32 w-48 rounded-2xl bg-white dark:bg-slate-800" style={{ boxShadow: shadow }} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div><label className={label}>X Offset: {x}px</label><input type="range" min={-50} max={50} value={x} onChange={e => setX(e.target.value)} className="w-full" /></div>
          <div><label className={label}>Y Offset: {y}px</label><input type="range" min={-50} max={50} value={y} onChange={e => setY(e.target.value)} className="w-full" /></div>
          <div><label className={label}>Blur: {blur}px</label><input type="range" min={0} max={100} value={blur} onChange={e => setBlur(e.target.value)} className="w-full" /></div>
          <div><label className={label}>Spread: {spread}px</label><input type="range" min={-50} max={50} value={spread} onChange={e => setSpread(e.target.value)} className="w-full" /></div>
          <div>
            <label className={label}>Color</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 w-full rounded cursor-pointer" />
          </div>
          <div><label className={label}>Opacity: {opacity}%</label><input type="range" min={0} max={100} value={opacity} onChange={e => setOpacity(e.target.value)} className="w-full" /></div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={inset} onChange={e => setInset(e.target.checked)} /> Inset shadow
        </label>
        <div>
          <label className={label}>CSS Code</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-mono dark:border-slate-600 dark:bg-slate-700 dark:text-white">{css}</code>
            <CopyButton value={css} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ───── 7. Bcrypt Hash Generator ───── */
export function BcryptHashGenerator() {
  const [text, setText] = useState("");
  const [hash, setHash] = useState("");
  const [verifyText, setVerifyText] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<null | boolean>(null);
  const [status, setStatus] = useState("");

  const generate = useCallback(async () => {
    if (!text) { setStatus("Enter text to hash."); return; }
    try {
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(text, salt);
      setHash(hashed);
      setStatus("");
    } catch (err) {
      setStatus("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  }, [text]);

  const verify = useCallback(async () => {
    if (!verifyText || !verifyHash) { setVerifyResult(null); return; }
    try {
      const bcrypt = await import("bcryptjs");
      const match = await bcrypt.compare(verifyText, verifyHash);
      setVerifyResult(match);
    } catch {
      setVerifyResult(false);
    }
  }, [verifyText, verifyHash]);

  return (
    <Panel title="Bcrypt Hash Generator & Checker">
      <div className="space-y-5">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Generate Hash</h3>
          <div>
            <label className={label}>Text to Hash</label>
            <input type="text" value={text} onChange={e => setText(e.target.value)} className={input} placeholder="Enter password or text" />
          </div>
          <button type="button" onClick={generate} className={btn}>Generate Bcrypt Hash</button>
          {hash && (
            <div>
              <label className={label}>Bcrypt Hash</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono dark:border-slate-600 dark:bg-slate-700 dark:text-white">{hash}</code>
                <CopyButton value={hash} />
              </div>
            </div>
          )}
          {status && <p className="text-sm text-red-500">{status}</p>}
        </div>

        <hr className="border-slate-200 dark:border-slate-600" />

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Verify Hash</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={label}>Plain Text</label>
              <input type="text" value={verifyText} onChange={e => setVerifyText(e.target.value)} className={input} placeholder="Original text" />
            </div>
            <div>
              <label className={label}>Bcrypt Hash</label>
              <input type="text" value={verifyHash} onChange={e => setVerifyHash(e.target.value)} className={input} placeholder="$2a$10..." />
            </div>
          </div>
          <button type="button" onClick={verify} className={btn}>Verify</button>
          {verifyResult !== null && (
            <p className={`text-sm font-bold ${verifyResult ? "text-emerald-600" : "text-red-500"}`}>
              {verifyResult ? "✅ Match! The text matches the hash." : "❌ No match."}
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ───── 8. URL Query String Parser ───── */
export function UrlQueryStringParser() {
  const [url, setUrl] = useState("https://example.com/page?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&ref=homepage&page=2");

  const parsed = useMemo(() => {
    try {
      const u = new URL(url);
      return {
        protocol: u.protocol,
        host: u.host,
        pathname: u.pathname,
        hash: u.hash,
        params: Array.from(u.searchParams.entries()),
      };
    } catch {
      return null;
    }
  }, [url]);

  return (
    <Panel title="URL & Query String Parser">
      <div className="space-y-4">
        <div>
          <label className={label}>Enter URL</label>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)} className={input} placeholder="https://example.com?key=value" />
        </div>
        {parsed ? (
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-950/30">
                <p className="text-xs text-indigo-500 dark:text-indigo-400">Protocol</p>
                <p className="font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300">{parsed.protocol}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
                <p className="text-xs text-emerald-500 dark:text-emerald-400">Host</p>
                <p className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">{parsed.host}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/30">
                <p className="text-xs text-amber-500 dark:text-amber-400">Path</p>
                <p className="font-mono text-sm font-bold text-amber-700 dark:text-amber-300">{parsed.pathname}</p>
              </div>
            </div>
            {parsed.params.length > 0 && (
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Query Parameters ({parsed.params.length})</p>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-600">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50 dark:bg-slate-700"><th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Key</th><th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Value</th></tr></thead>
                    <tbody>
                      {parsed.params.map(([k, v], i) => (
                        <tr key={i} className="border-t border-slate-100 dark:border-slate-600">
                          <td className="px-4 py-2 font-mono text-indigo-600 dark:text-indigo-400">{k}</td>
                          <td className="px-4 py-2 font-mono text-slate-700 dark:text-slate-300">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-red-500">Enter a valid URL.</p>
        )}
      </div>
    </Panel>
  );
}

/* ───── 9. Color Contrast Checker (WCAG) ───── */
export function ColorContrastChecker() {
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#6366f1");

  const result = useMemo(() => {
    const hexToRgb = (hex: string) => {
      const h = hex.replace("#", "");
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    };
    const luminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    const [r1, g1, b1] = hexToRgb(fg);
    const [r2, g2, b2] = hexToRgb(bg);
    const l1 = luminance(r1, g1, b1);
    const l2 = luminance(r2, g2, b2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return {
      ratio: ratio.toFixed(2),
      aaLarge: ratio >= 3,
      aaNormal: ratio >= 4.5,
      aaaLarge: ratio >= 4.5,
      aaaNormal: ratio >= 7,
    };
  }, [fg, bg]);

  const Pass = () => <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">PASS</span>;
  const Fail = () => <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/40 dark:text-red-400">FAIL</span>;

  return (
    <Panel title="Color Contrast Checker (WCAG)">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Foreground (Text)</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
              <input type="text" value={fg} onChange={e => setFg(e.target.value)} className={input} />
            </div>
          </div>
          <div>
            <label className={label}>Background</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
              <input type="text" value={bg} onChange={e => setBg(e.target.value)} className={input} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-2xl p-8" style={{ backgroundColor: bg }}>
          <p className="text-2xl font-bold" style={{ color: fg }}>Sample Text Preview</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700">
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{result.ratio}:1</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Contrast Ratio</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700">
            <p className="mb-1">{result.aaNormal ? <Pass /> : <Fail />}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">AA Normal</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700">
            <p className="mb-1">{result.aaLarge ? <Pass /> : <Fail />}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">AA Large</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700">
            <p className="mb-1">{result.aaaNormal ? <Pass /> : <Fail />}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">AAA Normal</p>
          </div>
        </div>
        <button type="button" onClick={() => { const t = fg; setFg(bg); setBg(t); }} className={btn}>Swap Colors</button>
      </div>
    </Panel>
  );
}

/* ───── 10. HEX to RGB / RGB to HEX ───── */
export function HexRgbConverter() {
  const [hex, setHex] = useState("#6366f1");
  const [r, setR] = useState("99");
  const [g, setG] = useState("102");
  const [b, setB] = useState("241");

  const hexToRgb = useCallback((h: string) => {
    const clean = h.replace("#", "");
    if (clean.length !== 6) return;
    setR(String(parseInt(clean.slice(0, 2), 16)));
    setG(String(parseInt(clean.slice(2, 4), 16)));
    setB(String(parseInt(clean.slice(4, 6), 16)));
  }, []);

  const rgbToHex = useCallback(() => {
    const rr = Math.min(255, Math.max(0, parseInt(r) || 0));
    const gg = Math.min(255, Math.max(0, parseInt(g) || 0));
    const bb = Math.min(255, Math.max(0, parseInt(b) || 0));
    setHex(`#${rr.toString(16).padStart(2, "0")}${gg.toString(16).padStart(2, "0")}${bb.toString(16).padStart(2, "0")}`);
  }, [r, g, b]);

  const handleHexChange = (val: string) => {
    setHex(val);
    hexToRgb(val);
  };

  const handleRgbChange = (channel: "r" | "g" | "b", val: string) => {
    if (channel === "r") setR(val);
    if (channel === "g") setG(val);
    if (channel === "b") setB(val);
  };

  const rgbString = `rgb(${r}, ${g}, ${b})`;
  const hslString = useMemo(() => {
    const rr = (parseInt(r) || 0) / 255;
    const gg = (parseInt(g) || 0) / 255;
    const bb = (parseInt(b) || 0) / 255;
    const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
    const l = (max + min) / 2;
    if (max === min) return `hsl(0, 0%, ${Math.round(l * 100)}%)`;
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
    else if (max === gg) h = ((bb - rr) / d + 2) / 6;
    else h = ((rr - gg) / d + 4) / 6;
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }, [r, g, b]);

  return (
    <Panel title="HEX ↔ RGB Converter">
      <div className="space-y-4">
        <div className="h-20 w-full rounded-2xl border border-slate-200 dark:border-slate-600" style={{ backgroundColor: hex }} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>HEX</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={hex} onChange={e => handleHexChange(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
              <input type="text" value={hex} onChange={e => handleHexChange(e.target.value)} className={input} />
            </div>
          </div>
          <div>
            <label className={label}>RGB</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" min={0} max={255} value={r} onChange={e => handleRgbChange("r", e.target.value)} onBlur={rgbToHex} className={input} placeholder="R" />
              <input type="number" min={0} max={255} value={g} onChange={e => handleRgbChange("g", e.target.value)} onBlur={rgbToHex} className={input} placeholder="G" />
              <input type="number" min={0} max={255} value={b} onChange={e => handleRgbChange("b", e.target.value)} onBlur={rgbToHex} className={input} placeholder="B" />
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-700">
            <code className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300">{hex}</code>
            <CopyButton value={hex} />
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-700">
            <code className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300">{rgbString}</code>
            <CopyButton value={rgbString} />
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-700">
            <code className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300">{hslString}</code>
            <CopyButton value={hslString} />
          </div>
        </div>
      </div>
    </Panel>
  );
}
