import { Link } from "wouter";
import { Building2, CircleDollarSign, FileText, ShieldCheck, Sparkles, TrendingUp, WalletCards, Wrench, type LucideIcon } from "lucide-react";
import { FAQSection, SeoHead, SiteLayout, SourceList } from "../components/Site";
import { tools } from "../lib/tools";

const homeFaqs = [
  { question: "Are these calculators legal advice?", answer: "No. They perform arithmetic and summarize selected public legal frameworks for education. They cannot evaluate your lease, evidence, local ordinance, or the full facts. Consider a tenant organization or qualified attorney for advice." },
  { question: "Why do deposit deadlines differ by state?", answer: "Each state sets its own rules, and some require different steps depending on whether a landlord claims deductions, whether the renter supplied a forwarding address, or when the deposit was collected." },
  { question: "What records should I keep when moving?", answer: "Save your lease, payment records, dated condition photos or video, written notices, forwarding-address proof, inspection notes, receipts, and all landlord communications." },
  { question: "Can my landlord charge me for ordinary wear?", answer: "Many state statutes distinguish ordinary wear from damage. The line depends on the item, age, condition at move-in, use, and local law; document condition and ask for itemized support." }
];
const cardIcons: LucideIcon[] = [WalletCards, FileText, ShieldCheck, Building2, TrendingUp, Sparkles, Wrench, CircleDollarSign];

