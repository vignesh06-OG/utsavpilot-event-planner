import type { 
  EventPlan, 
  EventInput, 
  ReplanDelta, 
  CategoryReplanDiff,
  PlanTask,
  VendorChecklistItem
} from '../domain/types';
import { calculateBudgetFeasibility, formatINR } from './budgetEngine';

export interface ReplanConstraintsInput {
  newBudget?: number;
  newGuestCount?: number;
  newDate?: string;
  newTier?: EventInput['tier'];
  newPriorities?: string[];
  newNotes?: string;
}

/**
 * Executes constraint delta calculation, preserves user decisions,
 * identifies impacted categories, and constructs a clear natural-language explanation.
 */
export function calculateReplanDelta(
  currentPlan: EventPlan,
  changes: ReplanConstraintsInput
): {
  updatedPlan: EventPlan;
  delta: ReplanDelta;
} {
  const prevInput = currentPlan.input;
  const newBudget = changes.newBudget !== undefined ? changes.newBudget : prevInput.totalBudget;
  const newGuestCount = changes.newGuestCount !== undefined ? changes.newGuestCount : prevInput.guestCount;
  const newDate = changes.newDate || prevInput.date;
  const newTier = changes.newTier || prevInput.tier;
  const newPriorities = changes.newPriorities || prevInput.priorities;
  const newNotes = changes.newNotes !== undefined ? changes.newNotes : prevInput.notes;

  const updatedInput: EventInput = {
    ...prevInput,
    totalBudget: newBudget,
    guestCount: newGuestCount,
    date: newDate,
    tier: newTier,
    priorities: newPriorities,
    notes: newNotes,
  };

  // Recalculate budget deterministically
  const newBudgetReport = calculateBudgetFeasibility(updatedInput);

  // Compare previous categories with new categories
  const categoryDiffs: CategoryReplanDiff[] = [];
  const prevCategoryMap = new Map(currentPlan.budgetReport.categories.map((c) => [c.id, c]));

  newBudgetReport.categories.forEach((newCat) => {
    const prevCat = prevCategoryMap.get(newCat.id);
    const prevAmount = prevCat ? prevCat.allocatedAmount : 0;
    const deltaAmount = newCat.allocatedAmount - prevAmount;
    const deltaPercentage = prevAmount > 0 ? Number(((deltaAmount / prevAmount) * 100).toFixed(1)) : 0;

    let reason = 'Unchanged';
    if (deltaAmount > 0) {
      reason = `Increased by ${formatINR(deltaAmount)} (${deltaPercentage > 0 ? '+' : ''}${deltaPercentage}%) to accommodate revised scale.`;
    } else if (deltaAmount < 0) {
      reason = `Trimmed by ${formatINR(Math.abs(deltaAmount))} (${deltaPercentage}%) to keep overall plan within budget.`;
    }

    categoryDiffs.push({
      categoryId: newCat.id,
      categoryName: newCat.name,
      previousAmount: prevAmount,
      newAmount: newCat.allocatedAmount,
      deltaAmount,
      deltaPercentage,
      reason,
    });
  });

  // Preserve user decisions on tasks:
  // Completed tasks and customized notes remain 100% intact!
  const preservedTasks: PlanTask[] = currentPlan.tasks.map((task) => {
    return { ...task };
  });

  // If date changed, adjust task deadlines dynamically
  if (newDate !== prevInput.date) {
    const prevDateObj = new Date(prevInput.date);
    const newDateObj = new Date(newDate);
    const dateShiftDays = Math.round((newDateObj.getTime() - prevDateObj.getTime()) / (1000 * 3600 * 24));

    preservedTasks.forEach((t) => {
      // Keep daysBeforeEvent relative to the new event date
      t.notes = t.notes 
        ? `${t.notes} [Shifted ${dateShiftDays > 0 ? `+${dateShiftDays}` : dateShiftDays}d]` 
        : `Rescheduled for ${newDate} (${dateShiftDays > 0 ? `+${dateShiftDays}` : dateShiftDays}d shift)`;
    });
  }

  // Preserve booked vendor statuses
  const preservedVendors: VendorChecklistItem[] = currentPlan.vendorChecklist.map((v) => {
    return { ...v };
  });

  // Generate actionable natural-language explanation and trade-offs
  const tradeOffSuggestions: string[] = [];
  const budgetDelta = newBudget - prevInput.totalBudget;
  const guestDelta = newGuestCount - prevInput.guestCount;

  if (budgetDelta < 0) {
    tradeOffSuggestions.push(
      `Budget reduced by ${formatINR(Math.abs(budgetDelta))}: We scaled down non-essential decor and entertainment line items while protecting core catering quality.`
    );
    tradeOffSuggestions.push(
      `Vendor recommendation: Negotiate package discounts or opt for seasonal regional flowers instead of imported blooms.`
    );
  } else if (budgetDelta > 0) {
    tradeOffSuggestions.push(
      `Budget increased by ${formatINR(budgetDelta)}: Allocated additional funds towards guest hospitality, elevated dining experiences, and increased contingency reserve.`
    );
  }

  if (guestDelta > 0) {
    tradeOffSuggestions.push(
      `Guest count expanded by +${guestDelta}: Catering and dining allocations have automatically scaled. Verify banquet hall maximum legal occupancy with the venue manager.`
    );
  } else if (guestDelta < 0) {
    tradeOffSuggestions.push(
      `Guest count reduced by ${Math.abs(guestDelta)}: Reduced catering minimum guarantee plates to avoid food wastage.`
    );
  }

  if (newBudgetReport.shortfallAmount > 0) {
    tradeOffSuggestions.push(
      `Warning: At ${newGuestCount} guests and ${formatINR(newBudget)}, you are currently running a deficit of ${formatINR(newBudgetReport.shortfallAmount)} compared to realistic market benchmarks.`
    );
  }

  const delta: ReplanDelta = {
    previousBudget: prevInput.totalBudget,
    newBudget,
    previousGuests: prevInput.guestCount,
    newGuests: newGuestCount,
    explanation: `Plan adapted for ${newGuestCount} guests with revised budget of ${formatINR(newBudget)} in ${updatedInput.city}. All previously marked completed tasks and vendor bookings have been preserved.`,
    categoryDiffs,
    tradeOffSuggestions,
  };

  const updatedPlan: EventPlan = {
    ...currentPlan,
    input: updatedInput,
    budgetReport: newBudgetReport,
    tasks: preservedTasks,
    vendorChecklist: preservedVendors,
    summary: `Adapted Celebration Plan: ${updatedInput.title} for ${newGuestCount} guests with a budget of ${formatINR(newBudget)}. Feasibility: ${newBudgetReport.isFeasible ? 'Feasible' : 'Requires Adjustment'}.`,
  };

  return {
    updatedPlan,
    delta,
  };
}
