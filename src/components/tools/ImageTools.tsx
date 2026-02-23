"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

function UploadDropzone({
  accept,
  multiple,
  onFiles,
  hint,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  hint: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const pushFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onFiles(Array.from(list));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(event) => pushFiles(event.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          pushFiles(event.dataTransfer.files);
        }}
        className={`w-full rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
          isDragging
            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
            : "border-slate-300 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/60"
        }`}
      >
        <p className="text-sm font-semibold">Drop images here or click to browse</p>
        <p className="mt-1 text-xs">{hint}</p>
      </button>
    </div>
  );
}

function formatKB(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function loadImageFromFile(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.decode) {
        img.decode().then(() => resolve(img)).catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

function ComparePreview({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{beforeLabel}</p>
        <img src={beforeSrc} alt={beforeLabel} className="max-h-48 w-full rounded-lg border border-slate-200 bg-white object-contain" />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{afterLabel}</p>
        <img src={afterSrc} alt={afterLabel} className="max-h-48 w-full rounded-lg border border-slate-200 bg-white object-contain" />
      </div>
    </div>
  );
}

function useFileInput(accept: string) {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const setFromFile = useCallback((f: File) => {
    setFile(f);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  }, []);

  const onSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFromFile(f);
  }, [setFromFile]);

  const clear = useCallback(() => {
    setFile(null);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    if (ref.current) ref.current.value = "";
  }, []);

  return { ref, file, preview, onSelect, accept, setFromFile, clear };
}

