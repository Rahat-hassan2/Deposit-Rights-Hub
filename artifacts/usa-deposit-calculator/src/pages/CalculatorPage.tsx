import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { FAQSection, SeoHead, SiteLayout, SourceList } from "../components/Site";
import { money, sources, tools } from "../lib/tools";

type Field = { key: string; label: string; type?: "number" | "date" | "select" | "check" | "text"; options?: string[]; help?: string; min?: number; step?: string };
type Result = { value: string; label: string; metrics?: [string, string][]; note: string; source?: string; warning?: boolean };
const sourceByName: Record<string, string> = {
  caDeposit: sources[0][1], caCourts: sources[1][1], texas: sources[2][1], florida: sources[3][1], rentCaps: sources[4][1], rentStatute: sources[5][1], habitability: sources[6][1]
};
const cleaningBaseRanges: Record<string, [number, number]> = { Studio: [120, 200], "1BHK": [180, 300], "2BHK": [260, 450] };
const cleaningMultipliers: Record<string, number> = { Standard: 1, Deep: 1.45, "Move-out": 1.25 };
const fieldsBySlug: Record<string, Field[]> = {
  "security-deposit-return-calculator": [
    { key: "state", label: "State", type: "select", options: ["California", "Texas", "Florida", "New York", "Other"] },
    { key: "rent", label: "Monthly rent", type: "number", min: 0, step: "0.01" }, { key: "deposit", label: "Security deposit", type: "number", min: 0, step: "0.01" },
    { key: "moveout", label: "Move-out / surrender date", type: "date" },
    { key: "rentOn", label: "Unpaid rent to include", type: "check" }, { key: "rentDeduction", label: "Unpaid rent amount", type: "number", min: 0, step: "0.01" },
    { key: "cleanOn", label: "Cleaning charge to include", type: "check" }, { key: "cleaning", label: "Cleaning amount", type: "number", min: 0, step: "0.01" },
    { key: "wallOn", label: "Wall damage charge to include", type: "check" }, { key: "wall", label: "Wall damage amount", type: "number", min: 0, step: "0.01" },
    { key: "brokenOn", label: "Broken-item charge to include", type: "check" }, { key: "broken", label: "Broken items amount", type: "number", min: 0, step: "0.01" }
  ],
  "texas-deduction-calculator": [
    { key: "deposit", label: "Security deposit", type: "number", min: 0, step: "0.01" }, { key: "rent", label: "Unpaid rent", type: "number", min: 0, step: "0.01" }, { key: "damage", label: "Tenant-caused damage charge", type: "number", min: 0, step: "0.01", help: "Enter only the amount claimed; the tool does not determine liability." }
  ],
  "california-deposit-limit-checker": [
    { key: "rent", label: "Monthly rent", type: "number", min: 0, step: "0.01" }, { key: "deposit", label: "Deposit charged", type: "number", min: 0, step: "0.01" },
    { key: "furnished", label: "Rental furnished?", type: "select", options: ["No", "Yes"] }, { key: "smallOwner", label: "Landlord may qualify for small-owner exception?", type: "select", options: ["No / not sure", "Yes"], help: "Potential exception is for certain natural-person / small-owner landlords with no more than 2 rental properties and 4 units total." },
    { key: "serviceMember", label: "Prospective tenant is a service member?", type: "select", options: ["No", "Yes"] }, { key: "received", label: "Date deposit was demanded or received", type: "date", help: "Deposits from before July 1, 2024 may be governed by prior rules." }
  ],
  "hoa-fee-calculator": [
    { key: "fee", label: "Monthly HOA fee", type: "number", min: 0, step: "0.01" },
    { key: "water", label: "Water included", type: "check" }, { key: "trash", label: "Trash included", type: "check" }, { key: "pool", label: "Pool included", type: "check" }, { key: "gym", label: "Gym included", type: "check" }, { key: "insurance", label: "Insurance included", type: "check" }
  ],
  "rent-increase-calculator": [
    { key: "state", label: "State", type: "select", options: ["California", "Texas", "Florida", "New York", "Other"] },
    { key: "city", label: "City / county", type: "text", help: "Used as a reminder to check local rules." }, { key: "current", label: "Current monthly rent", type: "number", min: 0, step: "0.01" }, { key: "new", label: "Proposed monthly rent", type: "number", min: 0, step: "0.01" },
    { key: "lease", label: "Lease type", type: "select", options: ["Month-to-month", "Fixed term", "Other / unsure"] }, { key: "effective", label: "Increase effective date", type: "date" },
    { key: "region", label: "California DOJ schedule region", type: "select", options: ["Los Angeles / Orange counties", "Riverside / San Bernardino counties", "San Diego County", "San Francisco / Alameda / Contra Costa / Marin / San Mateo", "Other California counties"] },
    { key: "coverage", label: "AB 1482 coverage", type: "select", options: ["Unsure", "Applies", "Does not apply"] }
  ],
  "move-out-cleaning-estimator": [
    { key: "size", label: "Home size", type: "select", options: ["Studio", "1BHK", "2BHK"] }, { key: "type", label: "Cleaning level", type: "select", options: ["Standard", "Deep", "Move-out"] },
    { key: "charge", label: "Proposed landlord cleaning charge", type: "number", min: 0, step: "0.01", help: "Optional comparison only; not a legality decision." }
  ],
  "landlord-repair-time-calculator": [
    { key: "state", label: "State", type: "select", options: ["California", "Texas", "Florida", "New York", "Other"] },
    { key: "issue", label: "Repair issue", type: "select", options: ["No Hot Water", "AC Broken", "Mold"] }, { key: "notice", label: "Written notice date", type: "date" }
  ],
  "florida-deposit-calculator": [
    { key: "deposit", label: "Security deposit", type: "number", min: 0, step: "0.01" }, { key: "rent", label: "Unpaid rent amount", type: "number", min: 0, step: "0.01" },
    { key: "damage", label: "Damage / other claimed amount", type: "number", min: 0, step: "0.01" }, { key: "moveout", label: "Vacancy date", type: "date" }, { key: "claimReceived", label: "Date you received a claim notice (optional)", type: "date" }
  ]
};
const letterTypes: Record<string, string> = {
  "security-deposit-return-calculator": "Deposit return demand",
  "texas-deduction-calculator": "Texas deduction dispute",
  "california-deposit-limit-checker": "California deposit-limit inquiry",
  "hoa-fee-calculator": "HOA fee inquiry",
  "rent-increase-calculator": "Rent-increase information request",
  "move-out-cleaning-estimator": "Cleaning deduction dispute",
  "landlord-repair-time-calculator": "Written repair request",
  "florida-deposit-calculator": "Florida deposit demand"
};
const letterText = (slug: string) => {
  const common = " [Your name]\n[Rental address]\n[Date]\n\n[Landlord / property manager name]\n[Mailing or email address]\n\nSubject: ";
  const bodies: Record<string, string> = {
    "security-deposit-return-calculator": "Request for security deposit accounting and return\n\nHello [Name],\n\nI surrendered the rental at [address] on [move-out date]. My records show a security deposit of [$ amount]. Please provide the required itemized accounting and return any balance due under the law applicable to this tenancy. If you claim deductions, please identify each item and provide supporting documentation.\n\nMy forwarding address is [forwarding address]. Please respond in writing. I have retained copies of my lease, payment records, and condition documentation.\n\nSincerely,\n[Your name]",
    "texas-deduction-calculator": "Request to review Texas deposit deductions\n\nHello [Name],\n\nI am writing about the security deposit for [address], surrendered on [date]. Please provide an itemized explanation and supporting records for the deductions of [items / amounts]. Texas Property Code §§92.103–.104 address refund and lawful deductions, and exclude normal wear and tear. Please reconsider any charge that does not reflect an amount for which I am legally liable.\n\nMy forwarding address is [address]. Please respond in writing.\n\nSincerely,\n[Your name]",
    "california-deposit-limit-checker": "Question about security deposit amount\n\nHello [Name],\n\nI am reviewing the security deposit of [$ amount] for [address], demanded or received on [date]. California Civil Code §1950.5 generally limits qualifying deposits demanded or received on or after July 1, 2024 to one month’s rent, with a narrowly defined small-owner exception and other conditions. Please explain how the amount was calculated and whether you believe an exception applies.\n\nI understand the rule depends on the dates and facts. Please respond in writing.\n\nSincerely,\n[Your name]",
    "hoa-fee-calculator": "Request for HOA fee details\n\nHello [Association / manager],\n\nI am reviewing the recurring assessment for [property / unit]. Please provide the current fee schedule, billing frequency, services included, governing-document provisions, and details of any approved or proposed special assessments or fee changes. Please also identify where I can review the current budget and reserve information.\n\nThank you for your help. Please respond in writing.\n\nSincerely,\n[Your name]",
    "rent-increase-calculator": "Request for information about proposed rent change\n\nHello [Name],\n\nI received notice of a proposed rent change for [address], from [$ current] to [$ proposed], effective [date]. Please provide the calculation and identify the lease provision and state or local rule you believe applies, including any relevant coverage or exemption and the notice period relied on.\n\nI am reviewing the information and am not waiving any rights. Please respond in writing.\n\nSincerely,\n[Your name]",
    "move-out-cleaning-estimator": "Request for support for cleaning deduction\n\nHello [Name],\n\nI am writing about the proposed cleaning deduction of [$ amount] for [address]. Please send an itemized description of the work, the date it was completed, and copies of relevant invoices or receipts. I have retained move-in and move-out condition records. Please explain how the charge reflects the condition at surrender and the rules applicable to this tenancy.\n\nPlease respond in writing.\n\nSincerely,\n[Your name]",
    "landlord-repair-time-calculator": "Written notice and request for repair\n\nHello [Name],\n\nI am providing written notice that [describe issue] at [address] began on [date]. The issue affects [describe impact, including health or safety concerns]. Please arrange inspection and repair promptly and let me know when access is needed. I am available [times]. Please confirm receipt of this notice and respond in writing.\n\nI will keep a copy of this message and related documentation. This request is not a waiver of any rights or remedies.\n\nSincerely,\n[Your name]",
    "florida-deposit-calculator": "Request for Florida security deposit return / accounting\n\nHello [Name],\n\nI vacated [address] on [date]. My records show a security deposit of [$ amount]. Under Florida Statute §83.49, please return the balance if there is no claim, or provide any required written notice of intent to impose a claim within the statutory period. If a claim has been made, please send its itemization and supporting documents. I understand the statute provides a period to object after receipt of a claim notice.\n\nMy forwarding address is [address]. Please respond in writing.\n\nSincerely,\n[Your name]"
  };
  return `${common}${letterTypes[slug]}\n\n${bodies[slug]}\n\nTemplate only. Replace every bracketed placeholder, confirm current law and facts, and keep a copy. This is not legal advice.`;
};

