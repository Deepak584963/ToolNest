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

/* ───── 1. Percentage Calculator ───── */
export function PercentageCalculator() {
  const [mode, setMode] = useState<"of" | "change" | "whatPercent">("of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const result = useMemo(() => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    if (isNaN(na) || isNaN(nb)) return "";
    if (mode === "of") return `${(na / 100) * nb}`;
    if (mode === "change") return `${(((nb - na) / na) * 100).toFixed(2)}%`;
    return `${((na / nb) * 100).toFixed(2)}%`;
  }, [mode, a, b]);

  const labels: Record<string, [string, string]> = {
    of: ["Percentage (%)", "Of number"],
    change: ["Old value", "New value"],
    whatPercent: ["Value", "Total"],
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
      {result && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-center text-lg font-bold text-emerald-700">Result: {result}</p>}
    </Panel>
  );
}

/* ───── 2. CGPA to Percentage Converter ───── */
export function CgpaToPercentageConverter() {
  const [cgpa, setCgpa] = useState("");
  const [multiplier, setMultiplier] = useState("9.5");
  const percentage = useMemo(() => {
    const c = parseFloat(cgpa);
    const m = parseFloat(multiplier);
    if (isNaN(c) || isNaN(m)) return "";
    return (c * m).toFixed(2);
  }, [cgpa, multiplier]);

  return (
    <Panel title="CGPA to Percentage Converter">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>CGPA</label><input type="number" step="0.01" value={cgpa} onChange={(e) => setCgpa(e.target.value)} className={input} placeholder="e.g. 8.5" /></div>
        <div>
          <label className={label}>Multiplier</label>
          <select value={multiplier} onChange={(e) => setMultiplier(e.target.value)} className={input}>
            <option value="9.5">× 9.5 (Most Indian Universities)</option>
            <option value="10">× 10 (Some Universities)</option>
            <option value="25">× 25 (4.0 Scale → %)</option>
          </select>
        </div>
        <div className="flex items-end">
          {percentage && <p className="w-full rounded-xl bg-emerald-50 p-2.5 text-center text-lg font-bold text-emerald-700">{percentage}%</p>}
        </div>
      </div>
      {cgpa && multiplier && <p className="mt-3 text-sm text-slate-500">Formula: {cgpa} × {multiplier} = {percentage}%</p>}
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
        </div>
      )}
    </Panel>
  );
}

