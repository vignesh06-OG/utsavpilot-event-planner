import { describe, it, expect } from 'vitest';
import { calculateReplanDelta } from '../engine/replanEngine';
import { generateDeterministicPlan } from '../engine/deterministicFallback';
import type { EventInput } from '../domain/types';

describe('ReplanEngine - Adaptive Delta & User Decision Preservation', () => {
  const initialInput: EventInput = {
    eventType: 'birthday',
    title: 'Anaya 5th Birthday',
    date: '2026-12-10',
    durationDays: 1,
    city: 'Mumbai',
    tier: 'standard',
    guestCount: 60,
    totalBudget: 120000,
    currency: 'INR',
    dietaryRequirements: ['Vegetarian Snacks'],
    accessibilityNeeds: ['Stroller parking'],
    priorities: ['Kids games'],
    styleTheme: 'Princess Castle',
  };

  it('preserves completed task states and custom notes during replanning', () => {
    const plan = generateDeterministicPlan(initialInput);

    // Mark task 1 as completed with a custom note
    plan.tasks[0].isCompleted = true;
    plan.tasks[0].notes = 'Booked Sea Princess banquet hall with ₹10,000 token advance.';

    // Replan: Cut budget by ₹20,000 and increase guests to 80
    const { updatedPlan, delta } = calculateReplanDelta(plan, {
      newBudget: 100000,
      newGuestCount: 80,
    });

    // Check preservation
    expect(updatedPlan.tasks[0].isCompleted).toBe(true);
    expect(updatedPlan.tasks[0].notes).toContain('Booked Sea Princess banquet hall');

    // Check delta
    expect(delta.previousBudget).toBe(120000);
    expect(delta.newBudget).toBe(100000);
    expect(delta.previousGuests).toBe(60);
    expect(delta.newGuests).toBe(80);
    expect(delta.tradeOffSuggestions.length).toBeGreaterThan(0);
  });

  it('adjusts dates and task schedule notes when celebration date moves', () => {
    const plan = generateDeterministicPlan(initialInput);

    const { updatedPlan } = calculateReplanDelta(plan, {
      newDate: '2026-12-25', // 15 days later
    });

    expect(updatedPlan.input.date).toBe('2026-12-25');
    expect(updatedPlan.tasks[0].notes).toMatch(/\[Shifted \+15d\]/);
  });

  it('guarantees revised category totals reconcile 100% to new budget', () => {
    const plan = generateDeterministicPlan(initialInput);

    const { updatedPlan } = calculateReplanDelta(plan, {
      newBudget: 350000,
      newGuestCount: 150,
    });

    const sum = updatedPlan.budgetReport.categories.reduce((acc, c) => acc + c.allocatedAmount, 0);
    expect(sum).toBe(350000);
    expect(updatedPlan.budgetReport.totalBudget).toBe(350000);
  });
});
