"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CopyButton from "@/components/CopyButton";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

const label = "block text-sm font-medium text-slate-700 mb-1";
const input = "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none";
const btn = "rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition";

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
        <>
          <div className="mt-4 space-y-2 sm:hidden">
            {schedule.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                <p className="mt-1 text-sm font-medium text-indigo-700">{s.hrs} hrs/week</p>
              </div>
            ))}
          </div>
          <div className="mt-4 hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-200"><th className="py-2 text-left font-semibold text-slate-700">Subject</th><th className="py-2 text-right font-semibold text-slate-700">Hours/Day</th></tr></thead>
              <tbody>{schedule.map((s, i) => (<tr key={i} className="border-b border-slate-100"><td className="py-2 text-slate-800">{s.name}</td><td className="py-2 text-right font-medium text-indigo-700">{s.hrs} hrs/week</td></tr>))}</tbody>
            </table>
          </div>
        </>
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

/* ───── 11. Attendance Shortage Calculator ───── */
export function AttendanceShortageCalculator() {
  const [totalHeld, setTotalHeld] = useState("");
  const [attended, setAttended] = useState("");
  const [remaining, setRemaining] = useState("");
  const [required, setRequired] = useState("75");

  const analysis = useMemo(() => {
    const th = parseInt(totalHeld);
    const at = parseInt(attended);
    const rem = parseInt(remaining);
    const req = parseFloat(required);
    if (isNaN(th) || isNaN(at) || isNaN(req) || th <= 0) return null;

    const currentPct = (at / th) * 100;
    const safe = currentPct >= req;

    // How many classes can you skip and still stay above req%
    // (at) / (th + skip) >= req/100  →  skip <= at*100/req - th
    const canSkip = Math.max(0, Math.floor((at * 100) / req - th));

    // How many consecutive classes needed to reach req%
    // (at + need) / (th + need) >= req/100  →  need >= (req*th - 100*at) / (100 - req)
    const needAttend = safe ? 0 : Math.max(0, Math.ceil((req * th - 100 * at) / (100 - req)));

    // Projections if remaining classes are known
    const projections: { scenario: string; pct: string; ok: boolean }[] = [];
    if (!isNaN(rem) && rem > 0) {
      // All attended
      const allPct = ((at + rem) / (th + rem)) * 100;
      projections.push({ scenario: `Attend all ${rem} remaining`, pct: allPct.toFixed(2), ok: allPct >= req });

      // Miss 1, 2, 3, 5
      for (const miss of [1, 2, 3, 5]) {
        if (miss >= rem) break;
        const p = ((at + rem - miss) / (th + rem)) * 100;
        projections.push({ scenario: `Miss ${miss} of ${rem}`, pct: p.toFixed(2), ok: p >= req });
      }

      // Skip all remaining
      const nonePct = (at / (th + rem)) * 100;
      projections.push({ scenario: `Attend 0 more`, pct: nonePct.toFixed(2), ok: nonePct >= req });
    }

    return { currentPct: currentPct.toFixed(2), safe, canSkip, needAttend, projections };
  }, [totalHeld, attended, remaining, required]);

  return (
    <Panel title="Attendance Shortage Calculator">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><label className={label}>Total Classes Held</label><input type="number" value={totalHeld} onChange={(e) => setTotalHeld(e.target.value)} className={input} placeholder="e.g. 90" /></div>
        <div><label className={label}>Classes Attended</label><input type="number" value={attended} onChange={(e) => setAttended(e.target.value)} className={input} placeholder="e.g. 60" /></div>
        <div><label className={label}>Remaining Classes</label><input type="number" value={remaining} onChange={(e) => setRemaining(e.target.value)} className={input} placeholder="e.g. 20" /></div>
        <div><label className={label}>Required %</label><input type="number" value={required} onChange={(e) => setRequired(e.target.value)} className={input} placeholder="e.g. 75" /></div>
      </div>
      {analysis && (
        <div className="mt-4 space-y-3">
          <p className={`rounded-xl p-3 text-center text-lg font-bold ${analysis.safe ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            Current Attendance: {analysis.currentPct}% {analysis.safe ? "✓ Safe" : "✗ Below threshold"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500">Classes you can skip</p>
              <p className="text-2xl font-bold text-indigo-700">{analysis.canSkip}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500">Classes needed to recover</p>
              <p className="text-2xl font-bold text-indigo-700">{analysis.needAttend}</p>
            </div>
          </div>
          {analysis.projections.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">Future projections</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {analysis.projections.map((p) => (
                  <div key={p.scenario} className={`rounded-lg border p-2 text-xs ${p.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                    <p className="font-semibold">{p.scenario}</p>
                    <p>→ {p.pct}% {p.ok ? "✓" : "✗"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

/* ───── 12. Semester GPA Predictor ───── */
type PredictedCourse = { name: string; grade: string; credits: string };
const gpScale: Record<string, number> = { "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, F: 0 };

export function SemesterGpaPredictor() {
  const [courses, setCourses] = useState<PredictedCourse[]>([
    { name: "Mathematics", grade: "A", credits: "4" },
    { name: "Physics", grade: "B+", credits: "3" },
    { name: "English", grade: "A-", credits: "3" },
  ]);
  const [targetGpa, setTargetGpa] = useState("3.5");

  const addCourse = () => setCourses([...courses, { name: "", grade: "A", credits: "3" }]);
  const removeCourse = (i: number) => setCourses(courses.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof PredictedCourse, val: string) => {
    const copy = [...courses];
    copy[i] = { ...copy[i], [field]: val };
    setCourses(copy);
  };

  const prediction = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    const breakdown: { name: string; gp: number; credits: number; weighted: number }[] = [];

    for (const c of courses) {
      const cr = parseFloat(c.credits);
      const gp = gpScale[c.grade];
      if (!isNaN(cr) && gp !== undefined && cr > 0) {
        totalPoints += gp * cr;
        totalCredits += cr;
        breakdown.push({ name: c.name || "Unnamed", gp, credits: cr, weighted: gp * cr });
      }
    }

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const tg = parseFloat(targetGpa);
    const meetsTarget = !isNaN(tg) && gpa >= tg;
    const gapMessage = !isNaN(tg) && totalCredits > 0
      ? gpa >= tg
        ? `You are ${(gpa - tg).toFixed(2)} points above your target!`
        : `You need ${(tg - gpa).toFixed(2)} more points to reach your target.`
      : "";

    return { gpa: gpa.toFixed(2), totalCredits, totalPoints: totalPoints.toFixed(1), breakdown, meetsTarget, gapMessage };
  }, [courses, targetGpa]);

  return (
    <Panel title="Semester GPA Predictor">
      <div className="space-y-3">
        {courses.map((c, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2">
            <div className="flex-1 min-w-32"><label className={label}>Course</label><input value={c.name} onChange={(e) => update(i, "name", e.target.value)} className={input} placeholder={`Course ${i + 1}`} /></div>
            <div className="w-24"><label className={label}>Expected Grade</label>
              <select value={c.grade} onChange={(e) => update(i, "grade", e.target.value)} className={input}>
                {Object.keys(gpScale).map((g) => <option key={g} value={g}>{g} ({gpScale[g].toFixed(1)})</option>)}
              </select>
            </div>
            <div className="w-20"><label className={label}>Credits</label><input type="number" min={1} value={c.credits} onChange={(e) => update(i, "credits", e.target.value)} className={input} /></div>
            {courses.length > 1 && <button type="button" onClick={() => removeCourse(i)} className="mb-0.5 rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100">✕</button>}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={addCourse} className={btn}>+ Add Course</button>
        <div><label className={label}>Target GPA</label><input type="number" step="0.1" value={targetGpa} onChange={(e) => setTargetGpa(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm w-24" /></div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className={`rounded-xl p-3 text-center ${prediction.meetsTarget ? "bg-emerald-50" : "bg-amber-50"}`}>
          <p className="text-xs text-slate-500">Predicted GPA</p>
          <p className={`text-2xl font-bold ${prediction.meetsTarget ? "text-emerald-700" : "text-amber-700"}`}>{prediction.gpa}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
          <p className="text-xs text-slate-500">Total Credits</p>
          <p className="text-2xl font-bold text-slate-900">{prediction.totalCredits}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
          <p className="text-xs text-slate-500">Total Points</p>
          <p className="text-2xl font-bold text-slate-900">{prediction.totalPoints}</p>
        </div>
      </div>
      {prediction.gapMessage && <p className="mt-2 text-center text-sm text-slate-600">{prediction.gapMessage}</p>}
      {prediction.breakdown.length > 0 && (
        <div className="mt-4 max-h-48 overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200"><th className="py-2 text-left font-semibold text-slate-700">Course</th><th className="py-2 text-center font-semibold text-slate-700">Grade</th><th className="py-2 text-center font-semibold text-slate-700">Credits</th><th className="py-2 text-right font-semibold text-slate-700">Points</th></tr></thead>
            <tbody>{prediction.breakdown.map((b, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2 text-slate-800">{b.name}</td>
                <td className="py-2 text-center text-slate-700">{b.gp.toFixed(1)}</td>
                <td className="py-2 text-center text-slate-700">{b.credits}</td>
                <td className="py-2 text-right font-medium text-indigo-700">{b.weighted.toFixed(1)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

/* ───── 13. Study Timetable Printable Generator ───── */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const defaultSlots = [
  { start: "06:00", end: "08:00" },
  { start: "08:30", end: "10:30" },
  { start: "11:00", end: "13:00" },
  { start: "14:00", end: "16:00" },
  { start: "16:30", end: "18:30" },
  { start: "19:00", end: "21:00" },
];

type TimetableSlot = { start: string; end: string };

export function StudyTimetablePrintableGenerator() {
  const [subjects, setSubjects] = useState("Math, Physics, Chemistry, English, Biology");
  const [slots, setSlots] = useState<TimetableSlot[]>(defaultSlots);
  const [grid, setGrid] = useState<Record<string, Record<number, string>>>({});
  const [activeDays, setActiveDays] = useState<string[]>(DAYS.slice(0, 6));

  const subjectList = useMemo(() => subjects.split(",").map((s) => s.trim()).filter(Boolean), [subjects]);

  const toggleDay = (day: string) => {
    setActiveDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const setCell = (day: string, slotIdx: number, value: string) => {
    setGrid((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slotIdx]: value },
    }));
  };

  const addSlot = () => setSlots([...slots, { start: "20:00", end: "22:00" }]);
  const removeSlot = (i: number) => setSlots(slots.filter((_, idx) => idx !== i));
  const updateSlot = (i: number, field: "start" | "end", val: string) => {
    const copy = [...slots];
    copy[i] = { ...copy[i], [field]: val };
    setSlots(copy);
  };

  const autoFill = () => {
    if (subjectList.length === 0) return;
    const newGrid: Record<string, Record<number, string>> = {};
    let idx = 0;
    for (const day of activeDays) {
      newGrid[day] = {};
      for (let s = 0; s < slots.length; s++) {
        newGrid[day][s] = subjectList[idx % subjectList.length];
        idx++;
      }
    }
    setGrid(newGrid);
  };

  const clearAll = () => setGrid({});

  const formatted = useMemo(() => {
    const header = `${"Time".padEnd(16)}${activeDays.map((d) => d.padEnd(14)).join("")}`;
    const divider = "─".repeat(header.length);
    const rows = slots.map((slot, si) => {
      const time = `${slot.start}-${slot.end}`.padEnd(16);
      const cells = activeDays.map((day) => (grid[day]?.[si] || "—").padEnd(14)).join("");
      return `${time}${cells}`;
    });
    return [header, divider, ...rows].join("\n");
  }, [grid, activeDays, slots]);

  return (
    <Panel title="Study Timetable Printable Generator">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className={label}>Subjects (comma-separated)</label>
          <input value={subjects} onChange={(e) => setSubjects(e.target.value)} className={input} placeholder="Math, Physics, Chemistry" />
          <div className="mt-3">
            <label className={label}>Active days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button key={day} type="button" onClick={() => toggleDay(day)} className={`rounded-full px-3 py-1 text-xs font-semibold transition ${activeDays.includes(day) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <label className={label}>Time slots</label>
            {slots.map((slot, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="time" value={slot.start} onChange={(e) => updateSlot(i, "start", e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 text-sm" />
                <span className="text-slate-400">to</span>
                <input type="time" value={slot.end} onChange={(e) => updateSlot(i, "end", e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 text-sm" />
                {slots.length > 1 && <button type="button" onClick={() => removeSlot(i)} className="rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100">✕</button>}
              </div>
            ))}
            <button type="button" onClick={addSlot} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">+ Add Slot</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={autoFill} className={btn}>Auto-Fill</button>
            <button type="button" onClick={clearAll} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Clear All</button>
          </div>
        </div>
        <div>
          <label className={label}>Timetable grid</label>
          <div className="max-h-96 overflow-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="sticky left-0 bg-slate-50 px-2 py-2 text-left font-semibold text-slate-700">Time</th>
                  {activeDays.map((day) => (
                    <th key={day} className="px-2 py-2 text-center font-semibold text-slate-700">{day.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, si) => (
                  <tr key={si} className="border-t border-slate-100">
                    <td className="sticky left-0 bg-white px-2 py-1.5 font-medium text-slate-600 whitespace-nowrap">{slot.start}-{slot.end}</td>
                    {activeDays.map((day) => (
                      <td key={day} className="px-1 py-1">
                        <select value={grid[day]?.[si] || ""} onChange={(e) => setCell(day, si, e.target.value)} className="w-full rounded border border-slate-200 px-1 py-1 text-xs">
                          <option value="">—</option>
                          {subjectList.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton value={formatted} />
            <button type="button" onClick={() => downloadText("study-timetable.txt", formatted)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Download</button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ── Pomodoro Timer ── */
export function PomodoroTimer() {
  const [workMin, setWorkMin] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"work" | "short" | "long">("work");
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const beep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.frequency.value = 880;
      g.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          beep();
          if (phase === "work") {
            const next = (sessions + 1) % 4 === 0 ? "long" : "short";
            setSessions(s => s + 1);
            setPhase(next);
            return (next === "long" ? longBreak : shortBreak) * 60;
          } else { setPhase("work"); return workMin * 60; }
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, workMin, shortBreak, longBreak, sessions, beep]);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const total = phase === "work" ? workMin * 60 : phase === "short" ? shortBreak * 60 : longBreak * 60;
  const pct = ((total - seconds) / total) * 100;
  const colors = { work: "text-red-600", short: "text-emerald-600", long: "text-blue-600" };
  const bgColors = { work: "bg-red-500", short: "bg-emerald-500", long: "bg-blue-500" };

  const reset = () => { setRunning(false); setPhase("work"); setSeconds(workMin * 60); setSessions(0); };

  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-center focus:border-indigo-400 focus:outline-none";

  return (
    <Panel title="Pomodoro Timer">
      <div className="mx-auto max-w-md text-center">
        <p className={`text-xs font-bold uppercase tracking-widest ${colors[phase]}`}>
          {phase === "work" ? "🔴 Focus Time" : phase === "short" ? "🟢 Short Break" : "🔵 Long Break"}
        </p>
        <p className={`mt-2 text-6xl font-extrabold tracking-tight ${colors[phase]}`}>
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </p>
        <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${bgColors[phase]}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-500">Sessions completed: {sessions}</p>
        <div className="mt-4 flex justify-center gap-3">
          <button type="button" onClick={() => setRunning(!running)} className={`rounded-full px-6 py-2 text-sm font-semibold text-white transition ${running ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            {running ? "Pause" : "Start"}
          </button>
          <button type="button" onClick={reset} className="rounded-full bg-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition">Reset</button>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div><label className={label}>Work (min)</label><input type="number" value={workMin} onChange={e => { const v = parseInt(e.target.value) || 1; setWorkMin(v); if (!running && phase === "work") setSeconds(v * 60); }} className={input} min={1} max={120} /></div>
        <div><label className={label}>Short Break</label><input type="number" value={shortBreak} onChange={e => { const v = parseInt(e.target.value) || 1; setShortBreak(v); if (!running && phase === "short") setSeconds(v * 60); }} className={input} min={1} max={30} /></div>
        <div><label className={label}>Long Break</label><input type="number" value={longBreak} onChange={e => { const v = parseInt(e.target.value) || 1; setLongBreak(v); if (!running && phase === "long") setSeconds(v * 60); }} className={input} min={1} max={60} /></div>
      </div>
    </Panel>
  );
}

/* ── Grade Scale Converter ── */
export function GradeScaleConverter() {
  const [value, setValue] = useState("");
  const [scale, setScale] = useState<"percentage" | "gpa4" | "gpa10" | "letter">("percentage");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) && scale !== "letter") return null;

    let pct = 0;
    if (scale === "percentage") { pct = v; }
    else if (scale === "gpa4") { pct = Math.min(100, Math.max(0, (v / 4) * 100)); }
    else if (scale === "gpa10") { pct = Math.min(100, Math.max(0, v * 10)); }
    else if (scale === "letter") {
      const map: Record<string, number> = { "A+": 97, A: 93, "A-": 90, "B+": 87, B: 83, "B-": 80, "C+": 77, C: 73, "C-": 70, "D+": 67, D: 63, "D-": 60, F: 40 };
      pct = map[value.trim().toUpperCase()] ?? NaN;
      if (isNaN(pct)) return null;
    }
    if (pct < 0 || pct > 100) return null;

    const gpa4 = pct >= 93 ? 4.0 : pct >= 90 ? 3.7 : pct >= 87 ? 3.3 : pct >= 83 ? 3.0 : pct >= 80 ? 2.7 : pct >= 77 ? 2.3 : pct >= 73 ? 2.0 : pct >= 70 ? 1.7 : pct >= 67 ? 1.3 : pct >= 63 ? 1.0 : pct >= 60 ? 0.7 : 0.0;
    const gpa10 = pct / 10;
    const letter = pct >= 93 ? "A" : pct >= 90 ? "A-" : pct >= 87 ? "B+" : pct >= 83 ? "B" : pct >= 80 ? "B-" : pct >= 77 ? "C+" : pct >= 73 ? "C" : pct >= 70 ? "C-" : pct >= 67 ? "D+" : pct >= 63 ? "D" : pct >= 60 ? "D-" : "F";
    const uk = pct >= 70 ? "First Class" : pct >= 60 ? "Upper Second (2:1)" : pct >= 50 ? "Lower Second (2:2)" : pct >= 40 ? "Third Class" : "Fail";
    const ects = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : pct >= 50 ? "E" : "F";

    return { pct: pct.toFixed(1), gpa4: gpa4.toFixed(1), gpa10: gpa10.toFixed(1), letter, uk, ects };
  }, [value, scale]);

  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";

  return (
    <Panel title="Grade Scale Converter">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Source Scale</label>
          <select value={scale} onChange={e => { setScale(e.target.value as typeof scale); setValue(""); }} className={input}>
            <option value="percentage">Percentage (0-100)</option>
            <option value="gpa4">GPA (4.0 scale)</option>
            <option value="gpa10">GPA (10.0 scale)</option>
            <option value="letter">Letter Grade (A-F)</option>
          </select>
        </div>
        <div>
          <label className={label}>Enter Grade</label>
          <input value={value} onChange={e => setValue(e.target.value)} className={input} placeholder={scale === "letter" ? "e.g. B+" : scale === "gpa4" ? "e.g. 3.5" : scale === "gpa10" ? "e.g. 8.5" : "e.g. 85"} />
        </div>
      </div>
      {result && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Percentage", value: `${result.pct}%` },
            { label: "GPA (4.0)", value: result.gpa4 },
            { label: "GPA (10.0)", value: result.gpa10 },
            { label: "Letter Grade", value: result.letter },
            { label: "UK Classification", value: result.uk },
            { label: "ECTS Grade", value: result.ects },
          ].map(r => (
            <div key={r.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500">{r.label}</p>
              <p className="mt-1 text-lg font-bold text-indigo-700">{r.value}</p>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ── Assignment Deadline Tracker ── */
type Deadline = { id: string; name: string; subject: string; due: string; done: boolean };

export function AssignmentDeadlineTracker() {
  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("tn-deadlines") || "[]"); } catch { return []; }
  });
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [due, setDue] = useState("");
  const [, setTick] = useState(0);

  useEffect(() => { const t = setInterval(() => setTick(n => n + 1), 60000); return () => clearInterval(t); }, []);
  useEffect(() => { localStorage.setItem("tn-deadlines", JSON.stringify(deadlines)); }, [deadlines]);

  const add = () => {
    if (!name.trim() || !due) return;
    setDeadlines(prev => [...prev, { id: Date.now().toString(), name: name.trim(), subject: subject.trim(), due, done: false }]);
    setName(""); setSubject(""); setDue("");
  };

  const toggle = (id: string) => setDeadlines(prev => prev.map(d => d.id === id ? { ...d, done: !d.done } : d));
  const remove = (id: string) => setDeadlines(prev => prev.filter(d => d.id !== id));

  const getUrgency = (dueDate: string, done: boolean) => {
    if (done) return { color: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "✓ Done" };
    const diff = (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return { color: "bg-red-50 border-red-200", text: "text-red-700", label: "Overdue" };
    if (diff < 1) return { color: "bg-red-50 border-red-200", text: "text-red-600", label: "Due today" };
    if (diff < 3) return { color: "bg-amber-50 border-amber-200", text: "text-amber-700", label: `${Math.ceil(diff)}d left` };
    return { color: "bg-slate-50 border-slate-200", text: "text-slate-600", label: `${Math.ceil(diff)}d left` };
  };

  const label = "text-sm font-medium text-slate-700 mb-1 block";
  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";
  const sorted = [...deadlines].sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0) || new Date(a.due).getTime() - new Date(b.due).getTime());

  return (
    <div className="space-y-4">
      <Panel title="Add Assignment">
        <div className="grid gap-3 sm:grid-cols-4">
          <div><label className={label}>Assignment</label><input value={name} onChange={e => setName(e.target.value)} className={input} placeholder="Essay, Lab Report..." /></div>
          <div><label className={label}>Subject</label><input value={subject} onChange={e => setSubject(e.target.value)} className={input} placeholder="Math, English..." /></div>
          <div><label className={label}>Due Date</label><input type="datetime-local" value={due} onChange={e => setDue(e.target.value)} className={input} /></div>
          <div className="flex items-end"><button type="button" onClick={add} className="w-full rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition" disabled={!name.trim() || !due}>Add</button></div>
        </div>
      </Panel>
      <Panel title={`Deadlines (${deadlines.filter(d => !d.done).length} active)`}>
        {sorted.length === 0 ? <p className="text-sm text-slate-500">No assignments yet. Add one above.</p> : (
          <div className="space-y-2">
            {sorted.map(d => {
              const u = getUrgency(d.due, d.done);
              return (
                <div key={d.id} className={`flex items-center gap-3 rounded-xl border p-3 ${u.color} ${d.done ? "opacity-60" : ""}`}>
                  <input type="checkbox" checked={d.done} onChange={() => toggle(d.id)} className="h-4 w-4 rounded accent-indigo-600" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${d.done ? "line-through text-slate-400" : "text-slate-900"}`}>{d.name}</p>
                    {d.subject && <p className="text-xs text-slate-500">{d.subject}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${u.text}`}>{u.label}</span>
                  <p className="shrink-0 text-xs text-slate-400">{new Date(d.due).toLocaleDateString()}</p>
                  <button type="button" onClick={() => remove(d.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
