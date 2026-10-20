import type { 
  EventInput, 
  BudgetFeasibilityReport, 
  BudgetCategory, 
  BudgetSubItem, 
  CostProvenance 
} from '../domain/types';
import { 
  INDIAN_EVENT_ALLOCATION_PRESETS, 
  MINIMUM_PER_GUEST_BENCHMARKS 
} from '../domain/eventDefaults';

/**
 * Formats a number into Indian Rupee format (e.g. ₹35,00,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded);
  
  // Format with Indian locale
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(absVal);

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Formats large amounts into readable Indian denominations (Lakhs / Crores)
 */
export function formatLakhCrore(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (abs >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  return formatINR(amount);
}

/**
 * Deterministically computes category allocations, contingency reserve, and checks feasibility.
 * Guarantee: Sum of all categories (including contingency) == totalBudget EXACTLY.
 */
export function calculateBudgetFeasibility(input: EventInput): BudgetFeasibilityReport {
  const { eventType, tier, guestCount, totalBudget } = input;
  const presets = INDIAN_EVENT_ALLOCATION_PRESETS[eventType] || INDIAN_EVENT_ALLOCATION_PRESETS.wedding;

  const costPerGuest = guestCount > 0 ? Math.round(totalBudget / guestCount) : 0;
  const minBenchmark = MINIMUM_PER_GUEST_BENCHMARKS[eventType]?.[tier] || 500;

  const feasibilityWarnings: string[] = [];
  const actionableLevers: string[] = [];
  let isFeasible = true;
  let shortfallAmount = 0;

  // Feasibility Check 1: Per-guest unit economics
  if (costPerGuest < minBenchmark) {
    isFeasible = false;
    const requiredBudget = minBenchmark * guestCount;
    shortfallAmount = requiredBudget - totalBudget;
    feasibilityWarnings.push(
      `Your current budget of ${formatINR(totalBudget)} for ${guestCount} guests yields ${formatINR(costPerGuest)}/guest. Benchmark cost for a ${tier} ${eventType.replace('_', ' ')} is ${formatINR(minBenchmark)}/guest.`
    );
    actionableLevers.push(
      `Option A: Adjust guest count from ${guestCount} to ~${Math.floor(totalBudget / minBenchmark)} guests to match your budget.`
    );
    actionableLevers.push(
      `Option B: Increase total budget by ${formatINR(shortfallAmount)} to reach benchmark feasibility.`
    );
    actionableLevers.push(
      `Option C: Downgrade from '${tier}' tier or adopt DIY / community banquet arrangements for catering and venue.`
    );
  }

  // Feasibility Check 2: Absolute floor thresholds
  if (totalBudget < 25000 && (eventType === 'wedding' || eventType === 'corporate_celebration')) {
    isFeasible = false;
    feasibilityWarnings.push(
      `Budget is critically below standard minimum operating overheads for a ${eventType.replace('_', ' ')}.`
    );
  }

  // Deterministic Category Calculation:
  // We allocate integer rupees based on preset percentages, and assign any rounding discrepancy
  // to the contingency category so the sum reconciles 100.00% perfectly.
  const categories: BudgetCategory[] = [];
  let totalAllocatedExcludingContingency = 0;
  let contingencyCategoryPreset = presets.find((p) => p.id === 'contingency');
  const regularPresets = presets.filter((p) => p.id !== 'contingency');

  regularPresets.forEach((preset) => {
    const rawAmount = (totalBudget * preset.defaultPercentage) / 100;
    const allocated = Math.round(rawAmount);
    totalAllocatedExcludingContingency += allocated;

    // Sub items breakdown
    const subItemCount = preset.typicalItems.length;
    const subItemBase = Math.floor(allocated / subItemCount);
    let subItemRemainder = allocated - subItemBase * subItemCount;

    const subItems: BudgetSubItem[] = preset.typicalItems.map((item, idx) => {
      const itemAmount = subItemBase + (idx === 0 ? subItemRemainder : 0);
      return {
        id: `${preset.id}_sub_${idx + 1}`,
        name: item,
        amount: itemAmount,
        provenance: 'estimated' as CostProvenance,
        notes: `Estimated benchmark for ${tier} tier in ${input.city}`,
      };
    });

    categories.push({
      id: preset.id,
      name: preset.name,
      allocatedAmount: allocated,
      percentage: preset.defaultPercentage,
      provenance: 'estimated',
      rationale: `Standard allocation benchmark (${preset.defaultPercentage}%) for Indian ${eventType.replace('_', ' ')}s`,
      subItems,
    });
  });

  // Calculate contingency as the exact remaining balance so that sum(categories) === totalBudget
  const contingencyAmount = Math.max(0, totalBudget - totalAllocatedExcludingContingency);
  const contingencyPercentage = totalBudget > 0 ? Number(((contingencyAmount / totalBudget) * 100).toFixed(1)) : 0;

  const contingencyCategory: BudgetCategory = {
    id: 'contingency',
    name: contingencyCategoryPreset ? contingencyCategoryPreset.name : 'Contingency Reserve',
    allocatedAmount: contingencyAmount,
    percentage: contingencyPercentage,
    provenance: 'estimated',
    rationale: 'Unallocated emergency reserve for sudden guest additions, overtime charges, and unforeseen expenses.',
    subItems: [
      {
        id: 'contingency_reserve',
        name: 'Emergency Buffer & Overtime Fund',
        amount: contingencyAmount,
        provenance: 'estimated',
        notes: 'Held in reserve until vendor settlement day',
      },
    ],
  };

  categories.push(contingencyCategory);

  // Verification sanity check: Reconcile sum
  const finalSum = categories.reduce((acc, cat) => acc + cat.allocatedAmount, 0);
  if (finalSum !== totalBudget && categories.length > 0) {
    // Correct minor discrepancy on contingency
    const diff = totalBudget - finalSum;
    categories[categories.length - 1].allocatedAmount += diff;
  }

  const allocatedSum = categories.reduce((acc, cat) => acc + cat.allocatedAmount, 0);

  return {
    totalBudget,
    allocatedSum,
    contingencyAmount,
    contingencyPercentage,
    isFeasible,
    shortfallAmount,
    costPerGuest,
    feasibilityWarnings,
    actionableLevers,
    categories,
  };
}

/**
 * Recalculates category allocations when user updates a single category's budget,
 * adjusting contingency or proportionately balancing other categories.
 */
export function updateCategoryBudget(
  currentReport: BudgetFeasibilityReport,
  categoryId: string,
  newAmount: number
): BudgetFeasibilityReport {
  const categories = currentReport.categories.map((c) => ({
    ...c,
    subItems: [...c.subItems],
  }));

  const targetCategory = categories.find((c) => c.id === categoryId);
  if (!targetCategory) return currentReport;

  targetCategory.allocatedAmount = Math.max(0, Math.round(newAmount));
  targetCategory.provenance = 'user_specified';

  // Recalculate percentages
  const total = currentReport.totalBudget;
  categories.forEach((cat) => {
    cat.percentage = total > 0 ? Number(((cat.allocatedAmount / total) * 100).toFixed(1)) : 0;
  });

  const allocatedSum = categories.reduce((acc, c) => acc + c.allocatedAmount, 0);
  const diff = total - allocatedSum;

  const contingency = categories.find((c) => c.id === 'contingency');
  if (contingency && categoryId !== 'contingency') {
    contingency.allocatedAmount = Math.max(0, contingency.allocatedAmount + diff);
    contingency.percentage = total > 0 ? Number(((contingency.allocatedAmount / total) * 100).toFixed(1)) : 0;
  }

  const finalAllocatedSum = categories.reduce((acc, c) => acc + c.allocatedAmount, 0);

  return {
    ...currentReport,
    allocatedSum: finalAllocatedSum,
    contingencyAmount: contingency ? contingency.allocatedAmount : 0,
    contingencyPercentage: contingency ? contingency.percentage : 0,
    categories,
  };
}
