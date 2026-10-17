import { useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { tools } from "../lib/tools";

export function Header() {
  return <header className="topbar"><div className="topbar-inner">
    <Link href="/" className="brand" aria-label="USADepositCalculator.com home"><span className="brand-mark">US</span><span>USADepositCalculator<span style={{ color: "#2563eb" }}>.com</span></span></Link>
    <nav className="nav-links" aria-label="Main navigation"><Link href="/#calculators">Calculators</Link><Link href="/#tenant-guide">Tenant guide</Link><Link href="/#sources">Legal sources</Link><Link href="/security-deposit-return-calculator" className="btn small">Start a calculation</Link></nav>
  </div></header>;
}

export function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-top"><div><div className="footer-brand">USADepositCalculator.com</div><p>A plain-English toolkit for comparing your lease facts with selected state-law frameworks. Calculations are educational estimates, not legal advice.</p></div>
      <nav className="footer-links" aria-label="Footer calculators">{tools.map(t => <Link key={t.slug} href={`/${t.slug}`}>{t.shortTitle}</Link>)}</nav></div>
    <div className="footer-bottom"><span>Information is general and may change. Confirm current law and local rules.</span><span>© 2026 USADepositCalculator.com</span></div>
  </div></footer>;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return <div className="site-shell"><Header /><main className="page-main">{children}</main><Footer /></div>;
}

export function FAQSection({ faqs, title = "Frequently asked questions" }: { faqs: { question: string; answer: string }[]; title?: string }) {
  return <section className="section" aria-labelledby="faq-heading"><div className="container"><div className="section-head"><div><p className="eyebrow">Clear answers, not legal advice</p><h2 id="faq-heading">{title}</h2></div></div><div className="faq-list">{faqs.map((faq, i) => <article className="faq-item" key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}</div></div></section>;
}

export function SourceList() {
  return <div className="sources" id="sources"><p className="eyebrow">Primary references</p><h2 style={{ margin: "0 0 12px", color: "#17365f", fontSize: 22 }}>Official sources to check</h2><ul>{tools.length > 0 && [
    ["California Civil Code §1950.5 — deposits", "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5"],
    ["California Courts — security deposits", "https://selfhelp.courts.ca.gov/guide-security-deposits-california"],
    ["Texas Property Code, Chapter 92", "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm"],
    ["Florida Statute §83.49", "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0083/Sections/0083.49.html"],
    ["California DOJ — rent caps and current schedule", "https://oag.ca.gov/rentcaps"],
    ["California Civil Code §1947.12 — rent cap", "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=1947.12.&lawCode=CIV"],
    ["California Civil Code §1941.1 — habitability", "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1941.1"]
  ].map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer">{label}</a></li>)}</ul><p style={{ fontSize: 12, color: "#728198", margin: 0 }}>Official materials are linked for convenience. Laws, local ordinances, and facts can change; read the source that applies to your situation.</p></div>;
}

export function SeoHead({ title, description, faqs }: { title: string; description: string; faqs: { question: string; answer: string }[] }) {
  useEffect(() => {
    document.title = title;
    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); property ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("description", description);
    setMeta("og:title", title, true); setMeta("og:description", description, true); setMeta("og:type", "website", true);
    const pageUrl = new URL(window.location.pathname, window.location.origin).href;
    setMeta("og:url", pageUrl, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = pageUrl;
    let script = document.getElementById("faq-jsonld") as HTMLScriptElement | null;
    if (!script) { script = document.createElement("script"); script.id = "faq-jsonld"; script.type = "application/ld+json"; document.head.appendChild(script); }
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) });
    return () => { script?.remove(); };
  }, [title, description, faqs]);
  return null;
}
