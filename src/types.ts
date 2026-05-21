export type UserRole = 'incubator_admin' | 'startup_founder' | 'technical_expert';
export const UserRole = {
  ADMIN: 'incubator_admin' as const,
  STARTUP: 'startup_founder' as const,
  MENTOR: 'technical_expert' as const
};

export interface AuditReport {
  commitsVerified: number;
  totalCommits: number;
  testCoverage: number;
  figmaTokens: boolean;
  score: number; // 0.00 to 1.00
  verdict: 'approved' | 'rejected' | 'pending';
  notes: string;
}

export interface Milestone {
  id: number;
  title: string;
  amount: number; // in ARB
  status: 'funded' | 'ai_review' | 'paid_out';
  deadline: string;
  auditReport: AuditReport;
  txHash?: string;
  evidenceLink?: string;
  evidenceType?: 'commit' | 'figma' | 'report';
}

export interface StartupProject {
  id: string;
  name: string;
  category: string; // e.g. 'Fintech', 'Edtech'
  description: string;
  escrowTotal: number; // locked in ARB
  escrowReleased: number; // released in ARB
  activeMilestoneId: number;
  milestones: Milestone[];
  walletConnected?: boolean;
  walletAddress?: string;
  githubRepo?: string;
  figmaUrl?: string;
  isPaused?: boolean; // Pause Guardian state
}

export interface UserSession {
  role: UserRole;
  activeStartupId?: string; // If role is STARTUP
  isLoggedIn: boolean;
  walletAddress?: string;
  onboardingStep?: number; // 1: Profile, 2: Code, 3: Wallet, 4: Done
}
