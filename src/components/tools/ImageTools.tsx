"use client";

import { useCallback, useMemo, useRef, useState } from "react";
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

function useFileInput(accept: string) {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const onSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);
  return { ref, file, preview, onSelect, accept };
}

/* ───── 1. Image to PDF Converter ───── */
export function ImageToPdfConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const convert = async () => {
    if (files.length === 0) return;
    setStatus("Generating PDF...");
    try {
      // Load and fully decode each image before drawing to canvas
      const images: HTMLImageElement[] = await Promise.all(
        files.map(
          (f) =>
            new Promise<HTMLImageElement>((res, rej) => {
              const img = new Image();
              img.onload = () => {
                // Ensure image is fully decoded before resolving
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

      // Convert each image to a data URL via canvas before opening the window
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const dataUrls: string[] = [];
      for (const img of images) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        dataUrls.push(canvas.toDataURL("image/jpeg", 0.9));
        // Revoke the blob URL after drawing
        URL.revokeObjectURL(img.src);
      }

      const printWin = window.open("", "_blank");
      if (!printWin) { setStatus("Please allow pop-ups to download PDF"); return; }
      const html = dataUrls.map((src) =>
        `<img src="${src}" style="max-width:100%;page-break-after:always;" />`
      ).join("");
      printWin.document.write(`<html><head><title>Images PDF</title></head><body style="margin:0;padding:0">${html}</body></html>`);
      printWin.document.close();
      printWin.focus();
      printWin.print();
      setStatus("Print dialog opened — choose 'Save as PDF'");
    } catch {
      setStatus("Error processing images.");
    }
  };

  return (
    <Panel title="Image to PDF Converter">
      <input type="file" accept="image/*" multiple onChange={onFiles} className={input} />
      {files.length > 0 && <p className="mt-2 text-sm text-slate-600">{files.length} image(s) selected</p>}
      <button type="button" onClick={convert} className={`mt-4 ${btn}`} disabled={files.length === 0}>Convert to PDF</button>
      {status && <p className="mt-2 text-sm text-indigo-600">{status}</p>}
    </Panel>
  );
}

/* ───── 2. Compress Image ───── */
export function CompressImage() {
  const { ref, file, preview, onSelect, accept } = useFileInput("image/*");
  const [quality, setQuality] = useState(70);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  const compress = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) setResult({ url: URL.createObjectURL(blob), size: blob.size });
        },
        "image/jpeg",
        quality / 100
      );
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <Panel title="Compress Image">
      <input ref={ref} type="file" accept={accept} onChange={onSelect} className={input} />
      <div className="mt-3"><label className={label}>Quality: {quality}%</label><input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" /></div>
      <button type="button" onClick={compress} className={`mt-4 ${btn}`} disabled={!file}>Compress</button>
      {file && result && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-slate-600">Original: {(file.size / 1024).toFixed(1)} KB → Compressed: {(result.size / 1024).toFixed(1)} KB ({Math.round((1 - result.size / file.size) * 100)}% smaller)</p>
          {preview && <img src={preview} alt="Original" className="h-32 rounded-lg object-contain" />}
          <a href={result.url} download="compressed.jpg" className={btn}>Download Compressed</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 3. Resize Image ───── */
export function ResizeImage() {
  const { ref, file, preview, onSelect, accept } = useFileInput("image/*");
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("600");
  const [lock, setLock] = useState(true);
  const [origDim, setOrigDim] = useState({ w: 0, h: 0 });
  const [resultUrl, setResultUrl] = useState("");

  const loadDim = (f: File) => {
    const img = new Image();
    img.onload = () => { setOrigDim({ w: img.width, h: img.height }); setWidth(String(img.width)); setHeight(String(img.height)); };
    img.src = URL.createObjectURL(f);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e);
    const f = e.target.files?.[0];
    if (f) loadDim(f);
  };

  const onWidthChange = (v: string) => {
    setWidth(v);
    if (lock && origDim.w > 0) setHeight(String(Math.round((parseInt(v) / origDim.w) * origDim.h)));
  };

  const resize = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = parseInt(width) || img.width;
      canvas.height = parseInt(height) || img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      setResultUrl(canvas.toDataURL("image/png"));
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <Panel title="Resize Image">
      <input ref={ref} type="file" accept={accept} onChange={handleFile} className={input} />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Width (px)</label><input type="number" value={width} onChange={(e) => onWidthChange(e.target.value)} className={input} /></div>
        <div><label className={label}>Height (px)</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={input} /></div>
        <div className="flex items-end"><label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> Lock ratio</label></div>
      </div>
      <button type="button" onClick={resize} className={`mt-4 ${btn}`} disabled={!file}>Resize</button>
      {resultUrl && (
        <div className="mt-4 space-y-2">
          <img src={resultUrl} alt="Resized" className="max-h-48 rounded-lg object-contain" />
          <a href={resultUrl} download="resized.png" className={btn}>Download Resized</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 4. JPG to PNG Converter ───── */
export function JpgToPngConverter() {
  const { ref, file, onSelect, accept } = useFileInput("image/jpeg,.jpg");
  const [resultUrl, setResultUrl] = useState("");

  const convert = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      setResultUrl(canvas.toDataURL("image/png"));
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <Panel title="JPG to PNG Converter">
      <input ref={ref} type="file" accept={accept} onChange={onSelect} className={input} />
      <button type="button" onClick={convert} className={`mt-4 ${btn}`} disabled={!file}>Convert to PNG</button>
      {resultUrl && (
        <div className="mt-4 space-y-2">
          <img src={resultUrl} alt="Converted" className="max-h-48 rounded-lg object-contain" />
          <a href={resultUrl} download="converted.png" className={btn}>Download PNG</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 5. PNG to JPG Converter ───── */
export function PngToJpgConverter() {
  const { ref, file, onSelect, accept } = useFileInput("image/png,.png");
  const [quality, setQuality] = useState(85);
  const [resultUrl, setResultUrl] = useState("");

  const convert = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setResultUrl(canvas.toDataURL("image/jpeg", quality / 100));
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <Panel title="PNG to JPG Converter">
      <input ref={ref} type="file" accept={accept} onChange={onSelect} className={input} />
      <div className="mt-3"><label className={label}>Quality: {quality}%</label><input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" /></div>
      <button type="button" onClick={convert} className={`mt-4 ${btn}`} disabled={!file}>Convert to JPG</button>
      {resultUrl && (
        <div className="mt-4 space-y-2">
          <img src={resultUrl} alt="Converted" className="max-h-48 rounded-lg object-contain" />
          <a href={resultUrl} download="converted.jpg" className={btn}>Download JPG</a>
        </div>
      )}
    </Panel>
  );
}

/* ───── 6. QR Code Generator ───── */
export function QrCodeGenerator() {
  const [text, setText] = useState("https://toolnest.vercel.app");
  const [size, setSize] = useState(200);
  const qrUrl = useMemo(() => {
    if (!text.trim()) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  }, [text, size]);

  return (
    <Panel title="QR Code Generator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Text or URL</label><textarea value={text} onChange={(e) => setText(e.target.value)} className={`${input} h-24`} placeholder="https://example.com" /></div>
        <div><label className={label}>Size: {size}px</label><input type="range" min={100} max={500} step={50} value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-full" /></div>
      </div>
      {qrUrl && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <img src={qrUrl} alt="QR Code" width={size} height={size} className="rounded-lg border border-slate-200" />
          <a href={qrUrl} download="qrcode.png" className={btn}>Download QR Code</a>
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

  const generate = () => {
    setError("");
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    // Simple Code128-style barcode rendering (visual representation)
    const barWidth = 2;
    const height = 80;
    canvas.width = value.length * barWidth * 11 + 40;
    canvas.height = height + 30;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x = 20;
    for (const char of value) {
      const code = char.charCodeAt(0);
      const binary = code.toString(2).padStart(8, "0");
      for (const bit of binary) {
        ctx.fillStyle = bit === "1" ? "#000" : "#fff";
        ctx.fillRect(x, 5, barWidth, height);
        x += barWidth;
      }
      // gap
      ctx.fillStyle = "#fff";
      ctx.fillRect(x, 5, barWidth, height);
      x += barWidth * 3;
    }

    ctx.fillStyle = "#000";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(value, canvas.width / 2, height + 22);
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
  const { ref, file, preview, onSelect, accept } = useFileInput("image/*");
  const [dataUri, setDataUri] = useState("");

  const encode = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDataUri(reader.result as string);
    reader.readAsDataURL(file);
  };

  const htmlSnippet = dataUri ? `<img src="${dataUri.slice(0, 60)}..." alt="image" />` : "";

  return (
    <Panel title="Base64 Image Encoder">
      <input ref={ref} type="file" accept={accept} onChange={onSelect} className={input} />
      <button type="button" onClick={encode} className={`mt-4 ${btn}`} disabled={!file}>Encode to Base64</button>
      {dataUri && (
        <div className="mt-4 space-y-3">
          {preview && <img src={preview} alt="Preview" className="h-24 rounded-lg object-contain" />}
          <div>
            <label className={label}>Data URI ({(dataUri.length / 1024).toFixed(1)} KB)</label>
            <textarea value={dataUri} readOnly className={`${input} h-32 font-mono text-xs`} />
            <CopyButton value={dataUri} />
          </div>
          <div>
            <label className={label}>HTML Snippet</label>
            <CopyButton value={`<img src="${dataUri}" alt="image" />`} />
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 9. Image Metadata Viewer ───── */
export function ImageMetadataViewer() {
  const { ref, file, preview, onSelect, accept } = useFileInput("image/*");
  const [metadata, setMetadata] = useState<Record<string, string>>({});

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
      <input ref={ref} type="file" accept={accept} onChange={onSelect} className={input} />
      <button type="button" onClick={extract} className={`mt-4 ${btn}`} disabled={!file}>Extract Metadata</button>
      {Object.keys(metadata).length > 0 && (
        <div className="mt-4">
          {preview && <img src={preview} alt="Preview" className="mb-3 h-32 rounded-lg object-contain" />}
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(metadata).map(([k, v]) => (
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
  const { ref, file, preview, onSelect, accept } = useFileInput("image/*");
  const [favicons, setFavicons] = useState<{ size: number; url: string }[]>([]);

  const generate = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const sizes = [16, 32, 48];
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

  return (
    <Panel title="Favicon Generator">
      <input ref={ref} type="file" accept={accept} onChange={onSelect} className={input} />
      <button type="button" onClick={generate} className={`mt-4 ${btn}`} disabled={!file}>Generate Favicons</button>
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
