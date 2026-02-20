"use client";

import { useEffect, useMemo, useState } from "react";
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

function downloadText(name: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

/* ───── 1. Percentage Calculator ───── */
export function PercentageCalculator() {
  const [mode, setMode] = useState<"of" | "change" | "whatPercent">("of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [decimals, setDecimals] = useState(2);
  const [history, setHistory] = useState<string[]>([]);
  const result = useMemo(() => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    if (isNaN(na) || isNaN(nb)) return "";
    if (mode === "of") return `${((na / 100) * nb).toFixed(decimals)}`;
    if (mode === "change") return `${(((nb - na) / Math.max(na, Number.EPSILON)) * 100).toFixed(decimals)}%`;
    return `${((na / Math.max(nb, Number.EPSILON)) * 100).toFixed(decimals)}%`;
  }, [mode, a, b, decimals]);

  const labels: Record<string, [string, string]> = {
    of: ["Percentage (%)", "Of number"],
    change: ["Old value", "New value"],
    whatPercent: ["Value", "Total"],
  };

  const formula = mode === "of" ? "(A ÷ 100) × B" : mode === "change" ? "((B - A) ÷ A) × 100" : "(A ÷ B) × 100";

  const saveToHistory = () => {
    if (!result) return;
    const line = `${new Date().toLocaleTimeString()} • ${labels[mode][0]}=${a}, ${labels[mode][1]}=${b} => ${result}`;
    setHistory((prev) => [line, ...prev].slice(0, 8));
  };

  return (
    <Panel title="Percentage Calculator">
      <div className="mb-4 flex flex-wrap gap-2">
        {(["of", "change", "whatPercent"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${mode === m ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-indigo-50"}`}>
            {m === "of" ? "% of Number" : m === "change" ? "% Change" : "What %?"}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>{labels[mode][0]}</label><input type="number" value={a} onChange={(e) => setA(e.target.value)} className={input} /></div>
        <div><label className={label}>{labels[mode][1]}</label><input type="number" value={b} onChange={(e) => setB(e.target.value)} className={input} /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Decimals</label><input type="number" min={0} max={6} value={decimals} onChange={(e) => setDecimals(Number(e.target.value) || 2)} className={input} /></div>
        <div className="flex items-end"><button type="button" onClick={() => { const oldA = a; setA(b); setB(oldA); }} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Swap</button></div>
        <div className="flex items-end"><button type="button" onClick={() => { setA(""); setB(""); }} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Clear</button></div>
      </div>
      <p className="mt-3 text-xs text-slate-500">Formula: {formula}</p>
      {result && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-center text-lg font-bold text-emerald-700">Result: {result}</p>}
      {result ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton value={result} />
          <button type="button" onClick={saveToHistory} className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">Save result</button>
        </div>
      ) : null}
      {history.length > 0 ? (
        <div className="mt-3 space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          {history.map((line) => <p key={line}>{line}</p>)}
        </div>
      ) : null}
    </Panel>
  );
}

/* ───── 2. CGPA to Percentage Converter ───── */
export function CgpaToPercentageConverter() {
  const [cgpa, setCgpa] = useState("");
  const [multiplier, setMultiplier] = useState("9.5");
  const [maxCgpa, setMaxCgpa] = useState("10");
  const [reversePct, setReversePct] = useState("");
  const percentage = useMemo(() => {
    const c = parseFloat(cgpa);
    const m = parseFloat(multiplier);
    if (isNaN(c) || isNaN(m)) return "";
    return (c * m).toFixed(2);
  }, [cgpa, multiplier]);

  const cgpaFromPercent = useMemo(() => {
    const p = parseFloat(reversePct);
    const m = parseFloat(multiplier);
    if (isNaN(p) || isNaN(m) || m === 0) return "";
    return (p / m).toFixed(2);
  }, [reversePct, multiplier]);

  const gradeBand = useMemo(() => {
    const c = parseFloat(cgpa || cgpaFromPercent);
    if (isNaN(c)) return "";
    if (c >= 9) return "Outstanding";
    if (c >= 8) return "Excellent";
    if (c >= 7) return "Very Good";
    if (c >= 6) return "Good";
    if (c >= 5) return "Average";
    return "Needs Improvement";
  }, [cgpa, cgpaFromPercent]);

  return (
    <Panel title="CGPA to Percentage Converter">
      <div className="grid gap-4 sm:grid-cols-4">
        <div><label className={label}>CGPA</label><input type="number" step="0.01" value={cgpa} onChange={(e) => setCgpa(e.target.value)} className={input} placeholder="e.g. 8.5" /></div>
        <div>
          <label className={label}>Multiplier</label>
          <select value={multiplier} onChange={(e) => setMultiplier(e.target.value)} className={input}>
            <option value="9.5">× 9.5 (Most Indian Universities)</option>
            <option value="10">× 10 (Some Universities)</option>
            <option value="25">× 25 (4.0 Scale → %)</option>
          </select>
        </div>
        <div><label className={label}>Scale max</label><input value={maxCgpa} onChange={(e) => setMaxCgpa(e.target.value)} className={input} /></div>
        <div className="flex items-end">
          {percentage && <p className="w-full rounded-xl bg-emerald-50 p-2.5 text-center text-lg font-bold text-emerald-700">{percentage}%</p>}
        </div>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Reverse: Percentage to CGPA</label><input type="number" value={reversePct} onChange={(e) => setReversePct(e.target.value)} className={input} placeholder="e.g. 82" /></div>
        <div className="flex items-end"><p className="w-full rounded-xl bg-indigo-50 p-2.5 text-center text-sm font-semibold text-indigo-700">CGPA: {cgpaFromPercent || "--"}</p></div>
        <div className="flex items-end"><p className="w-full rounded-xl bg-slate-50 p-2.5 text-center text-sm font-semibold text-slate-700">Band: {gradeBand || "--"}</p></div>
      </div>
      {cgpa && multiplier && <p className="mt-3 text-sm text-slate-500">Formula: {cgpa} × {multiplier} = {percentage}%</p>}
      <p className="mt-1 text-xs text-slate-500">Equivalent ratio: {(parseFloat(percentage || "0") / Math.max(parseFloat(maxCgpa || "10"), 1) * 10).toFixed(2)} on 10-scale</p>
    </Panel>
  );
}

/* ───── 3. Attendance Calculator ───── */
export function AttendanceCalculator() {
  const [total, setTotal] = useState("");
  const [attended, setAttended] = useState("");
  const [required, setRequired] = useState("75");

  const stats = useMemo(() => {
    const t = parseInt(total);
    const a = parseInt(attended);
    const r = parseFloat(required);
    if (isNaN(t) || isNaN(a) || t === 0) return null;
    const pct = (a / t) * 100;
    const canSkip = Math.floor(a / (r / 100) - t);
    const needAttend = Math.ceil((r * t - 100 * a) / (100 - r));
    return { pct: pct.toFixed(2), canSkip: Math.max(0, canSkip), needAttend: Math.max(0, needAttend), safe: pct >= r };
  }, [total, attended, required]);

  const simulator = useMemo(() => {
    const t = parseInt(total);
    const a = parseInt(attended);
    const r = parseFloat(required);
    if (isNaN(t) || isNaN(a) || isNaN(r) || t <= 0) return [] as { next: number; pct: string }[];
    return Array.from({ length: 6 }, (_, i) => {
      const nextClasses = i + 1;
      const pct = (((a + nextClasses) / (t + nextClasses)) * 100).toFixed(2);
      return { next: nextClasses, pct };
    });
  }, [total, attended, required]);

  return (
    <Panel title="Attendance Calculator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Total Classes</label><input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className={input} /></div>
        <div><label className={label}>Classes Attended</label><input type="number" value={attended} onChange={(e) => setAttended(e.target.value)} className={input} /></div>
        <div><label className={label}>Required %</label><input type="number" value={required} onChange={(e) => setRequired(e.target.value)} className={input} /></div>
      </div>
      {stats && (
        <div className="mt-4 space-y-2">
          <p className={`rounded-xl p-3 text-center text-lg font-bold ${stats.safe ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            Attendance: {stats.pct}% {stats.safe ? "✓ Safe" : "✗ Below threshold"}
          </p>
          {stats.safe ? (
            <p className="text-sm text-slate-600">You can skip up to <strong>{stats.canSkip}</strong> more class{stats.canSkip !== 1 ? "es" : ""} and still stay above {required}%.</p>
          ) : (
            <p className="text-sm text-slate-600">You need to attend <strong>{stats.needAttend}</strong> more consecutive class{stats.needAttend !== 1 ? "es" : ""} to reach {required}%.</p>
          )}
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {simulator.map((item) => (
              <p key={item.next} className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">Attend next {item.next}: <strong>{item.pct}%</strong></p>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 4. Age Calculator ───── */
export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [target, setTarget] = useState("");

  const age = useMemo(() => {
    if (!dob) return null;
    const d = new Date(dob);
    const t = target ? new Date(target) : new Date();
    if (isNaN(d.getTime())) return null;
    let years = t.getFullYear() - d.getFullYear();
    let months = t.getMonth() - d.getMonth();
    let days = t.getDate() - d.getDate();
    if (days < 0) { months--; days += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((t.getTime() - d.getTime()) / 86400000);
    const nextBirthday = new Date(t.getFullYear(), d.getMonth(), d.getDate());
    if (nextBirthday < t) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    const daysToBirthday = Math.ceil((nextBirthday.getTime() - t.getTime()) / 86400000);
    return { years, months, days, totalDays, totalWeeks: Math.floor(totalDays / 7), daysToBirthday };
  }, [dob, target]);

  return (
    <Panel title="Age Calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Date of Birth</label><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={input} /></div>
        <div><label className={label}>As of Date</label><input type="date" value={target} onChange={(e) => setTarget(e.target.value)} className={input} /></div>
      </div>
      {age && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <p className="rounded-xl bg-emerald-50 p-3 text-center text-lg font-bold text-emerald-700">{age.years} years, {age.months} months, {age.days} days</p>
          <div className="flex flex-wrap gap-2 justify-center items-center">
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{age.totalDays.toLocaleString()} days</span>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{age.totalWeeks.toLocaleString()} weeks</span>
            <span className="rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700">Next birthday in {age.daysToBirthday} days</span>
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 5. Date Difference Calculator ───── */
export function DateDifferenceCalculator() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [inclusive, setInclusive] = useState(false);
  const diff = useMemo(() => {
    if (!start || !end) return null;
    const s = new Date(start);
    const e = new Date(end);
    const ms = Math.abs(e.getTime() - s.getTime());
    const days = Math.floor(ms / 86400000) + (inclusive ? 1 : 0);
    const weeks = Math.floor(days / 7);
    const months = Math.round(days / 30.44);
    const years = (days / 365.25).toFixed(1);
    const businessDays = Array.from({ length: days }, (_, i) => {
      const d = new Date(Math.min(s.getTime(), e.getTime()) + i * 86400000);
      return d.getDay();
    }).filter((day) => day !== 0 && day !== 6).length;
    return { days, weeks, months, years, businessDays };
  }, [start, end, inclusive]);

  return (
    <Panel title="Date Difference Calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Start Date</label><input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={input} /></div>
        <div><label className={label}>End Date</label><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={input} /></div>
      </div>
      <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={inclusive} onChange={(e) => setInclusive(e.target.checked)} /> Include both start and end date</label>
      {diff && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <span className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">{diff.days} days</span>
          <span className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">{diff.weeks} weeks</span>
          <span className="rounded-lg bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">{diff.months} months</span>
          <span className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{diff.years} years</span>
          <span className="rounded-lg bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">{diff.businessDays} business days</span>
        </div>
      )}
    </Panel>
  );
}

/* ───── 6. Exam Countdown Timer ───── */
export function ExamCountdownTimer() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [remaining, setRemaining] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [past, setPast] = useState(false);
  const [milestone, setMilestone] = useState(30);

  useEffect(() => {
    if (!date) { setRemaining(null); return; }
    const tick = () => {
      const diff = new Date(date).getTime() - Date.now();
      if (diff <= 0) { setPast(true); setRemaining(null); return; }
      setPast(false);
      setRemaining({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [date]);

  return (
    <Panel title="Exam Countdown Timer">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Exam Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className={input} placeholder="e.g. JEE Main 2026" /></div>
        <div><label className={label}>Exam Date & Time</label><input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className={input} /></div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Milestone alert (days)</label><input type="number" value={milestone} onChange={(e) => setMilestone(Number(e.target.value) || 30)} className={input} /></div>
        <div className="flex items-end"><button type="button" onClick={() => { setName(""); setDate(""); }} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Reset</button></div>
      </div>
      {past && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-center text-lg font-bold text-rose-700">🔔 {name || "Exam"} time has arrived!</p>}
      {remaining && (
        <>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {[["Days", remaining.d], ["Hours", remaining.h], ["Minutes", remaining.m], ["Seconds", remaining.s]].map(([l, v]) => (
            <div key={l as string} className="flex flex-col items-center rounded-xl bg-indigo-50 p-4 min-w-20">
              <span className="text-2xl font-bold text-indigo-700">{v}</span>
              <span className="text-xs font-medium text-indigo-500">{l as string}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-sm text-slate-600">{remaining.d <= milestone ? `Focus window started: ${remaining.d} days left.` : `You still have ${remaining.d} days to prepare strategically.`}</p>
        </>
      )}
    </Panel>
  );
}

/* ───── 7. GPA Calculator ───── */
type Course = { name: string; grade: string; credits: string };
const gradePoints: Record<string, number> = { "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, F: 0 };

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([{ name: "", grade: "A", credits: "3" }]);
  const [targetGpa, setTargetGpa] = useState("3.5");

  const addCourse = () => setCourses([...courses, { name: "", grade: "A", credits: "3" }]);
  const removeCourse = (i: number) => setCourses(courses.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Course, val: string) => {
    const copy = [...courses];
    copy[i] = { ...copy[i], [field]: val };
    setCourses(copy);
  };

  const gpa = useMemo(() => {
    let totalPoints = 0, totalCredits = 0;
    for (const c of courses) {
      const cr = parseFloat(c.credits);
      const gp = gradePoints[c.grade];
      if (!isNaN(cr) && gp !== undefined) { totalPoints += gp * cr; totalCredits += cr; }
    }
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "--";
  }, [courses]);

  const creditsTotal = useMemo(() => courses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0), [courses]);
  const targetMessage = useMemo(() => {
    const tg = parseFloat(targetGpa);
    if (isNaN(tg) || creditsTotal <= 0) return "";
    const current = parseFloat(gpa === "--" ? "0" : gpa);
    if (current >= tg) return "You are currently at or above your target GPA.";
    return `Need improvement from ${current.toFixed(2)} to ${tg.toFixed(2)}. Prioritize high-credit courses.`;
  }, [targetGpa, creditsTotal, gpa]);

  return (
    <Panel title="GPA Calculator">
      <div className="space-y-3">
        {courses.map((c, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2">
            <div className="flex-1 min-w-32"><label className={label}>Course</label><input value={c.name} onChange={(e) => update(i, "name", e.target.value)} className={input} placeholder={`Course ${i + 1}`} /></div>
            <div className="w-24"><label className={label}>Grade</label>
              <select value={c.grade} onChange={(e) => update(i, "grade", e.target.value)} className={input}>
                {Object.keys(gradePoints).map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="w-20"><label className={label}>Credits</label><input type="number" value={c.credits} onChange={(e) => update(i, "credits", e.target.value)} className={input} /></div>
            {courses.length > 1 && <button type="button" onClick={() => removeCourse(i)} className="mb-0.5 rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100">✕</button>}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={addCourse} className={btn}>+ Add Course</button>
        <p className="rounded-xl bg-emerald-50 px-4 py-2 text-lg font-bold text-emerald-700">GPA: {gpa}</p>
        <input value={targetGpa} onChange={(e) => setTargetGpa(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Target GPA" />
      </div>
      <p className="mt-2 text-sm text-slate-600">Total credits: <strong>{creditsTotal}</strong> • {targetMessage}</p>
    </Panel>
  );
}

/* ───── 8. Resume Headline Generator ───── */
export function ResumeHeadlineGenerator() {
  const [role, setRole] = useState("");
  const [exp, setExp] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState<"professional" | "bold" | "minimal">("professional");
  const [headlines, setHeadlines] = useState<string[]>([]);

  const generate = () => {
    const r = role.trim() || "Professional";
    const e = exp.trim();
    const s = skills.split(",").map((s) => s.trim()).filter(Boolean);
    const skillStr = s.length ? s.slice(0, 3).join(", ") : "Multiple Skills";
    const expStr = e ? `${e}+ Years` : "";
    const lines = [
      `${r}${expStr ? ` with ${expStr} of Experience` : ""} | ${skillStr}`,
      `Results-Driven ${r} Specializing in ${skillStr}`,
      `${expStr ? `${expStr} Experienced ` : ""}${r} | ${s[0] || "Technical"} & ${s[1] || "Leadership"} Expert`,
      `Dynamic ${r} Passionate About ${s[0] || "Innovation"} and ${s[1] || "Growth"}`,
      `${r} | ${skillStr}${expStr ? ` | ${expStr} Experience` : ""}`,
    ].map((line) => {
      if (tone === "bold") return `🚀 ${line}`;
      if (tone === "minimal") return line.replace(/\s*\|\s*/g, " • ");
      return line;
    });
    setHeadlines(lines);
  };

  return (
    <Panel title="Resume Headline Generator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Job Role</label><input value={role} onChange={(e) => setRole(e.target.value)} className={input} placeholder="e.g. Software Engineer" /></div>
        <div><label className={label}>Years of Experience</label><input value={exp} onChange={(e) => setExp(e.target.value)} className={input} placeholder="e.g. 3" /></div>
        <div><label className={label}>Key Skills (comma-separated)</label><input value={skills} onChange={(e) => setSkills(e.target.value)} className={input} placeholder="React, Node.js, AWS" /></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(["professional", "bold", "minimal"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTone(t)} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${tone === t ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{t}</button>
        ))}
      </div>
      <button type="button" onClick={generate} className={`mt-4 ${btn}`}>Generate Headlines</button>
      {headlines.length > 0 && (
        <div className="mt-4 space-y-2">
          {headlines.map((h, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
              <p className="flex-1 text-sm text-slate-800">{h}</p>
              <CopyButton value={h} />
            </div>
          ))}
        </div>
      )}
      {headlines.length > 0 ? <button type="button" onClick={() => downloadText("resume-headlines.txt", headlines.join("\n"))} className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700">Download all</button> : null}
    </Panel>
  );
}

/* ───── 9. Study Time Planner ───── */
type Subject = { name: string; difficulty: number };

export function StudyTimePlanner() {
  const [subjects, setSubjects] = useState<Subject[]>([{ name: "Math", difficulty: 4 }, { name: "English", difficulty: 2 }]);
  const [hours, setHours] = useState("6");
  const [days, setDays] = useState("6");
  const [breakMinutes, setBreakMinutes] = useState("25");
  const [schedule, setSchedule] = useState<{ name: string; hrs: string }[]>([]);

  const addSubject = () => setSubjects([...subjects, { name: "", difficulty: 3 }]);
  const removeSubject = (i: number) => setSubjects(subjects.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Subject, val: string | number) => {
    const copy = [...subjects];
    copy[i] = { ...copy[i], [field]: val };
    setSubjects(copy);
  };

  const generate = () => {
    const total = parseFloat(hours);
    const d = parseFloat(days);
    const bm = parseFloat(breakMinutes);
    if (isNaN(total) || total <= 0) return;
    const totalWeight = subjects.reduce((s, sub) => s + sub.difficulty, 0);
    if (totalWeight === 0) return;
    const breakTime = Math.max(0, (bm / 60) * (subjects.length - 1));
    const studyHrs = Math.max(total - breakTime * (subjects.length - 1), total * 0.7);
    setSchedule(subjects.map((sub) => ({
      name: sub.name || "Unnamed",
      hrs: ((sub.difficulty / totalWeight) * studyHrs * Math.max(1, d)).toFixed(1),
    })));
  };

  return (
    <Panel title="Study Time Planner">
      <div className="space-y-3">
        {subjects.map((s, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2">
            <div className="flex-1 min-w-32"><label className={label}>Subject</label><input value={s.name} onChange={(e) => update(i, "name", e.target.value)} className={input} /></div>
            <div className="w-32"><label className={label}>Difficulty (1-5)</label>
              <select value={s.difficulty} onChange={(e) => update(i, "difficulty", parseInt(e.target.value))} className={input}>
                {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{d} — {["Very Easy", "Easy", "Medium", "Hard", "Very Hard"][d - 1]}</option>)}
              </select>
            </div>
            {subjects.length > 1 && <button type="button" onClick={() => removeSubject(i)} className="mb-0.5 rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100">✕</button>}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="w-36"><label className={label}>Daily Hours</label><input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className={input} /></div>
        <div className="w-36"><label className={label}>Study Days/Week</label><input type="number" value={days} onChange={(e) => setDays(e.target.value)} className={input} /></div>
        <div className="w-36"><label className={label}>Break (min)</label><input type="number" value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} className={input} /></div>
        <button type="button" onClick={addSubject} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">+ Subject</button>
        <button type="button" onClick={generate} className={btn}>Generate Plan</button>
      </div>
      {schedule.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200"><th className="py-2 text-left font-semibold text-slate-700">Subject</th><th className="py-2 text-right font-semibold text-slate-700">Hours/Day</th></tr></thead>
            <tbody>{schedule.map((s, i) => (<tr key={i} className="border-b border-slate-100"><td className="py-2 text-slate-800">{s.name}</td><td className="py-2 text-right font-medium text-indigo-700">{s.hrs} hrs/week</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

/* ───── 10. Marks Required Calculator ───── */
export function MarksRequiredCalculator() {
  const [obtained, setObtained] = useState("");
  const [totalCompleted, setTotalCompleted] = useState("");
  const [totalRemaining, setTotalRemaining] = useState("");
  const [target, setTarget] = useState("");
  const [minGoal, setMinGoal] = useState("50");

  const result = useMemo(() => {
    const o = parseFloat(obtained);
    const tc = parseFloat(totalCompleted);
    const tr = parseFloat(totalRemaining);
    const t = parseFloat(target);
    if (isNaN(o) || isNaN(tc) || isNaN(tr) || isNaN(t) || tr <= 0) return null;
    const totalMarks = tc + tr;
    const needed = (t / 100) * totalMarks - o;
    const pctNeeded = (needed / tr) * 100;
    const minTargetNeeded = (parseFloat(minGoal) / 100) * totalMarks - o;
    return { needed: Math.max(0, needed).toFixed(1), pctNeeded: pctNeeded.toFixed(1), achievable: needed <= tr, minTargetNeeded: Math.max(0, minTargetNeeded).toFixed(1) };
  }, [obtained, totalCompleted, totalRemaining, target, minGoal]);

  return (
    <Panel title="Marks Required Calculator">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><label className={label}>Marks Obtained</label><input type="number" value={obtained} onChange={(e) => setObtained(e.target.value)} className={input} placeholder="e.g. 120" /></div>
        <div><label className={label}>Max Marks (Completed)</label><input type="number" value={totalCompleted} onChange={(e) => setTotalCompleted(e.target.value)} className={input} placeholder="e.g. 200" /></div>
        <div><label className={label}>Max Marks (Remaining)</label><input type="number" value={totalRemaining} onChange={(e) => setTotalRemaining(e.target.value)} className={input} placeholder="e.g. 300" /></div>
        <div><label className={label}>Target %</label><input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className={input} placeholder="e.g. 75" /></div>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><label className={label}>Minimum Goal %</label><input type="number" value={minGoal} onChange={(e) => setMinGoal(e.target.value)} className={input} placeholder="e.g. 50" /></div>
      </div>
      {result && (
        <div className="mt-4">
          {result.achievable ? (
            <p className="rounded-xl bg-emerald-50 p-3 text-center text-lg font-bold text-emerald-700">
              You need {result.needed} marks ({result.pctNeeded}%) in remaining exams
            </p>
          ) : (
            <p className="rounded-xl bg-rose-50 p-3 text-center text-lg font-bold text-rose-700">
              Target not achievable — required marks exceed remaining maximum
            </p>
          )}
          <p className="mt-2 text-center text-sm text-slate-600">Marks needed for minimum goal: <strong>{result.minTargetNeeded}</strong></p>
        </div>
      )}
    </Panel>
  );
}
