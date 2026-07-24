import React, { useState, useEffect, useRef } from "react";
import {
  Heart, Stethoscope, Upload, MapPin, MessageCircle, Syringe, PawPrint,
  User, Sun, Moon, AlertTriangle, Search, Phone, Navigation, X, Send, Plus,
  Calendar, ChevronRight, Star, Loader2, LogOut, Menu, Camera,
  ShieldCheck, Activity, Dog, Trash2, CheckCircle2, Info
} from "lucide-react";
import { api, setToken, getToken } from "./api.js";

/* ============================== SIGNATURE VITALS DIVIDER ============================== */
function VitalsDivider({ color = "var(--primary)" }) {
  return (
    <svg className="pd-pulse-divider" viewBox="0 0 800 46" preserveAspectRatio="none">
      <path
        d="M0 23 L60 23 L75 6 L90 40 L104 14 L118 32 L132 23 L200 23 Q212 23 216 15 Q220 7 226 15 Q230 21 236 23 L300 23 L315 6 L330 40 L344 14 L358 32 L372 23 L440 23 Q452 23 456 15 Q460 7 466 15 Q470 21 476 23 L540 23 L555 6 L570 40 L584 14 L598 32 L612 23 L680 23 Q692 23 696 15 Q700 7 706 15 Q710 21 716 23 L800 23"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================== HERO ILLUSTRATION ============================== */
function DogHeroArt() {
  return (
    <svg viewBox="0 0 420 340" className="w-full h-auto">
      <ellipse cx="210" cy="300" rx="160" ry="20" fill="var(--surface-2)" />
      <g>
        <path d="M120 190 Q100 120 150 90 Q170 60 210 65 Q250 60 270 90 Q320 120 300 190 Q310 240 260 260 Q210 280 160 260 Q110 240 120 190Z" fill="var(--accent-soft)" stroke="var(--primary)" strokeWidth="3" />
        <path d="M145 100 Q120 60 100 75 Q95 110 130 130Z" fill="var(--accent)" stroke="var(--primary)" strokeWidth="3" />
        <path d="M275 100 Q300 60 320 75 Q325 110 290 130Z" fill="var(--accent)" stroke="var(--primary)" strokeWidth="3" />
        <circle cx="180" cy="165" r="8" fill="var(--primary-deep)" />
        <circle cx="245" cy="165" r="8" fill="var(--primary-deep)" />
        <ellipse cx="212" cy="200" rx="14" ry="10" fill="var(--primary-deep)" />
        <path d="M198 210 Q212 222 226 210" fill="none" stroke="var(--primary-deep)" strokeWidth="3" strokeLinecap="round" />
        <path d="M155 150 Q145 160 152 172" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M270 150 Q280 160 273 172" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g opacity="0.55">
        <circle cx="70" cy="70" r="16" fill="var(--primary)" opacity="0.15" />
        <circle cx="350" cy="60" r="12" fill="var(--accent)" opacity="0.25" />
        <circle cx="360" cy="230" r="18" fill="var(--primary)" opacity="0.12" />
      </g>
    </svg>
  );
}

/* ============================== CONSTANTS / DATA ============================== */
const SYMPTOM_CHIPS = ["vomiting","diarrhea","coughing","limping","excessive scratching","loss of appetite","fever","skin redness","eye infection"];

const DISCLAIMER_TEXT = "AI-generated results are for educational purposes only and should not replace consultation with a licensed veterinarian.";

const EMERGENCY_MESSAGE = "This condition may require immediate veterinary attention. Please contact the nearest veterinary hospital immediately.";

const HEALTH_TIPS = [
  "Fresh water is essential — refill your dog's bowl at least twice a day.",
  "Vaccinate regularly and keep a written record of every dose.",
  "Brush your dog's teeth weekly to prevent dental disease.",
  "Check for ticks after every walk, especially in tall grass.",
  "Keep vaccinations updated — many diseases are preventable, not treatable.",
  "Trim nails every 3-4 weeks to avoid joint strain.",
  "Feed age-appropriate portions — puppies, adults, and seniors need different diets.",
  "Schedule a vet check-up at least once a year, even if your dog seems healthy.",
  "Never give human medication without veterinary guidance — many are toxic to dogs.",
  "Keep your dog's weight in check; extra weight strains joints and the heart."
];

const DISEASE_LIBRARY = {
  "Skin Diseases": [
    { name: "Mange (Sarcoptic/Demodectic)", symptoms: ["Intense itching","Hair loss in patches","Red, crusty skin","Sores from scratching"], causes: ["Sarcoptes or Demodex mites","Weakened immune system","Close contact with infected animals"], prevention: ["Regular parasite prevention","Routine vet checkups","Isolate infected animals"], treatment: ["Prescribed miticidal dips or oral medication","Medicated shampoos","Treating secondary infections"], recovery: "4-8 weeks with treatment", faqs: [{q:"Is mange contagious to humans?", a:"Sarcoptic mange can cause temporary irritation in humans; demodectic mange is not contagious to people."}] },
    { name: "Hot Spots (Acute Moist Dermatitis)", symptoms: ["Red, moist, inflamed patch","Constant licking or chewing","Odor from the area","Hair loss around the spot"], causes: ["Allergies","Trapped moisture in fur","Insect bites","Underlying skin irritation"], prevention: ["Regular grooming and drying after baths/swims","Flea and tick control","Prompt treatment of minor irritations"], treatment: ["Clipping fur around the spot","Antiseptic cleaning","Vet-prescribed topical or oral medication"], recovery: "1-2 weeks", faqs: [{q:"Can I treat a hot spot at home?", a:"Mild cases can be cleaned gently, but recurring or spreading spots need veterinary attention."}] }
  ],
  "Digestive Disorders": [
    { name: "Gastroenteritis", symptoms: ["Vomiting","Diarrhea","Loss of appetite","Lethargy"], causes: ["Dietary indiscretion","Infections","Parasites","Sudden food changes"], prevention: ["Consistent diet","Avoiding table scraps","Regular deworming"], treatment: ["Fasting for a short period (vet-guided)","Bland diet reintroduction","Fluids and medication if needed"], recovery: "2-5 days", faqs: [{q:"When should vomiting be considered an emergency?", a:"If it's persistent, contains blood, or is paired with lethargy and no urination, seek immediate veterinary care."}] },
    { name: "Pancreatitis", symptoms: ["Abdominal pain","Vomiting","Reduced appetite","Hunched posture"], causes: ["High-fat meals","Obesity","Certain medications"], prevention: ["Low-fat, consistent diet","Avoiding fatty table scraps","Weight management"], treatment: ["Hospitalization for severe cases","IV fluids","Prescription low-fat diet"], recovery: "1-2 weeks, longer for chronic cases", faqs: [{q:"Can pancreatitis recur?", a:"Yes, dogs that have had it once are more prone to future episodes, so diet management is important."}] }
  ],
  "Ear Diseases": [
    { name: "Otitis Externa (Ear Infection)", symptoms: ["Head shaking","Scratching at ears","Odor","Redness or discharge"], causes: ["Bacteria or yeast overgrowth","Allergies","Moisture trapped in ear canal"], prevention: ["Regular ear cleaning","Drying ears after swimming","Managing underlying allergies"], treatment: ["Vet-prescribed ear drops","Ear cleaning solution","Treating the root cause"], recovery: "1-3 weeks", faqs: [{q:"Which breeds are more prone to ear infections?", a:"Floppy-eared breeds like Cocker Spaniels and Basset Hounds are more susceptible due to reduced airflow."}] },
    { name: "Ear Mites", symptoms: ["Dark, crumbly discharge","Intense scratching","Head shaking","Odor"], causes: ["Otodectes cynotis mites","Contact with infected animals"], prevention: ["Routine parasite prevention","Regular ear checks"], treatment: ["Topical miticidal medication","Ear cleaning"], recovery: "3-4 weeks", faqs: [{q:"Are ear mites contagious to other pets?", a:"Yes, they spread easily between dogs and cats in the same household."}] }
  ],
  "Eye Diseases": [
    { name: "Conjunctivitis", symptoms: ["Redness","Watery or thick discharge","Squinting","Swelling"], causes: ["Allergies","Bacterial or viral infection","Foreign debris"], prevention: ["Keeping eyes clean","Avoiding irritants like dust or smoke"], treatment: ["Vet-prescribed eye drops or ointment","Gentle cleaning"], recovery: "1-2 weeks", faqs: [{q:"Can I use human eye drops?", a:"No — always use medication specifically prescribed for dogs."}] },
    { name: "Cataracts", symptoms: ["Cloudy or bluish-gray eye lens","Reduced vision","Bumping into objects"], causes: ["Aging","Diabetes","Genetics","Injury"], prevention: ["Managing diabetes well","Regular eye exams"], treatment: ["Surgical removal in advanced cases","Monitoring in early stages"], recovery: "Weeks post-surgery; otherwise a chronic, managed condition", faqs: [{q:"Do all dogs with cataracts go blind?", a:"Not always — it depends on severity and whether both eyes are affected."}] }
  ],
  "Viral Diseases": [
    { name: "Canine Parvovirus", symptoms: ["Severe vomiting","Bloody diarrhea","Lethargy","High fever"], causes: ["Parvovirus, spread through feces-contaminated environments"], prevention: ["Core vaccination series","Avoiding unvaccinated dog areas as a puppy"], treatment: ["Emergency hospitalization","IV fluids","Supportive care"], recovery: "1-2 weeks in hospital for survivors; can be fatal without treatment", faqs: [{q:"Is parvo an emergency?", a:"Yes — it is life-threatening and needs immediate veterinary care."}] },
    { name: "Canine Distemper", symptoms: ["Fever","Coughing","Nasal discharge","Seizures in advanced stages"], causes: ["Distemper virus, airborne and contact transmission"], prevention: ["Core vaccination series","Avoiding contact with infected animals"], treatment: ["Supportive hospital care","No direct cure; managing symptoms"], recovery: "Weeks to months; may have lasting neurological effects", faqs: [{q:"Can vaccinated dogs still get distemper?", a:"It's rare but possible; vaccination greatly reduces risk and severity."}] }
  ],
  "Bacterial Diseases": [
    { name: "Leptospirosis", symptoms: ["Fever","Vomiting","Increased thirst/urination","Jaundice"], causes: ["Leptospira bacteria, often from contaminated water"], prevention: ["Annual vaccination","Avoiding stagnant water"], treatment: ["Antibiotics","Hospitalization for severe cases"], recovery: "2-4 weeks", faqs: [{q:"Can leptospirosis spread to humans?", a:"Yes, it's zoonotic — use gloves when handling a sick dog's urine."}] },
    { name: "Kennel Cough (Bordetella)", symptoms: ["Persistent honking cough","Mild fever","Nasal discharge"], causes: ["Bordetella bacteria or viral co-infections","Close contact in kennels/parks"], prevention: ["Bordetella vaccine","Avoiding crowded dog areas when outbreaks occur"], treatment: ["Rest","Cough suppressants if prescribed","Antibiotics for bacterial cases"], recovery: "1-3 weeks", faqs: [{q:"Is kennel cough serious?", a:"Usually mild, but can become serious in puppies, seniors, or immunocompromised dogs."}] }
  ],
  "Parasitic Diseases": [
    { name: "Heartworm Disease", symptoms: ["Persistent cough","Fatigue after mild activity","Weight loss","Labored breathing"], causes: ["Mosquito-transmitted heartworm larvae"], prevention: ["Monthly heartworm preventives","Annual testing"], treatment: ["Vet-supervised melarsomine treatment protocol","Strict rest during treatment"], recovery: "Months, with strict activity restriction", faqs: [{q:"Can heartworm be cured?", a:"Yes, but treatment is intensive and prevention is far safer and cheaper."}] },
    { name: "Ticks & Tick-borne Illness", symptoms: ["Visible ticks","Lethargy","Joint pain","Fever"], causes: ["Tick bites transmitting bacteria like Lyme or Ehrlichia"], prevention: ["Monthly tick preventives","Checking for ticks after walks"], treatment: ["Tick removal","Antibiotics if infection is confirmed"], recovery: "2-4 weeks if treated early", faqs: [{q:"How do I safely remove a tick?", a:"Use fine-tipped tweezers to grip close to the skin and pull straight out steadily; consult a vet if unsure."}] }
  ],
  "Bone Problems": [
    { name: "Hip Dysplasia", symptoms: ["Difficulty rising","Bunny-hopping gait","Reduced activity","Limping"], causes: ["Genetics","Rapid growth in large breeds","Excess weight"], prevention: ["Healthy growth-rate diet for puppies","Weight management","Breeding screening"], treatment: ["Weight control","Joint supplements","Surgery in severe cases"], recovery: "Chronic, managed long-term; surgical recovery is 6-12 weeks", faqs: [{q:"Which breeds are most at risk?", a:"Large breeds like German Shepherds, Labradors, and Golden Retrievers are commonly affected."}] },
    { name: "Fractures", symptoms: ["Sudden limping or non-weight bearing","Swelling","Visible deformity","Pain when touched"], causes: ["Trauma such as falls or being hit by a vehicle"], prevention: ["Supervision near roads and heights","Secure leashing"], treatment: ["Emergency vet care","Splinting or surgical repair"], recovery: "6-12 weeks depending on severity", faqs: [{q:"Is a suspected fracture an emergency?", a:"Yes — seek immediate veterinary attention and avoid moving the limb unnecessarily."}] }
  ],
  "Dental Problems": [
    { name: "Periodontal Disease", symptoms: ["Bad breath","Red or bleeding gums","Loose teeth","Difficulty eating"], causes: ["Plaque and tartar buildup","Lack of dental care"], prevention: ["Weekly brushing","Dental chews","Annual dental checkups"], treatment: ["Professional dental cleaning","Tooth extraction if needed"], recovery: "Immediate relief post-cleaning; ongoing maintenance required", faqs: [{q:"How often should a dog's teeth be professionally cleaned?", a:"Typically once a year, though it varies by breed and dental health."}] },
    { name: "Broken Tooth", symptoms: ["Visible chip or crack","Pain while chewing","Drooling","Reluctance to eat hard food"], causes: ["Chewing hard objects like bones, rocks, or antlers","Trauma"], prevention: ["Avoiding overly hard chew toys","Supervised chewing"], treatment: ["Dental X-ray and evaluation","Extraction or root canal"], recovery: "1-2 weeks post-procedure", faqs: [{q:"Can a broken tooth be left untreated?", a:"No — untreated fractures can lead to painful infections and should be evaluated promptly."}] }
  ]
};

const BREEDS = [
  { name: "Labrador Retriever", lifespan: "10-12 years", weight: "25-36 kg", height: "55-62 cm", commonDiseases: ["Hip dysplasia","Obesity","Ear infections"], exercise: "60+ minutes daily", nutrition: "High-quality protein, weight-controlled portions", grooming: "Weekly brushing, moderate shedding" },
  { name: "Golden Retriever", lifespan: "10-12 years", weight: "25-34 kg", height: "51-61 cm", commonDiseases: ["Hip dysplasia","Cancer predisposition","Skin allergies"], exercise: "60 minutes daily", nutrition: "Balanced diet with joint-support supplements", grooming: "Brushing 2-3x weekly, seasonal heavy shedding" },
  { name: "German Shepherd", lifespan: "9-13 years", weight: "22-40 kg", height: "55-65 cm", commonDiseases: ["Hip/elbow dysplasia","Bloat","Degenerative myelopathy"], exercise: "90 minutes daily, mental stimulation needed", nutrition: "Large-breed formula, joint support", grooming: "Brushing 2-3x weekly, sheds heavily" },
  { name: "Bulldog", lifespan: "8-10 years", weight: "18-25 kg", height: "31-40 cm", commonDiseases: ["Brachycephalic airway syndrome","Skin fold infections","Overheating"], exercise: "20-30 minutes, avoid heat", nutrition: "Weight-controlled, easily digestible", grooming: "Clean facial folds daily" },
  { name: "Poodle (Standard)", lifespan: "12-15 years", weight: "20-32 kg", height: "45-60 cm", commonDiseases: ["Hip dysplasia","Ear infections","Bloat"], exercise: "45-60 minutes daily", nutrition: "High-quality balanced diet", grooming: "Professional grooming every 4-6 weeks" },
  { name: "Beagle", lifespan: "10-15 years", weight: "9-11 kg", height: "33-41 cm", commonDiseases: ["Obesity","Ear infections","Epilepsy"], exercise: "60 minutes daily", nutrition: "Portion control critical, prone to weight gain", grooming: "Weekly brushing" },
  { name: "Rottweiler", lifespan: "9-10 years", weight: "35-60 kg", height: "56-69 cm", commonDiseases: ["Hip/elbow dysplasia","Bloat","Heart conditions"], exercise: "60+ minutes daily", nutrition: "Large-breed formula, controlled growth for puppies", grooming: "Weekly brushing, low maintenance coat" },
  { name: "Dachshund", lifespan: "12-16 years", weight: "7-15 kg", height: "20-27 cm", commonDiseases: ["Intervertebral disc disease","Obesity","Dental issues"], exercise: "30 minutes daily, avoid jumping/stairs", nutrition: "Weight management is essential for back health", grooming: "Weekly brushing depending on coat type" },
  { name: "Pug", lifespan: "12-15 years", weight: "6-8 kg", height: "25-33 cm", commonDiseases: ["Brachycephalic syndrome","Eye problems","Skin fold dermatitis"], exercise: "20-30 minutes, avoid heat and overexertion", nutrition: "Portion-controlled to prevent obesity", grooming: "Clean facial wrinkles regularly" },
  { name: "Shih Tzu", lifespan: "10-16 years", weight: "4-7 kg", height: "20-28 cm", commonDiseases: ["Eye problems","Dental disease","Breathing difficulty in heat"], exercise: "20-30 minutes daily", nutrition: "Small-breed formula", grooming: "Daily brushing, regular trims" }
];

/* ============================== HELPERS ============================== */
function addWeeks(date, weeks) { const d = new Date(date); d.setDate(d.getDate() + weeks * 7); return d; }
function addMonths(date, months) { const d = new Date(date); d.setMonth(d.getMonth() + months); return d; }
function fmtDate(d) { return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }

function nextOccurrence(startDate, intervalFn) {
  let d = new Date(startDate);
  const now = new Date();
  let guard = 0;
  while (d < now && guard < 200) { d = intervalFn(d); guard++; }
  return d;
}

function computeReminders(dog) {
  const birth = new Date(dog.birthDate);
  if (isNaN(birth.getTime())) return [];
  const reminders = [];
  const rabiesStart = addWeeks(birth, 16);
  reminders.push({ label: "Rabies vaccine", due: fmtDate(nextOccurrence(rabiesStart, d => addMonths(d, 12))) });
  const dhppStart = addWeeks(birth, 6);
  reminders.push({ label: "DHPP vaccine", due: fmtDate(nextOccurrence(dhppStart, d => addMonths(d, 12))) });
  const dewormStart = addWeeks(birth, 2);
  reminders.push({ label: "Deworming", due: fmtDate(nextOccurrence(dewormStart, d => addMonths(d, 3))) });
  reminders.push({ label: "Tick treatment", due: fmtDate(nextOccurrence(birth, d => addMonths(d, 1))) });
  return reminders;
}

/* ============================== SHARED UI PIECES ============================== */
function Disclaimer({ compact }) {
  return (
    <div className={`pd-surface-2 rounded-xl flex items-start gap-2 ${compact ? "p-3" : "p-4"}`} style={{ border: "1px solid var(--line)" }}>
      <Info size={compact ? 15 : 18} className="pd-primary-text mt-0.5 flex-shrink-0" />
      <p className={`pd-ink-soft ${compact ? "text-xs" : "text-sm"}`}>{DISCLAIMER_TEXT}</p>
    </div>
  );
}

function EmergencyAlert({ onFindVet }) {
  return (
    <div className="pd-emergency p-5 flex items-start gap-4">
      <AlertTriangle size={26} className="flex-shrink-0" />
      <div className="flex-1">
        <p className="font-bold text-base mb-1">Emergency signs detected</p>
        <p className="text-sm">{EMERGENCY_MESSAGE}</p>
        <button onClick={onFindVet} className="pd-btn-primary text-sm px-4 py-2 mt-3 inline-flex items-center gap-2" style={{ background: "var(--danger)" }}>
          <MapPin size={15} /> Find nearest vet
        </button>
      </div>
    </div>
  );
}

function SeverityBadge({ level }) {
  const map = { Low: "pd-badge-low", Moderate: "pd-badge-mod", High: "pd-badge-high" };
  return <span className={`pd-badge ${map[level] || "pd-badge-mod"}`}>{level || "Unknown"} severity</span>;
}

function ResultBlock({ title, items }) {
  if (!items || !items.length) return null;
  return (
    <div className="mb-4">
      <p className="text-xs uppercase pd-mono pd-ink-soft tracking-wide mb-1.5">{title}</p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-sm flex gap-2"><span className="pd-primary-text">•</span><span>{it}</span></li>
        ))}
      </ul>
    </div>
  );
}

