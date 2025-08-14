import React, { useMemo, useState } from "react";
import {
  Sparkles,
  Handshake,
  Building2,
  UserCircle2,
  Settings,
  Loader2,
  ShieldCheck,
  FileText,
  CheckCircle2,
  CircleDot,
  Circle,
  ChevronRight,
  ChevronLeft,
  X,
  Upload,
  Filter,
  Search,
  Star,
  BadgeCheck,
  MessageSquare,
  Calendar,
  Plus,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// \n// Caprae DealMatch — Single-file React UI demo for the assignment\n// - Tech: React + Tailwind + Framer Motion + Lucide icons\n// - Focus: approachable design language, intuitive flows, AI assists\n// - Sections: Onboarding (buyer/seller), Marketplace (buyer cards), Matches, Deal Room, Profile, Settings\n// - Notes: All data is mocked; upload/AI actions are simulated for demo.\n// \n
// ---------- Shared UI Primitives ----------
const Pill = ({ children, tone = "slate" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-${tone}-100 text-${tone}-700`}
  >
    {children}
  </span>
);

const Tag = ({ children }) => (
  <span className="inline-flex items-center rounded-xl bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
    {children}
  </span>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 text-xs shadow-sm ring-1 ring-slate-200">
    {children}
  </span>
);

const SectionCard = ({ title, icon: Icon, action, children }) => (
  <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="rounded-2xl bg-violet-50 p-2 text-violet-600">
            <Icon size={18} />
          </span>
        )}
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const StepDot = ({ active, done }) => (
  <div
    className={`h-2 w-2 rounded-full ${
      done ? "bg-emerald-500" : active ? "bg-violet-500" : "bg-slate-300"
    }`}
  />
);

const PrimaryButton = ({ children, onClick, icon: Icon, className = "" }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 active:translate-y-px ${className}`}
  >
    {Icon && <Icon size={16} />}
    {children}
  </button>
);

const GhostButton = ({ children, onClick, className = "", icon: Icon }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 ${className}`}
  >
    {Icon && <Icon size={16} />}
    {children}
  </button>
);

// ---------- Mock Data ----------
const MOCK_BUYERS = [
  {
    id: "b1",
    name: "Crescent Ridge Partners",
    type: "Strategic Buyer",
    avatarHue: "bg-violet-100 text-violet-700",
    badges: ["SaaS", "Fintech", "AI"],
    checkSize: "$25M - $80M",
    dryPowder: "$120M",
    geography: ["US", "EU"],
    timeline: "3-6 months",
    credibility: 92,
    responseRate: 98,
    preference: "B2B recurring revenue $5–20M ARR",
    notes: "Hands-on post-merger integration team.",
  },
  {
    id: "b2",
    name: "Harbor Peak Holdings",
    type: "Private Equity",
    avatarHue: "bg-teal-100 text-teal-700",
    badges: ["Healthcare", "Services"],
    checkSize: "$5M - $25M",
    dryPowder: "$60M",
    geography: ["US"],
    timeline: "< 90 days",
    credibility: 87,
    responseRate: 91,
    preference: "EBITDA-positive clinics roll-up",
    notes: "Flexible earn-outs; operator network.",
  },
  {
    id: "b3",
    name: "Northbeam Operators Guild",
    type: "Search Fund",
    avatarHue: "bg-amber-100 text-amber-800",
    badges: ["Logistics", "Manufacturing"],
    checkSize: "$1M - $8M",
    dryPowder: "$12M",
    geography: ["US", "CA"],
    timeline: "6-9 months",
    credibility: 78,
    responseRate: 88,
    preference: "Profitable niche B2B services",
    notes: "Industry mentors available.",
  },
];

const DEAL_STEPS = [
  { key: "intro", label: "Intro & NDA" },
  { key: "dataroom", label: "Data Room" },
  { key: "qa", label: "Q&A" },
  { key: "loi", label: "LOI Draft" },
  { key: "dd", label: "Due Diligence" },
  { key: "terms", label: "Terms & Valuation" },
  { key: "financing", label: "Financing" },
  { key: "definitive", label: "Definitive Docs" },
  { key: "closing", label: "Closing & Transition" },
];

// ---------- Theming ----------
const AppShell = ({ children, active, setActive }) => (
  <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-teal-50">
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm">
            <Handshake size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-800">Caprae DealMatch</h1>
              <Pill tone="violet">
                <Sparkles size={14} /> AI-assisted
              </Pill>
            </div>
            <p className="text-xs text-slate-500">An approachable marketplace for acquisitions</p>
          </div>
        </div>
        <nav className="hidden gap-1 md:flex">
          {[
            { key: "onboarding", label: "Onboarding" },
            { key: "marketplace", label: "Marketplace" },
            { key: "matches", label: "Matches" },
            { key: "deal", label: "Deal Room" },
            { key: "profile", label: "Profile" },
            { key: "settings", label: "Settings" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                active === t.key
                  ? "bg-violet-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <GhostButton icon={Search}>Search</GhostButton>
          <GhostButton icon={Filter}>Filters</GhostButton>
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-5 py-6">{children}</main>
    <footer className="mx-auto max-w-7xl px-5 py-8 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} Caprae Capital — DealMatch UI
    </footer>
  </div>
);

// ---------- Onboarding ----------
const BuyerOnboarding = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    orgName: "",
    type: "Strategic Buyer",
    geos: [],
    sectors: [],
    checkMin: 5,
    checkMax: 50,
    timeline: "3-6 months",
    proofFunds: false,
    aiAssist: true,
  });
  const steps = [
    {
      title: "About your firm",
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Organization name" placeholder="Acme Holdings" value={form.orgName} onChange={(v)=>setForm({...form, orgName:v})} />
          <Select label="Buyer type" value={form.type} onChange={(v)=>setForm({...form, type:v})} options={["Strategic Buyer","Private Equity","Family Office","Search Fund","Individual"]} />
          <MultiSelect label="Preferred geographies" value={form.geos} onChange={(v)=>setForm({...form, geos:v})} options={["US","EU","UK","CA","APAC","MENA"]} />
          <MultiSelect label="Sectors of interest" value={form.sectors} onChange={(v)=>setForm({...form, sectors:v})} options={["SaaS","Fintech","Healthcare","Manufacturing","Logistics","Services"]} />
        </div>
      )
    },
    {
      title: "Investment parameters",
      content: (
        <div className="grid gap-4 md:grid-cols-3">
          <Number label="Min check ($M)" value={form.checkMin} onChange={(v)=>setForm({...form, checkMin:v})} />
          <Number label="Max check ($M)" value={form.checkMax} onChange={(v)=>setForm({...form, checkMax:v})} />
          <Select label="Target timeline" value={form.timeline} onChange={(v)=>setForm({...form, timeline:v})} options={["< 90 days","3-6 months","6-9 months"]} />
          <Toggle label="Willing to share proof of funds (secure)" checked={form.proofFunds} onChange={(v)=>setForm({...form, proofFunds:v})} />
          <Toggle label="Enable AI assistance (auto-draft LOI, summarize docs)" checked={form.aiAssist} onChange={(v)=>setForm({...form, aiAssist:v})} />
        </div>
      )
    },
    {
      title: "Review",
      content: (
        <div className="space-y-3 text-sm">
          <SummaryRow k="Organization" v={form.orgName || "—"} />
          <SummaryRow k="Buyer type" v={form.type} />
          <SummaryRow k="Geographies" v={form.geos.join(", ") || "—"} />
          <SummaryRow k="Sectors" v={form.sectors.join(", ") || "—"} />
          <SummaryRow k="Check size" v={`$${form.checkMin}M - $${form.checkMax}M`} />
          <SummaryRow k="Timeline" v={form.timeline} />
          <SummaryRow k="Proof of funds" v={form.proofFunds?"Yes":"No"} />
          <SummaryRow k="AI assistance" v={form.aiAssist?"Enabled":"Disabled"} />
        </div>
      )
    }
  ];

  return (
    <SectionCard title="Buyer Onboarding" icon={Building2} action={<Stepper index={step} total={steps.length} /> }>
      <div className="space-y-6">
        <h4 className="text-base font-semibold text-slate-700">{steps[step].title}</h4>
        {steps[step].content}
        <div className="flex items-center justify-between">
          <GhostButton icon={ChevronLeft} onClick={()=>setStep(Math.max(0, step-1))}>Back</GhostButton>
          {step < steps.length-1 ? (
            <PrimaryButton icon={ChevronRight} onClick={()=>setStep(step+1)}>Continue</PrimaryButton>
          ) : (
            <PrimaryButton icon={BadgeCheck}>Complete onboarding</PrimaryButton>
          )}
        </div>
      </div>
    </SectionCard>
  );
};

const SellerOnboarding = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    company: "",
    sector: "SaaS",
    geo: "US",
    revenue: 8,
    ebitda: 2,
    confidentiality: true,
    dataRoomReady: false,
    aiRedact: true,
  });
  const steps = [
    {
      title: "About your company",
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Company name" placeholder="BrightLedger" value={form.company} onChange={(v)=>setForm({...form, company:v})} />
          <Select label="Sector" value={form.sector} onChange={(v)=>setForm({...form, sector:v})} options={["SaaS","Fintech","Healthcare","Manufacturing","Logistics","Services"]} />
          <Select label="Geography" value={form.geo} onChange={(v)=>setForm({...form, geo:v})} options={["US","EU","UK","CA","APAC","MENA"]} />
        </div>
      )
    },
    {
      title: "Financial snapshot (confidential)",
      content: (
        <div className="grid gap-4 md:grid-cols-3">
          <Number label="ARR ($M)" value={form.revenue} onChange={(v)=>setForm({...form, revenue:v})} />
          <Number label="EBITDA ($M)" value={form.ebitda} onChange={(v)=>setForm({...form, ebitda:v})} />
          <Toggle label="Keep identity confidential" checked={form.confidentiality} onChange={(v)=>setForm({...form, confidentiality:v})} />
          <Toggle label="Data room prepared" checked={form.dataRoomReady} onChange={(v)=>setForm({...form, dataRoomReady:v})} />
          <Toggle label="Use AI to auto-redact sensitive info" checked={form.aiRedact} onChange={(v)=>setForm({...form, aiRedact:v})} />
        </div>
      )
    },
    {
      title: "Review",
      content: (
        <div className="space-y-3 text-sm">
          <SummaryRow k="Company" v={form.company || "—"} />
          <SummaryRow k="Sector" v={form.sector} />
          <SummaryRow k="Geography" v={form.geo} />
          <SummaryRow k="ARR" v={`$${form.revenue}M`} />
          <SummaryRow k="EBITDA" v={`$${form.ebitda}M`} />
          <SummaryRow k="Confidential identity" v={form.confidentiality?"Yes":"No"} />
          <SummaryRow k="Data room ready" v={form.dataRoomReady?"Yes":"No"} />
          <SummaryRow k="AI redaction" v={form.aiRedact?"Enabled":"Disabled"} />
        </div>
      )
    }
  ];

  return (
    <SectionCard title="Seller Onboarding" icon={UserCircle2} action={<Stepper index={step} total={steps.length} /> }>
      <div className="space-y-6">
        <h4 className="text-base font-semibold text-slate-700">{steps[step].title}</h4>
        {steps[step].content}
        <div className="flex items-center justify-between">
          <GhostButton icon={ChevronLeft} onClick={()=>setStep(Math.max(0, step-1))}>Back</GhostButton>
          {step < steps.length-1 ? (
            <PrimaryButton icon={ChevronRight} onClick={()=>setStep(step+1)}>Continue</PrimaryButton>
          ) : (
            <PrimaryButton icon={BadgeCheck}>Complete onboarding</PrimaryButton>
          )}
        </div>
      </div>
    </SectionCard>
  );
};

const Onboarding = () => {
  const [mode, setMode] = useState("seller");
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-gradient-to-br from-violet-100 via-white to-teal-100 p-6 ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-800">Onboarding</h2>
            <Pill tone="teal">Approachable ✨</Pill>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white p-1 ring-1 ring-slate-200">
            <button onClick={()=>setMode("buyer")} className={`rounded-2xl px-3 py-1.5 text-sm ${mode==='buyer' ? 'bg-violet-600 text-white':'text-slate-700 hover:bg-slate-100'}`}>Buyer</button>
            <button onClick={()=>setMode("seller")} className={`rounded-2xl px-3 py-1.5 text-sm ${mode==='seller' ? 'bg-violet-600 text-white':'text-slate-700 hover:bg-slate-100'}`}>Seller</button>
          </div>
        </div>
        <p className="mb-4 text-sm text-slate-600">We ask only what’s essential, keeping the flow light and encouraging with clear progress and AI assists.</p>
        <ul className="grid gap-2 text-sm text-slate-600">
          <li className="flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={16}/> Short multi-step forms</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={16}/> Privacy-first: optional confidentiality & redaction</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={16}/> AI guidance: draft LOIs, summarize docs, detect blockers</li>
        </ul>
      </div>
      <div className="space-y-6">
        {mode === "buyer" ? <BuyerOnboarding/> : <SellerOnboarding/>}
      </div>
    </div>
  );
};

// ---------- Marketplace (Seller views buyers & can initiate contact) ----------
const BuyerCard = ({ buyer, onView, onAccept, onReject }) => (
  <motion.div layout className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
    <div className="mb-3 flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${buyer.avatarHue}`}>{buyer.name.slice(0,2)}</div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-800">{buyer.name}</h4>
            <Tag>{buyer.type}</Tag>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {buyer.badges.map((b) => (
              <Chip key={b}>{b}</Chip>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <GhostButton onClick={onReject}>Reject</GhostButton>
        <PrimaryButton onClick={onAccept} icon={Handshake}>Match</PrimaryButton>
      </div>
    </div>
    <div className="grid gap-3 text-sm md:grid-cols-3">
      <SummaryRow k="Check size" v={buyer.checkSize} />
      <SummaryRow k="Dry powder" v={buyer.dryPowder} />
      <SummaryRow k="Geography" v={buyer.geography.join(", ")} />
      <SummaryRow k="Timeline" v={buyer.timeline} />
      <SummaryRow k="Credibility" v={<Credibility score={buyer.credibility} />} />
      <SummaryRow k="Response rate" v={`${buyer.responseRate}%`} />
    </div>
    <div className="mt-3 flex items-center justify-between">
      <div className="text-sm text-slate-600 line-clamp-2"><b>Preference:</b> {buyer.preference}</div>
      <GhostButton icon={ExternalLink} onClick={onView}>View profile</GhostButton>
    </div>
  </motion.div>
);

const Credibility = ({ score }) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < Math.round(score / 20) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
      ))}
    </div>
    <span className="text-slate-600">{score}/100</span>
  </div>
);

