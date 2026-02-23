"use client";

import { useMemo, useState } from "react";
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
const stat = "flex flex-col items-center rounded-xl p-4 min-w-28";

function downloadText(name: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

/* ───── 1. EMI Calculator ───── */
export function EmiCalculator() {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("240");
  const [downPayment, setDownPayment] = useState("0");
  const [extraMonthly, setExtraMonthly] = useState("0");

  const result = useMemo(() => {
    const p = Math.max(0, parseFloat(principal) - parseFloat(downPayment || "0"));
    const r = parseFloat(rate) / 12 / 100;
    const n = parseInt(tenure);
    if (isNaN(p) || isNaN(r) || isNaN(n) || r === 0 || n === 0) return null;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    const withExtra = Math.max(emi + parseFloat(extraMonthly || "0"), emi);
    let balance = p;
    let months = 0;
    while (balance > 0 && months < n * 2) {
      const interest = balance * r;
      const principalPart = withExtra - interest;
      if (principalPart <= 0) break;
      balance -= principalPart;
      months += 1;
    }
    const savedMonths = Math.max(0, n - months);
    return { emi: emi.toFixed(0), totalPayment: totalPayment.toFixed(0), totalInterest: totalInterest.toFixed(0), savedMonths };
  }, [principal, downPayment, rate, tenure, extraMonthly]);

  const fmt = (v: string) => Number(v).toLocaleString("en-IN");

  return (
    <Panel title="EMI Calculator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Loan Amount (₹)</label><input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={input} /></div>
        <div><label className={label}>Annual Interest Rate (%)</label><input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={input} /></div>
        <div><label className={label}>Tenure (months)</label><input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className={input} /></div>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Down Payment (₹)</label><input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className={input} /></div>
        <div><label className={label}>Extra EMI / month (₹)</label><input type="number" value={extraMonthly} onChange={(e) => setExtraMonthly(e.target.value)} className={input} /></div>
      </div>
      {result && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <div className={`${stat} bg-indigo-50`}><p className="text-xl font-bold text-indigo-700">₹{fmt(result.emi)}</p><p className="text-xs text-indigo-500">Monthly EMI</p></div>
          <div className={`${stat} bg-emerald-50`}><p className="text-xl font-bold text-emerald-700">₹{fmt(result.totalPayment)}</p><p className="text-xs text-emerald-500">Total Payment</p></div>
          <div className={`${stat} bg-rose-50`}><p className="text-xl font-bold text-rose-700">₹{fmt(result.totalInterest)}</p><p className="text-xs text-rose-500">Total Interest</p></div>
          <div className={`${stat} bg-amber-50`}><p className="text-xl font-bold text-amber-700">{result.savedMonths}</p><p className="text-xs text-amber-500">Months saved</p></div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 2. Loan Interest Calculator ───── */
export function LoanInterestCalculator() {
  const [principal, setPrincipal] = useState("500000");
  const [rate, setRate] = useState("9");
  const [tenure, setTenure] = useState("60");
  const [showSchedule, setShowSchedule] = useState(false);
  const [summaryOnly, setSummaryOnly] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseInt(tenure);
    if (isNaN(p) || isNaN(r) || isNaN(n) || r === 0 || n === 0) return null;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const schedule: { month: number; emi: number; interest: number; principal: number; balance: number }[] = [];
    let balance = p;
    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const prinPart = emi - interest;
      balance -= prinPart;
      schedule.push({ month: m, emi: Math.round(emi), interest: Math.round(interest), principal: Math.round(prinPart), balance: Math.max(0, Math.round(balance)) });
    }
    const totalInterest = schedule.reduce((s, row) => s + row.interest, 0);
    return { emi: Math.round(emi), totalInterest, totalPayment: Math.round(emi * n), schedule };
  }, [principal, rate, tenure]);

  const fmt = (v: number) => v.toLocaleString("en-IN");
  const displayedSchedule = result ? (summaryOnly ? result.schedule.filter((row) => row.month <= 12 || row.month > result.schedule.length - 12) : result.schedule) : [];

  return (
    <Panel title="Loan Interest Calculator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Loan Amount (₹)</label><input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={input} /></div>
        <div><label className={label}>Annual Rate (%)</label><input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={input} /></div>
        <div><label className={label}>Tenure (months)</label><input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className={input} /></div>
      </div>
      {result && (
        <>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className={`${stat} bg-indigo-50`}><p className="text-lg font-bold text-indigo-700">₹{fmt(result.emi)}</p><p className="text-xs text-indigo-500">EMI</p></div>
            <div className={`${stat} bg-rose-50`}><p className="text-lg font-bold text-rose-700">₹{fmt(result.totalInterest)}</p><p className="text-xs text-rose-500">Total Interest</p></div>
            <div className={`${stat} bg-emerald-50`}><p className="text-lg font-bold text-emerald-700">₹{fmt(result.totalPayment)}</p><p className="text-xs text-emerald-500">Total Payment</p></div>
          </div>
          <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={summaryOnly} onChange={(e) => setSummaryOnly(e.target.checked)} /> Summary only (first and last 12 months)</label>
          <button type="button" onClick={() => setShowSchedule(!showSchedule)} className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800">{showSchedule ? "Hide" : "Show"} Amortization Schedule</button>
          {showSchedule && (
            <>
              <div className="mt-3 space-y-2 sm:hidden">
                {displayedSchedule.map((r) => (
                  <div key={r.month} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                    <p className="font-semibold text-slate-800">Month {r.month}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <p>EMI: <strong>₹{fmt(r.emi)}</strong></p>
                      <p>Interest: <strong>₹{fmt(r.interest)}</strong></p>
                      <p>Principal: <strong>₹{fmt(r.principal)}</strong></p>
                      <p>Balance: <strong>₹{fmt(r.balance)}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 hidden max-h-64 overflow-auto rounded-xl border border-slate-200 sm:block">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-50"><tr><th className="px-2 py-1.5 text-left">Month</th><th className="px-2 py-1.5 text-right">EMI</th><th className="px-2 py-1.5 text-right">Interest</th><th className="px-2 py-1.5 text-right">Principal</th><th className="px-2 py-1.5 text-right">Balance</th></tr></thead>
                  <tbody>{displayedSchedule.map((r) => (<tr key={r.month} className="border-t border-slate-100"><td className="px-2 py-1">{r.month}</td><td className="px-2 py-1 text-right">₹{fmt(r.emi)}</td><td className="px-2 py-1 text-right">₹{fmt(r.interest)}</td><td className="px-2 py-1 text-right">₹{fmt(r.principal)}</td><td className="px-2 py-1 text-right">₹{fmt(r.balance)}</td></tr>))}</tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </Panel>
  );
}

/* ───── 3. GST Calculator ───── */
export function GstCalculator() {
  const [amount, setAmount] = useState("10000");
  const [gstRate, setGstRate] = useState("18");
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [interState, setInterState] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(amount);
    const r = parseFloat(gstRate);
    if (isNaN(a) || isNaN(r)) return null;
    if (mode === "exclusive") {
      const gst = a * (r / 100);
      return { net: a, gst, total: a + gst, cgst: interState ? 0 : gst / 2, sgst: interState ? 0 : gst / 2, igst: interState ? gst : 0 };
    }
    const net = a / (1 + r / 100);
    const gst = a - net;
    return { net, gst, total: a, cgst: interState ? 0 : gst / 2, sgst: interState ? 0 : gst / 2, igst: interState ? gst : 0 };
  }, [amount, gstRate, mode, interState]);

  const fmt = (v: number) => `₹${v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Panel title="GST Calculator (India)">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Amount (₹)</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={input} /></div>
        <div><label className={label}>GST Rate</label>
          <select value={gstRate} onChange={(e) => setGstRate(e.target.value)} className={input}>
            {["5", "12", "18", "28"].map((r) => <option key={r} value={r}>{r}%</option>)}
          </select>
        </div>
        <div><label className={label}>Calculation Type</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as "exclusive" | "inclusive")} className={input}>
            <option value="exclusive">GST Exclusive (add GST)</option>
            <option value="inclusive">GST Inclusive (extract GST)</option>
          </select>
        </div>
      </div>
      <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={interState} onChange={(e) => setInterState(e.target.checked)} /> Inter-state (IGST)</label>
      {result && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-100"><td className="py-2 font-medium text-slate-700">Net Amount</td><td className="py-2 text-right font-semibold text-slate-800">{fmt(result.net)}</td></tr>
              {interState ? <tr className="border-b border-slate-100"><td className="py-2 font-medium text-slate-700">IGST ({parseFloat(gstRate)}%)</td><td className="py-2 text-right text-slate-800">{fmt(result.igst)}</td></tr> : <><tr className="border-b border-slate-100"><td className="py-2 font-medium text-slate-700">CGST ({parseFloat(gstRate) / 2}%)</td><td className="py-2 text-right text-slate-800">{fmt(result.cgst)}</td></tr><tr className="border-b border-slate-100"><td className="py-2 font-medium text-slate-700">SGST ({parseFloat(gstRate) / 2}%)</td><td className="py-2 text-right text-slate-800">{fmt(result.sgst)}</td></tr></>}
              <tr className="border-b border-slate-100"><td className="py-2 font-medium text-slate-700">Total GST</td><td className="py-2 text-right font-semibold text-indigo-700">{fmt(result.gst)}</td></tr>
              <tr><td className="py-2 font-medium text-slate-700">Total Amount</td><td className="py-2 text-right font-bold text-emerald-700">{fmt(result.total)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

/* ───── 4. Currency Converter ───── */
const currencies: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, JPY: 151.2, CAD: 1.37, AUD: 1.54, CHF: 0.89, CNY: 7.24, SGD: 1.35, AED: 3.67, BRL: 5.0, KRW: 1340, MXN: 17.2, ZAR: 18.8,
};

export function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [decimals, setDecimals] = useState(2);

  const result = useMemo(() => {
    const a = parseFloat(amount);
    if (isNaN(a)) return null;
    const inUsd = a / currencies[from];
    const converted = inUsd * currencies[to];
    const rate = currencies[to] / currencies[from];
    return { converted: converted.toFixed(decimals), rate: rate.toFixed(4) };
  }, [amount, from, to, decimals]);

  return (
    <Panel title="Currency Converter">
      <div className="grid gap-4 sm:grid-cols-4">
        <div><label className={label}>Amount</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={input} /></div>
        <div><label className={label}>From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={input}>
            {Object.keys(currencies).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div><label className={label}>To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className={input}>
            {Object.keys(currencies).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          {result && <p className="w-full rounded-xl bg-emerald-50 p-2.5 text-center text-lg font-bold text-emerald-700">{result.converted} {to}</p>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => { const prev = from; setFrom(to); setTo(prev); }} className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Swap</button>
        <input type="number" min={0} max={6} value={decimals} onChange={(e) => setDecimals(Number(e.target.value) || 2)} className="w-24 rounded-xl border border-slate-200 px-3 py-1.5 text-xs" placeholder="Decimals" />
      </div>
      {result && <p className="mt-2 text-xs text-slate-500">Rate: 1 {from} = {result.rate} {to} (approximate reference rate)</p>}
    </Panel>
  );
}

/* ───── 5. SIP Calculator ───── */
export function SipCalculator() {
  const [monthly, setMonthly] = useState("10000");
  const [returnRate, setReturnRate] = useState("12");
  const [years, setYears] = useState("15");
  const [stepUp, setStepUp] = useState("0");

  const result = useMemo(() => {
    const m = parseFloat(monthly);
    const r = parseFloat(returnRate) / 12 / 100;
    const n = parseInt(years) * 12;
    if (isNaN(m) || isNaN(r) || isNaN(n) || r === 0) return null;
    const annualStep = parseFloat(stepUp) / 100;
    let corpus = 0;
    let invested = 0;
    let currentMonthly = m;
    for (let month = 1; month <= n; month++) {
      if (month > 1 && month % 12 === 1) currentMonthly *= 1 + (isNaN(annualStep) ? 0 : annualStep);
      corpus = (corpus + currentMonthly) * (1 + r);
      invested += currentMonthly;
    }
    return { maturity: Math.round(corpus), totalInvested: Math.round(invested), wealth: Math.round(corpus - invested) };
  }, [monthly, returnRate, years, stepUp]);

  const fmt = (v: number) => `₹${v.toLocaleString("en-IN")}`;

  return (
    <Panel title="SIP Calculator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Monthly Investment (₹)</label><input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} className={input} /></div>
        <div><label className={label}>Expected Return (% p.a.)</label><input type="number" step="0.5" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} className={input} /></div>
        <div><label className={label}>Duration (years)</label><input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={input} /></div>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div><label className={label}>Annual Step-up (%)</label><input type="number" step="0.5" value={stepUp} onChange={(e) => setStepUp(e.target.value)} className={input} /></div>
      </div>
      {result && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <div className={`${stat} bg-indigo-50`}><p className="text-lg font-bold text-indigo-700">{fmt(result.maturity)}</p><p className="text-xs text-indigo-500">Maturity Value</p></div>
          <div className={`${stat} bg-slate-100`}><p className="text-lg font-bold text-slate-700">{fmt(result.totalInvested)}</p><p className="text-xs text-slate-500">Total Invested</p></div>
          <div className={`${stat} bg-emerald-50`}><p className="text-lg font-bold text-emerald-700">{fmt(result.wealth)}</p><p className="text-xs text-emerald-500">Wealth Gained</p></div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 6. Inflation Calculator ───── */
export function InflationCalculator() {
  const [currentPrice, setCurrentPrice] = useState("1000");
  const [inflationRate, setInflationRate] = useState("6");
  const [years, setYears] = useState("10");
  const [periodicAddition, setPeriodicAddition] = useState("0");

  const result = useMemo(() => {
    const p = parseFloat(currentPrice);
    const r = parseFloat(inflationRate) / 100;
    const y = parseInt(years);
    if (isNaN(p) || isNaN(r) || isNaN(y)) return null;
    const periodic = parseFloat(periodicAddition);
    const futureValue = p * Math.pow(1 + r, y);
    const additions = isNaN(periodic) ? 0 : periodic * y;
    return { futureValue: futureValue.toFixed(2), increase: (futureValue - p).toFixed(2), multiplier: (futureValue / p).toFixed(2), withAdditions: (futureValue + additions).toFixed(2) };
  }, [currentPrice, inflationRate, years, periodicAddition]);

  return (
    <Panel title="Inflation Calculator">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Current Price (₹)</label><input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} className={input} /></div>
        <div><label className={label}>Inflation Rate (% p.a.)</label><input type="number" step="0.5" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} className={input} /></div>
        <div><label className={label}>Years</label><input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={input} /></div>
      </div>
      <div className="mt-3"><label className={label}>Yearly Additional Spend (₹)</label><input type="number" value={periodicAddition} onChange={(e) => setPeriodicAddition(e.target.value)} className={`${input} max-w-sm`} /></div>
      {result && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <div className={`${stat} bg-rose-50`}><p className="text-lg font-bold text-rose-700">₹{Number(result.futureValue).toLocaleString("en-IN")}</p><p className="text-xs text-rose-500">Future Cost</p></div>
          <div className={`${stat} bg-amber-50`}><p className="text-lg font-bold text-amber-700">₹{Number(result.increase).toLocaleString("en-IN")}</p><p className="text-xs text-amber-500">Price Increase</p></div>
          <div className={`${stat} bg-slate-100`}><p className="text-lg font-bold text-slate-700">{result.multiplier}×</p><p className="text-xs text-slate-500">Cost Multiplier</p></div>
          <div className={`${stat} bg-indigo-50`}><p className="text-lg font-bold text-indigo-700">₹{Number(result.withAdditions).toLocaleString("en-IN")}</p><p className="text-xs text-indigo-500">With yearly additions</p></div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 7. Age in Days Calculator ───── */
export function AgeInDaysCalculator() {
  const [dob, setDob] = useState("");
  const [target, setTarget] = useState("");
  const result = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = target ? new Date(target) : new Date();
    const ms = now.getTime() - birth.getTime();
    if (ms < 0) return null;
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(ms / 1000);
    return { days, hours, minutes, seconds };
  }, [dob, target]);

  return (
    <Panel title="Age in Days Calculator">
      <div className="grid gap-4 sm:grid-cols-2"><div><label className={label}>Date of Birth</label><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={`${input} max-w-sm`} /></div><div><label className={label}>As of date (optional)</label><input type="date" value={target} onChange={(e) => setTarget(e.target.value)} className={`${input} max-w-sm`} /></div></div>
      {result && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className={`${stat} bg-indigo-50`}><p className="text-xl font-bold text-indigo-700">{result.days.toLocaleString()}</p><p className="text-xs text-indigo-500">Days</p></div>
          <div className={`${stat} bg-purple-50`}><p className="text-xl font-bold text-purple-700">{result.hours.toLocaleString()}</p><p className="text-xs text-purple-500">Hours</p></div>
          <div className={`${stat} bg-cyan-50`}><p className="text-xl font-bold text-cyan-700">{result.minutes.toLocaleString()}</p><p className="text-xs text-cyan-500">Minutes</p></div>
          <div className={`${stat} bg-emerald-50`}><p className="text-xl font-bold text-emerald-700">{result.seconds.toLocaleString()}</p><p className="text-xs text-emerald-500">Seconds</p></div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 8. Time Zone Converter ───── */
const timeZones: Record<string, number> = {
  "UTC": 0, "EST (UTC-5)": -5, "CST (UTC-6)": -6, "MST (UTC-7)": -7, "PST (UTC-8)": -8, "IST (UTC+5:30)": 5.5, "GMT (UTC+0)": 0, "CET (UTC+1)": 1, "EET (UTC+2)": 2, "JST (UTC+9)": 9, "AEST (UTC+10)": 10, "CST China (UTC+8)": 8, "SGT (UTC+8)": 8, "GST (UTC+4)": 4, "NZST (UTC+12)": 12,
};

export function TimeZoneConverter() {
  const [time, setTime] = useState("12:00");
  const [fromZone, setFromZone] = useState("IST (UTC+5:30)");
  const [toZone, setToZone] = useState("EST (UTC-5)");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const result = useMemo(() => {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const fromOffset = timeZones[fromZone] ?? 0;
    const toOffset = timeZones[toZone] ?? 0;
    const utcMinutes = h * 60 + m - fromOffset * 60;
    let targetMinutes = utcMinutes + toOffset * 60;
    let dayShift = "";
    if (targetMinutes < 0) { targetMinutes += 1440; dayShift = " (previous day)"; }
    if (targetMinutes >= 1440) { targetMinutes -= 1440; dayShift = " (next day)"; }
    const th = Math.floor(targetMinutes / 60);
    const tm = Math.round(targetMinutes % 60);
    return `${date} ${String(th).padStart(2, "0")}:${String(tm).padStart(2, "0")}${dayShift}`;
  }, [time, fromZone, toZone, date]);

  return (
    <Panel title="Time Zone Converter">
      <div className="grid gap-4 sm:grid-cols-4">
        <div><label className={label}>Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={input} /></div>
        <div><label className={label}>Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={input} /></div>
        <div><label className={label}>From</label>
          <select value={fromZone} onChange={(e) => setFromZone(e.target.value)} className={input}>
            {Object.keys(timeZones).map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div><label className={label}>To</label>
          <select value={toZone} onChange={(e) => setToZone(e.target.value)} className={input}>
            {Object.keys(timeZones).map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          {result && <p className="w-full rounded-xl bg-teal-50 p-2.5 text-center text-lg font-bold text-teal-700">{result}</p>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => { const prev = fromZone; setFromZone(toZone); setToZone(prev); }} className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Swap zones</button>
        <CopyButton value={result} />
      </div>
    </Panel>
  );
}

/* ───── 9. Unit Converter ───── */
type UnitCategory = { name: string; units: { name: string; factor: number }[] };
const unitCategories: UnitCategory[] = [
  { name: "Length", units: [{ name: "Meters", factor: 1 }, { name: "Kilometers", factor: 0.001 }, { name: "Centimeters", factor: 100 }, { name: "Millimeters", factor: 1000 }, { name: "Miles", factor: 0.000621371 }, { name: "Yards", factor: 1.09361 }, { name: "Feet", factor: 3.28084 }, { name: "Inches", factor: 39.3701 }] },
  { name: "Weight", units: [{ name: "Kilograms", factor: 1 }, { name: "Grams", factor: 1000 }, { name: "Milligrams", factor: 1e6 }, { name: "Pounds", factor: 2.20462 }, { name: "Ounces", factor: 35.274 }, { name: "Tonnes", factor: 0.001 }] },
  { name: "Temperature", units: [{ name: "Celsius", factor: 1 }, { name: "Fahrenheit", factor: 1 }, { name: "Kelvin", factor: 1 }] },
  { name: "Volume", units: [{ name: "Liters", factor: 1 }, { name: "Milliliters", factor: 1000 }, { name: "Gallons (US)", factor: 0.264172 }, { name: "Cups", factor: 4.22675 }, { name: "Fluid Oz", factor: 33.814 }] },
  { name: "Data", units: [{ name: "Bytes", factor: 1 }, { name: "KB", factor: 1 / 1024 }, { name: "MB", factor: 1 / (1024 ** 2) }, { name: "GB", factor: 1 / (1024 ** 3) }, { name: "TB", factor: 1 / (1024 ** 4) }] },
];

function convertTemp(val: number, from: string, to: string): number {
  // First convert to Celsius
  let celsius = val;
  if (from === "Fahrenheit") celsius = (val - 32) * 5 / 9;
  else if (from === "Kelvin") celsius = val - 273.15;
  // Then to target
  if (to === "Fahrenheit") return celsius * 9 / 5 + 32;
  if (to === "Kelvin") return celsius + 273.15;
  return celsius;
}

export function UnitConverter() {
  const [catIdx, setCatIdx] = useState(0);
  const [value, setValue] = useState("1");
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [precision, setPrecision] = useState(6);

  const cat = unitCategories[catIdx];
  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return "";
    if (cat.name === "Temperature") {
      return convertTemp(v, cat.units[fromIdx].name, cat.units[toIdx].name).toFixed(Math.min(8, Math.max(0, precision)));
    }
    const baseValue = v / cat.units[fromIdx].factor;
    return (baseValue * cat.units[toIdx].factor).toFixed(Math.min(8, Math.max(0, precision))).replace(/\.?0+$/, "");
  }, [value, catIdx, fromIdx, toIdx, cat, precision]);

  return (
    <Panel title="Unit Converter">
      <div className="mb-3 flex flex-wrap gap-2">
        {unitCategories.map((c, i) => (
          <button key={c.name} type="button" onClick={() => { setCatIdx(i); setFromIdx(0); setToIdx(1); }} className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${catIdx === i ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-teal-50"}`}>{c.name}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div><label className={label}>Value</label><input type="number" value={value} onChange={(e) => setValue(e.target.value)} className={input} /></div>
        <div><label className={label}>From</label>
          <select value={fromIdx} onChange={(e) => setFromIdx(parseInt(e.target.value))} className={input}>
            {cat.units.map((u, i) => <option key={u.name} value={i}>{u.name}</option>)}
          </select>
        </div>
        <div><label className={label}>To</label>
          <select value={toIdx} onChange={(e) => setToIdx(parseInt(e.target.value))} className={input}>
            {cat.units.map((u, i) => <option key={u.name} value={i}>{u.name}</option>)}
          </select>
        </div>
        <div className="flex items-end"><p className="w-full rounded-xl bg-teal-50 p-2.5 text-center text-lg font-bold text-teal-700">{result || "—"}</p></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => { const prev = fromIdx; setFromIdx(toIdx); setToIdx(prev); }} className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Swap units</button>
        <input type="number" min={0} max={8} value={precision} onChange={(e) => setPrecision(Number(e.target.value) || 6)} className="w-24 rounded-xl border border-slate-200 px-3 py-1.5 text-xs" placeholder="Precision" />
      </div>
    </Panel>
  );
}

/* ───── 10. Scientific Calculator ───── */
export function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [isDeg, setIsDeg] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [ans, setAns] = useState("0");

  const append = (v: string) => {
    if (display === "0" && v !== ".") setDisplay(v);
    else setDisplay(display + v);
    setExpression(expression + v);
  };

  const clear = () => { setDisplay("0"); setExpression(""); };
  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
    setDisplay((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  };

  const calculate = () => {
    try {
      let expr = expression
        .replace(/Ans/g, ans)
        .replace(/π/g, String(Math.PI))
        .replace(/e(?![x])/g, String(Math.E))
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\^/g, "**");

      // Handle trig functions
      const toRad = isDeg ? `*${Math.PI}/180` : "";
      expr = expr.replace(/sin\(([^)]+)\)/g, `Math.sin(($1)${toRad})`);
      expr = expr.replace(/cos\(([^)]+)\)/g, `Math.cos(($1)${toRad})`);
      expr = expr.replace(/tan\(([^)]+)\)/g, `Math.tan(($1)${toRad})`);
      expr = expr.replace(/log\(([^)]+)\)/g, "Math.log10($1)");
      expr = expr.replace(/ln\(([^)]+)\)/g, "Math.log($1)");
      expr = expr.replace(/√\(([^)]+)\)/g, "Math.sqrt($1)");
      expr = expr.replace(/(\d+)!/g, (_, n) => {
        let f = 1; for (let i = 2; i <= parseInt(n); i++) f *= i; return String(f);
      });

      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${expr})`)();
      const r = typeof result === "number" ? (Number.isInteger(result) ? String(result) : result.toFixed(10).replace(/\.?0+$/, "")) : "Error";
      setHistory([`${expression} = ${r}`, ...history.slice(0, 4)]);
      setDisplay(r);
      setExpression(r);
      setAns(r);
    } catch {
      setDisplay("Error");
      setExpression("");
    }
  };

  const btnClass = "rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-200 active:bg-slate-300 transition";
  const fnClass = "rounded-lg bg-indigo-50 px-3 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition";
  const opClass = "rounded-lg bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition";

  return (
    <Panel title="Scientific Calculator">
      <div className="mx-auto max-w-sm space-y-3">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-right text-xs text-slate-400 h-4">{expression || " "}</p>
          <p className="text-right text-2xl font-bold text-white mt-1">{display}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setIsDeg(!isDeg)} className={`${fnClass} text-xs`}>{isDeg ? "DEG" : "RAD"}</button>
          <span className="text-xs text-slate-500">Mode: {isDeg ? "Degrees" : "Radians"}</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {/* Row 1: Functions */}
          <button type="button" onClick={() => append("sin(")} className={fnClass}>sin</button>
          <button type="button" onClick={() => append("cos(")} className={fnClass}>cos</button>
          <button type="button" onClick={() => append("tan(")} className={fnClass}>tan</button>
          <button type="button" onClick={() => append("log(")} className={fnClass}>log</button>
          <button type="button" onClick={() => append("ln(")} className={fnClass}>ln</button>
          {/* Row 2 */}
          <button type="button" onClick={() => append("√(")} className={fnClass}>√</button>
          <button type="button" onClick={() => append("^")} className={fnClass}>x^y</button>
          <button type="button" onClick={() => append("π")} className={fnClass}>π</button>
          <button type="button" onClick={() => append("e")} className={fnClass}>e</button>
          <button type="button" onClick={() => append("Ans")} className={fnClass}>Ans</button>
          <button type="button" onClick={() => append("!")} className={fnClass}>n!</button>
          {/* Row 3 */}
          <button type="button" onClick={() => append("7")} className={btnClass}>7</button>
          <button type="button" onClick={() => append("8")} className={btnClass}>8</button>
          <button type="button" onClick={() => append("9")} className={btnClass}>9</button>
          <button type="button" onClick={() => append("÷")} className={opClass}>÷</button>
          <button type="button" onClick={() => append("(")} className={opClass}>(</button>
          {/* Row 4 */}
          <button type="button" onClick={() => append("4")} className={btnClass}>4</button>
          <button type="button" onClick={() => append("5")} className={btnClass}>5</button>
          <button type="button" onClick={() => append("6")} className={btnClass}>6</button>
          <button type="button" onClick={() => append("×")} className={opClass}>×</button>
          <button type="button" onClick={() => append(")")} className={opClass}>)</button>
          {/* Row 5 */}
          <button type="button" onClick={() => append("1")} className={btnClass}>1</button>
          <button type="button" onClick={() => append("2")} className={btnClass}>2</button>
          <button type="button" onClick={() => append("3")} className={btnClass}>3</button>
          <button type="button" onClick={() => append("-")} className={opClass}>−</button>
          <button type="button" onClick={clear} className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100">C</button>
          {/* Row 6 */}
          <button type="button" onClick={() => append("0")} className={`${btnClass} col-span-2`}>0</button>
          <button type="button" onClick={() => append(".")} className={btnClass}>.</button>
          <button type="button" onClick={() => append("+")} className={opClass}>+</button>
          <button type="button" onClick={calculate} className="rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">=</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={backspace} className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Backspace</button>
          <button type="button" onClick={() => navigator.clipboard?.writeText(display)} className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Copy result</button>
          <button type="button" onClick={() => downloadText("calculator-history.txt", history.join("\n"))} className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700" disabled={history.length === 0}>Download history</button>
        </div>
        {history.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">History</p>
            {history.map((h, i) => <p key={i} className="text-xs text-slate-600">{h}</p>)}
          </div>
        )}
      </div>
    </Panel>
  );
}

/* ───── 11. Tip Calculator ───── */
export function TipCalculator() {
  const [bill, setBill] = useState("50");
  const [tipPct, setTipPct] = useState("15");
  const [people, setPeople] = useState("2");

  const result = useMemo(() => {
    const b = parseFloat(bill);
    const t = parseFloat(tipPct);
    const p = parseInt(people);
    if (isNaN(b) || isNaN(t) || isNaN(p) || p < 1) return null;
    const tipAmount = b * (t / 100);
    const total = b + tipAmount;
    const perPerson = total / p;
    const tipPerPerson = tipAmount / p;
    return { tipAmount: tipAmount.toFixed(2), total: total.toFixed(2), perPerson: perPerson.toFixed(2), tipPerPerson: tipPerPerson.toFixed(2) };
  }, [bill, tipPct, people]);

  return (
    <Panel title="Tip Calculator & Bill Splitter">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={label}>Bill Amount</label><input type="number" value={bill} onChange={e => setBill(e.target.value)} className={input} placeholder="0.00" /></div>
        <div>
          <label className={label}>Tip %</label>
          <input type="number" value={tipPct} onChange={e => setTipPct(e.target.value)} className={input} />
          <div className="mt-1.5 flex gap-1">
            {[10, 15, 18, 20, 25].map(p => (
              <button key={p} type="button" onClick={() => setTipPct(String(p))} className={`flex-1 rounded-lg py-1 text-xs font-semibold transition ${tipPct === String(p) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{p}%</button>
            ))}
          </div>
        </div>
        <div><label className={label}>People</label><input type="number" min={1} value={people} onChange={e => setPeople(e.target.value)} className={input} /></div>
      </div>
      {result && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className={`${stat} bg-indigo-50`}><p className="text-lg font-bold text-indigo-700">${result.tipAmount}</p><p className="text-xs text-indigo-500">Tip Total</p></div>
          <div className={`${stat} bg-emerald-50`}><p className="text-lg font-bold text-emerald-700">${result.total}</p><p className="text-xs text-emerald-500">Grand Total</p></div>
          <div className={`${stat} bg-amber-50`}><p className="text-lg font-bold text-amber-700">${result.perPerson}</p><p className="text-xs text-amber-500">Per Person</p></div>
          <div className={`${stat} bg-purple-50`}><p className="text-lg font-bold text-purple-700">${result.tipPerPerson}</p><p className="text-xs text-purple-500">Tip / Person</p></div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 12. BMI Calculator ───── */
export function BmiCalculator() {
  const [heightCm, setHeightCm] = useState("170");
  const [weightKg, setWeightKg] = useState("70");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const result = useMemo(() => {
    let h = parseFloat(heightCm);
    let w = parseFloat(weightKg);
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return null;
    if (unit === "imperial") { h = h * 2.54; w = w * 0.453592; } // inches to cm, lbs to kg
    const hm = h / 100;
    const bmi = w / (hm * hm);
    let category = "Obese";
    let color = "text-red-700";
    let bg = "bg-red-50";
    if (bmi < 18.5) { category = "Underweight"; color = "text-amber-700"; bg = "bg-amber-50"; }
    else if (bmi < 25) { category = "Normal Weight"; color = "text-emerald-700"; bg = "bg-emerald-50"; }
    else if (bmi < 30) { category = "Overweight"; color = "text-orange-700"; bg = "bg-orange-50"; }
    return { bmi: bmi.toFixed(1), category, color, bg };
  }, [heightCm, weightKg, unit]);

  return (
    <Panel title="BMI Calculator">
      <div className="mb-3 flex gap-2">
        {(["metric", "imperial"] as const).map(u => (
          <button key={u} type="button" onClick={() => setUnit(u)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${unit === u ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{u === "metric" ? "Metric (cm/kg)" : "Imperial (in/lbs)"}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>{unit === "metric" ? "Height (cm)" : "Height (inches)"}</label><input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} className={input} /></div>
        <div><label className={label}>{unit === "metric" ? "Weight (kg)" : "Weight (lbs)"}</label><input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} className={input} /></div>
      </div>
      {result && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <div className={`rounded-2xl ${result.bg} px-8 py-6 text-center`}>
            <p className={`text-4xl font-extrabold ${result.color}`}>{result.bmi}</p>
            <p className={`mt-1 text-sm font-bold ${result.color}`}>{result.category}</p>
          </div>
          <div className="flex gap-1 w-full max-w-md">
            <div className="flex-1 h-3 rounded-l-full bg-amber-400" title="Underweight < 18.5" />
            <div className="flex-[2] h-3 bg-emerald-500" title="Normal 18.5-24.9" />
            <div className="flex-1 h-3 bg-orange-400" title="Overweight 25-29.9" />
            <div className="flex-1 h-3 rounded-r-full bg-red-500" title="Obese 30+" />
          </div>
          <div className="flex gap-3 text-xs text-slate-500">
            <span>{"<18.5 Under"}</span><span>{"18.5-24.9 Normal"}</span><span>{"25-29.9 Over"}</span><span>{"30+ Obese"}</span>
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ───── 13. Electricity Bill Calculator ───── */
type Appliance = { id: string; name: string; watts: string; hours: string };

export function ElectricityBillCalculator() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: "1", name: "Air Conditioner", watts: "1500", hours: "8" },
    { id: "2", name: "LED Light", watts: "10", hours: "10" },
    { id: "3", name: "Refrigerator", watts: "150", hours: "24" },
  ]);
  const [rate, setRate] = useState("8");

  const update = (id: string, field: keyof Appliance, value: string) =>
    setAppliances(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  const add = () => setAppliances(prev => [...prev, { id: Date.now().toString(), name: "", watts: "", hours: "" }]);
  const remove = (id: string) => setAppliances(prev => prev.filter(a => a.id !== id));

  const results = useMemo(() => {
    const r = parseFloat(rate);
    if (isNaN(r)) return null;
    const items = appliances.map(a => {
      const w = parseFloat(a.watts) || 0;
      const h = parseFloat(a.hours) || 0;
      const dailyKwh = (w * h) / 1000;
      const monthlyKwh = dailyKwh * 30;
      const monthlyCost = monthlyKwh * r;
      return { ...a, dailyKwh, monthlyKwh, monthlyCost };
    });
    const totalMonthly = items.reduce((s, i) => s + i.monthlyCost, 0);
    const totalDaily = items.reduce((s, i) => s + i.dailyKwh, 0);
    const totalYearly = totalMonthly * 12;
    return { items, totalMonthly, totalDaily, totalYearly };
  }, [appliances, rate]);

  return (
    <div className="space-y-4">
      <Panel title="Electricity Bill Calculator">
        <div className="mb-3">
          <label className={label}>Electricity Rate (₹ per kWh / unit)</label>
          <input type="number" step="0.5" value={rate} onChange={e => setRate(e.target.value)} className={`${input} max-w-xs`} />
        </div>
        <div className="space-y-2">
          {appliances.map(a => (
            <div key={a.id} className="grid gap-2 sm:grid-cols-4 items-end">
              <input value={a.name} onChange={e => update(a.id, "name", e.target.value)} className={input} placeholder="Appliance name" />
              <input type="number" value={a.watts} onChange={e => update(a.id, "watts", e.target.value)} className={input} placeholder="Watts" />
              <input type="number" value={a.hours} onChange={e => update(a.id, "hours", e.target.value)} className={input} placeholder="Hours/day" />
              <button type="button" onClick={() => remove(a.id)} className="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition">Remove</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={add} className="mt-3 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition">+ Add Appliance</button>
      </Panel>
      {results && (
        <Panel title="Estimated Costs">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className={`${stat} bg-indigo-50`}><p className="text-lg font-bold text-indigo-700">{results.totalDaily.toFixed(2)} kWh</p><p className="text-xs text-indigo-500">Daily Usage</p></div>
            <div className={`${stat} bg-emerald-50`}><p className="text-lg font-bold text-emerald-700">₹{results.totalMonthly.toFixed(0)}</p><p className="text-xs text-emerald-500">Monthly Bill</p></div>
            <div className={`${stat} bg-amber-50`}><p className="text-lg font-bold text-amber-700">₹{results.totalYearly.toFixed(0)}</p><p className="text-xs text-amber-500">Yearly Bill</p></div>
          </div>
          <div className="mt-4 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50"><tr><th className="px-2 py-1.5 text-left">Appliance</th><th className="px-2 py-1.5 text-right">Watts</th><th className="px-2 py-1.5 text-right">Hrs/Day</th><th className="px-2 py-1.5 text-right">kWh/Month</th><th className="px-2 py-1.5 text-right">₹/Month</th></tr></thead>
              <tbody>{results.items.map(i => (
                <tr key={i.id} className="border-t border-slate-100"><td className="px-2 py-1">{i.name || "—"}</td><td className="px-2 py-1 text-right">{i.watts}</td><td className="px-2 py-1 text-right">{i.hours}</td><td className="px-2 py-1 text-right">{i.monthlyKwh.toFixed(1)}</td><td className="px-2 py-1 text-right font-semibold">₹{i.monthlyCost.toFixed(0)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}