/* ============================== ERROR BOUNDARY ============================== */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("PawDiagnose AI: render crash", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 28, fontFamily: "monospace", maxWidth: 640, margin: "40px auto", background: "#fff", border: "2px solid #D14343", borderRadius: 12, color: "#3a1917" }}>
          <p style={{ fontWeight: 700, marginBottom: 10 }}>Something crashed while rendering this screen.</p>
          <p style={{ fontSize: 13, marginBottom: 14, whiteSpace: "pre-wrap" }}>{String(this.state.error?.stack || this.state.error?.message || this.state.error)}</p>
          <button onClick={() => this.setState({ error: null })} style={{ background: "#D14343", color: "#fff", border: "none", borderRadius: 999, padding: "8px 16px", fontWeight: 700, cursor: "pointer" }}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ============================== NAVBAR ============================== */
function Navbar({ page, setPage, dark, setDark, user, mobileOpen, setMobileOpen }) {
  const links = [
    ["home", "Home"], ["diagnose", "Diagnose"], ["vets", "Vets"],
    ["library", "Library"], ["breeds", "Breeds"], ["vaccination", "Vaccination"],
    ["dashboard", "Dashboard"]
  ];
  return (
    <div className="pd-surface sticky top-0 z-40" style={{ borderBottom: "1px solid var(--line)" }}>
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <button onClick={() => setPage("home")} className="flex items-center gap-2 pd-focus" style={{ background: "none", border: "none", cursor: "pointer" }}>
          <div className="rounded-full flex items-center justify-center" style={{ width: 36, height: 36, background: "var(--primary)" }}>
            <PawPrint size={19} color="#fff" />
          </div>
          <span className="pd-display font-semibold text-lg">PawDiagnose <span className="pd-accent-text">AI</span></span>
        </button>
        <div className="hidden lg:flex items-center gap-6">
          {links.map(([id, label]) => (
            <span key={id} onClick={() => setPage(id)} className={`pd-nav-link ${page === id ? "active" : ""}`}>{label}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDark(!dark)} className="pd-btn-ghost p-2 rounded-full pd-focus" aria-label="Toggle dark mode">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          {user ? (
            <button onClick={() => setPage("dashboard")} className="pd-btn-ghost px-3 py-2 text-sm hidden sm:flex items-center gap-1.5 pd-focus">
              <User size={15} /> {user.name.split(" ")[0]}
            </button>
          ) : (
            <button onClick={() => setPage("auth")} className="pd-btn-primary px-4 py-2 text-sm hidden sm:block pd-focus">Sign in</button>
          )}
          <button className="lg:hidden pd-btn-ghost p-2 rounded-full pd-focus" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu size={18} />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden px-5 pb-4 flex flex-col gap-3 pd-fade-in">
          {links.map(([id, label]) => (
            <span key={id} onClick={() => { setPage(id); setMobileOpen(false); }} className={`pd-nav-link ${page === id ? "active" : ""}`}>{label}</span>
          ))}
          {!user && <span onClick={() => { setPage("auth"); setMobileOpen(false); }} className="pd-nav-link">Sign in</span>}
        </div>
      )}
    </div>
  );
}

