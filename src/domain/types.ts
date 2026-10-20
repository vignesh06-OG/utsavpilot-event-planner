export type EventType = 
  | 'wedding' 
  | 'birthday' 
  | 'puja' 
  | 'college_fest' 
  | 'community_event' 
  | 'corporate_celebration';

export type EventTier = 'budget' | 'standard' | 'premium' | 'luxury';

export type CostProvenance = 'verified' | 'user_specified' | 'estimated';

export interface EventInput {
  eventType: EventType;
  title: string;
  date: string;
  durationDays: number;
  city: string;
  tier: EventTier;
  guestCount: number;
  totalBudget: number;
  currency: 'INR';
  dietaryRequirements: string[];
  accessibilityNeeds: string[];
  priorities: string[];
  styleTheme: string;
  notes?: string;
}

export interface BudgetSubItem {
  id: string;
  name: string;
  amount: number;
  provenance: CostProvenance;
  notes?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocatedAmount: number;
  percentage: number;
  provenance: CostProvenance;
  rationale: string;
  subItems: BudgetSubItem[];
}

export interface BudgetFeasibilityReport {
  totalBudget: number;
  allocatedSum: number;
  contingencyAmount: number;
  contingencyPercentage: number;
  isFeasible: boolean;
  shortfallAmount: number;
  costPerGuest: number;
  feasibilityWarnings: string[];
  actionableLevers: string[];
  categories: BudgetCategory[];
}

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export type TaskMilestonePhase = 
  | 'months_before' 
  | 'weeks_before' 
  | 'days_before' 
  | 'day_of' 
  | 'post_event';

export interface PlanTask {
  id: string;
  title: string;
  category: string;
  phase: TaskMilestonePhase;
  daysBeforeEvent: number;
  isCompleted: boolean;
  assignedOwner?: string;
  priority: TaskPriority;
  dependencies?: string[];
  notes?: string;
}

export type VendorStatus = 'not_contacted' | 'shortlisted' | 'negotiating' | 'booked';

export interface VendorChecklistItem {
  id: string;
  category: string;
  serviceTitle: string;
  status: VendorStatus;
  benchmarkCostRange: string;
  provenance: CostProvenance;
  keyQuestionsToAsk: string[];
  verificationTip: string;
  bookedVendorName?: string;
  agreedPrice?: number;
}

export interface PersonalizedSuggestions {
  themeAndDecor: string[];
  foodAndBeverage: string[];
  entertainmentAndRituals: string[];
  culturalConsiderations: string[];
  accessibilityPlan: string[];
}

export interface EventPlan {
  id: string;
  createdAt: string;
  input: EventInput;
  summary: string;
  budgetReport: BudgetFeasibilityReport;
  tasks: PlanTask[];
  vendorChecklist: VendorChecklistItem[];
  suggestions: PersonalizedSuggestions;
  assumptions: string[];
  unresolvedDecisions: string[];
  isDemoSample?: boolean;
  modelUsed: 'gemini-flash' | 'deterministic-fallback';
}

export interface CategoryReplanDiff {
  categoryId: string;
  categoryName: string;
  previousAmount: number;
  newAmount: number;
  deltaAmount: number;
  deltaPercentage: number;
  reason: string;
}

export interface ReplanDelta {
  previousBudget: number;
  newBudget: number;
  previousGuests: number;
  newGuests: number;
  explanation: string;
  categoryDiffs: CategoryReplanDiff[];
  tradeOffSuggestions: string[];
}
