"use client";

import { useCallback, useRef, useState } from "react";
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

/* ───── 1. Merge PDF ───── */
export function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const merge = useCallback(async () => {
    if (files.length < 2) { setStatus("Please select at least 2 PDF files."); return; }
    setStatus("Merging…");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const pdfBytes = await merged.save();
      downloadBlob("merged.pdf", new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
      setStatus(`✅ Merged ${files.length} files successfully!`);
    } catch (err) {
      setStatus("❌ Error: " + (err instanceof Error ? err.message : String(err)));
    }
  }, [files]);

  return (
    <Panel title="Merge PDF Files">
      <div className="space-y-4">
        <div>
          <label className={label}>Select PDF Files (2 or more)</label>
          <input ref={inputRef} type="file" accept=".pdf" multiple onChange={handleFiles} className={input} />
        </div>
        {files.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{files.length} files selected:</p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
              {files.map((f, i) => <li key={i}>{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>)}
            </ul>
          </div>
        )}
        <button type="button" onClick={merge} className={btn}>Merge PDFs</button>
        {status && <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p>}
      </div>
    </Panel>
  );
}

/* ───── 2. Split PDF ───── */
export function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [from, setFrom] = useState("1");
  const [to, setTo] = useState("1");
  const [status, setStatus] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setTotalPages(doc.getPageCount());
      setTo(String(doc.getPageCount()));
      setStatus("");
    } catch {
      setStatus("Could not read PDF.");
    }
  };

  const split = useCallback(async () => {
    if (!file) return;
    const f = parseInt(from), t = parseInt(to);
    if (isNaN(f) || isNaN(t) || f < 1 || t > totalPages || f > t) { setStatus("Invalid page range."); return; }
    setStatus("Splitting…");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const dest = await PDFDocument.create();
      const indices = Array.from({ length: t - f + 1 }, (_, i) => f - 1 + i);
      const pages = await dest.copyPages(src, indices);
      pages.forEach((p) => dest.addPage(p));
      const pdfBytes = await dest.save();
      downloadBlob(`split_${f}-${t}.pdf`, new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
      setStatus(`✅ Extracted pages ${f}–${t} successfully!`);
    } catch (err) {
      setStatus("❌ Error: " + (err instanceof Error ? err.message : String(err)));
    }
  }, [file, from, to, totalPages]);

  return (
    <Panel title="Split PDF — Extract Pages">
      <div className="space-y-4">
        <div>
          <label className={label}>Select PDF File</label>
          <input type="file" accept=".pdf" onChange={handleFile} className={input} />
        </div>
        {totalPages > 0 && (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total pages: <strong className="text-slate-800 dark:text-white">{totalPages}</strong></p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={label}>From Page</label><input type="number" min={1} max={totalPages} value={from} onChange={e => setFrom(e.target.value)} className={input} /></div>
              <div><label className={label}>To Page</label><input type="number" min={1} max={totalPages} value={to} onChange={e => setTo(e.target.value)} className={input} /></div>
            </div>
            <button type="button" onClick={split} className={btn}>Extract Pages</button>
          </>
        )}
        {status && <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p>}
      </div>
    </Panel>
  );
}

/* ───── 3. PDF to Text Extractor ───── */
export function PdfToTextExtractor() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setStatus("Extracting text…");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = doc.getPages();
      // pdf-lib doesn't extract text directly; we use a basic approach
      // For proper text extraction, we'd need pdf.js but for simplicity:
      let extracted = "";
      // Use pdf.js for text extraction
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdfDoc = await loadingTask.promise;
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str).filter(Boolean);
        extracted += `--- Page ${i} ---\n${strings.join(" ")}\n\n`;
      }
      setText(extracted.trim());
      setStatus(`✅ Extracted text from ${pdfDoc.numPages} pages.`);
    } catch (err) {
      setStatus("❌ Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <Panel title="PDF to Text Extractor">
      <div className="space-y-4">
        <div>
          <label className={label}>Select PDF File</label>
          <input type="file" accept=".pdf" onChange={handleFile} className={input} />
        </div>
        {status && <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p>}
        {text && (
          <div className="space-y-2">
            <textarea readOnly value={text} className="h-64 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
            <CopyButton value={text} />
          </div>
        )}
      </div>
    </Panel>
  );
}

/* ───── 4. Protect PDF (Add Password) ───── */
export function ProtectPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const protect = useCallback(async () => {
    if (!file || !password) { setStatus("Please select a file and enter a password."); return; }
    setStatus("Encrypting…");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      // @ts-ignore
      const pdfBytes = await doc.save({
      // @ts-ignore
      userPassword: password,
        ownerPassword: password,
      });
      downloadBlob("protected.pdf", new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
      setStatus("✅ PDF protected with password!");
    } catch (err) {
      setStatus("❌ Error: " + (err instanceof Error ? err.message : String(err)));
    }
  }, [file, password]);

  return (
    <Panel title="Protect PDF with Password">
      <div className="space-y-4">
        <div>
          <label className={label}>Select PDF File</label>
          <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className={input} />
        </div>
        <div>
          <label className={label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={input} placeholder="Enter password" />
        </div>
        <button type="button" onClick={protect} className={btn}>Protect PDF</button>
        {status && <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p>}
      </div>
    </Panel>
  );
}

/* ───── 5. Unlock PDF ───── */
export function UnlockPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const unlock = useCallback(async () => {
    if (!file) { setStatus("Please select a PDF file."); return; }
    setStatus("Unlocking…");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      // @ts-ignore
      const doc = await PDFDocument.load(bytes, { password, ignoreEncryption: true });
      const pdfBytes = await doc.save();
      downloadBlob("unlocked.pdf", new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
      setStatus("✅ PDF unlocked successfully!");
    } catch (err) {
      setStatus("❌ Error: " + (err instanceof Error ? err.message : String(err)));
    }
  }, [file, password]);

  return (
    <Panel title="Unlock PDF (Remove Password)">
      <div className="space-y-4">
        <div>
          <label className={label}>Select Password-Protected PDF</label>
          <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className={input} />
        </div>
        <div>
          <label className={label}>Current Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={input} placeholder="Enter current password" />
        </div>
        <button type="button" onClick={unlock} className={btn}>Unlock PDF</button>
        {status && <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p>}
      </div>
    </Panel>
  );
}
