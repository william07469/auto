import {
  ServiceOption,
  PackageOption,
  PackageId,
  ServiceId,
  ServiceQuestion,
  AddOnOption,
} from "./types";

// ─── Services ─────────────────────────────────────────────────────────────────
export const SERVICES_DATA: ServiceOption[] = [
  {
    id: "exterior",
    name: "Exterior Detail",
    tagline: "Hand wash · Clay · Sealant",
    description: "A thorough exterior decontamination, machine polish prep and long-lasting sealant application.",
    iconName: "Car",
  },
  {
    id: "interior",
    name: "Interior Detail",
    tagline: "Steam · Leather · Shampoo",
    description: "Deep extraction cleaning, steam disinfection and premium leather conditioning throughout.",
    iconName: "Armchair",
    popular: true,
    badge: "Most Popular",
  },
  {
    id: "full_detail",
    name: "Full Detail",
    tagline: "Complete Head-to-Toe",
    description: "The complete WV experience — full interior and exterior treatment in one appointment.",
    iconName: "Star",
    badge: "Best Value",
  },
  {
    id: "paint_correction",
    name: "Paint Correction",
    tagline: "Machine Polish · Mirror Finish",
    description: "Multi-stage machine polishing to remove swirls, holograms and oxidation for a flawless finish.",
    iconName: "Sparkles",
    badge: "Premium",
  },
  {
    id: "ceramic",
    name: "Ceramic Coating",
    tagline: "Nano Protection · Hydrophobic",
    description: "Professional-grade ceramic coating for long-term paint protection, UV resistance and extreme beading.",
    iconName: "ShieldCheck",
    badge: "Elite",
  },
];

