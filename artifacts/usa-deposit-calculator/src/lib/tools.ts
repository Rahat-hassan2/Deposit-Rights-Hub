export type ToolInfo = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  faqs: { question: string; answer: string }[];
};

export const tools: ToolInfo[] = [
  { slug: "security-deposit-return-calculator", title: "Security deposit return calculator", shortTitle: "Deposit return", eyebrow: "Move-out finances", description: "Estimate a deposit balance after documented charges and review the deadline framework for your state.", faqs: [
    { question: "Can a landlord deduct normal wear and tear?", answer: "Generally, a security deposit is not a fund for ordinary wear from normal use. The exact rules and examples vary by state; keep move-in and move-out photos and request an itemized explanation." },
    { question: "When is a deposit due back?", answer: "The deadline depends on state law. California generally requires return of the balance and itemization within 21 days after vacancy; Texas generally uses 30 days after surrender, subject to the forwarding-address rule; Florida has separate 15-day return and 30-day claim-notice rules." },
    { question: "Does this estimate decide whether a deduction is legal?", answer: "No. This tool adds the amounts you enter and gives general state context. Whether an individual charge is allowed depends on facts, the lease, evidence, and applicable law." }
  ] },
  { slug: "texas-deduction-calculator", title: "Texas security deposit deduction calculator", shortTitle: "Texas deductions", eyebrow: "Texas renters", description: "Compare a Texas deposit with unpaid rent and damage amounts, while keeping ordinary wear separate.", faqs: [
    { question: "When should a Texas deposit be refunded?", answer: "Texas Property Code §92.103 generally requires refund by the 30th day after surrender, subject to the tenant providing a forwarding address under §92.107." },
    { question: "Can normal wear and tear be deducted?", answer: "No. Section 92.104 excludes normal wear and tear. Faded paint and minor carpet wear are common examples, though the facts matter." },
    { question: "Can any landlord charge be deducted?", answer: "No. Deductions should be amounts for which the tenant is legally liable; this calculator does not determine liability or validate a charge." }
  ] },
  { slug: "california-deposit-limit-checker", title: "California security deposit limit checker", shortTitle: "California deposit limit", eyebrow: "California renters", description: "Check a charged deposit against California’s general current cap and carefully scoped small-owner exception.", faqs: [
    { question: "What is California’s general deposit cap?", answer: "For security demanded or received on or after July 1, 2024, the general maximum is one month’s rent regardless of furnished status." },
    { question: "When can a landlord charge up to two months?", answer: "A qualifying natural-person or small-owner landlord may qualify for an exception when they own no more than two rental properties and four units total. The exception does not apply if the prospective tenant is a service member." },
    { question: "Is a potential court remedy automatic?", answer: "No. Any enhanced damages are a potential court remedy, not guaranteed. Earlier deposits may be governed by prior rules, and individual circumstances matter." }
  ] },
  { slug: "hoa-fee-calculator", title: "HOA fee calculator", shortTitle: "HOA fee", eyebrow: "Homeownership costs", description: "See the annual cost of recurring HOA dues and how selected services add up against a simple comparison benchmark.", faqs: [
    { question: "Is $250 a month an official HOA benchmark?", answer: "No. The $250 monthly figure here is a rough comparison reference requested for this tool, not an official U.S. statistic or a statement about a typical fee." },
    { question: "What does the amenity chart show?", answer: "It shows an illustrative equal split of the services you selected. Actual HOA spending by line item was not supplied and may be very different." },
    { question: "Can HOA fees change?", answer: "Association budgets, governing documents, reserves, special assessments, and state law can affect charges. Review current association records before making a decision." }
  ] },
  { slug: "rent-increase-calculator", title: "Rent increase calculator", shortTitle: "Rent increase", eyebrow: "Lease planning", description: "Calculate the percentage change in rent and, for likely covered California rentals, compare with the current regional AB 1482 schedule.", faqs: [
    { question: "How is a rent increase percentage calculated?", answer: "The calculator divides the difference between new and current monthly rent by current rent, then expresses that change as a percentage." },
    { question: "Does California’s statewide cap apply to every rental?", answer: "No. AB 1482 has coverage rules and exemptions, a 12-month aggregate limit, and notice requirements. Local limits may be lower and other increases can affect the result." },
    { question: "What is the current California cap schedule used here?", answer: "For effective dates August 1, 2026 through July 31, 2027, the official California DOJ schedule is 8.7% for Los Angeles/Orange, 8.1% Riverside/San Bernardino, 8.2% San Diego, 8.8% the listed Bay Area counties, and 8.6% other counties." }
  ] },
  { slug: "move-out-cleaning-estimator", title: "Move-out cleaning cost estimator", shortTitle: "Cleaning estimate", eyebrow: "Moving out", description: "Estimate a rough market range for common cleaning sizes and service levels, then compare a proposed charge without making a legality decision.", faqs: [
    { question: "Are the cleaning ranges legal limits?", answer: "No. They are rough market estimates only, not statutory limits, quotes, or a decision about whether a landlord deduction is allowed." },
    { question: "What should I do if cleaning is deducted?", answer: "Compare the move-in and move-out condition, ask for an itemized explanation and receipts where applicable, and check state and local rules." },
    { question: "Does every rental need professional cleaning?", answer: "Not necessarily. Lease terms, actual condition, local law, and the difference between ordinary use and damage all matter." }
  ] },
  { slug: "landlord-repair-time-calculator", title: "Landlord repair time calculator", shortTitle: "Repair timeline", eyebrow: "Safe housing", description: "Count days since written notice and review the state-specific repair framework without inventing a universal deadline.", faqs: [
    { question: "Does California give landlords 30 days to make repairs?", answer: "There is no simple statewide 30-day rule. California uses reasonable-time and habitability standards, with the circumstances and severity of the problem mattering." },
    { question: "Is the Texas seven-day period a hard deadline?", answer: "No. In applicable circumstances after proper notice, Texas Property Code §92.056 provides a rebuttable presumption that seven days is a reasonable time. It is not a universal hard deadline." },
    { question: "What repair deadline applies in Florida?", answer: "Repair and notice rules vary by issue and circumstances. This calculator does not assign a fixed universal statewide countdown for Florida." }
  ] },
  { slug: "florida-deposit-calculator", title: "Florida security deposit calculator", shortTitle: "Florida deposit", eyebrow: "Florida renters", description: "Estimate the balance after entered amounts and review Florida’s distinct return, claim-notice, and tenant-objection timelines.", faqs: [
    { question: "When is a Florida deposit returned if there is no claim?", answer: "Under Florida Statute §83.49, if there is no claim the landlord returns the deposit within 15 days after vacancy." },
    { question: "How long does a landlord have to send a claim notice?", answer: "If claiming against the deposit, the landlord must send written notice of intent within 30 days. The 15-day return period is not a claim deadline." },
    { question: "How long does a tenant have to object?", answer: "A tenant has 15 days after receiving the claim notice to object under §83.49. Keep the notice and proof of its receipt." }
  ] }
];

export const sources = [
  ["California Civil Code §1950.5", "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5"],
  ["California Courts: security deposits", "https://selfhelp.courts.ca.gov/guide-security-deposits-california"],
  ["Texas Property Code, Chapter 92", "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm"],
  ["Florida Statute §83.49", "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0083/Sections/0083.49.html"],
  ["California DOJ rent caps and current schedule", "https://oag.ca.gov/rentcaps"],
  ["California Civil Code §1947.12", "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=1947.12.&lawCode=CIV"],
  ["California Civil Code §1941.1", "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1941.1"]
];

export const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number.isFinite(n) ? n : 0);
