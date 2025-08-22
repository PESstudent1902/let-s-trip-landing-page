export interface GameScenario {
  id: number;
  title: string;
  scenario: string;
  task: string;
  type: "mcq" | "short";
  options?: string[];
  timeLimit: number; // in seconds
}

export const gameScenarios: GameScenario[] = [
  {
    id: 1,
    title: "Bear or Bull (Market Mood Match)",
    scenario:
      "Tesla Misses Earnings but Announces India Entry — Revenue down 8%, but Elon tweets about opening a gigafactory in Gujarat.",
    task: "Pick the correct market sentiment & justify.",
    type: "mcq",
    options: [
      "A. Bull – Investors focus on India growth potential.",
      "B. Bear – Poor earnings outweigh expansion news.",
      "C. Flat – Both events balance out.",
      "D. Volatile – Market swings before settling.",
    ],
    timeLimit: 60,
  },
  {
    id: 2,
    title: "Inflation (Crisis Control)",
    scenario:
      "Inflation at 9.2%. Public outrage is rising. You head the RBI task force.",
    task: "Pick a policy & defend it.",
    type: "mcq",
    options: [
      "A. Raise interest rates by 1.5%",
      "B. Ration food & fuel",
      "C. Stop all new govt spending for 6 months",
      "D. Ask corporates to freeze price hikes voluntarily",
    ],
    timeLimit: 60,
  },
  {
    id: 3,
    title: "Pricing (Bathroom Economics)",
    scenario: "Toilet Paper with Rizz™ — scented, eco-friendly, QR jokes.",
    task: "Pick best price based on psychology, segmentation, & margins.",
    type: "mcq",
    options: [
      "A. ₹29 – Mass market",
      "B. ₹49 – Mid-premium",
      'C. ₹99 – Luxury "Bathroom Experience"',
    ],
    timeLimit: 60,
  },
  {
    id: 4,
    title: "Disappearing Brand (Brand Mystery)",
    scenario: "SplashPop Soda vanished in 2023.",
    task: "Pick the most likely cause.",
    type: "mcq",
    options: [
      "A. TikTok toothpaste mix challenge went wrong",
      'B. Launched "Shrimp Punch" flavor',
      "C. Glow-in-dark bottle melted in sun",
    ],
    timeLimit: 60,
  },
  {
    id: 5,
    title: "Opportunity Cost (Career Crossroads)",
    scenario:
      "₹18 LPA Bain offer (stable, fast track to IIM) vs ₹16 LPA SpaceX India (risky, 1st 20 employees).",
    task: "Explain what you gain AND give up.",
    type: "mcq",
    options: [
      "A. Bain – Prestige, network, stability",
      "B. SpaceX – Innovation, risk, pioneering role",
    ],
    timeLimit: 60,
  },
  {
    id: 6,
    title: "Tagline Twist (Decode the Hype)",
    scenario: '"Organized chaos you volunteered for."',
    task: "Match the tagline to the platform.",
    type: "mcq",
    options: [
      "A. Reddit",
      "B. Twitter (X)",
      "C. WhatsApp group chats",
      "D. Pinterest",
    ],
    timeLimit: 60,
  },
  {
    id: 7,
    title: "Types of Market (Market Match-Up)",
    scenario: "Visa & Mastercard in India despite UPI dominance.",
    task: "Identify the market structure.",
    type: "mcq",
    options: [
      "A. Duopoly",
      "B. Monopolistic Competition",
      "C. Natural Oligopoly",
      "D. Regulated Monopoly",
    ],
    timeLimit: 60,
  },
  {
    id: 8,
    title: "The Bedtime Lie (Self-Truth Check)",
    scenario: '"Lie down for 5 mins" → wake up 4 hrs later.',
    task: "Decide — lie or truth? Justify logically.",
    type: "short",
    timeLimit: 60,
  },
  {
    id: 9,
    title: "The 'Do Not Enter' Door (Rule or Trap?)",
    scenario: 'Sign says "Do Not Enter," behind it is free dessert.',
    task: "Entering — break rule or follow trap? Justify.",
    type: "short",
    timeLimit: 60,
  },
  {
    id: 10,
    title: "Budget Breakdown (Budget or Bust)",
    scenario:
      "Rick & Morty's Multiverse Hackathon — ₹1,00,000 left after Rick blows half budget.",
    task: "Pick & justify your budget allocation.",
    type: "mcq",
    options: [
      "A. WiFi (30k), Alien snacks (40k), Stage (30k)",
      "B. Portal insurance (50k), Translator drones (20k), ID cards (30k)",
      "C. Livestream tech (25k), Wormhole security (35k), PR (40k)",
      "D. Custom chaos config",
    ],
    timeLimit: 60,
  },
  {
    id: 11,
    title: "Corporate Ethics (Corporate Compass)",
    scenario:
      "Your company discovers a product defect that could cause minor injuries. Recall costs ₹50 crores, legal costs if discovered later could be ₹200 crores.",
    task: "Pick your ethical stance & justify.",
    type: "mcq",
    options: [
      "A. Immediate recall – protect customers first",
      "B. Silent fix in next batch – minimize costs",
      "C. Legal disclosure – let customers decide",
      "D. Wait for complaints – react if needed",
    ],
    timeLimit: 60,
  },
  {
    id: 12,
    title: "Society Ethics (Social Morality)",
    scenario:
      "A whistleblower reveals government corruption but breaks national security laws in the process.",
    task: "Choose & defend your ethical stance.",
    type: "mcq",
    options: [
      "A. Support whistleblower – public interest first",
      "B. Prosecute for law breaking – rules matter",
      "C. Conditional immunity – balanced approach",
      "D. Case-by-case evaluation – context matters",
    ],
    timeLimit: 60,
  },
  {
    id: 13,
    title: "The Restaurant Rule (Logic Loop)",
    scenario:
      'Restaurant sign: "We serve everyone who doesn\'t follow rules." You break one rule.',
    task: "Are you served? Explain the paradox.",
    type: "short",
    timeLimit: 60,
  },
  {
    id: 14,
    title: "Turn Trash into Treasure (From Worst to Wow)",
    scenario: "Reversible socks with pockets.",
    task: 'Transform this "worst" product into something amazing.',
    type: "mcq",
    options: [
      'A. "Sockrets" snack stash',
      "B. Airport gum/cash holder",
      "C. ADHD-friendly fidget fashion",
      "D. Survival kit drop",
    ],
    timeLimit: 60,
  },
  {
    id: 15,
    title: "Government Ethics (Policy Morality)",
    scenario:
      "Pandemic lockdown vs economic collapse. 10,000 jobs lost daily vs 500 lives lost daily.",
    task: "Balance legality, trust, and long-term impact.",
    type: "mcq",
    options: [
      "A. Strict lockdown – lives over economy",
      "B. Open economy – livelihoods matter",
      "C. Phased reopening – balanced approach",
      "D. Local decisions – context-based policy",
    ],
    timeLimit: 60,
  },
  {
    id: 16,
    title: "Packaging Problem (Product Survival)",
    scenario: "Perfume leak crisis causing ₹2 crore monthly losses.",
    task: "Pick fix & justify cost-benefit.",
    type: "mcq",
    options: [
      "A. Heavier glass bottles — more freight cost",
      "B. Tamper-proof wrap — melts in heat",
      "C. Mini bottles — triple packaging cost",
      "D. Industrial-grade threading — 3-week delay",
      "E. Fill locally — reduces scent life",
    ],
    timeLimit: 60,
  },
  {
    id: 17,
    title: "Mystery Product Combination (Product Mashup)",
    scenario: "The Stationery Stunt — paperclip, torn ruler, crayon stub.",
    task: "Create a viable product from these components.",
    type: "mcq",
    options: [
      'A. "I-Measured-Wrong" Ruler',
      "B. Multi-use Crayon Clip",
      "C. Stress Cracker Pack",
    ],
    timeLimit: 60,
  },
  {
    id: 18,
    title: "Investigation Type Thing (HR Sleuth)",
    scenario:
      "Office coffee machine money disappears daily. Security shows 3 people near it: intern (always broke), manager (hates coffee), cleaner (night shift).",
    task: "Solve using logic + given clues.",
    type: "short",
    timeLimit: 60,
  },
  {
    id: 19,
    title: "The Perfect Team Combo (HR Strategist)",
    scenario:
      "Build 5-person team: Genius (arrogant), Veteran (slow adopter), Rookie (eager), Diplomat (conflict-averse), Maverick (rule-breaker).",
    task: "Balance skill, diversity, & conflict control.",
    type: "short",
    timeLimit: 60,
  },
  {
    id: 20,
    title: "Reverse Auction (Strategy Meets Originality)",
    scenario:
      "Founder's Survival — with ₹100, list cheapest unique business-starting item.",
    task: "Lowest unique bid wins. Think strategy + originality.",
    type: "short",
    timeLimit: 60,
  },
  {
    id: 21,
    title: "Burning Building (Marketing Rescue)",
    scenario: "Warehouse fire — you can save only ONE category of inventory.",
    task: "Pick what to save for business survival.",
    type: "mcq",
    options: [
      "A. Viral product stock",
      "B. Raw materials (6 months)",
      "C. Discontinued products",
      "D. Celebrity collab stock",
      "E. R&D equipment",
    ],
    timeLimit: 60,
  },
  {
    id: 22,
    title: "Risk It! (The Hustler's Bet)",
    scenario:
      "NFT-based food delivery startup dying. ₹5 lakhs left, 2 months runway.",
    task: "Pick your pivot strategy.",
    type: "mcq",
    options: [
      "A. B2B food tokens for corporates",
      'B. "Pay-to-Cook" app',
      "C. Meme page partnership",
      "D. Kill brand → dating app",
    ],
    timeLimit: 60,
  },
  {
    id: 23,
    title: "Trade Game (Survival Markets)",
    scenario:
      "Crisis countries trade: Oil (Saudi), Tech (Japan), Food (India), Military (USA). You're India facing drought.",
    task: "Trade resources to survive. Justify strategy.",
    type: "short",
    timeLimit: 60,
  },
  {
    id: 24,
    title: "CFO Challenge (CFO's Last Stand)",
    scenario:
      'CloneCorp board wants to cut "empathy modules" from AI products to boost profits 40%.',
    task: "You're the CFO. Choose your response.",
    type: "mcq",
    options: [
      "A. Resign",
      "B. Stay silent + exit strategy",
      "C. Leak to media",
      'D. Rebrand sociopaths as "efficiency experts"',
    ],
    timeLimit: 60,
  },
  {
    id: 25,
    title: "Monopoly Auction (Final Bidding War)",
    scenario:
      "Teams bid fake money on surprise mystery boxes — may help or sabotage your final score.",
    task: "Bid strategically on unknown items. High risk, high reward.",
    type: "short",
    timeLimit: 60,
  },
];

export interface Player {
  id: string;
  name: string;
  teamName?: string;
  isAdmin: boolean;
  connected: boolean;
  answers: Array<{
    scenarioId: number;
    selectedOption?: string;
    justification: string;
    submittedAt: number;
  }>;
  score: number;
  eliminated: boolean;
}

export interface GameState {
  id: string;
  phase: "lobby" | "waiting" | "rolling" | "question" | "results" | "finished";
  currentScenario: number | null;
  diceResult: number | null;
  isRolling: boolean;
  questionStartTime: number | null;
  usedScenarios: number[];
  players: Record<string, Player>;
  adminId: string | null;
  settings: {
    adminUsername: string;
    adminPassword: string;
    maxPlayers: number;
  };
}

export interface AnswerSubmission {
  scenarioId: number;
  selectedOption?: string;
  justification: string;
}