function initialValues(slug: string) {
  const init: Record<string, string | boolean> = {};
  (fieldsBySlug[slug] || []).forEach(f => {
    if (f.type === "check") init[f.key] = ["rentOn", "cleanOn", "wallOn", "brokenOn"].includes(f.key) ? false : false;
    else if (f.type === "select") init[f.key] = f.options?.[0] || "";
    else init[f.key] = "";
  });
  return init;
}
function number(v: string | boolean | undefined) { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 0; }
function dateDays(date: string) { if (!date) return null; const parsed = new Date(`${date}T00:00:00`); if (Number.isNaN(parsed.getTime())) return null; return Math.max(0, Math.floor((new Date().setHours(0, 0, 0, 0) - parsed.getTime()) / 86400000)); }
function dateAfter(date: string, days: number) {
  const parsed = new Date(`${date}T00:00:00`);
  if (!date || Number.isNaN(parsed.getTime())) return "";
  parsed.setDate(parsed.getDate() + days);
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function calculate(slug: string, v: Record<string, string | boolean>): Result | null {
  const n = (k: string) => number(v[k]);
  if (slug === "security-deposit-return-calculator") {
    if (!n("deposit")) return null;
    const items = [["Unpaid rent", v.rentOn ? n("rentDeduction") : 0], ["Cleaning", v.cleanOn ? n("cleaning") : 0], ["Wall damage", v.wallOn ? n("wall") : 0], ["Broken items", v.brokenOn ? n("broken") : 0]] as [string, number][];
    const deductions = items.reduce((sum, [, amount]) => sum + amount, 0); const refund = Math.max(0, n("deposit") - deductions);
    let note = "Deadlines vary by state. NY and other-state rules are not estimated here; check current state and local law. Deductions must be evaluated under the law and facts, not just arithmetic.";
    let source: string | undefined = v.state === "New York" ? "https://ag.ny.gov/resources/individuals/tenants-homeowners/tenants" : v.state === "Other" ? "https://www.usa.gov/housing" : undefined;
    if (v.state === "California") { note = "California generally requires return of the balance and itemization within 21 days after vacancy. Ordinary wear and tear cannot be charged. The details and facts still matter."; source = sourceByName.caDeposit; }
    if (v.state === "Texas") { note = "Texas generally requires refund by the 30th day after surrender, subject to the forwarding-address requirement in §92.107. Deductions must be amounts the tenant is legally liable for, excluding normal wear and tear."; source = sourceByName.texas; }
    if (v.state === "Florida") { note = "Florida: absent a claim, return is due within 15 days after vacancy. If claiming, landlord sends written notice of intent within 30 days; tenant has 15 days after receiving notice to object. These are distinct timelines."; source = sourceByName.florida; }
    const metrics: [string, string][] = [["Deposit", money(n("deposit"))], ["Total entered deductions", money(deductions)], ["Estimated refund", money(refund)]];
    if (v.moveout && v.state === "California") metrics.push(["CA return / itemization reference (21 days)", dateAfter(String(v.moveout), 21)]);
    if (v.moveout && v.state === "Texas") metrics.push(["TX refund reference (30 days)", dateAfter(String(v.moveout), 30)]);
    if (v.moveout && v.state === "Florida") metrics.push(["FL no-claim return (15 days)", dateAfter(String(v.moveout), 15)], ["FL claim notice by (30 days)", dateAfter(String(v.moveout), 30)]);
    return { value: money(refund), label: "Estimated balance after entered deductions", metrics, note, source };
  }
  if (slug === "texas-deduction-calculator") {
    if (!n("deposit")) return null;
    return { value: money(Math.max(0, n("deposit") - n("rent") - n("damage"))), label: "Estimated remaining refund", metrics: [["Deposit", money(n("deposit"))], ["Entered rent + damage", money(n("rent") + n("damage"))]], note: "Texas Property Code §92.103 addresses refund timing; §92.104 limits deductions to amounts for which the tenant is legally liable and excludes normal wear and tear. Faded paint and minor carpet wear are examples that generally cannot be deducted as damage. This arithmetic does not determine liability.", source: sourceByName.texas };
  }
  if (slug === "california-deposit-limit-checker") {
    if (!n("rent") || !n("deposit")) return null;
    const exception = v.smallOwner === "Yes" && v.serviceMember === "No"; const cap = n("rent") * (exception ? 2 : 1); const over = n("deposit") > cap;
    const before = Boolean(v.received && new Date(`${v.received}T00:00:00`) < new Date("2024-07-01T00:00:00"));
    return { value: money(cap), label: exception ? "Potential two-month cap if exception facts qualify" : "General current cap for comparison", metrics: [["Deposit charged", money(n("deposit"))], ["Entered rent", money(n("rent"))]], note: before ? "The date entered is before July 1, 2024; earlier deposits may be governed by prior rules, so this current-law comparison may not apply." : over ? "Potential overcharge: the amount is above the selected cap. In a bad-faith violation, a court may award statutory damages of up to twice the security amount in addition to actual damages. This is not automatic; the facts and court findings matter." : "Furnished status does not change the general one-month cap for covered deposits demanded or received on or after July 1, 2024. A qualifying small-owner exception may allow up to two months only when statutory conditions are met and the prospective tenant is not a service member.", source: sourceByName.caDeposit, warning: over && !before };
  }
  if (slug === "hoa-fee-calculator") {
    if (!n("fee")) return null;
    const chosen = ["water", "trash", "pool", "gym", "insurance"].filter(k => v[k]).length;
    const category = n("fee") < 225 ? "Low (under $225)" : n("fee") <= 275 ? "Average ($225–$275)" : "High (over $275)";
    const comparison = n("fee") > 250 ? `${money((n("fee") - 250) * 12)} above / year` : `${money((250 - n("fee")) * 12)} below / year`;
    return { value: money(n("fee") * 12), label: "Annual HOA cost", metrics: [["Monthly fee", money(n("fee"))], ["Compared with $250/mo reference", comparison], ["Relative category", category], ["Selected services", `${chosen}`]], note: "The low / average / high bands are a rough comparison around the requested $250/month reference: under $225 is low, $225–$275 is near average, and over $275 is high. This is not an official U.S. statistic. HOA budgets, assessments, included services, and governing documents vary.", };
  }
  if (slug === "rent-increase-calculator") {
    if (!n("current") || !n("new")) return null;
    const pct = ((n("new") - n("current")) / n("current")) * 100;
    const regionCaps: Record<string, number> = { "Los Angeles / Orange counties": 8.7, "Riverside / San Bernardino counties": 8.1, "San Diego County": 8.2, "San Francisco / Alameda / Contra Costa / Marin / San Mateo": 8.8, "Other California counties": 8.6 };
    const isCa = v.state === "California"; const cap = regionCaps[String(v.region)] ?? 8.6;
    let note = `The proposed change is ${pct.toFixed(2)}%. State and local requirements differ; check the city, lease, notice rules, effective date, and applicable coverage before drawing a conclusion.`;
    let source: string | undefined; let warning = false; let metrics: [string, string][] = [["Current rent", money(n("current"))], ["Proposed rent", money(n("new"))]];
    if (isCa) {
      source = sourceByName.rentCaps;
      const date = v.effective ? new Date(`${v.effective}T00:00:00`) : null;
      const scheduleDate = date && date >= new Date("2026-08-01T00:00:00") && date <= new Date("2027-07-31T23:59:59");
      if (v.coverage === "Applies") {
        metrics.push(["Regional schedule cap", `${cap.toFixed(1)}%`]); warning = pct > cap;
        note = `${warning ? "The increase is above" : "The increase is at or below"} the ${cap.toFixed(1)}% regional schedule used for the selected region. AB 1482 generally uses 5% plus applicable CPI, capped at 10%; the California DOJ schedule shown here is effective Aug. 1, 2026–July 31, 2027${scheduleDate ? " and matches the entered effective-date window" : "; verify the schedule for the entered effective date"}. Coverage, exemptions, the 12-month aggregate, local lower limits, notice rules, and other increases can change the answer.`;
      } else if (v.coverage === "Does not apply") note = `${pct.toFixed(2)}% increase calculated. You selected that AB 1482 does not apply, so no statewide cap comparison is made. Confirm the exemption and check city rules, other tenant protections, lease terms, and notice requirements.`;
      else note = `${pct.toFixed(2)}% increase calculated. Coverage is marked unsure; the cap schedule is not treated as a verdict. For likely covered units, the selected region's schedule is ${cap.toFixed(1)}% for Aug. 1, 2026–July 31, 2027. Check coverage, exemptions, local limits, 12-month aggregate, date, and notice.`;
    }
    return { value: `${pct.toFixed(2)}%`, label: "Calculated monthly rent increase", metrics, note, source, warning };
  }
  if (slug === "move-out-cleaning-estimator") {
    const [low, high] = cleaningBaseRanges[String(v.size)] || [120, 200]; const factor = cleaningMultipliers[String(v.type)] || 1;
    if (!v.size || !v.type) return null;
    const estLow = low * factor; const estHigh = high * factor; const charge = n("charge");
    return { value: `${money(estLow)} – ${money(estHigh)}`, label: "Rough market estimate", metrics: charge ? [["Proposed charge", money(charge)], ["Compared with range", charge > estHigh ? `${money(charge - estHigh)} above high end` : charge < estLow ? `${money(estLow - charge)} below low end` : "Within estimate"]] : [["Home size", String(v.size)], ["Cleaning level", String(v.type)]], note: `Baseline examples: Studio $120–200, 1BHK $180–300, 2BHK $260–450. The ${v.type} estimate is scaled by ${cleaningMultipliers[String(v.type)]}×. These are rough market estimates, not quotes or legal limits. A comparison cannot determine whether a landlord deduction is lawful. Move-in condition, move-out evidence, receipts, lease terms, and state/local rules matter.` };
  }
  if (slug === "landlord-repair-time-calculator") {
    if (!v.notice) return null;
    const days = dateDays(String(v.notice)); if (days === null) return null;
    const state = String(v.state); const issue = String(v.issue);
    let note = "No fixed universal statewide countdown is given here. Repair and notice rules depend on state and local law, issue severity, notice, access, and circumstances.";
    let source: string | undefined;
    const issueContext = issue === "No Hot Water" ? "Lack of hot water may raise habitability or health-and-safety concerns." : issue === "AC Broken" ? "Air-conditioning duties can depend on the lease, local code, and circumstances; do not assume every state treats AC as a universal statutory service." : "Mold concerns depend on the source, severity, moisture, and health effects; document the condition and any ongoing leak.";
    if (state === "California") { note = `California applies a reasonable-time and habitability framework depending on severity and circumstances; there is no statewide rule that all repairs must be done in 30 days. ${issueContext} Document written notice and follow-up.`; source = sourceByName.habitability; }
    if (state === "Texas") { note = `In applicable circumstances after proper notice, Texas Property Code §92.056 provides a rebuttable presumption that 7 days is a reasonable repair time. It is not a universal hard deadline. ${issueContext} The reference date below is informational only.`; source = sourceByName.texas; }
    if (state === "Florida") { note = `Florida repair and notice rules vary by issue and circumstances. No fixed universal statewide countdown is assigned. ${issueContext} Keep written notice and records, and check the statute and local rules.`; source = sourceByName.florida; }
    const metrics: [string, string][] = [["Days since written notice", `${days} day${days === 1 ? "" : "s"}`], ["Issue", issue]];
    if (state === "Texas") metrics.push(["Qualified 7-day reference date", new Date(new Date(`${v.notice}T00:00:00`).getTime() + 7 * 86400000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })]);
    return { value: `${days} days`, label: "Elapsed since notice date", metrics, note, source };
  }
  if (slug === "florida-deposit-calculator") {
    if (!n("deposit")) return null;
    const refund = Math.max(0, n("deposit") - n("rent") - n("damage"));
    let metrics: [string, string][] = [["Deposit", money(n("deposit"))], ["Total entered deductions", money(n("rent") + n("damage"))], ["Estimated refund", money(refund)]];
    if (v.moveout) {
      const base = new Date(`${v.moveout}T00:00:00`);
      const add = (days: number) => { const d = new Date(base); d.setDate(d.getDate() + days); return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); };
      metrics = [...metrics, ["No-claim return date (15 days)", add(15)], ["Claim notice by (30 days)", add(30)]];
    }
    if (v.claimReceived) {
      const received = new Date(`${v.claimReceived}T00:00:00`);
      const objection = new Date(received); objection.setDate(objection.getDate() + 15);
      metrics.push(["Tenant objection window (15 days)", objection.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })]);
    }
    return { value: money(refund), label: "Estimated balance after entered amounts", metrics, note: "Florida Statute §83.49: if no claim, landlord returns deposit within 15 days after vacancy. If claiming, landlord sends written notice of intent within 30 days; the tenant has 15 days after receiving the notice to object. The 15-day return clock is not the claim-notice deadline.", source: sourceByName.florida };
  }
  return null;
}

