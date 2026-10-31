import { z } from 'zod';

export const EventInputSchema = z.object({
  eventType: z.enum([
    'wedding',
    'engagement',
    'anniversary',
    'birthday',
    'puja',
    'college_fest',
    'community_event',
    'corporate_celebration',
  ]),
  title: z.string().min(3, 'Event title must be at least 3 characters').max(100),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid date is required',
  }),
  durationDays: z.number().int().min(1, 'Duration must be at least 1 day').max(14),
  city: z.string().min(2, 'City is required').max(50),
  tier: z.enum(['budget', 'standard', 'premium', 'luxury']),
  guestCount: z.number().int().min(5, 'Guest count must be at least 5').max(5000),
  totalBudget: z.number().positive('Total budget must be a positive number'),
  currency: z.literal('INR'),
  dietaryRequirements: z.array(z.string()).default([]),
  accessibilityNeeds: z.array(z.string()).default([]),
  priorities: z.array(z.string()).default([]),
  styleTheme: z.string().max(200).default(''),
  notes: z.string().max(1000).optional(),
});

export const BudgetSubItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number().nonnegative(),
  provenance: z.enum(['verified', 'user_specified', 'estimated']),
  notes: z.string().optional(),
});

export const BudgetCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  allocatedAmount: z.number().nonnegative(),
  percentage: z.number().min(0).max(100),
  provenance: z.enum(['verified', 'user_specified', 'estimated']),
  rationale: z.string(),
  subItems: z.array(BudgetSubItemSchema),
});

export const BudgetFeasibilityReportSchema = z.object({
  totalBudget: z.number().positive(),
  allocatedSum: z.number().nonnegative(),
  contingencyAmount: z.number().nonnegative(),
  contingencyPercentage: z.number().min(0).max(50),
  isFeasible: z.boolean(),
  shortfallAmount: z.number().nonnegative(),
  costPerGuest: z.number().nonnegative(),
  feasibilityWarnings: z.array(z.string()),
  actionableLevers: z.array(z.string()),
  categories: z.array(BudgetCategorySchema),
});

export const PlanTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  phase: z.enum(['months_before', 'weeks_before', 'days_before', 'day_of', 'post_event']),
  daysBeforeEvent: z.number().int(),
  isCompleted: z.boolean(),
  assignedOwner: z.string().optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  dependencies: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const VendorChecklistItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  serviceTitle: z.string(),
  status: z.enum(['not_contacted', 'shortlisted', 'negotiating', 'booked']),
  benchmarkCostRange: z.string(),
  provenance: z.enum(['verified', 'user_specified', 'estimated']),
  keyQuestionsToAsk: z.array(z.string()),
  verificationTip: z.string(),
  bookedVendorName: z.string().optional(),
  agreedPrice: z.number().optional(),
});

export const PersonalizedSuggestionsSchema = z.object({
  themeAndDecor: z.array(z.string()),
  foodAndBeverage: z.array(z.string()),
  entertainmentAndRituals: z.array(z.string()),
  culturalConsiderations: z.array(z.string()),
  accessibilityPlan: z.array(z.string()),
});

export const EventPlanSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  input: EventInputSchema,
  summary: z.string(),
  budgetReport: BudgetFeasibilityReportSchema,
  tasks: z.array(PlanTaskSchema),
  vendorChecklist: z.array(VendorChecklistItemSchema),
  suggestions: PersonalizedSuggestionsSchema,
  assumptions: z.array(z.string()),
  unresolvedDecisions: z.array(z.string()),
  isDemoSample: z.boolean().optional(),
  modelUsed: z.enum(['gemini-flash', 'deterministic-fallback']),
});