// ─── Packages per service ─────────────────────────────────────────────────────
export const PACKAGES_DATA: Record<ServiceId, PackageOption[]> = {
  exterior: [
    {
      id: "basic",
      name: "Basic",
      tagline: "Grundlegende Außenwäsche & Reinigung",
      description: "Handwäsche & Trocknung, Felgen- & Reifenreinigung sowie Reifenglanz.",
      price: 70,
      duration: "2–3 Std.",
      features: [
        "Handwäsche & Trocknung",
        "Felgen- & Reifenreinigung",
        "Reifenglanz",
        "Scheibenreinigung",
      ],
    },
    {
      id: "premium",
      name: "Deluxe",
      tagline: "Volle Außenrestaurierung & Schutz",
      description: "Komplette Außenaufbereitung mit Kunststoffpflege und dauerhafter Lackversiegelung.",
      price: 130,
      duration: "4–5 Std.",
      features: [
        "Handwäsche & Trocknung",
        "Reifen & Felgen – Reinigung",
        "Reifenglanz",
        "Scheibenreinigung",
        "Kunststoffaufbereitung",
        "Lackversiegelung",
      ],
      recommended: true,
    },
    {
      id: "ultimate",
      name: "Deluxe",
      tagline: "Volle Außenrestaurierung & Schutz",
      description: "Komplette Außenaufbereitung mit Kunststoffpflege und dauerhafter Lackversiegelung.",
      price: 130,
      duration: "4–5 Std.",
      features: [
        "Handwäsche & Trocknung",
        "Reifen & Felgen – Reinigung",
        "Reifenglanz",
        "Scheibenreinigung",
        "Kunststoffaufbereitung",
        "Lackversiegelung",
      ],
    },
  ],
  interior: [
    {
      id: "basic",
      name: "Basic",
      tagline: "Schnelle Innenraumauffrischung & Reinigung",
      description: "Komplettes Staubsaugen, Armaturenbrett abwischen und Scheibenreinigung innen.",
      price: 80,
      duration: "2–3 Std.",
      features: [
        "Komplettes Staubsaugen",
        "Armaturenbrett & Mittelkonsole abwischen",
        "Scheibenreinigung innen",
      ],
    },
    {
      id: "premium",
      name: "Deluxe",
      tagline: "Tiefenreinigung & Aufbereitung Ihres Innenraums",
      description: "Tiefenreinigung mit Lederpflege, Textilversiegelung und vollständiger Innenaufbereitung.",
      price: 150,
      duration: "4–5 Std.",
      features: [
        "Komplettes Staubsaugen & Absaugen",
        "Reinigung von Armaturenbrett & Konsole",
        "Lederpflege",
        "Textilversiegelung",
        "Scheibenreinigung innen",
      ],
      recommended: true,
    },
    {
      id: "ultimate",
      name: "Deluxe",
      tagline: "Tiefenreinigung & Aufbereitung Ihres Innenraums",
      description: "Tiefenreinigung mit Lederpflege, Textilversiegelung und vollständiger Innenaufbereitung.",
      price: 150,
      duration: "4–5 Std.",
      features: [
        "Komplettes Staubsaugen & Absaugen",
        "Reinigung von Armaturenbrett & Konsole",
        "Lederpflege",
        "Textilversiegelung",
        "Scheibenreinigung innen",
      ],
    },
  ],
  full_detail: [
    {
      id: "basic",
      name: "Basic",
      tagline: "Eine komplette Grundreinigung innen & außen",
      description: "Außenwäsche per Hand, Innenraum aussaugen, Armaturenbrett abwischen und Scheibenreinigung.",
      price: 130,
      duration: "4–5 Std.",
      features: [
        "Außenwäsche per Hand",
        "Innenraum aussaugen",
        "Armaturenbrett abwischen",
        "Scheibenreinigung",
      ],
    },
    {
      id: "premium",
      name: "Deluxe",
      tagline: "Das Komplettpaket für die komplette Fahrzeugtransformation",
      description: "Komplettpaket mit voller Innen- und Außenreinigung, Leder-/Stoffbehandlung, Geruchsbeseitigung und Lackversiegelung.",
      price: 250,
      duration: "7–9 Std.",
      features: [
        "Komplette Außenreinigung",
        "Komplette Innenreinigung",
        "Pflege von Armaturenbrett und Mittelkonsole",
        "Leder-/Stoffbehandlung",
        "Geruchsbeseitigung",
        "Lackversiegelung",
      ],
      recommended: true,
    },
    {
      id: "ultimate",
      name: "Deluxe",
      tagline: "Das Komplettpaket für die komplette Fahrzeugtransformation",
      description: "Komplettpaket mit voller Innen- und Außenreinigung, Leder-/Stoffbehandlung, Geruchsbeseitigung und Lackversiegelung.",
      price: 250,
      duration: "7–9 Std.",
      features: [
        "Komplette Außenreinigung",
        "Komplette Innenreinigung",
        "Pflege von Armaturenbrett und Mittelkonsole",
        "Leder-/Stoffbehandlung",
        "Geruchsbeseitigung",
        "Lackversiegelung",
      ],
    },
  ],
  paint_correction: [
    {
      id: "basic",
      name: "Single Stage",
      tagline: "Light correction",
      description: "One-step machine polish to remove light swirls and restore gloss by 60–70%.",
      price: 349,
      duration: "4–5 hrs",
      features: ["1-step machine polish", "Removes light swirls & haze", "Gloss enhancement", "Ideal for well-maintained paint"],
    },
    {
      id: "premium",
      name: "Two Stage",
      tagline: "Deep correction",
      description: "Cutting compound followed by a high-gloss finishing polish — removes up to 85–90% of defects.",
      price: 549,
      duration: "7–9 hrs",
      features: ["Compound cutting stage", "High-gloss finishing polish", "Removes deep swirls & scratches", "Paint decontamination included"],
      recommended: true,
    },
    {
      id: "ultimate",
      name: "Three Stage",
      tagline: "Concours finish",
      description: "Multi-stage correction including spot wet-sanding for a 95%+ defect removal mirror finish.",
      price: 899,
      duration: "10–14 hrs",
      features: ["Multi-stage compound & polish", "Spot wet-sanding", "95%+ defect removal", "Show-car mirror reflection"],
    },
  ],
  ceramic: [
    {
      id: "basic",
      name: "1-Year Shield",
      tagline: "Entry protection",
      description: "Entry-level ceramic coating with extreme hydrophobic performance for 12 months.",
      price: 599,
      duration: "5–6 hrs",
      features: ["1-year protection guarantee", "Contact angle >110°", "Paint prep included", "Maintenance kit"],
    },
    {
      id: "premium",
      name: "3-Year Pro",
      tagline: "Professional grade",
      description: "Dual-layer 9H ceramic coating for superior chemical resistance and UV protection.",
      price: 899,
      duration: "8–10 hrs",
      features: ["3-year guarantee", "9H hardness layer", "Chemical & UV resistance", "Wheel coating included"],
      recommended: true,
    },
    {
      id: "ultimate",
      name: "5-Year Graphene",
      tagline: "The ultimate shield",
      description: "Graphene-enhanced multi-layer coating for maximum heat resistance and permanent gloss.",
      price: 1399,
      duration: "12–14 hrs",
      features: ["5-year premium guarantee", "Graphene multi-layer formula", "Heat & water spot resistance", "Glass & wheel coating included"],
    },
  ],
};