function FieldInput({ field, value, onChange }: { field: Field; value: string | boolean; onChange: (v: string | boolean) => void }) {
  if (field.type === "check") return <div className="field"><label className="check-row"><input type="checkbox" checked={Boolean(value)} onChange={e => onChange(e.target.checked)} data-testid={`input-${field.key}`} />{field.label}</label></div>;
  return <div className="field"><label htmlFor={`field-${field.key}`}>{field.label}</label>
    {field.type === "select" ? <select id={`field-${field.key}`} value={String(value)} onChange={e => onChange(e.target.value)} data-testid={`input-${field.key}`}>{field.options?.map(o => <option key={o} value={o}>{o}</option>)}</select> :
      <input id={`field-${field.key}`} type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"} min={field.min} step={field.step} value={String(value)} onChange={e => onChange(e.target.value)} data-testid={`input-${field.key}`} />}
    {field.help && <small>{field.help}</small>}
  </div>;
}

export default function CalculatorPage() {
  const [, params] = useRoute("/:slug");
  const slug = params?.slug || "";
  const tool = tools.find(t => t.slug === slug) || tools[0];
  const fields = fieldsBySlug[tool.slug] || [];
  const [values, setValues] = useState<Record<string, string | boolean>>(() => initialValues(tool.slug));
  const [letter, setLetter] = useState(() => letterText(tool.slug));
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    setValues(initialValues(tool.slug));
    setLetter(letterText(tool.slug));
    setFeedback("");
  }, [tool.slug]);
  const result = useMemo(() => calculate(tool.slug, values), [tool.slug, values]);
  const selectedAmenities = ["water", "trash", "pool", "gym", "insurance"].filter(k => values[k]);
  const pieColors = ["#2563eb", "#66a1f8", "#9bbff5", "#d2e1fa", "#8bb9ef"];
  const pieBackground = selectedAmenities.length ? `conic-gradient(${selectedAmenities.map((_, i) => `${pieColors[i]} ${i * 100 / selectedAmenities.length}% ${(i + 1) * 100 / selectedAmenities.length}%`).join(",")})` : undefined;
  const update = (key: string, value: string | boolean) => setValues(prev => ({ ...prev, [key]: value }));

  const copy = async (text: string, message: string) => {
    try { await navigator.clipboard.writeText(text); setFeedback(message); }
    catch { setFeedback("Copy is unavailable in this browser. Select the text and copy it manually."); }
    window.setTimeout(() => setFeedback(""), 3500);
  };
  return <SiteLayout>
    <SeoHead title={`${tool.title} 2026 | USADepositCalculator.com`} description={`${tool.description} Free, private, client-side calculator with source links and an editable letter template.`} faqs={tool.faqs} />
    <div className="container">
      <div className="crumbs"><Link href="/">Home</Link> / {tool.shortTitle}</div>
      <div className="tool-heading"><p className="eyebrow">{tool.eyebrow}</p><h1>{tool.title}</h1><p>{tool.description} Enter the facts you have; check linked official sources for the rules that apply to your location and dates.</p></div>
      <div className="tool-workspace">
        <section className="panel" aria-labelledby="input-heading"><h2 id="input-heading">Your details</h2>
          <div className="form-grid">{fields.map(field => {
            if (tool.slug === "rent-increase-calculator" && ["region", "coverage"].includes(field.key) && values.state !== "California") return null;
            if (["rentDeduction", "cleaning", "wall", "broken"].includes(field.key) && !values[`${field.key === "rentDeduction" ? "rentOn" : field.key === "cleaning" ? "cleanOn" : field.key === "wall" ? "wallOn" : "brokenOn"}`]) return null;
            return <FieldInput key={field.key} field={field} value={values[field.key] ?? ""} onChange={v => update(field.key, v)} />;
          })}</div>
          <div className="form-actions"><button type="button" className="btn" onClick={() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "center" })} data-testid="button-calculate">Update estimate</button><button type="button" className="btn secondary" onClick={() => { setValues(initialValues(tool.slug)); setFeedback(""); }} data-testid="button-reset">Reset fields</button></div>
        </section>
        <section className="panel" id="results" aria-live="polite" aria-labelledby="result-heading"><h2 id="result-heading">Your result</h2>{result ? <div className="result-panel">
          <div className="result-kicker">Calculated from the details entered</div><div className="result-value" data-testid="text-result-value">{result.value}</div><div className="result-label">{result.label}</div>
          {result.metrics && <div className="result-grid">{result.metrics.map(([label, val]) => <div className="result-metric" key={label}><span>{label}</span><strong>{val}</strong></div>)}</div>}
          {tool.slug === "hoa-fee-calculator" && <div className="chart-row">{selectedAmenities.length ? <div className="pie" style={{ background: pieBackground }} role="img" aria-label={`Illustrative equal split across ${selectedAmenities.length} selected HOA amenities`} /> : <div className="empty-state" style={{ padding: 12 }}>Select included services to show the illustrative split.</div>}<span>Illustrative equal split of selected amenities. Actual HOA line-item spending was not supplied.</span></div>}
          {tool.slug === "move-out-cleaning-estimator" && values.type && <div style={{ overflowX: "auto", marginTop: 14 }}><table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}><caption style={{ textAlign: "left", fontWeight: 700, padding: "0 0 8px" }}>Estimated cost table · {String(values.type)} cleaning</caption><thead><tr><th style={{ padding: 8, borderBottom: "1px solid #dbe4ef" }}>Home size</th><th style={{ padding: 8, borderBottom: "1px solid #dbe4ef" }}>Estimated range</th></tr></thead><tbody>{Object.entries(cleaningBaseRanges).map(([size, [low, high]]) => <tr key={size}><td style={{ padding: 8, borderBottom: "1px solid #edf1f6" }}>{size}</td><td style={{ padding: 8, borderBottom: "1px solid #edf1f6" }}>{money(low * cleaningMultipliers[String(values.type)])} – {money(high * cleaningMultipliers[String(values.type)])}</td></tr>)}</tbody></table></div>}
          <div className={`result-note ${result.warning ? "warning" : ""}`} data-testid="status-context">{result.note}</div>
          {result.source && <div className="source-inline">Source: <a href={result.source} target="_blank" rel="noreferrer">official law or guidance</a></div>}
        </div> : <div className="empty-state" data-testid="status-empty">Enter the required values to see your estimate. Your entries stay in this browser and are not submitted.</div>}
          {tool.slug === "texas-deduction-calculator" && <div className="notice" style={{ marginTop: 13 }}><strong>Wear-and-tear examples:</strong> faded paint and minor carpet wear generally cannot be charged as damage. Document the condition and review the statute.</div>}
          {tool.slug === "california-deposit-limit-checker" && <div className="notice" style={{ marginTop: 13 }}>Furnished status does not increase California’s general current one-month cap. The narrow small-owner exception does not apply when the prospective tenant is a service member.</div>}
          {tool.slug === "rent-increase-calculator" && <div className="notice" style={{ marginTop: 13 }}>CA DOJ regional schedule: effective Aug. 1, 2026–July 31, 2027. Local limits may be lower; covered status and exemptions matter.</div>}
          {tool.slug === "landlord-repair-time-calculator" && <div className="notice" style={{ marginTop: 13 }}>For urgent health or safety concerns, consider appropriate emergency help. A date counter is not a legal finding.</div>}
        </section>
      </div>
      <div className="tool-bottom">
        <section className="panel"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 12 }}><div><span className="template-label">Template only</span><h2 style={{ margin: "8px 0 0" }}>{letterTypes[tool.slug]}</h2></div><button className="btn secondary small" type="button" onClick={() => copy(letter, "Legal letter copied to clipboard.")} data-testid="button-copy-letter">Copy legal letter</button></div>
          <p style={{ color: "#687b91", fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>Edit every bracketed placeholder and confirm dates, facts, and law before sending. This template is not legal advice.</p>
          <textarea className="letter-box" value={letter} onChange={e => setLetter(e.target.value)} aria-label={`${letterTypes[tool.slug]} editable template`} data-testid="input-letter-template" />
          <div className="action-feedback" aria-live="polite" data-testid="status-copy">{feedback}</div>
          <div className="form-actions"><button className="btn secondary small" type="button" onClick={() => window.print()} data-testid="button-print">Print result</button><button className="btn secondary small" type="button" onClick={() => copy(`${tool.title}\n${result ? `${result.label}: ${result.value}\n${result.note}` : "No estimate yet."}`, "Result summary copied.")} data-testid="button-copy-result">Copy result summary</button></div>
        </section>
        <aside className="panel"><h2>Keep the context in view</h2><p style={{ fontSize: 13, color: "#5d7088", lineHeight: 1.75 }}>Use this estimate as a checklist, not a final legal decision. Read the source materials, review your lease, and check city or county rules. Dates, notice method, property coverage, prior payments, and evidence can change an outcome.</p>
          <div className="notice"><strong>Not legal advice.</strong> This educational tool does not create an attorney-client relationship or guarantee a legal outcome.</div>
          <h3 style={{ color: "#17365f", fontSize: 14, margin: "20px 0 8px" }}>Related calculators</h3>
          {tools.filter(t => t.slug !== tool.slug).slice(0, 4).map(t => <Link key={t.slug} href={`/${t.slug}`} style={{ display: "block", color: "#2563eb", fontSize: 12, textDecoration: "none", padding: "7px 0", borderTop: "1px solid #edf1f6" }}>{t.shortTitle} →</Link>)}
        </aside>
      </div>
      <section className="section" style={{ paddingBottom: 0 }}><SourceList /></section>
    </div>
    <FAQSection faqs={tool.faqs} title={`${tool.shortTitle}: common questions`} />
    <div className="container" style={{ paddingBottom: 35 }}><div className="legal-note">General information only, not legal advice. Laws and local rules can change. Confirm the official text and seek qualified local help when needed.</div></div>
  </SiteLayout>;
}
