import { RawCompanyData } from './types';

export const MOCK_RAW_DATA: RawCompanyData[] = [
  {
    id: "c1",
    name: "LegalMind",
    batch: "W24",
    website: "legalmind.ai",
    rawDescription: "We help law firms automate contract review using large language models. Our system catches 95% of errors that junior associates miss."
  },
  {
    id: "c2",
    name: "BioFold",
    batch: "W24",
    website: "biofold.bio",
    rawDescription: "Generative protein design for novel therapeutics. We use diffusion models to create new drug candidates in minutes."
  },
  {
    id: "c3",
    name: "SalesAgent.io",
    batch: "W24",
    website: "salesagent.io",
    rawDescription: "Autonomous voice agents for outbound sales calls. It sounds exactly like a human and can handle objections in real-time."
  },
  {
    id: "c4",
    name: "DevFlow",
    batch: "S23",
    website: "devflow.dev",
    rawDescription: "An internal developer portal that organizes microservices. Not AI-based, purely for orchestration."
  },
  {
    id: "c5",
    name: "VideoGen X",
    batch: "W24",
    website: "videogenx.com",
    rawDescription: "Text-to-video generation for marketing teams. Create high-quality social media ads from a simple prompt."
  },
  {
    id: "c6",
    name: "VectorScale",
    batch: "S23",
    website: "vectorscale.db",
    rawDescription: "The fastest vector database for RAG applications. Optimized for low latency retrieval at billion-scale."
  },
  {
    id: "c7",
    name: "FinPilot",
    batch: "W24",
    website: "finpilot.com",
    rawDescription: "An AI copilot for investment bankers. It automates financial modeling and slide deck creation."
  },
  {
    id: "c8",
    name: "GreenEnergy",
    batch: "S23",
    website: "greenenergy.co",
    rawDescription: "Next generation solar panels with 5% higher efficiency. Hardware startup focused on renewable materials."
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Infrastructure': 'bg-blue-500',
  'Healthcare': 'bg-emerald-500',
  'Sales & Marketing': 'bg-orange-500',
  'Legal & Finance': 'bg-purple-500',
  'Creative & Media': 'bg-pink-500',
  'Developer Tools': 'bg-cyan-500',
  'Other': 'bg-slate-500'
};