// ─── Service-specific questions ───────────────────────────────────────────────
export const SERVICE_QUESTIONS: Record<ServiceId, ServiceQuestion[]> = {
  exterior: [
    {
      id: "ext_condition",
      question: "How is your paint condition?",
      iconName: "Search",
      options: [
        { id: "good", label: "Good — minor swirls", iconName: "CheckCircle" },
        { id: "moderate", label: "Moderate — visible scratches", iconName: "AlertCircle" },
        { id: "poor", label: "Poor — heavy oxidation", iconName: "XCircle" },
      ],
    },
    {
      id: "ext_coating",
      question: "Any existing coating or wax?",
      iconName: "Layers",
      options: [
        { id: "none", label: "None", iconName: "X" },
        { id: "wax", label: "Wax / sealant", iconName: "Droplets" },
        { id: "ceramic", label: "Ceramic coating", iconName: "ShieldCheck" },
      ],
    },
  ],
  interior: [
    {
      id: "int_pet",
      question: "Pet hair present?",
      iconName: "Dog",
      options: [
        { id: "no", label: "No", iconName: "X" },
        { id: "light", label: "Light amount", iconName: "Minus" },
        { id: "heavy", label: "Heavy — dog / cat", iconName: "AlertCircle" },
      ],
    },
    {
      id: "int_leather",
      question: "Seat material?",
      iconName: "Armchair",
      options: [
        { id: "fabric", label: "Fabric", iconName: "Layers" },
        { id: "leather", label: "Leather", iconName: "Star" },
        { id: "alcantara", label: "Alcantara / suede", iconName: "Sparkles" },
      ],
    },
  ],
  full_detail: [
    {
      id: "full_pet",
      question: "Pet hair present?",
      iconName: "Dog",
      options: [
        { id: "no", label: "No", iconName: "X" },
        { id: "yes", label: "Yes", iconName: "AlertCircle" },
      ],
    },
    {
      id: "full_paint",
      question: "Paint condition?",
      iconName: "Search",
      options: [
        { id: "good", label: "Good", iconName: "CheckCircle" },
        { id: "moderate", label: "Moderate swirls", iconName: "AlertCircle" },
        { id: "poor", label: "Poor — needs correction", iconName: "XCircle" },
      ],
    },
  ],
  paint_correction: [
    {
      id: "pc_type",
      question: "Primary defect type?",
      iconName: "Sparkles",
      options: [
        { id: "swirls", label: "Swirl marks", iconName: "Circle" },
        { id: "scratches", label: "Deep scratches", iconName: "Minus" },
        { id: "oxidation", label: "Oxidation / fading", iconName: "Sun" },
      ],
    },
    {
      id: "pc_coated",
      question: "Previously ceramic coated?",
      iconName: "ShieldCheck",
      options: [
        { id: "no", label: "No coating", iconName: "X" },
        { id: "yes", label: "Yes — needs removal", iconName: "CheckCircle" },
        { id: "unsure", label: "Not sure", iconName: "HelpCircle" },
      ],
    },
  ],
  ceramic: [
    {
      id: "cer_new",
      question: "Vehicle condition?",
      iconName: "Car",
      options: [
        { id: "new", label: "New / near-new", iconName: "Sparkles" },
        { id: "corrected", label: "Paint corrected", iconName: "CheckCircle" },
        { id: "daily", label: "Daily driver", iconName: "Car" },
      ],
    },
    {
      id: "cer_previous",
      question: "Existing coating?",
      iconName: "Layers",
      options: [
        { id: "none", label: "No prior coating", iconName: "X" },
        { id: "expired", label: "Expired coating", iconName: "Clock" },
        { id: "active", label: "Active coating", iconName: "ShieldCheck" },
      ],
    },
  ],
};

// ─── Add-ons ──────────────────────────────────────────────────────────────────
export const ADDONS_DATA: AddOnOption[] = [
  {
    id: "addon_headlight",
    name: "Scheinwerfer Aufbereitung",
    description: "Kristallklare Sicht wiederhergestellt.",
    price: 90,
    iconName: "Lightbulb",
    badge: "Popular",
  },
  {
    id: "addon_pet_hair",
    name: "Tierhaarentfernung",
    description: "Gründliche Fellentfernung.",
    price: 40,
    iconName: "Wind",
  },
  {
    id: "addon_odour",
    name: "Geruchsentfernung",
    description: "Beseitigen Sie unerwünschte Gerüche.",
    price: 110,
    iconName: "Sparkles",
    badge: "110€/Std.",
  },
  {
    id: "addon_interior_prot",
    name: "Innenraumversiegelung",
    description: "Weist Flecken ab & schützt vor UV-Schäden.",
    price: 150,
    iconName: "ShieldCheck",
  },
  {
    id: "addon_glass",
    name: "Windschutzscheibenversiegelung",
    description: "Regenabweisender Schutz.",
    price: 100,
    iconName: "Droplets",
  },
  {
    id: "addon_engine",
    name: "Motorraumreinigung",
    description: "Makelloser Motorraum.",
    price: 85,
    iconName: "Gauge",
  },
  {
    id: "addon_wheel_ceramic",
    name: "Keramikversiegelung für Felgen",
    description: "Langlebiger Felgenschutz.",
    price: 120,
    iconName: "Circle",
    badge: "120€/Felge",
  },
  {
    id: "addon_scratch",
    name: "Ausbesserungsservice",
    description: "Steinschläge & tiefe Kratzer reparieren.",
    price: 50,
    iconName: "Wrench",
    badge: "ab 50€",
  },
];

// ─── Time slots ───────────────────────────────────────────────────────────────
export const TIME_SLOTS = [
  { slot: "08:00", period: "Morning", available: true },
  { slot: "09:30", period: "Morning", available: true },
  { slot: "11:00", period: "Morning", available: false },
  { slot: "13:00", period: "Afternoon", available: true },
  { slot: "14:30", period: "Afternoon", available: true },
  { slot: "16:00", period: "Afternoon", available: true },
  { slot: "17:30", period: "Evening", available: false },
];