/* ============================== HOME PAGE ============================== */
function HomePage({ setPage }) {
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTipIndex(i => (i + 1) % HEALTH_TIPS.length), 7000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="pd-fade-in">
      <section className="max-w-6xl mx-auto px-5 pt-14 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="pd-chip inline-block mb-4" style={{ cursor: "default" }}>
            <Activity size={13} className="inline mr-1 -mt-0.5" /> AI-assisted, vet-reviewed guidance
          </span>
          <h1 className="pd-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Understand your dog's <span className="pd-primary-text">symptoms</span> before you panic.
          </h1>
          <p className="pd-ink-soft text-base md:text-lg mb-7 max-w-md">
            Describe symptoms or upload a photo. PawDiagnose AI gives you clear, educational guidance on possible conditions, severity, and next steps — day or night.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <button onClick={() => setPage("diagnose")} className="pd-btn-accent px-6 py-3 text-sm pd-focus">Get Started</button>
            <button onClick={() => setPage("library")} className="pd-btn-ghost px-6 py-3 text-sm pd-focus">Browse Disease Library</button>
          </div>
          <VitalsDivider />
        </div>
        <div><DogHeroArt /></div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <h2 className="pd-display text-2xl font-semibold mb-6">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: <Stethoscope size={20} />, title: "Describe or upload", body: "Tell us the symptoms in your own words, or upload a clear photo of the affected area." },
            { icon: <PawPrint size={20} />, title: "AI analysis", body: "Our model reviews the details and generates possible conditions, severity, and care guidance." },
            { icon: <ShieldCheck size={20} />, title: "Act with confidence", body: "See whether home care is reasonable or a vet visit is recommended — with nearby clinics one tap away." }
          ].map((s, i) => (
            <div key={i} className="pd-card p-5">
              <div className="rounded-full w-10 h-10 flex items-center justify-center mb-3" style={{ background: "var(--surface-2)", color: "var(--primary)" }}>{s.icon}</div>
              <h3 className="font-semibold mb-1.5">{s.title}</h3>
              <p className="pd-ink-soft text-sm">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="pd-card p-6 flex items-start gap-4" style={{ background: "var(--surface-2)", border: "none" }}>
          <Heart size={22} className="pd-primary-text flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs uppercase pd-mono pd-ink-soft mb-1 tracking-wide">Health tip of the day</p>
            <p className="font-medium">{HEALTH_TIPS[tipIndex]}</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-14">
        <Disclaimer />
      </section>
    </div>
  );
}