const Marketplace = ({ onOpenProfile, onCreateMatch }) => {
  const [buyers, setBuyers] = useState(MOCK_BUYERS);
  const accept = (id) => {
    const b = buyers.find((x) => x.id === id);
    onCreateMatch(b);
    setBuyers((prev) => prev.filter((x) => x.id !== id));
  };
  const reject = (id) => setBuyers((prev) => prev.filter((x) => x.id !== id));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Qualified Buyers</h2>
        <div className="flex items-center gap-2">
          <GhostButton icon={Filter}>Refine</GhostButton>
          <GhostButton icon={Search}>Search</GhostButton>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {buyers.map((b) => (
          <BuyerCard
            key={b.id}
            buyer={b}
            onView={() => onOpenProfile(b)}
            onAccept={() => accept(b.id)}
            onReject={() => reject(b.id)}
          />
        ))}
      </div>
      {buyers.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-600">
          No more buyers. Adjust filters to discover more.
        </div>
      )}
    </div>
  );
};

const BuyerProfileModal = ({ buyer, onClose }) => (
  <AnimatePresence>
    {buyer && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm">
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="mx-auto mt-16 w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${buyer.avatarHue}`}>{buyer.name.slice(0,2)}</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{buyer.name}</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Tag>{buyer.type}</Tag>
                  {buyer.badges.map((b) => (
                    <Tag key={b}>{b}</Tag>
                  ))}
                </div>
              </div>
            </div>
            <GhostButton icon={X} onClick={onClose}>Close</GhostButton>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <SectionCard title="Snapshot" icon={BadgeCheck}>
              <div className="space-y-2 text-sm">
                <SummaryRow k="Check size" v={buyer.checkSize} />
                <SummaryRow k="Dry powder" v={buyer.dryPowder} />
                <SummaryRow k="Geography" v={buyer.geography.join(", ")} />
                <SummaryRow k="Timeline" v={buyer.timeline} />
                <SummaryRow k="Credibility" v={<Credibility score={buyer.credibility} />} />
                <SummaryRow k="Response rate" v={`${buyer.responseRate}%`} />
              </div>
            </SectionCard>
            <SectionCard title="Fit notes" icon={FileText}>
              <p className="text-sm text-slate-600">{buyer.notes}</p>
              <div className="mt-3">
                <PrimaryButton className="w-full" icon={Handshake}>Request intro</PrimaryButton>
              </div>
            </SectionCard>
            <SectionCard title="Signals" icon={ShieldCheck}>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Verified track record</li>
                <li>• NDA turnaround: fast</li>
                <li>• Operator bench available</li>
              </ul>
            </SectionCard>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ---------- Matches & Deal Room ----------
const DealProgress = ({ activeIndex }) => (
  <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
    {DEAL_STEPS.map((s, idx) => (
      <div key={s.key} className="flex items-center gap-2">
        <StepDot done={idx < activeIndex} active={idx === activeIndex} />
        <span className={`text-xs ${idx === activeIndex ? 'font-semibold text-violet-700':'text-slate-600'}`}>{s.label}</span>
        {idx !== DEAL_STEPS.length - 1 && <ChevronRight className="text-slate-300" size={14} />}
      </div>
    ))}
  </div>
);

const BlockersPanel = ({ blockers }) => (
  <SectionCard title="Detected Blockers (AI)" icon={Sparkles}>
    {blockers.length === 0 ? (
      <div className="text-sm text-emerald-700">No blockers detected. Great job keeping momentum!</div>
    ) : (
      <ul className="space-y-2 text-sm">
        {blockers.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <CircleDot className="mt-0.5 text-amber-500" size={16} />
            <div>
              <p className="font-medium text-slate-800">{b.title}</p>
              <p className="text-slate-600">{b.detail}</p>
              <div className="mt-1 flex gap-2">
                <PrimaryButton className="!bg-emerald-600 hover:!bg-emerald-700" icon={CheckCircle2}>Resolve</PrimaryButton>
                <GhostButton icon={MessageSquare}>Ask AI</GhostButton>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </SectionCard>
);

const AiDocAnalyzer = () => {
  const [state, setState] = useState({ uploading: false, analyzed: false, summary: "" });
  const upload = () => {
    setState({ uploading: true, analyzed: false, summary: "" });
    setTimeout(() => setState({ uploading: false, analyzed: true, summary: "Key revenue drivers are concentrated in 3 enterprise clients; churn low (2.1%); gross margin 78%; anomalies flagged in Q2 deferred revenue schedule." }), 1000);
  };
  return (
    <SectionCard title="AI Financial Document Analyzer" icon={FileText} action={<GhostButton icon={Upload} onClick={upload}>Upload & Analyze</GhostButton>}>
      <div className="text-sm text-slate-600">
        {state.uploading && (
          <div className="flex items-center gap-2 text-violet-700"><Loader2 className="animate-spin" size={16}/>Analyzing…</div>
        )}
        {!state.uploading && !state.analyzed && (
          <p>Drop trial balances, P&L, bank statements, contracts. We auto-extract, summarize risks, and surface questions for both sides.</p>
        )}
        {state.analyzed && (
          <div className="space-y-3">
            <p className="text-slate-700">{state.summary}</p>
            <div className="rounded-2xl bg-slate-50 p-3 text-slate-700 ring-1 ring-slate-200">
              <b>Suggested diligence questions:</b>
              <ul className="ml-5 list-disc">
                <li>Contract renewal probabilities for top 3 accounts?</li>
                <li>Deferred revenue recognition policy details?</li>
                <li>Customer concentration mitigation plan?</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <PrimaryButton icon={FileText}>Export summary</PrimaryButton>
              <GhostButton icon={MessageSquare}>Ask follow-up</GhostButton>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

const TemplatesPanel = () => (
  <SectionCard title="Smart Templates" icon={Sparkles}>
    <div className="grid gap-3 md:grid-cols-2">
      <TemplateItem title="Auto-draft NDA" subtitle="Fill parties & term; e-sign ready" />
      <TemplateItem title="Auto-draft LOI" subtitle="AI pre-fills valuation range & key terms" />
      <TemplateItem title="Q&A Matrix" subtitle="Route questions to the right owner" />
      <TemplateItem title="Closing Checklist" subtitle="Dynamic based on deal structure" />
    </div>
  </SectionCard>
);

const TemplateItem = ({ title, subtitle }) => (
  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
    <div>
      <p className="font-medium text-slate-800">{title}</p>
      <p className="text-sm text-slate-600">{subtitle}</p>
    </div>
    <PrimaryButton icon={Plus}>Create</PrimaryButton>
  </div>
);

const PartyTasks = ({ who, items }) => (
  <SectionCard title={`${who} Tasks`} icon={CheckCircle2}>
    <ul className="space-y-2 text-sm">
      {items.map((t, i) => (
        <li key={i} className="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-slate-200">
          <div className="flex items-center gap-2">
            {t.done ? <CheckCircle2 className="text-emerald-500" size={18}/> : <Circle className="text-slate-300" size={18}/>} 
            <span className={`text-slate-700 ${t.done ? 'line-through':''}`}>{t.title}</span>
          </div>
          <Tag>{t.owner}</Tag>
        </li>
      ))}
    </ul>
  </SectionCard>
);

const Timeline = () => (
  <SectionCard title="Deal Timeline" icon={Calendar}>
    <ul className="space-y-3 text-sm">
      <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 text-emerald-500" size={16}/> NDA executed — both parties</li>
      <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 text-emerald-500" size={16}/> Data room opened</li>
      <li className="flex items-start gap-2"><CircleDot className="mt-0.5 text-violet-500" size={16}/> Q&A ongoing (12 threads)</li>
      <li className="flex items-start gap-2"><Circle className="mt-0.5 text-slate-400" size={16}/> LOI draft pending</li>
    </ul>
  </SectionCard>
);

const Matches = ({ matches, openDeal }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-slate-800">Matches</h2>
    <div className="grid gap-4 md:grid-cols-2">
      {matches.map((m) => (
        <div key={m.id} className="flex items-center justify-between rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-800">{m.buyer.name}</h4>
              <Tag>with Seller: BrightLedger</Tag>
            </div>
            <p className="text-sm text-slate-600">Stage: {m.stageLabel}</p>
          </div>
          <PrimaryButton onClick={() => openDeal(m)} icon={Handshake}>Open Deal</PrimaryButton>
        </div>
      ))}
    </div>
  </div>
);

const DealRoom = ({ match }) => {
  const [activeIndex, setActiveIndex] = useState(2); // example: at Q&A
  const blockers = [
    { title: "Outstanding NDA from buyer legal", detail: "2 days overdue. Suggest escalation or reminder." },
    { title: "Missing bank recs for Q2", detail: "Required for financial diligence pack." },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Deal Room — {match?.buyer?.name || "Active Match"}</h2>
          <p className="text-sm text-slate-600">A guided, low-friction workspace to maximize completion.</p>
        </div>
        <DealProgress activeIndex={activeIndex} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <AiDocAnalyzer />
          <TemplatesPanel />
          <SectionCard title="Q&A Workspace" icon={MessageSquare}>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">Buyer: Please clarify revenue recognition for multi-year contracts.</div>
              <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">Seller: We recognize ratably; policy attached. <Tag>Policy.pdf</Tag></div>
              <div className="flex gap-2">
                <GhostButton icon={MessageSquare}>Suggest answer (AI)</GhostButton>
                <PrimaryButton icon={Upload}>Attach</PrimaryButton>
              </div>
            </div>
          </SectionCard>
        </div>
        <div className="space-y-5">
          <BlockersPanel blockers={blockers} />
          <PartyTasks who="Seller" items={[{ title: "Upload bank recs Q2", owner: "Finance", done: false }, { title: "Share churn cohort", owner: "Ops", done: false }, { title: "Countersign NDA", owner: "Legal", done: true }]} />
          <PartyTasks who="Buyer" items={[{ title: "Submit diligence questions", owner: "Deal team", done: true }, { title: "Provide funding letter", owner: "Sponsor", done: false }]} />
          <Timeline />
        </div>
      </div>
    </div>
  );
};

// ---------- Profile & Settings (stubs) ----------
const Profile = () => (
  <div className="grid gap-5 md:grid-cols-3">
    <SectionCard title="Your Profile" icon={UserCircle2}>
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">ST</div>
        <div>
          <p className="font-semibold text-slate-800">Shubhanshu Tiwari</p>
          <p className="text-sm text-slate-600">Frontend Developer</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <Tag>React</Tag><Tag>Tailwind CSS</Tag><Tag>JavaScript</Tag><Tag>JAVA</Tag><Tag>Mysql</Tag>
      </div>
    </SectionCard>
    <SectionCard title="Organization" icon={Building2}>
      <div className="space-y-2 text-sm">
        <SummaryRow k="Company" v="BrightLedger" />
        <SummaryRow k="Sector" v="SaaS" />
        <SummaryRow k="Location" v="Madhya Pradesh, IN" />
      </div>
    </SectionCard>
    <SectionCard title="Verifications" icon={ShieldCheck}>
      <div className="flex items-center gap-2 text-sm">
        <BadgeCheck className="text-emerald-500" size={18}/> Email verified
      </div>
      <div className="flex items-center gap-2 text-sm">
        <BadgeCheck className="text-emerald-500" size={18}/> Identity verified
      </div>
      <div className="flex items-center gap-2 text-sm">
        <CircleDot className="text-amber-500" size={18}/> Proof of funds pending
      </div>
    </SectionCard>
  </div>
);

const SettingsPanel = () => (
  <div className="grid gap-5 md:grid-cols-2">
    <SectionCard title="Privacy & Visibility" icon={ShieldCheck}>
      <Toggle label="Hide company name from buyers" checked />
      <Toggle label="Enable anonymized messaging" />
      <Toggle label="Allow intro requests only from verified buyers" checked />
    </SectionCard>
    <SectionCard title="Notifications" icon={Settings}>
      <Toggle label="Email notifications" checked />
      <Toggle label="In-app reminders" checked />
      <Toggle label="Weekly digest" />
    </SectionCard>
  </div>
);

// ---------- Small Inputs ----------
const Label = ({ children }) => (
  <label className="mb-1 block text-sm font-medium text-slate-700">{children}</label>
);

const Input = ({ label, value, onChange, placeholder }) => (
  <div>
    <Label>{label}</Label>
    <input value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-violet-400" />
  </div>
);

const Number = ({ label, value, onChange }) => (
  <div>
    <Label>{label}</Label>
    <input type="number" value={value} onChange={(e)=>onChange(Number(e.target.value))} className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-violet-400" />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <Label>{label}</Label>
    <select value={value} onChange={(e)=>onChange(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-violet-400">
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const MultiSelect = ({ label, value = [], onChange, options }) => {
  const toggle = (o) => {
    onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  };
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" onClick={()=>toggle(o)} className={`rounded-2xl px-3 py-1.5 text-sm ring-1 ${value.includes(o) ? 'bg-violet-600 text-white ring-violet-600' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'}`}>{o}</button>
        ))}
      </div>
    </div>
  );
};

const Toggle = ({ label, checked = false, onChange = () => {} }) => (
  <div className="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-slate-200">
    <span className="text-sm text-slate-700">{label}</span>
    <button onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? 'bg-violet-600' : 'bg-slate-300'}`}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  </div>
);

const SummaryRow = ({ k, v }) => (
  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
    <span className="text-slate-500">{k}</span>
    <span className="font-medium text-slate-800">{v}</span>
  </div>
);

const Stepper = ({ index, total }) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`h-2 w-8 rounded-full ${i <= index ? 'bg-violet-600' : 'bg-slate-200'}`} />
    ))}
  </div>
);

// ---------- Root ----------
export default function App() {
  const [active, setActive] = useState("onboarding");
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [deal, setDeal] = useState(null);

  const createMatch = (buyer) => {
    const stageLabel = DEAL_STEPS[0].label;
    const m = { id: `${buyer.id}-match`, buyer, stageLabel };
    setMatches((prev) => [m, ...prev]);
    setActive("matches");
  };

  return (
    <AppShell active={active} setActive={setActive}>
      {active === "onboarding" && <Onboarding />}
      {active === "marketplace" && (
        <Marketplace onOpenProfile={(b)=>setBuyerProfile(b)} onCreateMatch={createMatch} />
      )}
      {active === "matches" && (
        <Matches matches={matches} openDeal={(m)=>{ setDeal(m); setActive('deal'); }} />
      )}
      {active === "deal" && <DealRoom match={deal} />}
      {active === "profile" && <Profile />}
      {active === "settings" && <SettingsPanel />}

      <BuyerProfileModal buyer={buyerProfile} onClose={()=>setBuyerProfile(null)} />
    </AppShell>
  );
}