export default function HomePage() {
  return <SiteLayout><SeoHead title="US Security Deposit & HOA Law Calculators 2026 | Know Your Rights" description="Use free U.S. renter calculators for security deposit returns, state deadlines, rent changes, repairs, cleaning, and HOA costs. Plain-English context with official sources." faqs={homeFaqs} />
    <section className="hero"><div className="container hero-layout"><div>
      <p className="eyebrow">A clearer move-out starts here</p>
      <h1>US Security Deposit &amp; HOA Law Calculators 2026 - Know Your Rights</h1>
      <p className="lead">Practical, plain-English tools for renters checking deposits, deductions, repairs, rent changes, and housing costs. Enter your facts, see the math, then follow the source links that matter.</p>
      <Link className="btn" href="/security-deposit-return-calculator">Explore the calculators <span aria-hidden="true">→</span></Link>
      <div className="trust-note"><i className="trust-dot" /><span>Client-side calculations · No account · No information submitted</span></div>
    </div><aside className="hero-panel" aria-label="Toolkit overview">
      <div className="panel-top"><span>THE RENTERS’ TOOLKIT</span><span>2026 edition</span></div>
      <div className="mini-stat"><div><strong>8</strong><br /><span>focused calculators</span></div><div><strong>3</strong><br /><span>state timelines covered</span></div></div>
      <div className="mini-stat"><div><strong>Local</strong><br /><span>rules still matter</span></div><div><strong>Yours</strong><br /><span>to review and edit</span></div></div>
      <p style={{ color: "#61758d", fontSize: 12, lineHeight: 1.6, margin: "17px 0 0" }}>A useful starting point—not a substitute for the lease, official law, or legal advice.</p>
    </aside></div></section>
    <section className="section" id="calculators"><div className="container">
      <div className="section-head"><div><p className="eyebrow">Choose your next step</p><h2>Tools for the questions renters actually ask</h2><p className="section-intro">Each calculator shows the inputs behind the result and links to a primary source where available.</p></div></div>
       <div className="tool-grid">{tools.map((t, i) => { const Icon = cardIcons[i]; return <Link href={`/${t.slug}`} key={t.slug} className="tool-card" data-testid={`card-tool-${t.slug}`}><span className="tool-icon"><Icon size={19} strokeWidth={1.9} aria-hidden="true" /></span><strong>{t.shortTitle}</strong><span className="desc">{t.description}</span><span className="card-arrow">Open calculator <span aria-hidden="true">→</span></span></Link>; })}</div>
    </div></section>
    <section className="feature-band"><div className="container feature-content"><div><h2>Start with documents. Get clearer answers.</h2><p>Good records make calculations useful: signed lease, payment history, move-in and move-out photos, itemized claims, notices, and dated messages.</p></div><Link href="/security-deposit-return-calculator" className="btn secondary">Check a deposit</Link></div></section>
    <section className="section" id="tenant-guide"><div className="container content-layout"><article className="article">
      <p className="eyebrow">A practical renter’s guide</p><h2 style={{ marginTop: 0 }}>Know what to document before you compare the numbers</h2>
      <p>Moving out can turn a stack of small questions into one large financial uncertainty. Was the original deposit one month or more? Did the landlord send a list of deductions? Is a scuffed wall ordinary use or damage? When should a repair have been made? A useful first step is to separate what you know from what you need to verify. These tools organize the arithmetic and point toward selected official sources, but state law, city ordinances, lease wording, and the facts of a specific home all matter.</p>
      <h3>Deposits: keep the money trail intact</h3>
      <p>At move-in, save the lease, any receipt or payment confirmation, and written communications describing the amount held as a security deposit. Do not assume that a fee labeled “cleaning,” “key,” or “last month” is legally treated exactly like a deposit; its purpose and local law can matter. As you prepare to leave, record the surrender date and make sure the landlord has a reliable forwarding address in writing. Texas, for example, ties its general refund timing to surrender and requires a forwarding address under the relevant statute. California and Florida use different timelines and different notice steps.</p>
      <p>When a refund arrives, compare the amount with the initial deposit and the itemization rather than relying on memory. Ask for an explanation of unfamiliar line items and keep the envelope, email, or delivery record. A calculator can add the charges you enter and show the remaining balance, but cannot establish whether a particular deduction is legally justified. That question may depend on the lease, invoices, photographs, the age of an item, local requirements, and whether the renter was legally responsible for the cost.</p>
      <h3>Ordinary wear and tear is not the same as damage</h3>
      <p>Homes show signs of normal use. Paint can fade, carpet can flatten in a walkway, and fixtures can age. State rules commonly distinguish that gradual wear from damage beyond ordinary use, but they do not create one universal checklist for every home. Compare dated move-in and move-out images from similar angles. Capture wide shots and close-ups, and preserve inspection notes. If a charge involves repair or replacement, ask what work was done, how the cost was calculated, and whether the item’s age or prior condition was considered.</p>
      <p>Cleaning is especially fact-specific. Some rentals are returned in a condition described in the lease; some state statutes limit what may be withheld; local rules may add requirements. A rough market cleaning estimate can help you understand the scale of a proposed charge, but a market range is not a legal cap and does not decide whether a deduction is allowed. Condition evidence and receipts are more useful than a generic average.</p>
      <h3>Repairs and habitability: give clear written notice</h3>
      <p>When an essential feature fails, report the issue promptly in writing through the method specified by the lease or local rules. Describe the location, what is not working, when it began, and any steps taken to reduce immediate risk. Keep a copy, delivery confirmation, and follow-up messages. For urgent conditions that affect health or safety, seek appropriate emergency help rather than waiting for an online calculator.</p>
      <p>Repair laws depend on the kind of problem, severity, notice, access, and state or city. California uses a reasonable-time and habitability framework; there is no simple statewide rule that every repair must be finished in 30 days. Texas law has a rebuttable seven-day presumption of reasonable repair time in applicable circumstances after proper notice, not a hard deadline for every situation. Florida repair and notice requirements also vary. A day counter helps organize the timeline, not decide whether a landlord complied.</p>
      <h3>Rent changes: calculate the percentage, then check coverage</h3>
      <p>To understand a proposed rent change, write down the current monthly rent, the proposed amount, the effective date, and the lease type. The percentage change is the difference divided by the current rent. That arithmetic is only the first step. State law, local rent stabilization, notice periods, fixed-term lease provisions, and exemptions can all affect what may happen next.</p>
      <p>California’s AB 1482 generally caps covered units at 5% plus applicable CPI, up to 10%, while local limits may be lower. Coverage and exemptions matter, the aggregate increase during a 12-month period matters, and notice rules still apply. The regional California schedule shown in the tool is tied to its stated effective dates. Do not treat a percentage result as a final ruling: verify your city, building, exemption status, and all increases in the relevant period.</p>
      <h3>HOA costs: look beyond the monthly line</h3>
      <p>For renters in association-governed properties and prospective buyers comparing homes, dues can fund shared water, trash, landscaping, insurance, amenities, reserves, and administration. Check what the stated fee includes, how often it is billed, whether assessments are pending, and what the governing documents say about changes. A monthly figure becomes more concrete when viewed annually, but a simple benchmark is not a national average or a measure of value. The calculator’s amenity graphic is deliberately illustrative: it equally divides the selected services because actual spending data is not supplied.</p>
      <h3>Moving day is a recordkeeping project</h3>
      <p>Before handing over keys, photograph each room, appliances, floors, walls, and any existing issue. Keep proof of cleaning or repair work you paid for, return keys as instructed, and request a final inspection if your jurisdiction or lease provides one. Confirm the date and method of surrender. Afterward, route messages through a durable written channel and keep a copy outside a single email account. A short timeline—with dates for notice, inspection, forwarding address, claim, and response—can make an otherwise confusing dispute easier to understand.</p>
      <h3>Local variation is not a footnote</h3>
      <p>Statewide statutes are a starting point, not the entire map. Cities and counties may have rent stabilization, registration requirements, additional notice rules, or tenant protections that change the analysis. Federal protections may apply in particular circumstances. A rule can also depend on when a lease began, when a deposit was received, whether a property is exempt, or whether the renter is a service member. When a tool flags a general rule, follow the official source and seek local help if the answer affects a deadline or significant amount of money.</p>
      <p>Use these calculators to make the facts visible: enter dates carefully, check every amount, and save or print the result for your own records. The editable letter templates are a starting point for a clear, respectful message. Replace every bracketed placeholder, attach relevant documentation, and adapt the language to the facts. No template guarantees a response or a legal outcome.</p>
</article><aside className="side-box"><h3>Quick tools</h3>{tools.map(t => <Link href={`/${t.slug}`} key={t.slug}>{t.shortTitle}</Link>)}</aside></div>
<section className="section" style={{ paddingTop: 0 }}><div className="container"><SourceList /></div></section>
<div style={{padding: '20px', background: '#f5f5f5', marginTop: '30px', borderRadius: '8px', border: '2px solid #0070f3'}}>
<h3>📚 Latest Guides</h3>
<a href="/security-deposit-laws-by-state-2026.html" style={{color: '#0070f3', fontWeight: 'bold'}}>
Security Deposit Laws by State 2026 - Complete Guide
</a>
</div>
<FAQSection faqs={homeFaqs} />
  </SiteLayout>;
   }