/* ───── 1. Image to PDF Converter ───── */
export function ImageToPdfConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(92);
  const [pageFormat, setPageFormat] = useState<"a4" | "letter">("a4");
  const [pageOrientation, setPageOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState(8);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [grayscale, setGrayscale] = useState(false);
  const [autoOrientation, setAutoOrientation] = useState(true);
  const [includePageNumbers, setIncludePageNumbers] = useState(false);
  const [pdfName, setPdfName] = useState("toolnest-images");

  const onFiles = (selected: File[]) => {
    setFiles(selected);
    setStatus("");
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    setFiles((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const copy = [...current];
      const [picked] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, picked);
      return copy;
    });
    setStatus("");
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
    setStatus("");
  };

  const buildImageDataUrls = async () => {
    const images: HTMLImageElement[] = await Promise.all(
      files.map(
        (f) =>
          new Promise<HTMLImageElement>((res, rej) => {
            const img = new Image();
            img.onload = () => {
              if (img.decode) {
                img.decode().then(() => res(img)).catch(() => res(img));
              } else {
                res(img);
              }
            };
            img.onerror = rej;
            img.src = URL.createObjectURL(f);
          })
      )
    );

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const prepared = images.map((img, index) => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      if (grayscale) {
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = frame.data;
        for (let i = 0; i < pixels.length; i += 4) {
          const gray = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
          pixels[i] = gray;
          pixels[i + 1] = gray;
          pixels[i + 2] = gray;
        }
        ctx.putImageData(frame, 0, 0);
      }
      const dataUrl = canvas.toDataURL("image/jpeg", quality / 100);
      URL.revokeObjectURL(img.src);
      return {
        dataUrl,
        width: img.width,
        height: img.height,
        name: files[index]?.name ?? `image-${index + 1}`,
      };
    });

    return prepared;
  };

  const downloadPdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setStatus("Generating downloadable PDF...");

    try {
      const prepared = await buildImageDataUrls();
      const { jsPDF } = await import("jspdf");
      const initialOrientation = autoOrientation
        ? (prepared[0]?.width ?? 1) >= (prepared[0]?.height ?? 1)
          ? "landscape"
          : "portrait"
        : pageOrientation;
      const pdf = new jsPDF({
        orientation: initialOrientation,
        unit: "mm",
        format: pageFormat,
        compress: true,
      });

      prepared.forEach((item, index) => {
        const activeOrientation = autoOrientation
          ? item.width >= item.height
            ? "landscape"
            : "portrait"
          : pageOrientation;
        if (index > 0) pdf.addPage(pageFormat, activeOrientation);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const scale = fitMode === "contain"
          ? Math.min((pageWidth - margin * 2) / item.width, (pageHeight - margin * 2) / item.height)
          : Math.max((pageWidth - margin * 2) / item.width, (pageHeight - margin * 2) / item.height);
        const renderWidth = item.width * scale;
        const renderHeight = item.height * scale;
        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;
        pdf.addImage(item.dataUrl, "JPEG", x, y, renderWidth, renderHeight, `${item.name}-${index}`, "FAST");
        if (includePageNumbers) {
          pdf.setFontSize(10);
          pdf.setTextColor(120);
          pdf.text(`${index + 1}/${prepared.length}`, pageWidth - margin, pageHeight - 3, { align: "right" });
        }
      });

      const sanitizedName = (pdfName || "toolnest-images").trim().replace(/[^a-z0-9-_]+/gi, "-");
      pdf.save(`${sanitizedName || "toolnest-images"}.pdf`);
      setStatus(`Downloaded ${prepared.length} page PDF successfully.`);
    } catch {
      setStatus("Error generating PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openPrintDialog = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setStatus("Preparing print view...");

    const printWin = window.open("", "_blank");
    if (!printWin) {
      setStatus("Please allow pop-ups to download PDF");
      setIsProcessing(false);
      return;
    }
    printWin.document.open();
    printWin.document.write("<html><head><title>Preparing PDF...</title></head><body style='font-family:sans-serif;padding:24px'>Preparing images...</body></html>");
    printWin.document.close();

    try {
      const prepared = await buildImageDataUrls();

      const html = prepared.map((item) =>
        `<img src="${item.dataUrl}" style="max-width:100%;page-break-after:always;" />`
      ).join("");

      printWin.document.open();
      printWin.document.write(`
        <html>
          <head>
            <title>Images PDF</title>
            <style>
              html, body { margin: 0; padding: 0; }
              img { display: block; width: 100%; page-break-after: always; }
              img:last-child { page-break-after: auto; }
            </style>
          </head>
          <body>
            ${html}
            <script>
              (function () {
                const images = Array.from(document.images);
                Promise.all(images.map((image) => {
                  if (image.complete) return Promise.resolve();
                  return new Promise((resolve) => {
                    image.addEventListener('load', () => resolve(), { once: true });
                    image.addEventListener('error', () => resolve(), { once: true });
                  });
                })).then(() => {
                  setTimeout(() => {
                    window.focus();
                    window.print();
                  }, 150);
                });
              })();
            </script>
          </body>
        </html>
      `);
      printWin.document.close();
      printWin.focus();
      setStatus("Print dialog opened — choose 'Save as PDF'");
    } catch {
      printWin.close();
      setStatus("Error processing images.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Panel title="Image to PDF Converter">
      <UploadDropzone accept="image/*" multiple onFiles={onFiles} hint="Supports JPG, PNG, WEBP and more" />
      {files.length > 0 && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          <p>{files.length} image(s) selected</p>
          <p className="truncate">{files.slice(0, 3).map((file) => file.name).join(", ")}{files.length > 3 ? "..." : ""}</p>
          <p className="mt-1">Total size: {formatKB(files.reduce((sum, file) => sum + file.size, 0))}</p>
        </div>
      )}
      {files.length > 0 && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">PDF Page Order</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm">
                <span className="w-6 text-center font-semibold text-slate-500">{index + 1}</span>
                <span className="flex-1 truncate text-slate-700">{file.name}</span>
                <button type="button" onClick={() => moveFile(index, -1)} className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100" disabled={index === 0}>↑</button>
                <button type="button" onClick={() => moveFile(index, 1)} className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100" disabled={index === files.length - 1}>↓</button>
                <button type="button" onClick={() => removeFile(index)} className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className={label}>Quality: {quality}%</label>
          <input type="range" min={70} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className={label}>Page Size</label>
          <select value={pageFormat} onChange={(e) => setPageFormat(e.target.value as "a4" | "letter")} className={input}>
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
          </select>
        </div>
        <div>
          <label className={label}>Orientation</label>
          <select value={pageOrientation} onChange={(e) => setPageOrientation(e.target.value as "portrait" | "landscape")} className={input}>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className={label}>Margin: {margin}mm</label>
          <input type="range" min={0} max={30} value={margin} onChange={(e) => setMargin(parseInt(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className={label}>Fit Mode</label>
          <select value={fitMode} onChange={(e) => setFitMode(e.target.value as "contain" | "cover")} className={input}>
            <option value="contain">Contain (whole image)</option>
            <option value="cover">Cover (fill page)</option>
          </select>
        </div>
        <div>
          <label className={label}>PDF File Name</label>
          <input value={pdfName} onChange={(e) => setPdfName(e.target.value)} className={input} placeholder="toolnest-images" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
        <label className="flex items-center gap-2"><input type="checkbox" checked={autoOrientation} onChange={(e) => setAutoOrientation(e.target.checked)} /> Auto orientation per page</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={includePageNumbers} onChange={(e) => setIncludePageNumbers(e.target.checked)} /> Add page numbers</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={grayscale} onChange={(e) => setGrayscale(e.target.checked)} /> Grayscale output</label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={downloadPdf} className={btn} disabled={files.length === 0 || isProcessing}>Download PDF</button>
        <button type="button" onClick={openPrintDialog} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={files.length === 0 || isProcessing}>Open Print Dialog</button>
        <button type="button" onClick={() => { setFiles([]); setStatus(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={files.length === 0 || isProcessing}>Clear</button>
      </div>
      {status && <p className="mt-2 text-sm text-indigo-600">{status}</p>}
    </Panel>
  );
}

/* ───── 2. Compress Image ───── */
export function CompressImage() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [quality, setQuality] = useState(70);
  const [outputFormat, setOutputFormat] = useState<"jpeg" | "webp" | "png">("jpeg");
  const [maxWidth, setMaxWidth] = useState("0");
  const [maxHeight, setMaxHeight] = useState("0");
  const [targetKb, setTargetKb] = useState("300");
  const [downloadName, setDownloadName] = useState("compressed-image");
  const [result, setResult] = useState<{ url: string; size: number; width: number; height: number; ext: string } | null>(null);
  const [timeMs, setTimeMs] = useState(0);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const compress = async (autoTarget = false) => {
    if (!file) return;
    const start = performance.now();
    const img = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    const widthLimit = parseInt(maxWidth) || img.width;
    const heightLimit = parseInt(maxHeight) || img.height;
    const scale = Math.min(1, widthLimit / img.width, heightLimit / img.height);
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d")!;
    if (outputFormat === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let blob: Blob | null = null;
    const mimeType = outputFormat === "png" ? "image/png" : outputFormat === "webp" ? "image/webp" : "image/jpeg";
    if (autoTarget && outputFormat !== "png") {
      const targetBytes = (parseInt(targetKb) || 300) * 1024;
      let q = 92;
      while (q >= 20) {
        blob = await canvasToBlob(canvas, mimeType, q / 100);
        if (blob && blob.size <= targetBytes) break;
        q -= 6;
      }
    } else {
      blob = await canvasToBlob(canvas, mimeType, outputFormat === "png" ? undefined : quality / 100);
    }

    URL.revokeObjectURL(img.src);
    if (!blob) return;
    setResult({ url: URL.createObjectURL(blob), size: blob.size, width: canvas.width, height: canvas.height, ext: outputFormat === "jpeg" ? "jpg" : outputFormat });
    setTimeMs(Math.round(performance.now() - start));
  };

  return (
    <Panel title="Compress Image">
      <UploadDropzone
        accept="image/*"
        onFiles={(selected) => {
          if (!selected[0]) return;
          setFromFile(selected[0]);
          setResult(null);
        }}
        hint="One image at a time for highest quality compression"
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className={label}>Output Format</label>
          <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as "jpeg" | "webp" | "png")} className={input}>
            <option value="jpeg">JPG</option>
            <option value="webp">WebP</option>
            <option value="png">PNG</option>
          </select>
        </div>
        <div><label className={label}>Max Width (px)</label><input type="number" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} className={input} placeholder="0 = original" /></div>
        <div><label className={label}>Max Height (px)</label><input type="number" value={maxHeight} onChange={(e) => setMaxHeight(e.target.value)} className={input} placeholder="0 = original" /></div>
      </div>
      {outputFormat !== "png" && <div className="mt-3"><label className={label}>Quality: {quality}%</label><input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" /></div>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Target Size (KB) for Auto Mode</label><input type="number" value={targetKb} onChange={(e) => setTargetKb(e.target.value)} className={input} /></div>
        <div><label className={label}>Download File Name</label><input value={downloadName} onChange={(e) => setDownloadName(e.target.value)} className={input} /></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => compress(false)} className={btn} disabled={!file}>Compress</button>
        <button type="button" onClick={() => compress(true)} className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-200 transition" disabled={!file || outputFormat === "png"}>Auto Compress</button>
        <button type="button" onClick={() => { clear(); setResult(null); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {file && result && (
        <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm text-slate-600">Original: {formatKB(file.size)} → Compressed: {formatKB(result.size)} ({Math.round((1 - result.size / file.size) * 100)}% smaller) in {timeMs}ms</p>
          <p className="text-sm text-slate-600">Output: {result.width} × {result.height}px • Format: {result.ext.toUpperCase()}</p>
          {preview && <ComparePreview beforeSrc={preview} afterSrc={result.url} beforeLabel="Original" afterLabel="Compressed" />}
          <a href={result.url} download={`${(downloadName || "compressed-image").trim().replace(/[^a-z0-9-_]+/gi, "-") || "compressed-image"}.${result.ext}`} className={btn}>Download Compressed</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 3. Resize Image ───── */
export function ResizeImage() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("600");
  const [unitMode, setUnitMode] = useState<"px" | "%">("px");
  const [lock, setLock] = useState(true);
  const [fitMode, setFitMode] = useState<"stretch" | "contain" | "cover">("stretch");
  const [outputFormat, setOutputFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(90);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [downloadName, setDownloadName] = useState("resized-image");
  const [origDim, setOrigDim] = useState({ w: 0, h: 0 });
  const [result, setResult] = useState<{ url: string; width: number; height: number; ext: string; size: number } | null>(null);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const loadDim = (f: File) => {
    const img = new Image();
    img.onload = () => { setOrigDim({ w: img.width, h: img.height }); setWidth(String(img.width)); setHeight(String(img.height)); };
    img.src = URL.createObjectURL(f);
  };

  const handleFile = (f: File) => {
    setFromFile(f);
    setResult(null);
    loadDim(f);
  };

  const onWidthChange = (v: string) => {
    setWidth(v);
    if (lock && origDim.w > 0) setHeight(String(Math.round((parseInt(v) / origDim.w) * origDim.h)));
  };

  const applyPreset = (preset: "instagram" | "youtube" | "story" | "square") => {
    if (preset === "instagram") { setWidth("1080"); setHeight("1080"); setUnitMode("px"); }
    if (preset === "youtube") { setWidth("1280"); setHeight("720"); setUnitMode("px"); }
    if (preset === "story") { setWidth("1080"); setHeight("1920"); setUnitMode("px"); }
    if (preset === "square") { setWidth("800"); setHeight("800"); setUnitMode("px"); }
  };

  const swapDimensions = () => {
    setWidth(height);
    setHeight(width);
  };

  const resize = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const rawW = parseInt(width) || (unitMode === "%" ? 100 : img.width);
    const rawH = parseInt(height) || (unitMode === "%" ? 100 : img.height);
    const targetW = unitMode === "%" ? Math.max(1, Math.round((img.width * rawW) / 100)) : Math.max(1, rawW);
    const targetH = unitMode === "%" ? Math.max(1, Math.round((img.height * rawH) / 100)) : Math.max(1, rawH);
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d")!;
    if (outputFormat === "jpeg") {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, targetW, targetH);
    }
    if (fitMode === "stretch") {
      ctx.drawImage(img, 0, 0, targetW, targetH);
    } else {
      const scale = fitMode === "contain" ? Math.min(targetW / img.width, targetH / img.height) : Math.max(targetW / img.width, targetH / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const dx = (targetW - drawW) / 2;
      const dy = (targetH - drawH) / 2;
      ctx.drawImage(img, dx, dy, drawW, drawH);
    }
    const type = outputFormat === "png" ? "image/png" : outputFormat === "webp" ? "image/webp" : "image/jpeg";
    const blob = await canvasToBlob(canvas, type, outputFormat === "png" ? undefined : quality / 100);
    URL.revokeObjectURL(img.src);
    if (!blob) return;
    setResult({ url: URL.createObjectURL(blob), width: targetW, height: targetH, ext: outputFormat === "jpeg" ? "jpg" : outputFormat, size: blob.size });
  };

  return (
    <Panel title="Resize Image">
      <UploadDropzone
        accept="image/*"
        onFiles={(selected) => {
          if (!selected[0]) return;
          handleFile(selected[0]);
        }}
        hint="Drop one image to resize instantly"
      />
      {preview && <img src={preview} alt="Source" className="mt-3 max-h-40 rounded-lg border border-slate-200 bg-white object-contain" />}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => applyPreset("instagram")} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">Instagram 1080×1080</button>
        <button type="button" onClick={() => applyPreset("youtube")} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">YouTube 1280×720</button>
        <button type="button" onClick={() => applyPreset("story")} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">Story 1080×1920</button>
        <button type="button" onClick={() => applyPreset("square")} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">Square 800×800</button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Width ({unitMode})</label><input type="number" value={width} onChange={(e) => onWidthChange(e.target.value)} className={input} /></div>
        <div><label className={label}>Height ({unitMode})</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={input} /></div>
        <div className="flex items-end gap-2">
          <select value={unitMode} onChange={(e) => setUnitMode(e.target.value as "px" | "%")} className={input}><option value="px">Pixels</option><option value="%">Percent</option></select>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Fit Mode</label><select value={fitMode} onChange={(e) => setFitMode(e.target.value as "stretch" | "contain" | "cover")} className={input}><option value="stretch">Stretch</option><option value="contain">Contain</option><option value="cover">Cover</option></select></div>
        <div><label className={label}>Output Format</label><select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as "png" | "jpeg" | "webp")} className={input}><option value="png">PNG</option><option value="jpeg">JPG</option><option value="webp">WebP</option></select></div>
        <div className="flex items-end"><label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> Lock ratio</label></div>
      </div>
      {outputFormat !== "png" && <div className="mt-3"><label className={label}>Quality: {quality}%</label><input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" /></div>}
      {outputFormat === "jpeg" && <div className="mt-3"><label className={label}>Background Color</label><input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>}
      <div className="mt-3"><label className={label}>Download File Name</label><input value={downloadName} onChange={(e) => setDownloadName(e.target.value)} className={input} /></div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={resize} className={btn} disabled={!file}>Resize</button>
        <button type="button" onClick={swapDimensions} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Swap W/H</button>
        <button type="button" onClick={() => { clear(); setResult(null); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {result && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm text-slate-600">Output size: {result.width} × {result.height}px • {result.ext.toUpperCase()} • {formatKB(result.size)}</p>
          {preview && <ComparePreview beforeSrc={preview} afterSrc={result.url} beforeLabel="Original" afterLabel="Resized" />}
          <a href={result.url} download={`${(downloadName || "resized-image").trim().replace(/[^a-z0-9-_]+/gi, "-") || "resized-image"}.${result.ext}`} className={btn}>Download Resized</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 4. JPG to PNG Converter ───── */
export function JpgToPngConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<{ name: string; url: string; size: number }[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [maxWidth, setMaxWidth] = useState("0");
  const [maxHeight, setMaxHeight] = useState("0");
  const [grayscale, setGrayscale] = useState(false);
  const [filenamePrefix, setFilenamePrefix] = useState("converted");

  useEffect(() => {
    return () => {
      results.forEach((result) => URL.revokeObjectURL(result.url));
    };
  }, [results]);

  const convert = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    const next: { name: string; url: string; size: number }[] = [];
    for (const file of files) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      const limitW = parseInt(maxWidth) || img.width;
      const limitH = parseInt(maxHeight) || img.height;
      const scale = Math.min(1, limitW / img.width, limitH / img.height);
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (grayscale) {
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = frame.data;
        for (let i = 0; i < pixels.length; i += 4) {
          const gray = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
          pixels[i] = gray;
          pixels[i + 1] = gray;
          pixels[i + 2] = gray;
        }
        ctx.putImageData(frame, 0, 0);
      }
      const blob = await canvasToBlob(canvas, "image/png");
      URL.revokeObjectURL(img.src);
      if (!blob) continue;
      const fileName = file.name.replace(/\.(jpe?g)$/i, "") || "converted";
      next.push({ name: `${(filenamePrefix || fileName).trim().replace(/[^a-z0-9-_]+/gi, "-")}-${next.length + 1}.png`, url: URL.createObjectURL(blob), size: blob.size });
    }
    setResults((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url));
      return next;
    });
    setIsConverting(false);
  };

  const downloadAll = () => {
    results.forEach((result) => {
      const link = document.createElement("a");
      link.href = result.url;
      link.download = result.name;
      link.click();
    });
  };

  return (
    <Panel title="JPG to PNG Converter">
      <UploadDropzone
        accept="image/jpeg,.jpg"
        multiple
        onFiles={(selected) => {
          setFiles(selected);
          setResults((prev) => {
            prev.forEach((item) => URL.revokeObjectURL(item.url));
            return [];
          });
        }}
        hint="JPG or JPEG files, supports batch conversion"
      />
      {files.length > 0 && <p className="mt-3 text-sm text-slate-600">{files.length} image(s) queued for conversion</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Max Width (px)</label><input type="number" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} className={input} placeholder="0 = original" /></div>
        <div><label className={label}>Max Height (px)</label><input type="number" value={maxHeight} onChange={(e) => setMaxHeight(e.target.value)} className={input} placeholder="0 = original" /></div>
        <div><label className={label}>Filename Prefix</label><input value={filenamePrefix} onChange={(e) => setFilenamePrefix(e.target.value)} className={input} /></div>
      </div>
      <div className="mt-2 text-sm text-slate-700">
        <label className="flex items-center gap-2"><input type="checkbox" checked={grayscale} onChange={(e) => setGrayscale(e.target.checked)} /> Convert to grayscale</label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={convert} className={btn} disabled={files.length === 0 || isConverting}>{isConverting ? "Converting..." : "Convert to PNG"}</button>
        <button type="button" onClick={downloadAll} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={results.length === 0}>Download All</button>
        <button type="button" onClick={() => { setFiles([]); setResults((prev) => { prev.forEach((item) => URL.revokeObjectURL(item.url)); return []; }); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={files.length === 0 && results.length === 0}>Reset</button>
      </div>
      {results.length > 0 && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm text-slate-600">Converted {results.length} file(s) • Total output {formatKB(results.reduce((sum, item) => sum + item.size, 0))}</p>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={result.name + index} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <img src={result.url} alt={result.name} className="h-12 w-12 rounded border border-slate-200 object-contain" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700">{result.name}</p>
                  <p className="text-xs text-slate-500">{formatKB(result.size)}</p>
                </div>
                <a href={result.url} download={result.name} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-200">Download</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 5. PNG to JPG Converter ───── */
export function PngToJpgConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<{ name: string; url: string; size: number }[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(85);
  const [background, setBackground] = useState("#ffffff");
  const [targetKb, setTargetKb] = useState("300");
  const [filenamePrefix, setFilenamePrefix] = useState("converted");

  useEffect(() => {
    return () => {
      results.forEach((result) => URL.revokeObjectURL(result.url));
    };
  }, [results]);

  const convert = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    const next: { name: string; url: string; size: number }[] = [];
    for (const file of files) {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      let blob = await canvasToBlob(canvas, "image/jpeg", quality / 100);
      const targetBytes = (parseInt(targetKb) || 300) * 1024;
      if (blob && blob.size > targetBytes) {
        let q = quality;
        while (q > 20 && blob.size > targetBytes) {
          q -= 5;
          const nextBlob = await canvasToBlob(canvas, "image/jpeg", q / 100);
          if (!nextBlob) break;
          blob = nextBlob;
        }
      }
      URL.revokeObjectURL(img.src);
      if (!blob) continue;
      const fileName = file.name.replace(/\.png$/i, "") || "converted";
      next.push({ name: `${(filenamePrefix || fileName).trim().replace(/[^a-z0-9-_]+/gi, "-")}-${next.length + 1}.jpg`, url: URL.createObjectURL(blob), size: blob.size });
    }
    setResults((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url));
      return next;
    });
    setIsConverting(false);
  };

  const downloadAll = () => {
    results.forEach((result) => {
      const link = document.createElement("a");
      link.href = result.url;
      link.download = result.name;
      link.click();
    });
  };

  return (
    <Panel title="PNG to JPG Converter">
      <UploadDropzone
        accept="image/png,.png"
        multiple
        onFiles={(selected) => {
          setFiles(selected);
          setResults((prev) => {
            prev.forEach((item) => URL.revokeObjectURL(item.url));
            return [];
          });
        }}
        hint="PNG files only, supports batch conversion"
      />
      {files.length > 0 && <p className="mt-3 text-sm text-slate-600">{files.length} image(s) queued for conversion</p>}
      <div className="mt-3"><label className={label}>Quality: {quality}%</label><input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" /></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Background</label><input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>
        <div><label className={label}>Target Size (KB)</label><input type="number" value={targetKb} onChange={(e) => setTargetKb(e.target.value)} className={input} /></div>
        <div><label className={label}>Filename Prefix</label><input value={filenamePrefix} onChange={(e) => setFilenamePrefix(e.target.value)} className={input} /></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={convert} className={btn} disabled={files.length === 0 || isConverting}>{isConverting ? "Converting..." : "Convert to JPG"}</button>
        <button type="button" onClick={downloadAll} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={results.length === 0}>Download All</button>
        <button type="button" onClick={() => { setFiles([]); setResults((prev) => { prev.forEach((item) => URL.revokeObjectURL(item.url)); return []; }); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={files.length === 0 && results.length === 0}>Reset</button>
      </div>
      {results.length > 0 && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm text-slate-600">Converted {results.length} file(s) • Total output {formatKB(results.reduce((sum, item) => sum + item.size, 0))}</p>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={result.name + index} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <img src={result.url} alt={result.name} className="h-12 w-12 rounded border border-slate-200 object-contain" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700">{result.name}</p>
                  <p className="text-xs text-slate-500">{formatKB(result.size)}</p>
                </div>
                <a href={result.url} download={result.name} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-200">Download</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 6. QR Code Generator ───── */
export function QrCodeGenerator() {
  const [text, setText] = useState("https://tool-nest.tech");
  const [size, setSize] = useState(200);
  const [margin, setMargin] = useState(2);
  const [fgColor, setFgColor] = useState("000000");
  const [bgColor, setBgColor] = useState("ffffff");
  const [ecc, setEcc] = useState("M");
  const [format, setFormat] = useState<"png" | "svg">("png");
  const qrUrl = useMemo(() => {
    if (!text.trim()) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=${margin}&color=${fgColor}&bgcolor=${bgColor}&ecc=${ecc}&format=${format}`;
  }, [text, size, margin, fgColor, bgColor, ecc, format]);

  return (
    <Panel title="QR Code Generator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Text or URL</label><textarea value={text} onChange={(e) => setText(e.target.value)} className={`${input} h-24`} placeholder="https://example.com" /></div>
        <div><label className={label}>Size: {size}px</label><input type="range" min={100} max={500} step={50} value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-full" /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-5">
        <div><label className={label}>Margin</label><input type="number" min={0} max={20} value={margin} onChange={(e) => setMargin(parseInt(e.target.value) || 0)} className={input} /></div>
        <div><label className={label}>FG Color</label><input type="color" value={`#${fgColor}`} onChange={(e) => setFgColor(e.target.value.slice(1))} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>
        <div><label className={label}>BG Color</label><input type="color" value={`#${bgColor}`} onChange={(e) => setBgColor(e.target.value.slice(1))} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>
        <div><label className={label}>ECC</label><select value={ecc} onChange={(e) => setEcc(e.target.value)} className={input}><option value="L">L</option><option value="M">M</option><option value="Q">Q</option><option value="H">H</option></select></div>
        <div><label className={label}>Format</label><select value={format} onChange={(e) => setFormat(e.target.value as "png" | "svg")} className={input}><option value="png">PNG</option><option value="svg">SVG</option></select></div>
      </div>
      {qrUrl && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <img src={qrUrl} alt="QR Code" width={size} height={size} className="rounded-lg border border-slate-200" />
          <a href={qrUrl} download={`qrcode.${format}`} className={btn}>Download QR Code</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 7. Barcode Generator ───── */
export function BarcodeGenerator() {
  const [value, setValue] = useState("1234567890");
  const [format, setFormat] = useState("code128");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState("");
  const [barWidth, setBarWidth] = useState(2);
  const [barHeight, setBarHeight] = useState(80);
  const [showValue, setShowValue] = useState(true);
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");

  const generate = () => {
    setError("");
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    // Simple Code128-style barcode rendering (visual representation)
    const height = barHeight;
    canvas.width = value.length * barWidth * 11 + 40;
    canvas.height = height + (showValue ? 30 : 10);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x = 20;
    for (const char of value) {
      const code = char.charCodeAt(0);
      const binary = code.toString(2).padStart(8, "0");
      for (const bit of binary) {
        ctx.fillStyle = bit === "1" ? foreground : background;
        ctx.fillRect(x, 5, barWidth, height);
        x += barWidth;
      }
      // gap
      ctx.fillStyle = background;
      ctx.fillRect(x, 5, barWidth, height);
      x += barWidth * 3;
    }

    if (showValue) {
      ctx.fillStyle = foreground;
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(value, canvas.width / 2, height + 22);
    }
  };

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "barcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <Panel title="Barcode Generator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Value</label><input value={value} onChange={(e) => setValue(e.target.value)} className={input} placeholder="Enter barcode value" /></div>
        <div><label className={label}>Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className={input}>
            <option value="code128">Code 128</option>
            <option value="ean13">EAN-13 (visual)</option>
            <option value="upca">UPC-A (visual)</option>
          </select>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Bar Width: {barWidth}px</label><input type="range" min={1} max={4} value={barWidth} onChange={(e) => setBarWidth(parseInt(e.target.value))} className="w-full" /></div>
        <div><label className={label}>Bar Height: {barHeight}px</label><input type="range" min={40} max={140} value={barHeight} onChange={(e) => setBarHeight(parseInt(e.target.value))} className="w-full" /></div>
        <div className="flex items-end"><label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={showValue} onChange={(e) => setShowValue(e.target.checked)} /> Show value text</label></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Foreground</label><input type="color" value={foreground} onChange={(e) => setForeground(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>
        <div><label className={label}>Background</label><input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>
      </div>
      <button type="button" onClick={generate} className={`mt-4 ${btn}`}>Generate Barcode</button>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      <div className="mt-4 flex flex-col items-center gap-3">
        <canvas ref={canvasRef} className="rounded-lg border border-slate-200" />
        <button type="button" onClick={download} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Download PNG</button>
      </div>
    </Panel>
  );
}

/* ───── 8. Base64 Image Encoder ───── */
export function Base64ImageEncoder() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [dataUri, setDataUri] = useState("");
  const [mode, setMode] = useState<"data-uri" | "raw-base64">("data-uri");

  const encode = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = reader.result as string;
      if (mode === "raw-base64") {
        setDataUri(value.split(",")[1] || "");
      } else {
        setDataUri(value);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Panel title="Base64 Image Encoder">
      <UploadDropzone
        accept="image/*"
        onFiles={(selected) => {
          if (!selected[0]) return;
          setFromFile(selected[0]);
          setDataUri("");
        }}
        hint="Convert any image into embeddable Base64 data"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <select value={mode} onChange={(e) => setMode(e.target.value as "data-uri" | "raw-base64")} className={input}>
          <option value="data-uri">Data URI</option>
          <option value="raw-base64">Raw Base64</option>
        </select>
        <button type="button" onClick={encode} className={btn} disabled={!file}>Encode to Base64</button>
        <button type="button" onClick={() => { clear(); setDataUri(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {dataUri && (
        <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {preview && <img src={preview} alt="Preview" className="h-24 rounded-lg object-contain" />}
          <div>
            <label className={label}>Data URI ({(dataUri.length / 1024).toFixed(1)} KB)</label>
            <textarea value={dataUri} readOnly className={`${input} h-32 font-mono text-xs`} />
            <CopyButton value={dataUri} />
          </div>
          <div>
            <label className={label}>HTML Snippet</label>
            <CopyButton value={mode === "data-uri" ? `<img src="${dataUri}" alt="image" />` : `<img src="data:${file?.type || "image/png"};base64,${dataUri}" alt="image" />`} />
          </div>
          <div>
            <label className={label}>CSS Snippet</label>
            <CopyButton value={mode === "data-uri" ? `background-image: url('${dataUri}');` : `background-image: url('data:${file?.type || "image/png"};base64,${dataUri}');`} />
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 9. Image Metadata Viewer ───── */
export function ImageMetadataViewer() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const extract = () => {
    if (!file) return;
    const info: Record<string, string> = {
      "File Name": file.name,
      "File Size": `${(file.size / 1024).toFixed(1)} KB`,
      "File Type": file.type,
      "Last Modified": new Date(file.lastModified).toLocaleString(),
    };
    // Extract dimensions from preview
    const img = new Image();
    img.onload = () => {
      info["Width"] = `${img.width}px`;
      info["Height"] = `${img.height}px`;
      info["Aspect Ratio"] = `${(img.width / img.height).toFixed(2)}:1`;

      // Read EXIF from ArrayBuffer if available
      const reader = new FileReader();
      reader.onload = () => {
        const arr = new Uint8Array(reader.result as ArrayBuffer);
        // Check for EXIF marker in JPEG
        if (arr[0] === 0xff && arr[1] === 0xd8) {
          info["Format"] = "JPEG";
          // Search for EXIF APP1 marker
          let offset = 2;
          while (offset < arr.length - 1) {
            if (arr[offset] === 0xff && arr[offset + 1] === 0xe1) {
              info["EXIF Data"] = "Present (basic extraction)";
              break;
            }
            offset++;
          }
        } else if (arr[0] === 0x89 && arr[1] === 0x50) {
          info["Format"] = "PNG";
        } else if (arr[0] === 0x47 && arr[1] === 0x49) {
          info["Format"] = "GIF";
        } else if (arr[0] === 0x52 && arr[1] === 0x49) {
          info["Format"] = "WebP";
        }
        setMetadata(info);
      };
      reader.readAsArrayBuffer(file);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <Panel title="Image Metadata Viewer">
      <UploadDropzone
        accept="image/*"
        onFiles={(selected) => {
          if (!selected[0]) return;
          setFromFile(selected[0]);
          setMetadata({});
        }}
        hint="Read dimensions, type, format, and basic EXIF presence"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={extract} className={btn} disabled={!file}>Extract Metadata</button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(JSON.stringify(metadata, null, 2))} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={Object.keys(metadata).length === 0}>Copy JSON</button>
        <button type="button" onClick={() => { clear(); setMetadata({}); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {Object.keys(metadata).length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter metadata keys..." className={`${input} mb-3`} />
          {preview && <img src={preview} alt="Preview" className="mb-3 h-32 rounded-lg object-contain" />}
          <div className="space-y-2 sm:hidden">
            {Object.entries(metadata).filter(([k]) => !search.trim() || k.toLowerCase().includes(search.toLowerCase())).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                <p className="font-semibold text-slate-700">{k}</p>
                <p className="mt-1 wrap-break-word text-slate-600">{v}</p>
              </div>
            ))}
          </div>
          <table className="hidden w-full text-sm sm:table">
            <tbody>
              {Object.entries(metadata).filter(([k]) => !search.trim() || k.toLowerCase().includes(search.toLowerCase())).map(([k, v]) => (
                <tr key={k} className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-700">{k}</td>
                  <td className="py-2 text-slate-600">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

/* ───── 10. Favicon Generator ───── */
export function FaviconGenerator() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [favicons, setFavicons] = useState<{ size: number; url: string }[]>([]);
  const [sizesInput, setSizesInput] = useState("16,32,48,64,128,256");

  const generate = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const sizes = Array.from(new Set(sizesInput.split(",").map((value) => parseInt(value.trim())).filter((value) => value >= 16 && value <= 512))).slice(0, 12);
      const results = sizes.map((size) => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        canvas.getContext("2d")!.drawImage(img, 0, 0, size, size);
        return { size, url: canvas.toDataURL("image/png") };
      });
      setFavicons(results);
    };
    img.src = URL.createObjectURL(file);
  };

  const downloadAll = () => {
    favicons.forEach(({ size, url }) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = `favicon-${size}x${size}.png`;
      link.click();
    });
  };

  return (
    <Panel title="Favicon Generator">
      <UploadDropzone
        accept="image/*"
        onFiles={(selected) => {
          if (!selected[0]) return;
          setFromFile(selected[0]);
          setFavicons([]);
        }}
        hint="Upload a square logo for best favicon results"
      />
      <div className="mt-3"><label className={label}>Sizes (comma separated)</label><input value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} className={input} placeholder="16,32,48,64,128,256" /></div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={generate} className={btn} disabled={!file}>Generate Favicons</button>
        <button type="button" onClick={downloadAll} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={favicons.length === 0}>Download All</button>
        <button type="button" onClick={() => { clear(); setFavicons([]); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {preview && <img src={preview} alt="Source" className="mt-3 h-24 rounded-lg object-contain" />}
      {favicons.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {favicons.map(({ size, url }) => (
            <div key={size} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <img src={url} alt={`${size}x${size}`} width={size} height={size} className="rounded" style={{ imageRendering: "pixelated" }} />
              <p className="text-xs font-medium text-slate-600">{size}×{size}</p>
              <a href={url} download={`favicon-${size}x${size}.png`} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-200">Download</a>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ───── 11. WebP to PNG Converter ───── */
export function WebpToPngConverter() {
  const { file, preview, setFromFile, clear } = useFileInput("image/webp,.webp");
  const [resultUrl, setResultUrl] = useState("");
  const [maxWidth, setMaxWidth] = useState("0");
  const [maxHeight, setMaxHeight] = useState("0");
  const [grayscale, setGrayscale] = useState(false);

  const convert = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    const widthLimit = parseInt(maxWidth) || img.width;
    const heightLimit = parseInt(maxHeight) || img.height;
    const scale = Math.min(1, widthLimit / img.width, heightLimit / img.height);
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    if (grayscale) {
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = frame.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const gray = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
        pixels[i] = gray;
        pixels[i + 1] = gray;
        pixels[i + 2] = gray;
      }
      ctx.putImageData(frame, 0, 0);
    }
    setResultUrl(canvas.toDataURL("image/png"));
    URL.revokeObjectURL(img.src);
  };

  return (
    <Panel title="WebP to PNG Converter">
      <UploadDropzone accept="image/webp,.webp" onFiles={(selected) => { if (selected[0]) { setFromFile(selected[0]); setResultUrl(""); } }} hint="Convert WebP images into lossless PNG" />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Max Width</label><input type="number" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} className={input} placeholder="0 = original" /></div>
        <div><label className={label}>Max Height</label><input type="number" value={maxHeight} onChange={(e) => setMaxHeight(e.target.value)} className={input} placeholder="0 = original" /></div>
        <div className="flex items-end"><label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={grayscale} onChange={(e) => setGrayscale(e.target.checked)} /> Grayscale</label></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={convert} className={btn} disabled={!file}>Convert to PNG</button>
        <button type="button" onClick={() => { clear(); setResultUrl(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {resultUrl && preview && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <ComparePreview beforeSrc={preview} afterSrc={resultUrl} beforeLabel="WebP" afterLabel="PNG" />
          <a href={resultUrl} download="converted.png" className={btn}>Download PNG</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 12. PNG to WebP Converter ───── */
export function PngToWebpConverter() {
  const { file, preview, setFromFile, clear } = useFileInput("image/png,.png");
  const [quality, setQuality] = useState(85);
  const [resultUrl, setResultUrl] = useState("");
  const [lossless, setLossless] = useState(false);
  const [filename, setFilename] = useState("converted-webp");

  const convert = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, "image/webp", lossless ? 1 : quality / 100);
    URL.revokeObjectURL(img.src);
    if (!blob) return;
    setResultUrl(URL.createObjectURL(blob));
  };

  return (
    <Panel title="PNG to WebP Converter">
      <UploadDropzone accept="image/png,.png" onFiles={(selected) => { if (selected[0]) { setFromFile(selected[0]); setResultUrl(""); } }} hint="Convert PNG to modern WebP format" />
      <div className="mt-3"><label className={label}>Quality: {quality}%</label><input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" /></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Download Name</label><input value={filename} onChange={(e) => setFilename(e.target.value)} className={input} /></div>
        <div className="flex items-end"><label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={lossless} onChange={(e) => setLossless(e.target.checked)} /> Lossless mode</label></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={convert} className={btn} disabled={!file}>Convert to WebP</button>
        <button type="button" onClick={() => { clear(); setResultUrl(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {resultUrl && preview && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <ComparePreview beforeSrc={preview} afterSrc={resultUrl} beforeLabel="PNG" afterLabel="WebP" />
          <a href={resultUrl} download={`${(filename || "converted-webp").trim().replace(/[^a-z0-9-_]+/gi, "-") || "converted-webp"}.webp`} className={btn}>Download WebP</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 13. Image Cropper ───── */
export function ImageCropper() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [x, setX] = useState("0");
  const [y, setY] = useState("0");
  const [width, setWidth] = useState("300");
  const [height, setHeight] = useState("300");
  const [resultUrl, setResultUrl] = useState("");
  const [outputFormat, setOutputFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(90);

  const crop = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const cropX = Math.max(0, parseInt(x) || 0);
    const cropY = Math.max(0, parseInt(y) || 0);
    const cropW = Math.max(1, parseInt(width) || img.width);
    const cropH = Math.max(1, parseInt(height) || img.height);
    const canvas = document.createElement("canvas");
    canvas.width = cropW;
    canvas.height = cropH;
    canvas.getContext("2d")!.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    const mime = outputFormat === "png" ? "image/png" : outputFormat === "webp" ? "image/webp" : "image/jpeg";
    setResultUrl(canvas.toDataURL(mime, outputFormat === "png" ? undefined : quality / 100));
    URL.revokeObjectURL(img.src);
  };

  return (
    <Panel title="Image Cropper">
      <UploadDropzone accept="image/*" onFiles={(selected) => { if (selected[0]) { setFromFile(selected[0]); setResultUrl(""); } }} hint="Crop images using exact pixel coordinates" />
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <div><label className={label}>X</label><input type="number" value={x} onChange={(e) => setX(e.target.value)} className={input} /></div>
        <div><label className={label}>Y</label><input type="number" value={y} onChange={(e) => setY(e.target.value)} className={input} /></div>
        <div><label className={label}>Width</label><input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className={input} /></div>
        <div><label className={label}>Height</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={input} /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Output Format</label><select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as "png" | "jpeg" | "webp")} className={input}><option value="png">PNG</option><option value="jpeg">JPG</option><option value="webp">WebP</option></select></div>
        {outputFormat !== "png" ? <div><label className={label}>Quality: {quality}%</label><input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" /></div> : <div />}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={crop} className={btn} disabled={!file}>Crop</button>
        <button type="button" onClick={() => { clear(); setResultUrl(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {resultUrl && preview && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <ComparePreview beforeSrc={preview} afterSrc={resultUrl} beforeLabel="Original" afterLabel="Cropped" />
          <a href={resultUrl} download={`cropped.${outputFormat === "jpeg" ? "jpg" : outputFormat}`} className={btn}>Download Cropped</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 14. Rotate & Flip Tool ───── */
export function ImageRotateFlipTool() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [rotation, setRotation] = useState(90);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [outputFormat, setOutputFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(90);

  const transform = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const rad = (rotation * Math.PI) / 180;
    const swap = rotation % 180 !== 0;
    const canvas = document.createElement("canvas");
    canvas.width = swap ? img.height : img.width;
    canvas.height = swap ? img.width : img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.rotate(rad);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    const mime = outputFormat === "png" ? "image/png" : outputFormat === "webp" ? "image/webp" : "image/jpeg";
    setResultUrl(canvas.toDataURL(mime, outputFormat === "png" ? undefined : quality / 100));
    URL.revokeObjectURL(img.src);
  };

  return (
    <Panel title="Image Rotate & Flip Tool">
      <UploadDropzone accept="image/*" onFiles={(selected) => { if (selected[0]) { setFromFile(selected[0]); setResultUrl(""); } }} hint="Rotate by 90° and flip horizontally/vertically" />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Rotation</label><select value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className={input}><option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option></select></div>
        <div className="flex items-end"><label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={flipX} onChange={(e) => setFlipX(e.target.checked)} /> Flip Horizontal</label></div>
        <div className="flex items-end"><label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={flipY} onChange={(e) => setFlipY(e.target.checked)} /> Flip Vertical</label></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Output Format</label><select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as "png" | "jpeg" | "webp")} className={input}><option value="png">PNG</option><option value="jpeg">JPG</option><option value="webp">WebP</option></select></div>
        {outputFormat !== "png" ? <div><label className={label}>Quality: {quality}%</label><input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" /></div> : <div />}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={transform} className={btn} disabled={!file}>Apply</button>
        <button type="button" onClick={() => { clear(); setResultUrl(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {resultUrl && preview && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <ComparePreview beforeSrc={preview} afterSrc={resultUrl} beforeLabel="Original" afterLabel="Transformed" />
          <a href={resultUrl} download={`transformed.${outputFormat === "jpeg" ? "jpg" : outputFormat}`} className={btn}>Download</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 15. Image Watermark Tool ───── */
export function ImageWatermarkTool() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [text, setText] = useState("tool-nest.tech");
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState("#ffffff");
  const [stroke, setStroke] = useState("#000000");
  const [angle, setAngle] = useState(0);
  const [position, setPosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right" | "center">("bottom-right");
  const [resultUrl, setResultUrl] = useState("");

  const watermark = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(1, fontSize / 12);
    ctx.font = `bold ${fontSize}px sans-serif`;
    const metrics = ctx.measureText(text);
    const textW = metrics.width;
    const margin = 20;
    let px = margin;
    let py = margin + fontSize;
    if (position === "top-right") { px = canvas.width - textW - margin; py = margin + fontSize; }
    if (position === "bottom-left") { px = margin; py = canvas.height - margin; }
    if (position === "bottom-right") { px = canvas.width - textW - margin; py = canvas.height - margin; }
    if (position === "center") { px = (canvas.width - textW) / 2; py = canvas.height / 2; }
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.strokeText(text, 0, 0);
    ctx.fillText(text, 0, 0);
    ctx.restore();
    setResultUrl(canvas.toDataURL("image/png"));
    URL.revokeObjectURL(img.src);
  };

  return (
    <Panel title="Image Watermark Tool">
      <UploadDropzone accept="image/*" onFiles={(selected) => { if (selected[0]) { setFromFile(selected[0]); setResultUrl(""); } }} hint="Add text watermark with opacity and position controls" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Watermark Text</label><input value={text} onChange={(e) => setText(e.target.value)} className={input} /></div>
        <div><label className={label}>Position</label><select value={position} onChange={(e) => setPosition(e.target.value as typeof position)} className={input}><option value="top-left">Top Left</option><option value="top-right">Top Right</option><option value="center">Center</option><option value="bottom-left">Bottom Left</option><option value="bottom-right">Bottom Right</option></select></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Opacity: {Math.round(opacity * 100)}%</label><input type="range" min={10} max={100} value={Math.round(opacity * 100)} onChange={(e) => setOpacity(parseInt(e.target.value) / 100)} className="w-full" /></div>
        <div><label className={label}>Font Size: {fontSize}px</label><input type="range" min={16} max={96} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full" /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Text Color</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>
        <div><label className={label}>Stroke Color</label><input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>
        <div><label className={label}>Angle: {angle}°</label><input type="range" min={-45} max={45} value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full" /></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={watermark} className={btn} disabled={!file || !text.trim()}>Apply Watermark</button>
        <button type="button" onClick={() => { clear(); setResultUrl(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {resultUrl && preview && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <ComparePreview beforeSrc={preview} afterSrc={resultUrl} beforeLabel="Original" afterLabel="Watermarked" />
          <a href={resultUrl} download="watermarked.png" className={btn}>Download</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 16. Image Color Palette Extractor ───── */
export function ImageColorPaletteExtractor() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [colors, setColors] = useState<string[]>([]);
  const [paletteSize, setPaletteSize] = useState(8);
  const [sampleSize, setSampleSize] = useState(120);

  const extract = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const size = sampleSize;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    const buckets = new Map<string, number>();
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.round(data[i] / 32) * 32;
      const g = Math.round(data[i + 1] / 32) * 32;
      const b = Math.round(data[i + 2] / 32) * 32;
      const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
      buckets.set(hex, (buckets.get(hex) || 0) + 1);
    }
    const top = [...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, paletteSize).map(([hex]) => hex);
    setColors(top);
    URL.revokeObjectURL(img.src);
  };

  return (
    <Panel title="Image Color Palette Extractor">
      <UploadDropzone accept="image/*" onFiles={(selected) => { if (selected[0]) { setFromFile(selected[0]); setColors([]); } }} hint="Extract dominant color palette from any image" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Palette Size: {paletteSize}</label><input type="range" min={4} max={16} value={paletteSize} onChange={(e) => setPaletteSize(parseInt(e.target.value))} className="w-full" /></div>
        <div><label className={label}>Sample Resolution: {sampleSize}px</label><input type="range" min={60} max={240} step={20} value={sampleSize} onChange={(e) => setSampleSize(parseInt(e.target.value))} className="w-full" /></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={extract} className={btn} disabled={!file}>Extract Palette</button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(colors.join(", "))} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={colors.length === 0}>Copy Palette</button>
        <button type="button" onClick={() => { clear(); setColors([]); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {preview && colors.length > 0 && (
        <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <img src={preview} alt="Source" className="max-h-40 rounded-lg border border-slate-200 bg-white object-contain" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {colors.map((hex) => (
              <button key={hex} type="button" onClick={() => navigator.clipboard?.writeText(hex)} className="rounded-lg border border-slate-200 bg-white p-2 text-left hover:bg-slate-100">
                <div className="h-8 rounded" style={{ backgroundColor: hex }} />
                <p className="mt-1 text-xs font-semibold text-slate-700">{hex}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 17. Image Collage Maker ───── */
export function ImageCollageMaker() {
  const [files, setFiles] = useState<File[]>([]);
  const [resultUrl, setResultUrl] = useState("");
  const [layout, setLayout] = useState<"2x2" | "1x4" | "4x1">("2x2");
  const [gap, setGap] = useState(8);
  const [background, setBackground] = useState("#f8fafc");

  const build = async () => {
    if (files.length === 0) return;
    const max = layout === "2x2" ? 4 : 4;
    const imgs = await Promise.all(files.slice(0, max).map((f) => loadImageFromFile(f)));
    const cell = 500;
    const canvas = document.createElement("canvas");
    if (layout === "2x2") {
      canvas.width = 2 * cell + gap;
      canvas.height = 2 * cell + gap;
    }
    if (layout === "1x4") {
      canvas.width = 4 * cell + gap * 3;
      canvas.height = cell;
    }
    if (layout === "4x1") {
      canvas.width = cell;
      canvas.height = 4 * cell + gap * 3;
    }
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    imgs.forEach((img, i) => {
      if (layout === "2x2") {
        const row = Math.floor(i / 2);
        const col = i % 2;
        ctx.drawImage(img, col * (cell + gap), row * (cell + gap), cell, cell);
      }
      if (layout === "1x4") {
        ctx.drawImage(img, i * (cell + gap), 0, cell, cell);
      }
      if (layout === "4x1") {
        ctx.drawImage(img, 0, i * (cell + gap), cell, cell);
      }
      URL.revokeObjectURL(img.src);
    });
    setResultUrl(canvas.toDataURL("image/png"));
  };

  return (
    <Panel title="Image Collage Maker">
      <UploadDropzone accept="image/*" multiple onFiles={(selected) => { setFiles(selected.slice(0, 4)); setResultUrl(""); }} hint="Upload up to 4 images to build a 2×2 collage" />
      {files.length > 0 && <p className="mt-3 text-sm text-slate-600">{files.length} image(s) selected</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Layout</label><select value={layout} onChange={(e) => setLayout(e.target.value as "2x2" | "1x4" | "4x1")} className={input}><option value="2x2">2 × 2</option><option value="1x4">1 × 4</option><option value="4x1">4 × 1</option></select></div>
        <div><label className={label}>Gap: {gap}px</label><input type="range" min={0} max={30} value={gap} onChange={(e) => setGap(parseInt(e.target.value))} className="w-full" /></div>
        <div><label className={label}>Background</label><input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-2" /></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={build} className={btn} disabled={files.length === 0}>Create Collage</button>
        <button type="button" onClick={() => { setFiles([]); setResultUrl(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={files.length === 0}>Reset</button>
      </div>
      {resultUrl && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <img src={resultUrl} alt="Collage" className="max-h-72 rounded-lg border border-slate-200 bg-white object-contain" />
          <a href={resultUrl} download="collage.png" className={btn}>Download Collage</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 18. Image Blur Tool ───── */
export function ImageBlurTool() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [blur, setBlur] = useState(6);
  const [resultUrl, setResultUrl] = useState("");
  const [outputFormat, setOutputFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(90);

  const applyBlur = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(img, 0, 0);
    ctx.filter = "none";
    const mime = outputFormat === "png" ? "image/png" : outputFormat === "webp" ? "image/webp" : "image/jpeg";
    setResultUrl(canvas.toDataURL(mime, outputFormat === "png" ? undefined : quality / 100));
    URL.revokeObjectURL(img.src);
  };

  return (
    <Panel title="Image Blur Tool">
      <UploadDropzone accept="image/*" onFiles={(selected) => { if (selected[0]) { setFromFile(selected[0]); setResultUrl(""); } }} hint="Apply blur effect for backgrounds and overlays" />
      <div className="mt-3"><label className={label}>Blur Radius: {blur}px</label><input type="range" min={1} max={20} value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full" /></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Output Format</label><select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as "png" | "jpeg" | "webp")} className={input}><option value="png">PNG</option><option value="jpeg">JPG</option><option value="webp">WebP</option></select></div>
        {outputFormat !== "png" ? <div><label className={label}>Quality: {quality}%</label><input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" /></div> : <div />}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={applyBlur} className={btn} disabled={!file}>Apply Blur</button>
        <button type="button" onClick={() => { clear(); setResultUrl(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {resultUrl && preview && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <ComparePreview beforeSrc={preview} afterSrc={resultUrl} beforeLabel="Original" afterLabel="Blurred" />
          <a href={resultUrl} download={`blurred.${outputFormat === "jpeg" ? "jpg" : outputFormat}`} className={btn}>Download Blurred</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 19. Rounded Corners Tool ───── */
export function RoundedCornersTool() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [radius, setRadius] = useState(40);
  const [resultUrl, setResultUrl] = useState("");
  const [outputFormat, setOutputFormat] = useState<"png" | "webp">("png");

  const makeRounded = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    const r = Math.min(radius, canvas.width / 2, canvas.height / 2);
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(canvas.width - r, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
    ctx.lineTo(canvas.width, canvas.height - r);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
    ctx.lineTo(r, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0);
    const mime = outputFormat === "png" ? "image/png" : "image/webp";
    setResultUrl(canvas.toDataURL(mime));
    URL.revokeObjectURL(img.src);
  };

  return (
    <Panel title="Rounded Corners Image Tool">
      <UploadDropzone accept="image/*" onFiles={(selected) => { if (selected[0]) { setFromFile(selected[0]); setResultUrl(""); } }} hint="Create rounded-corner PNG images" />
      <div className="mt-3"><label className={label}>Corner Radius: {radius}px</label><input type="range" min={4} max={200} value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} className="w-full" /></div>
      <div className="mt-3"><label className={label}>Output Format</label><select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as "png" | "webp")} className={input}><option value="png">PNG</option><option value="webp">WebP</option></select></div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={makeRounded} className={btn} disabled={!file}>Apply Rounded Corners</button>
        <button type="button" onClick={() => { clear(); setResultUrl(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {resultUrl && preview && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <ComparePreview beforeSrc={preview} afterSrc={resultUrl} beforeLabel="Original" afterLabel="Rounded" />
          <a href={resultUrl} download={`rounded.${outputFormat}`} className={btn}>Download</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 20. Image to ASCII Art ───── */
export function ImageToAsciiArt() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [chars, setChars] = useState("@%#*+=-:. ");
  const [width, setWidth] = useState(90);
  const [ascii, setAscii] = useState("");
  const [invert, setInvert] = useState(false);
  const [thresholdMode, setThresholdMode] = useState(false);

  const generate = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const targetW = Math.max(20, width);
    const targetH = Math.max(10, Math.round((img.height / img.width) * targetW * 0.55));
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, targetW, targetH);
    const pixels = ctx.getImageData(0, 0, targetW, targetH).data;
    let out = "";
    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        const i = (y * targetW + x) * 4;
        const gray = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
        const signal = invert ? 255 - gray : gray;
        const normalized = thresholdMode ? (signal > 128 ? 255 : 0) : signal;
        const idx = Math.min(chars.length - 1, Math.floor((normalized / 255) * (chars.length - 1)));
        out += chars[idx] || " ";
      }
      out += "\n";
    }
    setAscii(out);
    URL.revokeObjectURL(img.src);
  };

  return (
    <Panel title="Image to ASCII Art">
      <UploadDropzone accept="image/*" onFiles={(selected) => { if (selected[0]) { setFromFile(selected[0]); setAscii(""); } }} hint="Convert images into text-based ASCII art" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Character Set</label><input value={chars} onChange={(e) => setChars(e.target.value || "@%#*+=-:. ")} className={input} /></div>
        <div><label className={label}>Output Width: {width}</label><input type="range" min={40} max={160} value={width} onChange={(e) => setWidth(parseInt(e.target.value))} className="w-full" /></div>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-700">
        <label className="flex items-center gap-2"><input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} /> Invert brightness</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={thresholdMode} onChange={(e) => setThresholdMode(e.target.checked)} /> High contrast mode</label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={generate} className={btn} disabled={!file}>Generate ASCII</button>
        <button type="button" onClick={() => {
          const blob = new Blob([ascii], { type: "text/plain;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "ascii-art.txt";
          link.click();
          URL.revokeObjectURL(url);
        }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!ascii}>Download TXT</button>
        <button type="button" onClick={() => { clear(); setAscii(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {ascii && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {preview && <img src={preview} alt="Source" className="max-h-36 rounded-lg border border-slate-200 bg-white object-contain" />}
          <textarea value={ascii} readOnly className="h-64 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-[10px] leading-3 text-slate-700" />
          <CopyButton value={ascii} />
        </div>
      )}
    </Panel>
  );
}

/* ───── 21. Image Compressor Under 100KB ───── */
export function ImageCompressorUnder100kb() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [outputFormat, setOutputFormat] = useState<"jpeg" | "webp">("jpeg");
  const [maxWidth, setMaxWidth] = useState("0");
  const [maxHeight, setMaxHeight] = useState("0");
  const [result, setResult] = useState<{ url: string; size: number; width: number; height: number; qualityUsed: number; ext: string } | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    return () => { if (result?.url) URL.revokeObjectURL(result.url); };
  }, [result]);

  const compress = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      const widthLimit = parseInt(maxWidth) || img.width;
      const heightLimit = parseInt(maxHeight) || img.height;
      const scale = Math.min(1, widthLimit / img.width, heightLimit / img.height);
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d")!;
      if (outputFormat === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const targetBytes = 100 * 1024; // 100KB
      const mimeType = outputFormat === "webp" ? "image/webp" : "image/jpeg";
      let q = 95;
      let blob: Blob | null = null;
      let bestBlob: Blob | null = null;
      let bestQ = q;

      // Binary-search-like approach for best quality under 100KB
      while (q >= 5) {
        blob = await canvasToBlob(canvas, mimeType, q / 100);
        if (blob && blob.size <= targetBytes) {
          bestBlob = blob;
          bestQ = q;
          break;
        }
        q -= 5;
      }

      // If still over, try even lower and with dimension reduction
      if (!bestBlob && blob && blob.size > targetBytes) {
        // Try with reduced dimensions
        const dimScale = Math.sqrt(targetBytes / blob.size) * 0.9;
        const smallCanvas = document.createElement("canvas");
        smallCanvas.width = Math.max(50, Math.round(canvas.width * dimScale));
        smallCanvas.height = Math.max(50, Math.round(canvas.height * dimScale));
        const sCtx = smallCanvas.getContext("2d")!;
        if (outputFormat === "jpeg") {
          sCtx.fillStyle = "#ffffff";
          sCtx.fillRect(0, 0, smallCanvas.width, smallCanvas.height);
        }
        sCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
        bestBlob = await canvasToBlob(smallCanvas, mimeType, 60 / 100);
        bestQ = 60;
        canvas.width = smallCanvas.width;
        canvas.height = smallCanvas.height;
      }

      URL.revokeObjectURL(img.src);
      if (!bestBlob) { setProcessing(false); return; }
      setResult({
        url: URL.createObjectURL(bestBlob),
        size: bestBlob.size,
        width: canvas.width,
        height: canvas.height,
        qualityUsed: bestQ,
        ext: outputFormat === "webp" ? "webp" : "jpg",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Panel title="Image Compressor Under 100KB">
      <UploadDropzone
        accept="image/*"
        onFiles={(selected) => {
          if (!selected[0]) return;
          setFromFile(selected[0]);
          setResult(null);
        }}
        hint="Upload an image to compress it under 100KB automatically"
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className={label}>Output Format</label>
          <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as "jpeg" | "webp")} className={input}>
            <option value="jpeg">JPG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
        <div><label className={label}>Max Width (px)</label><input type="number" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} className={input} placeholder="0 = auto" /></div>
        <div><label className={label}>Max Height (px)</label><input type="number" value={maxHeight} onChange={(e) => setMaxHeight(e.target.value)} className={input} placeholder="0 = auto" /></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={compress} className={btn} disabled={!file || processing}>
          {processing ? "Compressing..." : "Compress to <100KB"}
        </button>
        <button type="button" onClick={() => { clear(); setResult(null); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {file && result && (
        <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white border border-slate-200 p-3 text-center">
              <p className="text-xs text-slate-500">Original Size</p>
              <p className="text-lg font-bold text-slate-900">{formatKB(file.size)}</p>
            </div>
            <div className={`rounded-xl border p-3 text-center ${result.size <= 100 * 1024 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
              <p className="text-xs text-slate-500">Compressed Size</p>
              <p className={`text-lg font-bold ${result.size <= 100 * 1024 ? "text-emerald-700" : "text-amber-700"}`}>{formatKB(result.size)}</p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-3 text-center">
              <p className="text-xs text-slate-500">Reduction</p>
              <p className="text-lg font-bold text-indigo-700">{Math.round((1 - result.size / file.size) * 100)}%</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Output: {result.width} × {result.height}px • Quality: {result.qualityUsed}% • Format: {result.ext.toUpperCase()}
            {result.size <= 100 * 1024 ? " ✓ Under 100KB" : " ⚠ Could not reach 100KB"}
          </p>
          {preview && <ComparePreview beforeSrc={preview} afterSrc={result.url} beforeLabel="Original" afterLabel="Compressed" />}
          <a href={result.url} download={`compressed-under-100kb.${result.ext}`} className={btn}>Download</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 22. Passport Photo Maker ───── */
const PASSPORT_FORMATS = [
  { name: "India (51×51mm / 2×2in)", width: 600, height: 600, label: "India" },
  { name: "US Passport (2×2in)", width: 600, height: 600, label: "US" },
  { name: "UK Passport (35×45mm)", width: 413, height: 531, label: "UK" },
  { name: "Schengen Visa (35×45mm)", width: 413, height: 531, label: "Schengen" },
  { name: "China Visa (33×48mm)", width: 390, height: 567, label: "China" },
  { name: "Japan Visa (35×45mm)", width: 413, height: 531, label: "Japan" },
  { name: "Custom", width: 0, height: 0, label: "Custom" },
];

export function PassportPhotoMaker() {
  const { file, preview, setFromFile, clear } = useFileInput("image/*");
  const [formatIdx, setFormatIdx] = useState(0);
  const [customW, setCustomW] = useState("600");
  const [customH, setCustomH] = useState("600");
  const [offsetX, setOffsetX] = useState(50);
  const [offsetY, setOffsetY] = useState(50);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [resultUrl, setResultUrl] = useState("");

  const selectedFormat = PASSPORT_FORMATS[formatIdx];
  const targetW = selectedFormat.width || parseInt(customW) || 600;
  const targetH = selectedFormat.height || parseInt(customH) || 600;

  const generate = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d")!;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate crop area preserving aspect ratio
    const targetRatio = targetW / targetH;
    const imgRatio = img.width / img.height;
    let srcW: number, srcH: number, srcX: number, srcY: number;

    if (imgRatio > targetRatio) {
      // Image is wider — crop sides
      srcH = img.height;
      srcW = img.height * targetRatio;
      srcX = ((img.width - srcW) * offsetX) / 100;
      srcY = ((img.height - srcH) * offsetY) / 100;
    } else {
      // Image is taller — crop top/bottom
      srcW = img.width;
      srcH = img.width / targetRatio;
      srcX = ((img.width - srcW) * offsetX) / 100;
      srcY = ((img.height - srcH) * offsetY) / 100;
    }

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetW, targetH);
    setResultUrl(canvas.toDataURL("image/jpeg", 0.95));
    URL.revokeObjectURL(img.src);
  };

  return (
    <Panel title="Passport Photo Maker">
      <UploadDropzone
        accept="image/*"
        onFiles={(selected) => {
          if (!selected[0]) return;
          setFromFile(selected[0]);
          setResultUrl("");
        }}
        hint="Upload a portrait photo to create passport-size prints"
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Photo Format</label>
          <select value={formatIdx} onChange={(e) => { setFormatIdx(parseInt(e.target.value)); setResultUrl(""); }} className={input}>
            {PASSPORT_FORMATS.map((f, i) => (
              <option key={i} value={i}>{f.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Background Color</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-2" />
        </div>
      </div>
      {selectedFormat.label === "Custom" && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><label className={label}>Width (px)</label><input type="number" value={customW} onChange={(e) => setCustomW(e.target.value)} className={input} /></div>
          <div><label className={label}>Height (px)</label><input type="number" value={customH} onChange={(e) => setCustomH(e.target.value)} className={input} /></div>
        </div>
      )}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Horizontal Position: {offsetX}%</label><input type="range" min={0} max={100} value={offsetX} onChange={(e) => setOffsetX(parseInt(e.target.value))} className="w-full" /></div>
        <div><label className={label}>Vertical Position: {offsetY}%</label><input type="range" min={0} max={100} value={offsetY} onChange={(e) => setOffsetY(parseInt(e.target.value))} className="w-full" /></div>
      </div>
      <p className="mt-2 text-xs text-slate-500">Output: {targetW} × {targetH}px ({selectedFormat.label !== "Custom" ? selectedFormat.name : `${customW}×${customH}px`})</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={generate} className={btn} disabled={!file}>Generate Passport Photo</button>
        <button type="button" onClick={() => { clear(); setResultUrl(""); }} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" disabled={!file}>Reset</button>
      </div>
      {resultUrl && preview && (
        <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <ComparePreview beforeSrc={preview} afterSrc={resultUrl} beforeLabel="Original" afterLabel="Passport Photo" />
          <p className="text-sm text-slate-600">Dimensions: {targetW} × {targetH}px • Format: {selectedFormat.label !== "Custom" ? selectedFormat.name : "Custom"}</p>
          <a href={resultUrl} download={`passport-photo-${targetW}x${targetH}.jpg`} className={btn}>Download Passport Photo</a>
        </div>
      )}
    </Panel>
  );
}

/* ── SVG to PNG Converter ── */
export function SvgToPngConverter() {
  const [svgCode, setSvgCode] = useState("");
  const [width, setWidth] = useState("512");
  const [height, setHeight] = useState("512");
  const [bgColor, setBgColor] = useState("transparent");
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const convert = useCallback(() => {
    if (!svgCode.trim()) return;
    const w = parseInt(width) || 512;
    const h = parseInt(height) || 512;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    if (bgColor !== "transparent") { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, w, h); }
    const blob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, 0, 0, w, h); setResult(canvas.toDataURL("image/png")); URL.revokeObjectURL(url); };
    img.onerror = () => { alert("Invalid SVG"); URL.revokeObjectURL(url); };
    img.src = url;
  }, [svgCode, width, height, bgColor]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSvgCode(reader.result as string);
    reader.readAsText(file);
  };

  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";

  return (
    <div className="space-y-4">
      <Panel title="SVG to PNG Converter">
        <div className="space-y-3">
          <div>
            <label className={label}>Upload SVG or Paste Code</label>
            <input ref={fileRef} type="file" accept=".svg" onChange={handleFile} className={input} />
          </div>
          <textarea value={svgCode} onChange={e => setSvgCode(e.target.value)} className={`${input} h-32 font-mono text-xs`} placeholder="<svg>...</svg>" />
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label className={label}>Width (px)</label><input type="number" value={width} onChange={e => setWidth(e.target.value)} className={input} /></div>
            <div><label className={label}>Height (px)</label><input type="number" value={height} onChange={e => setHeight(e.target.value)} className={input} /></div>
            <div><label className={label}>Background</label><select value={bgColor} onChange={e => setBgColor(e.target.value)} className={input}><option value="transparent">Transparent</option><option value="#ffffff">White</option><option value="#000000">Black</option></select></div>
          </div>
          <button type="button" onClick={convert} disabled={!svgCode.trim()} className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">Convert to PNG</button>
        </div>
      </Panel>
      {result && (
        <Panel title="Result">
          <div className="flex flex-col items-center gap-3">
            <img src={result} alt="Converted PNG" className="max-h-64 rounded-xl border border-slate-200 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAOdEVYdFRpdGxlAGNoZWNrZXJzqa0jcwAAADFJREFUOI1jfPny5X8GKgImahkAAizUMmAUDFsDaB9EWFhYUDjUTkejYNgaQG0XAADM9gkLeyIFdwAAAABJRU5ErkJggg==')]" />
            <a href={result} download="converted.png" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition">Download PNG</a>
          </div>
        </Panel>
      )}
    </div>
  );
}

/* ── Image Noise / Grain Effect ── */
export function ImageNoiseGrainEffect() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(30);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
    setResult(null);
  };

  const apply = useCallback(() => {
    if (!preview) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * intensity * 2;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL("image/png"));
    };
    img.src = preview;
  }, [preview, intensity]);

  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";

  return (
    <div className="space-y-4">
      <Panel title="Image Noise / Grain Effect">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className={input} />
        <div className="mt-3">
          <label className={label}>Noise Intensity: {intensity}</label>
          <input type="range" min={5} max={100} value={intensity} onChange={e => setIntensity(parseInt(e.target.value))} className="w-full accent-indigo-600" />
        </div>
        <button type="button" onClick={apply} disabled={!preview} className="mt-3 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">Apply Grain Effect</button>
      </Panel>
      {(preview || result) && (
        <Panel title="Preview">
          <div className="grid gap-4 sm:grid-cols-2">
            {preview && <div><p className="text-xs text-slate-500 mb-1">Original</p><img src={preview} alt="Original" className="max-h-64 rounded-xl border border-slate-200 w-full object-contain" /></div>}
            {result && <div><p className="text-xs text-slate-500 mb-1">With Grain</p><img src={result} alt="With noise" className="max-h-64 rounded-xl border border-slate-200 w-full object-contain" /><a href={result} download="noisy.png" className="mt-2 inline-block rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition">Download</a></div>}
          </div>
        </Panel>
      )}
    </div>
  );
}

/* ── Screenshot Mockup Generator ── */
export function ScreenshotMockupGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [device, setDevice] = useState<"phone" | "laptop" | "tablet">("phone");
  const [bgColor, setBgColor] = useState("#6366f1");
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
    setResult(null);
  };

  const generate = useCallback(() => {
    if (!preview) return;
    const img = new Image();
    img.onload = () => {
      const configs = {
        phone: { w: 800, h: 1200, sx: 80, sy: 120, sw: 640, sh: 960, r: 40, bw: 8 },
        laptop: { w: 1400, h: 900, sx: 100, sy: 60, sw: 1200, sh: 750, r: 12, bw: 10 },
        tablet: { w: 1000, h: 1300, sx: 60, sy: 80, sw: 880, sh: 1140, r: 30, bw: 8 },
      };
      const c = configs[device];
      const canvas = document.createElement("canvas");
      canvas.width = c.w + 200;
      canvas.height = c.h + 200;
      const ctx = canvas.getContext("2d")!;
      // background gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, bgColor);
      grad.addColorStop(1, bgColor + "88");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // device frame
      const fx = 100, fy = 100;
      ctx.fillStyle = "#1a1a2e";
      ctx.beginPath();
      ctx.roundRect(fx, fy, c.w, c.h, c.r);
      ctx.fill();
      // screen border
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.roundRect(fx + c.bw, fy + c.bw, c.w - c.bw * 2, c.h - c.bw * 2, c.r - 4);
      ctx.fill();
      // screenshot
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(fx + c.sx - 50, fy + c.sy - 40, c.sw, c.sh, 4);
      ctx.clip();
      ctx.drawImage(img, fx + c.sx - 50, fy + c.sy - 40, c.sw, c.sh);
      ctx.restore();
      setResult(canvas.toDataURL("image/png"));
    };
    img.src = preview;
  }, [preview, device, bgColor]);

  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";

  return (
    <div className="space-y-4">
      <Panel title="Screenshot Mockup Generator">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className={input} />
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <label className={label}>Device</label>
            <select value={device} onChange={e => setDevice(e.target.value as typeof device)} className={input}>
              <option value="phone">📱 Phone</option>
              <option value="laptop">💻 Laptop</option>
              <option value="tablet">📋 Tablet</option>
            </select>
          </div>
          <div>
            <label className={label}>Background Color</label>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className={`${input} h-10 p-1`} />
          </div>
          <div className="flex items-end">
            <button type="button" onClick={generate} disabled={!preview} className="w-full rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">Generate Mockup</button>
          </div>
        </div>
      </Panel>
      {result && (
        <Panel title="Mockup Preview">
          <img src={result} alt="Mockup" className="max-h-96 rounded-xl border border-slate-200 mx-auto" />
          <div className="mt-3 text-center">
            <a href={result} download="mockup.png" className="inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition">Download Mockup</a>
          </div>
        </Panel>
      )}
    </div>
  );
}

/* ── Image Background Remover ── */
export function ImageBackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [threshold, setThreshold] = useState(30);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
    setResult(null);
  };

  const remove = useCallback(() => {
    if (!preview) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      // Sample corners for background color
      const samples = [
        [0, 0], [img.width - 1, 0], [0, img.height - 1], [img.width - 1, img.height - 1],
      ];
      let bgR = 0, bgG = 0, bgB = 0;
      for (const [x, y] of samples) {
        const idx = (y * img.width + x) * 4;
        bgR += data[idx]; bgG += data[idx + 1]; bgB += data[idx + 2];
      }
      bgR /= 4; bgG /= 4; bgB /= 4;
      const t = threshold * 3;
      for (let i = 0; i < data.length; i += 4) {
        const dist = Math.abs(data[i] - bgR) + Math.abs(data[i + 1] - bgG) + Math.abs(data[i + 2] - bgB);
        if (dist < t) { data[i + 3] = 0; }
        else if (dist < t * 1.5) { data[i + 3] = Math.round(((dist - t) / (t * 0.5)) * 255); }
      }
      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL("image/png"));
      setProcessing(false);
    };
    img.src = preview;
  }, [preview, threshold]);

  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";

  return (
    <div className="space-y-4">
      <Panel title="Image Background Remover">
        <p className="mb-3 text-sm text-slate-600">Upload an image to remove its background. Works best with solid-color backgrounds.</p>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className={input} />
        <div className="mt-3">
          <label className={label}>Sensitivity: {threshold}</label>
          <input type="range" min={5} max={80} value={threshold} onChange={e => setThreshold(parseInt(e.target.value))} className="w-full accent-indigo-600" />
          <p className="text-xs text-slate-400">Higher = more aggressive removal. Lower = preserve more details.</p>
        </div>
        <button type="button" onClick={remove} disabled={!preview || processing} className="mt-3 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">
          {processing ? "Processing..." : "Remove Background"}
        </button>
      </Panel>
      {(preview || result) && (
        <Panel title="Result">
          <div className="grid gap-4 sm:grid-cols-2">
            {preview && <div><p className="text-xs text-slate-500 mb-1">Original</p><img src={preview} alt="Original" className="max-h-64 rounded-xl border border-slate-200 w-full object-contain" /></div>}
            {result && <div><p className="text-xs text-slate-500 mb-1">Background Removed</p><img src={result} alt="Result" className="max-h-64 rounded-xl border border-slate-200 w-full object-contain bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAOdEVYdFRpdGxlAGNoZWNrZXJzqa0jcwAAADFJREFUOI1jfPny5X8GKgImahkAAizUMmAUDFsDaB9EWFhYUDjUTkejYNgaQG0XAADM9gkLeyIFdwAAAABJRU5ErkJggg==')]" /><a href={result} download="no-bg.png" className="mt-2 inline-block rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition">Download PNG</a></div>}
          </div>
        </Panel>
      )}
    </div>
  );
}
