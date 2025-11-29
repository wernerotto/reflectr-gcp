export enum EmotionalState {
  Neutral = 'Neutral',
  Rushed = 'Rushed',
  Fragile = 'Fragile',
  Charged = 'Charged',
}

export enum Outcome {
  Pending = 'Pending',
  Win = 'Win',
  Loss = 'Loss',
  Breakeven = 'Breakeven',
}

export interface Trade {
  id: string;
  userId: string;
  timestamp: number;
  symbol: string;
  
  // Pre-Trade (Check-In)
  emotionalState: EmotionalState;
  impulsiveness: number; // 0-10
  confidence: number; // 0-10
  fear: number; // 0-10
  reason: string;
  plan?: string; // Specific entry/exit/risk plan
  
  // Post-Trade (Debrief)
  isComplete: boolean;
  outcome?: Outcome;
  followedPlan?: boolean;
  emotionalShift?: string; // e.g., "Became Anxious", "Stayed Calm"
  regret?: boolean;
  tilt?: boolean;
  reflection?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isPro: boolean; // Subscription tier check
}

export interface InsightResult {
  summary: string;
  riskFactor: string;
  strength: string;
}