/* ───── 4. Age Calculator ───── */
export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [target, setTarget] = useState(new Date().toISOString().split("T")[0]);

  const age = useMemo(() => {
    if (!dob) return null;
    const d = new Date(dob);
    const t = new Date(target || Date.now());
    if (isNaN(d.getTime())) return null;
    let years = t.getFullYear() - d.getFullYear();
    let months = t.getMonth() - d.getMonth();
    let days = t.getDate() - d.getDate();
    if (days < 0) { months--; days += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((t.getTime() - d.getTime()) / 86400000);
    return { years, months, days, totalDays, totalWeeks: Math.floor(totalDays / 7) };
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
  const diff = useMemo(() => {
    if (!start || !end) return null;
    const s = new Date(start);
    const e = new Date(end);
    const ms = Math.abs(e.getTime() - s.getTime());
    const days = Math.floor(ms / 86400000);
    const weeks = Math.floor(days / 7);
    const months = Math.round(days / 30.44);
    const years = (days / 365.25).toFixed(1);
    return { days, weeks, months, years };
  }, [start, end]);

  return (
    <Panel title="Date Difference Calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Start Date</label><input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={input} /></div>
        <div><label className={label}>End Date</label><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={input} /></div>
      </div>
      {diff && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <span className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">{diff.days} days</span>
          <span className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">{diff.weeks} weeks</span>
          <span className="rounded-lg bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">{diff.months} months</span>
          <span className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{diff.years} years</span>
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
      {past && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-center text-lg font-bold text-rose-700">🔔 {name || "Exam"} time has arrived!</p>}
      {remaining && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {[["Days", remaining.d], ["Hours", remaining.h], ["Minutes", remaining.m], ["Seconds", remaining.s]].map(([l, v]) => (
            <div key={l as string} className="flex flex-col items-center rounded-xl bg-indigo-50 p-4 min-w-20">
              <span className="text-2xl font-bold text-indigo-700">{v}</span>
              <span className="text-xs font-medium text-indigo-500">{l as string}</span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ───── 7. GPA Calculator ───── */
type Course = { name: string; grade: string; credits: string };
const gradePoints: Record<string, number> = { "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, F: 0 };

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([{ name: "", grade: "A", credits: "3" }]);

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
      </div>
    </Panel>
  );
}

/* ───── 8. Resume Headline Generator ───── */
export function ResumeHeadlineGenerator() {
  const [role, setRole] = useState("");
  const [exp, setExp] = useState("");
  const [skills, setSkills] = useState("");
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
    ];
    setHeadlines(lines);
  };

  return (
    <Panel title="Resume Headline Generator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Job Role</label><input value={role} onChange={(e) => setRole(e.target.value)} className={input} placeholder="e.g. Software Engineer" /></div>
        <div><label className={label}>Years of Experience</label><input value={exp} onChange={(e) => setExp(e.target.value)} className={input} placeholder="e.g. 3" /></div>
        <div><label className={label}>Key Skills (comma-separated)</label><input value={skills} onChange={(e) => setSkills(e.target.value)} className={input} placeholder="React, Node.js, AWS" /></div>
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
    </Panel>
  );
}

/* ───── 9. Study Time Planner ───── */
type Subject = { name: string; difficulty: number };

export function StudyTimePlanner() {
  const [subjects, setSubjects] = useState<Subject[]>([{ name: "Math", difficulty: 4 }, { name: "English", difficulty: 2 }]);
  const [hours, setHours] = useState("6");
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
    if (isNaN(total) || total <= 0) return;
    const totalWeight = subjects.reduce((s, sub) => s + sub.difficulty, 0);
    if (totalWeight === 0) return;
    const breakTime = 0.5;
    const studyHrs = Math.max(total - breakTime * (subjects.length - 1), total * 0.7);
    setSchedule(subjects.map((sub) => ({
      name: sub.name || "Unnamed",
      hrs: ((sub.difficulty / totalWeight) * studyHrs).toFixed(1),
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
        <button type="button" onClick={addSubject} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">+ Subject</button>
        <button type="button" onClick={generate} className={btn}>Generate Plan</button>
      </div>
      {schedule.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200"><th className="py-2 text-left font-semibold text-slate-700">Subject</th><th className="py-2 text-right font-semibold text-slate-700">Hours/Day</th></tr></thead>
            <tbody>{schedule.map((s, i) => (<tr key={i} className="border-b border-slate-100"><td className="py-2 text-slate-800">{s.name}</td><td className="py-2 text-right font-medium text-indigo-700">{s.hrs} hrs</td></tr>))}</tbody>
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

  const result = useMemo(() => {
    const o = parseFloat(obtained);
    const tc = parseFloat(totalCompleted);
    const tr = parseFloat(totalRemaining);
    const t = parseFloat(target);
    if (isNaN(o) || isNaN(tc) || isNaN(tr) || isNaN(t) || tr <= 0) return null;
    const totalMarks = tc + tr;
    const needed = (t / 100) * totalMarks - o;
    const pctNeeded = (needed / tr) * 100;
    return { needed: Math.max(0, needed).toFixed(1), pctNeeded: pctNeeded.toFixed(1), achievable: needed <= tr };
  }, [obtained, totalCompleted, totalRemaining, target]);

  return (
    <Panel title="Marks Required Calculator">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><label className={label}>Marks Obtained</label><input type="number" value={obtained} onChange={(e) => setObtained(e.target.value)} className={input} placeholder="e.g. 120" /></div>
        <div><label className={label}>Max Marks (Completed)</label><input type="number" value={totalCompleted} onChange={(e) => setTotalCompleted(e.target.value)} className={input} placeholder="e.g. 200" /></div>
        <div><label className={label}>Max Marks (Remaining)</label><input type="number" value={totalRemaining} onChange={(e) => setTotalRemaining(e.target.value)} className={input} placeholder="e.g. 300" /></div>
        <div><label className={label}>Target %</label><input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className={input} placeholder="e.g. 75" /></div>
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
        </div>
      )}
    </Panel>
  );
}