/* ============================== DIAGNOSE PAGE ============================== */
function DiagnosePage({ setPage }) {
  const [mode, setMode] = useState("text");
  const [symptomText, setSymptomText] = useState("");
  const [activeChips, setActiveChips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imgResult, setImgResult] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState("");

  function toggleChip(c) {
    setActiveChips(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  async function runTextDiagnosis() {
    const combined = [symptomText, ...activeChips].filter(Boolean).join(", ");
    if (!combined.trim()) { setError("Please describe at least one symptom."); return; }
    setError(""); setResult(null); setLoading(true);
    try {
      const parsed = await api.diagnoseText(combined);
      setResult(parsed);
    } catch (e) {
      console.error("text diagnosis failed", e);
      setError("The AI analysis couldn't be completed right now (" + (e?.message || "unknown error") + "). Please try again in a moment.");
    } finally { setLoading(false); }
  }

  function handleImageSelect(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImgResult(null); setImgError("");
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(f);
  }

  async function runImageDiagnosis() {
    if (!imageFile) { setImgError("Please upload a photo first."); return; }
    setImgLoading(true); setImgError(""); setImgResult(null);
    try {
      const parsed = await api.diagnoseImage(imageFile);
      setImgResult(parsed);
    } catch (e) {
      console.error("image diagnosis failed", e);
      setImgError("The image analysis couldn't be completed right now (" + (e?.message || "unknown error") + "). Please try again in a moment.");
    } finally { setImgLoading(false); }
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 pd-fade-in">
      <h1 className="pd-display text-3xl font-semibold mb-2">Diagnose a symptom</h1>
      <p className="pd-ink-soft mb-6">Choose how you'd like to describe what's going on.</p>

      <div className="flex gap-3 mb-7">
        <button onClick={() => setMode("text")} className={mode === "text" ? "pd-btn-primary px-5 py-2.5 text-sm" : "pd-btn-ghost px-5 py-2.5 text-sm"}>
          <Stethoscope size={15} className="inline mr-1.5 -mt-0.5" /> Describe symptoms
        </button>
        <button onClick={() => setMode("image")} className={mode === "image" ? "pd-btn-primary px-5 py-2.5 text-sm" : "pd-btn-ghost px-5 py-2.5 text-sm"}>
          <Camera size={15} className="inline mr-1.5 -mt-0.5" /> Upload photo
        </button>
      </div>

      {mode === "text" && (
        <div>
          <div className="pd-card p-5 mb-5">
            <label className="text-sm font-semibold mb-2 block">Common symptoms (tap to add)</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {SYMPTOM_CHIPS.map(c => (
                <span key={c} onClick={() => toggleChip(c)} className={`pd-chip ${activeChips.includes(c) ? "active" : ""}`}>{c}</span>
              ))}
            </div>
            <label className="text-sm font-semibold mb-2 block">Describe in your own words</label>
            <textarea className="pd-input" rows={4} placeholder="e.g. My dog has been vomiting since this morning and seems very tired..."
              value={symptomText} onChange={e => setSymptomText(e.target.value)} />
            {error && <p className="text-sm mt-2" style={{ color: "var(--danger)" }}>{error}</p>}
            <button type="button" onClick={runTextDiagnosis} disabled={loading} className="pd-btn-primary px-6 py-2.5 text-sm mt-4 inline-flex items-center gap-2">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Analyzing...</> : "Analyze symptoms"}
            </button>
          </div>

          {result?.emergency && <div className="mb-5"><EmergencyAlert onFindVet={() => setPage("vets")} /></div>}

          {result && (
            <div className="pd-card p-6 pd-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <h3 className="pd-display text-xl font-semibold">Diagnosis summary</h3>
                <SeverityBadge level={result.severity} />
              </div>
              <ResultBlock title="Possible conditions" items={result.possible_diseases} />
              <ResultBlock title="Common causes" items={result.common_causes} />
              <ResultBlock title="Recommended home care" items={result.home_care} />
              <ResultBlock title="Prevention" items={result.prevention} />
              <ResultBlock title="Suggested medications (general info only)" items={result.suggested_medications} />
              <ResultBlock title="Diet recommendations" items={result.diet_recommendations} />
              <div className="flex items-center gap-2 mt-4 p-3 rounded-xl" style={{ background: result.vet_recommended ? "var(--high-soft)" : "var(--low-soft)" }}>
                {result.vet_recommended ? <AlertTriangle size={16} style={{ color: "var(--high)" }} /> : <CheckCircle2 size={16} style={{ color: "var(--low)" }} />}
                <p className="text-sm font-medium" style={{ color: result.vet_recommended ? "var(--high)" : "var(--low)" }}>
                  {result.vet_recommended ? "Veterinary consultation is recommended." : "Home monitoring is likely reasonable, but watch closely for changes."}
                </p>
              </div>
              <div className="mt-4"><Disclaimer compact /></div>
            </div>
          )}
        </div>
      )}

      {mode === "image" && (
        <div>
          <div className="pd-card p-5 mb-5">
            <label className="text-sm font-semibold mb-2 block">Upload a clear photo (skin, wound, ear, eye, paw, tick, swelling, rash)</label>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="pd-btn-ghost px-5 py-8 text-sm flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ borderStyle: "dashed" }}>
                  <Upload size={22} />
                  <span>{imageFile ? imageFile.name : "Click to choose a photo"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </label>
                {imgError && <p className="text-sm mt-2" style={{ color: "var(--danger)" }}>{imgError}</p>}
                <button type="button" onClick={runImageDiagnosis} disabled={imgLoading} className="pd-btn-primary px-6 py-2.5 text-sm mt-4 inline-flex items-center gap-2">
                  {imgLoading ? <><Loader2 size={15} className="animate-spin" /> Analyzing photo...</> : "Analyze photo"}
                </button>
              </div>
              {imagePreview && (
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--line)" }}>
                  <img src={imagePreview} alt="Uploaded dog condition" className="w-full h-full object-cover" style={{ maxHeight: 220 }} />
                </div>
              )}
            </div>
          </div>

          {imgResult?.emergency && <div className="mb-5"><EmergencyAlert onFindVet={() => setPage("vets")} /></div>}

          {imgResult && (
            <div className="pd-card p-6 grid sm:grid-cols-2 gap-6 pd-fade-in">
              {imagePreview && <img src={imagePreview} alt="Uploaded" className="rounded-xl w-full object-cover" style={{ maxHeight: 260 }} />}
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <h3 className="pd-display text-xl font-semibold">{imgResult.condition}</h3>
                  <span className="pd-badge pd-badge-mod">{imgResult.confidence} confidence</span>
                </div>
                <p className="pd-ink-soft text-sm mb-4">{imgResult.description}</p>
                <ResultBlock title="Home care advice" items={imgResult.home_care} />
                <div className="flex items-center gap-2 mt-3 p-3 rounded-xl" style={{ background: imgResult.vet_recommended ? "var(--high-soft)" : "var(--low-soft)" }}>
                  {imgResult.vet_recommended ? <AlertTriangle size={16} style={{ color: "var(--high)" }} /> : <CheckCircle2 size={16} style={{ color: "var(--low)" }} />}
                  <p className="text-sm font-medium" style={{ color: imgResult.vet_recommended ? "var(--high)" : "var(--low)" }}>
                    {imgResult.vet_recommended ? "Veterinary consultation is recommended." : "Likely manageable at home, but monitor closely."}
                  </p>
                </div>
                <div className="mt-4"><Disclaimer compact /></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================== VETS PAGE ============================== */
function VetsPage({ user }) {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [vets, setVets] = useState([]);
  const [note, setNote] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [mapLinks, setMapLinks] = useState(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try { setFavorites(await api.listFavorites()); } catch (e) { console.error("load favorites failed", e); }
    })();
  }, [user]);

  function buildLinksForQuery(queryText) {
    return {
      label: queryText,
      googleUrl: `https://www.google.com/maps/search/${encodeURIComponent("veterinary hospitals near " + queryText)}`,
      osmUrl: `https://www.openstreetmap.org/search?query=${encodeURIComponent("veterinary " + queryText)}`
    };
  }
  function buildLinksForCoords(lat, lon, label) {
    return {
      label: label || "your location",
      googleUrl: `https://www.google.com/maps/search/veterinary+hospitals/@${lat},${lon},14z`,
      osmUrl: `https://www.openstreetmap.org/#map=14/${lat}/${lon}`
    };
  }

  async function fetchLiveVets(lat, lon) {
    try {
      const results = await api.nearbyVets(lat, lon);
      const withDistance = results.map(v => ({ ...v, distance: haversineKm(lat, lon, v.lat, v.lon) })).sort((a, b) => a.distance - b.distance);
      if (!withDistance.length) throw new Error("No veterinary results returned for this area");
      setVets(withDistance);
    } catch (e) {
      console.error("live vet lookup failed", e);
      setNote("Inline live results aren't available right now (" + (e?.message || "network issue") + "). Use the map buttons below — they open real, live results in a new tab.");
      setVets([]);
    }
  }

  function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async function searchByCoords(lat, lon, label) {
    setLoading(true); setNote(""); setVets([]);
    setMapLinks(buildLinksForCoords(lat, lon, label));
    await fetchLiveVets(lat, lon);
    setLoading(false);
  }

  function useCurrentLocation() {
    setNote("");
    if (!navigator.geolocation) {
      setNote("This browser doesn't support geolocation. Try entering a city name instead.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => searchByCoords(pos.coords.latitude, pos.coords.longitude, "your current location"),
      (err) => {
        setLoading(false);
        console.error("geolocation error", err);
        const messages = {
          1: "Location access was denied. You can allow it in your browser's site settings, or enter a city name instead.",
          2: "Your location couldn't be determined right now. Try entering a city name instead.",
          3: "Location request timed out. Try again, or enter a city name instead."
        };
        setNote(messages[err.code] || "Couldn't access your location. Try entering a city name instead.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }

  async function searchByCity() {
    if (!city.trim()) return;
    setLoading(true); setNote(""); setVets([]);
    setMapLinks(buildLinksForQuery(city.trim()));
    try {
      const { lat, lon } = await api.geocodeCity(city.trim());
      setMapLinks(buildLinksForCoords(lat, lon, city.trim()));
      await fetchLiveVets(lat, lon);
    } catch (e) {
      console.error("city geocoding failed", e);
      setNote("Inline live results aren't available right now (" + (e?.message || "network issue") + "). Use the map buttons below — they open real, live results in a new tab.");
      setVets([]);
    } finally { setLoading(false); }
  }

  async function toggleFavorite(v) {
    if (!user) { setNote("Sign in to save favorite vets to your dashboard."); return; }
    const exists = favorites.find(f => f.name === v.name);
    try {
      if (exists) {
        await api.removeFavorite(exists.id);
        setFavorites(favorites.filter(f => f.id !== exists.id));
      } else {
        const saved = await api.addFavorite({ name: v.name, address: v.address, phone: v.phone, lat: v.lat, lon: v.lon });
        setFavorites([...favorites, saved]);
      }
    } catch (e) {
      console.error("toggle favorite failed", e);
      setNote("Couldn't update favorites right now (" + (e?.message || "unknown error") + ").");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 pd-fade-in">
      <h1 className="pd-display text-3xl font-semibold mb-2">Nearby veterinary care</h1>
      <p className="pd-ink-soft mb-6">Search using your current location or a city name.</p>

      <div className="pd-card p-5 mb-6 flex flex-col sm:flex-row gap-3">
        <input className="pd-input" placeholder="Enter a city name..." value={city} onChange={e => setCity(e.target.value)}
          onKeyDown={e => e.key === "Enter" && searchByCity()} />
        <button type="button" onClick={searchByCity} className="pd-btn-primary px-5 py-2.5 text-sm whitespace-nowrap">Search city</button>
        <button type="button" onClick={useCurrentLocation} className="pd-btn-ghost px-5 py-2.5 text-sm whitespace-nowrap inline-flex items-center gap-1.5">
          <MapPin size={15} /> Use my location
        </button>
      </div>

      {loading && <p className="pd-ink-soft text-sm mb-4 flex items-center gap-2"><Loader2 size={15} className="animate-spin" /> Searching...</p>}
      {note && <p className="text-sm mb-4 pd-ink-soft">{note}</p>}

      {mapLinks && (
        <div className="pd-card p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="text-sm"><span className="font-semibold">Live results for {mapLinks.label}</span> — these always open real, current results.</p>
          <div className="flex gap-2 flex-shrink-0">
            <a href={mapLinks.googleUrl} target="_blank" rel="noreferrer" className="pd-btn-primary px-4 py-2 text-xs inline-flex items-center gap-1.5">
              <MapPin size={13} /> Open in Google Maps
            </a>
            <a href={mapLinks.osmUrl} target="_blank" rel="noreferrer" className="pd-btn-ghost px-4 py-2 text-xs">
              Open in OpenStreetMap
            </a>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {vets.map((v, i) => {
          const isFav = favorites.find(f => f.name === v.name);
          return (
            <div key={i} className="pd-card p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{v.name}</h3>
                <button onClick={() => toggleFavorite(v)} className="pd-focus" style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <Star size={17} fill={isFav ? "var(--accent)" : "none"} color={isFav ? "var(--accent)" : "var(--ink-soft)"} />
                </button>
              </div>
              <p className="pd-ink-soft text-sm mt-1">{v.address}</p>
              <p className="text-sm mt-1 flex items-center gap-1.5"><Phone size={13} /> {v.phone}</p>
              {v.distance != null && <p className="text-sm pd-primary-text mt-1">{v.distance.toFixed(1)} km away</p>}
              {v.lat && (
                <div className="flex gap-2 mt-3">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${v.lat},${v.lon}`} target="_blank" rel="noreferrer" className="pd-btn-primary px-3 py-1.5 text-xs inline-flex items-center gap-1.5">
                    <Navigation size={12} /> Directions
                  </a>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lon}`} target="_blank" rel="noreferrer" className="pd-btn-ghost px-3 py-1.5 text-xs">
                    View on Maps
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!loading && !vets.length && mapLinks && (
        <p className="pd-ink-soft text-sm">No inline results to show here — use the map buttons above to see live nearby vets.</p>
      )}
      {!loading && !vets.length && !mapLinks && (
        <p className="pd-ink-soft text-sm">Search a city or share your location to see nearby veterinary care.</p>
      )}
    </div>
  );
}

/* ============================== CHAT ASSISTANT ============================== */
function ChatAssistant({ user, setPage }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi! I'm your dog care assistant. Ask me about nutrition, vaccinations, grooming, or general puppy care." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages, open]);

  async function send() {
    if (!input.trim() || loading) return;
    if (!user) {
      setMessages(m => [...m, { role: "user", text: input }, { role: "assistant", text: "Please sign in first so I can chat with you — head to the Sign in button up top." }]);
      setInput("");
      return;
    }
    const userMsg = { role: "user", text: input };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput(""); setLoading(true);
    try {
      const { text } = await api.chat(history);
      setMessages([...history, { role: "assistant", text: text || "Sorry, I couldn't generate a response just now." }]);
    } catch (e) {
      console.error("chat failed", e);
      setMessages([...history, { role: "assistant", text: "Sorry, something went wrong reaching the assistant (" + (e?.message || "unknown error") + ")." }]);
    } finally { setLoading(false); }
  }

  return (
    <>
      <button onClick={() => setOpen(!open)} className="pd-btn-accent fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 flex items-center justify-center shadow-lg pd-focus" aria-label="Open chat assistant">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
      {open && (
        <div className="pd-card fixed bottom-24 right-6 z-50 flex flex-col pd-fade-in" style={{ width: "min(360px, 90vw)", height: "min(480px, 70vh)" }}>
          <div className="p-4 flex items-center gap-2" style={{ borderBottom: "1px solid var(--line)" }}>
            <PawPrint size={16} className="pd-primary-text" />
            <p className="font-semibold text-sm">Dog Care Assistant</p>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 pd-scroll">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm p-3 rounded-2xl max-w-[85%] ${m.role === "user" ? "ml-auto" : ""}`}
                style={{ background: m.role === "user" ? "var(--primary)" : "var(--surface-2)", color: m.role === "user" ? "#fff" : "var(--ink)" }}>
                {m.text}
              </div>
            ))}
            {loading && <div className="text-sm pd-ink-soft flex items-center gap-2"><Loader2 size={13} className="animate-spin" /> Thinking...</div>}
          </div>
          <div className="p-3 flex gap-2" style={{ borderTop: "1px solid var(--line)" }}>
            <input className="pd-input" placeholder="Ask about diet, vaccines, grooming..." value={input}
              onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
            <button type="button" onClick={send} className="pd-btn-primary p-2.5 rounded-full flex-shrink-0" aria-label="Send"><Send size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================== DISEASE LIBRARY PAGE ============================== */
function LibraryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);
  const [selected, setSelected] = useState(null);

  const categories = Object.keys(DISEASE_LIBRARY);
  const filtered = category ? DISEASE_LIBRARY[category] : Object.values(DISEASE_LIBRARY).flat();
  const searched = filtered.filter(d => d.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 pd-fade-in">
      <h1 className="pd-display text-3xl font-semibold mb-2">Disease library</h1>
      <p className="pd-ink-soft mb-6">Browse by category or search a condition by name.</p>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pd-ink-soft" />
        <input className="pd-input pl-10" placeholder="Search diseases..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      <div className="flex flex-wrap gap-2 mb-7">
        <span onClick={() => setCategory(null)} className={`pd-chip ${!category ? "active" : ""}`}>All</span>
        {categories.map(c => <span key={c} onClick={() => setCategory(c)} className={`pd-chip ${category === c ? "active" : ""}`}>{c}</span>)}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {searched.map((d, i) => (
          <div key={i} className="pd-card p-4 cursor-pointer" onClick={() => setSelected(d)}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{d.name}</h3>
              <ChevronRight size={16} className="pd-ink-soft" />
            </div>
            <p className="pd-ink-soft text-sm mt-1.5 line-clamp-2">{d.symptoms.slice(0, 3).join(", ")}...</p>
          </div>
        ))}
        {!searched.length && <p className="pd-ink-soft text-sm">No matching conditions found.</p>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,20,18,0.55)" }} onClick={() => setSelected(null)}>
          <div className="pd-card p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto pd-scroll pd-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <h2 className="pd-display text-2xl font-semibold">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="pd-focus" style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <ResultBlock title="Symptoms" items={selected.symptoms} />
            <ResultBlock title="Causes" items={selected.causes} />
            <ResultBlock title="Prevention" items={selected.prevention} />
            <ResultBlock title="Treatment" items={selected.treatment} />
            <div className="mb-4">
              <p className="text-xs uppercase pd-mono pd-ink-soft tracking-wide mb-1.5">Recovery time</p>
              <p className="text-sm">{selected.recovery}</p>
            </div>
            {selected.faqs?.map((f, i) => (
              <div key={i} className="mb-3 p-3 rounded-xl pd-surface-2">
                <p className="text-sm font-semibold mb-1">{f.q}</p>
                <p className="text-sm pd-ink-soft">{f.a}</p>
              </div>
            ))}
            <Disclaimer compact />
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== BREEDS PAGE ============================== */
function BreedsPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = BREEDS.filter(b => b.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 pd-fade-in">
      <h1 className="pd-display text-3xl font-semibold mb-2">Breed information</h1>
      <p className="pd-ink-soft mb-6">Learn what's typical — and what to watch for — by breed.</p>
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pd-ink-soft" />
        <input className="pd-input pl-10" placeholder="Search breeds..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {filtered.map((b, i) => (
          <div key={i} className="pd-card p-4 cursor-pointer" onClick={() => setSelected(b)}>
            <Dog size={20} className="pd-primary-text mb-2" />
            <h3 className="font-semibold">{b.name}</h3>
            <p className="pd-ink-soft text-xs mt-1">{b.lifespan}</p>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,20,18,0.55)" }} onClick={() => setSelected(null)}>
          <div className="pd-card p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto pd-scroll" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="pd-display text-2xl font-semibold">{selected.name}</h2>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="pd-surface-2 rounded-xl p-3"><p className="pd-ink-soft text-xs mb-1">Lifespan</p><p className="font-medium">{selected.lifespan}</p></div>
              <div className="pd-surface-2 rounded-xl p-3"><p className="pd-ink-soft text-xs mb-1">Weight</p><p className="font-medium">{selected.weight}</p></div>
              <div className="pd-surface-2 rounded-xl p-3"><p className="pd-ink-soft text-xs mb-1">Height</p><p className="font-medium">{selected.height}</p></div>
              <div className="pd-surface-2 rounded-xl p-3"><p className="pd-ink-soft text-xs mb-1">Exercise</p><p className="font-medium">{selected.exercise}</p></div>
            </div>
            <ResultBlock title="Common health issues" items={selected.commonDiseases} />
            <ResultBlock title="Nutrition notes" items={[selected.nutrition]} />
            <ResultBlock title="Grooming notes" items={[selected.grooming]} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== VACCINATION PAGE ============================== */
function VaccinationPage({ user, setPage }) {
  const [dogs, setDogs] = useState([]);
  const [form, setForm] = useState({ name: "", breed: "", age: "", birthDate: "" });
  const [loaded, setLoaded] = useState(false);
  const [dogError, setDogError] = useState("");

  useEffect(() => {
    (async () => {
      if (!user) { setLoaded(true); return; }
      try { setDogs(await api.listDogs()); } catch (e) { console.error("load dogs failed", e); }
      setLoaded(true);
    })();
  }, [user]);

  async function addDog() {
    setDogError("");
    if (!form.name.trim() || !form.birthDate) { setDogError("Please enter at least a name and birth date."); return; }
    try {
      const saved = await api.addDog(form);
      setDogs([...dogs, saved]);
      setForm({ name: "", breed: "", age: "", birthDate: "" });
    } catch (e) {
      console.error("add dog failed", e);
      setDogError("Couldn't save this dog right now (" + (e?.message || "unknown error") + ").");
    }
  }

  async function removeDog(id) {
    try {
      await api.removeDog(id);
      setDogs(dogs.filter(d => d.id !== id));
    } catch (e) { console.error("remove dog failed", e); }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center pd-fade-in">
        <Syringe size={32} className="pd-primary-text mx-auto mb-4" />
        <h1 className="pd-display text-2xl font-semibold mb-2">Sign in to set vaccination reminders</h1>
        <p className="pd-ink-soft mb-6">Register your dog's details to get personalized reminders for rabies, DHPP, deworming, and tick treatment.</p>
        <button onClick={() => setPage("auth")} className="pd-btn-primary px-6 py-2.5 text-sm">Sign in / Sign up</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 pd-fade-in">
      <h1 className="pd-display text-3xl font-semibold mb-2">Vaccination reminders</h1>
      <p className="pd-ink-soft mb-6">Register your dog to generate a personalized reminder schedule.</p>

      <div className="pd-card p-5 mb-7 grid sm:grid-cols-2 gap-4">
        <input className="pd-input" placeholder="Dog's name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="pd-input" placeholder="Breed" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} />
        <input className="pd-input" placeholder="Age (years)" type="number" min="0" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
        <div>
          <label className="text-xs pd-ink-soft block mb-1">Birth date</label>
          <input className="pd-input" type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} />
        </div>
        {dogError && <p className="text-sm sm:col-span-2" style={{ color: "var(--danger)" }}>{dogError}</p>}
        <button type="button" onClick={addDog} className="pd-btn-primary px-6 py-2.5 text-sm sm:col-span-2 inline-flex items-center justify-center gap-2">
          <Plus size={15} /> Register dog
        </button>
      </div>

      <div className="grid gap-5">
        {dogs.map((dog) => {
          const reminders = computeReminders(dog);
          return (
            <div key={dog.id} className="pd-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2"><Dog size={17} className="pd-primary-text" /> {dog.name}</h3>
                  <p className="pd-ink-soft text-sm">{dog.breed || "Breed not specified"} {dog.age ? `· ${dog.age} yrs` : ""}</p>
                </div>
                <button onClick={() => removeDog(dog.id)} className="pd-focus" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)" }}><Trash2 size={17} /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {reminders.map((r, j) => (
                  <div key={j} className="pd-surface-2 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2"><Calendar size={14} className="pd-primary-text" /> {r.label}</span>
                    <span className="pd-mono text-xs pd-ink-soft">{r.due}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {loaded && !dogs.length && <p className="pd-ink-soft text-sm">No dogs registered yet — add one above to see reminders.</p>}
      </div>
    </div>
  );
}

/* ============================== DASHBOARD PAGE ============================== */
function DashboardPage({ user, setPage }) {
  const [diagnoses, setDiagnoses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const [h, f, d] = await Promise.all([api.history(), api.listFavorites(), api.listDogs()]);
        setDiagnoses(h); setFavorites(f); setDogs(d);
      } catch (e) { console.error("dashboard load failed", e); }
      setLoaded(true);
    })();
  }, [user]);

  async function clearMyData() {
    if (!user) return;
    try {
      await Promise.all([api.clearHistory(), api.clearFavorites(), api.clearDogs()]);
      setDiagnoses([]); setFavorites([]); setDogs([]);
    } catch (e) { console.error("clear data failed", e); }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center pd-fade-in">
        <User size={32} className="pd-primary-text mx-auto mb-4" />
        <h1 className="pd-display text-2xl font-semibold mb-2">Sign in to view your dashboard</h1>
        <p className="pd-ink-soft mb-6">Your diagnosis history, saved reports, reminders, and favorite vets all live here.</p>
        <button onClick={() => setPage("auth")} className="pd-btn-primary px-6 py-2.5 text-sm">Sign in / Sign up</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 pd-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="pd-display text-3xl font-semibold mb-1">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="pd-ink-soft text-sm">Your data is stored locally by your own backend server.</p>
        </div>
        <button onClick={clearMyData} className="pd-btn-ghost px-4 py-2 text-xs">Clear my data</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="pd-card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Stethoscope size={16} className="pd-primary-text" /> Diagnosis history</h3>
          {diagnoses.length ? (
            <div className="space-y-3">
              {diagnoses.slice(0, 8).map((d) => (
                <div key={d.id} className="pd-surface-2 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{d.type === "image" ? "Photo analysis" : "Symptom check"}</span>
                    <span className="pd-mono text-xs pd-ink-soft">{new Date(d.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm pd-ink-soft line-clamp-1">
                    {d.type === "image" ? d.result?.condition : (d.result?.possible_diseases || []).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ) : loaded && <p className="pd-ink-soft text-sm">No diagnoses saved yet.</p>}
        </div>

        <div className="pd-card p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Star size={16} className="pd-primary-text" /> Favorite vets</h3>
          {favorites.length ? (
            <div className="space-y-2">
              {favorites.map((f) => <div key={f.id} className="text-sm pd-surface-2 rounded-xl p-3">{f.name}</div>)}
            </div>
          ) : loaded && <p className="pd-ink-soft text-sm">No favorites saved yet.</p>}
        </div>

        <div className="pd-card p-5 lg:col-span-3">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Syringe size={16} className="pd-primary-text" /> Upcoming reminders</h3>
          {dogs.length ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {dogs.flatMap(dog => computeReminders(dog).map(r => ({ ...r, dog: dog.name }))).slice(0, 8).map((r, i) => (
                <div key={i} className="pd-surface-2 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm">{r.dog} — {r.label}</span>
                  <span className="pd-mono text-xs pd-ink-soft">{r.due}</span>
                </div>
              ))}
            </div>
          ) : loaded && <p className="pd-ink-soft text-sm">Register a dog on the Vaccination page to see reminders here.</p>}
        </div>
      </div>
    </div>
  );
}

/* ============================== AUTH PAGE ============================== */
function AuthPage({ setUser, setPage }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSignup() {
    setError(""); setBusy(true);
    try {
      if (!form.name.trim() || !form.email.trim() || !form.password) {
        setError("Please fill in your name, email, and password.");
        setBusy(false); return;
      }
      const { token, user } = await api.signup({ name: form.name, email: form.email, password: form.password });
      setToken(token);
      setUser(user);
      setPage("dashboard");
    } catch (err) {
      console.error("signup failed", err);
      setError("Something went wrong creating your account (" + (err?.message || "unknown error") + "). Please try again.");
    }
    setBusy(false);
  }

  async function handleLogin() {
    setError(""); setBusy(true);
    try {
      const { token, user } = await api.login({ email: form.email, password: form.password });
      setToken(token);
      setUser(user);
      setPage("dashboard");
    } catch (err) {
      console.error("login failed", err);
      setError("Something went wrong signing you in (" + (err?.message || "unknown error") + "). Please try again.");
    }
    setBusy(false);
  }

  async function handleGoogleDemo() {
    setError(""); setBusy(true);
    try {
      const { token, user } = await api.googleDemo();
      setToken(token);
      setUser(user);
      setPage("dashboard");
    } catch (err) {
      console.error("google demo failed", err);
      setError("Something went wrong with Google sign-in (" + (err?.message || "unknown error") + ").");
    }
    setBusy(false);
  }

  function handleForgot() {
    setResetSent(true);
  }

  return (
    <div className="max-w-md mx-auto px-5 py-14 pd-fade-in">
      <div className="pd-card p-7">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <PawPrint size={20} className="pd-primary-text" />
          <h1 className="pd-display text-xl font-semibold">PawDiagnose AI</h1>
        </div>
        <div className="flex gap-2 mb-6 justify-center">
          {["login", "signup", "forgot"].map(t => (
            <span key={t} onClick={() => { setTab(t); setError(""); setResetSent(false); }} className={`pd-chip ${tab === t ? "active" : ""}`}>
              {t === "login" ? "Log in" : t === "signup" ? "Sign up" : "Forgot password"}
            </span>
          ))}
        </div>

        {tab === "signup" && (
          <div className="space-y-3">
            <input className="pd-input" placeholder="Full name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="pd-input" placeholder="Email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="pd-input" placeholder="Password" type="password" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleSignup()} />
            {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
            <button type="button" onClick={handleSignup} disabled={busy} className="pd-btn-primary w-full py-2.5 text-sm">{busy ? "Creating account..." : "Create account"}</button>
          </div>
        )}

        {tab === "login" && (
          <div className="space-y-3">
            <input className="pd-input" placeholder="Email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="pd-input" placeholder="Password" type="password" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
            {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
            <button type="button" onClick={handleLogin} disabled={busy} className="pd-btn-primary w-full py-2.5 text-sm">{busy ? "Signing in..." : "Log in"}</button>
          </div>
        )}

        {tab === "forgot" && (
          <div className="space-y-3">
            <input className="pd-input" placeholder="Email" type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleForgot()} />
            {resetSent ? <p className="text-sm pd-primary-text">If an account exists, reset instructions would be sent to this email in a live deployment.</p>
              : <button type="button" onClick={handleForgot} className="pd-btn-primary w-full py-2.5 text-sm">Send reset instructions</button>}
          </div>
        )}

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px pd-line" style={{ borderTop: "1px solid var(--line)" }} />
          <span className="text-xs pd-ink-soft">or</span>
          <div className="flex-1 h-px" style={{ borderTop: "1px solid var(--line)" }} />
        </div>
        <button type="button" onClick={handleGoogleDemo} disabled={busy} className="pd-btn-ghost w-full py-2.5 text-sm">{busy ? "Signing in..." : "Continue with Google (demo)"}</button>
        {tab === "forgot" && error && <p className="text-sm mt-3 text-center" style={{ color: "var(--danger)" }}>{error}</p>}
        <p className="text-xs pd-ink-soft mt-4 text-center">Demo authentication for prototype purposes — see README for wiring up real Google OAuth.</p>
      </div>
    </div>
  );
}

/* ============================== FOOTER ============================== */
function Footer({ setPage }) {
  return (
    <footer className="pd-surface-2 mt-16">
      <div className="max-w-6xl mx-auto px-5 py-10 grid sm:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <PawPrint size={17} className="pd-primary-text" />
            <span className="pd-display font-semibold">PawDiagnose AI</span>
          </div>
          <p className="pd-ink-soft text-sm">Educational guidance for dog owners, powered by generative AI.</p>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Explore</p>
          <div className="flex flex-col gap-1.5 text-sm">
            <span className="pd-nav-link" onClick={() => setPage("diagnose")}>Diagnose</span>
            <span className="pd-nav-link" onClick={() => setPage("library")}>Disease library</span>
            <span className="pd-nav-link" onClick={() => setPage("breeds")}>Breed info</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Important</p>
          <p className="pd-ink-soft text-xs leading-relaxed">{DISCLAIMER_TEXT}</p>
        </div>
      </div>
    </footer>
  );
}

/* ============================== APP ROOT ============================== */
export default function App() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      const token = getToken();
      if (token) {
        try {
          const { user } = await api.me();
          setUser(user);
        } catch (e) {
          console.warn("Stored session was invalid, signing out.", e);
          setToken(null);
        }
      }
      setBooting(false);
    })();
  }, []);

  function logout() {
    setUser(null);
    setToken(null);
    setPage("home");
  }

  return (
    <div className={`pd-root ${dark ? "dark" : ""}`}>
      <Navbar page={page} setPage={setPage} dark={dark} setDark={setDark} user={user} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {user && page === "dashboard" && (
        <div className="max-w-5xl mx-auto px-5 pt-4">
          <button onClick={logout} className="pd-btn-ghost px-3 py-1.5 text-xs inline-flex items-center gap-1.5"><LogOut size={12} /> Sign out</button>
        </div>
      )}

      {!booting && (
        <ErrorBoundary>
          {page === "home" && <HomePage setPage={setPage} />}
          {page === "diagnose" && <DiagnosePage setPage={setPage} />}
          {page === "vets" && <VetsPage user={user} />}
          {page === "library" && <LibraryPage />}
          {page === "breeds" && <BreedsPage />}
          {page === "vaccination" && <VaccinationPage user={user} setPage={setPage} />}
          {page === "dashboard" && <DashboardPage user={user} setPage={setPage} />}
          {page === "auth" && <AuthPage setUser={setUser} setPage={setPage} />}
        </ErrorBoundary>
      )}

      <Footer setPage={setPage} />
      <ChatAssistant user={user} setPage={setPage} />
    </div>
  );
}
