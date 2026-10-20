import { describe, it, expect } from 'vitest';
import { calculateBudgetFeasibility, formatINR, formatLakhCrore, updateCategoryBudget } from '../engine/budgetEngine';
import type { EventInput } from '../domain/types';

describe('BudgetEngine - Deterministic Arithmetic & Feasibility', () => {
  const baseWeddingInput: EventInput = {
    eventType: 'wedding',
    title: 'Kapoor Vivah',
    date: '2026-11-20',
    durationDays: 2,
    city: 'Jaipur',
    tier: 'premium',
    guestCount: 300,
    totalBudget: 3500000,
    currency: 'INR',
    dietaryRequirements: ['Strict Vegetarian'],
    accessibilityNeeds: ['Wheelchair ramp'],
    priorities: ['Catering'],
    styleTheme: 'Royal Heritage',
  };

  it('guarantees category sum + contingency equals totalBudget EXACTLY', () => {
    const report = calculateBudgetFeasibility(baseWeddingInput);
    const sum = report.categories.reduce((acc, c) => acc + c.allocatedAmount, 0);

    expect(sum).toBe(baseWeddingInput.totalBudget);
    expect(report.allocatedSum).toBe(baseWeddingInput.totalBudget);
  });

  it('correctly calculates transparent contingency reserve', () => {
    const report = calculateBudgetFeasibility(baseWeddingInput);
    const contingency = report.categories.find((c) => c.id === 'contingency');

    expect(contingency).toBeDefined();
    expect(contingency?.allocatedAmount).toBeGreaterThan(0);
    expect(report.contingencyAmount).toBe(contingency?.allocatedAmount);
    expect(report.contingencyPercentage).toBeGreaterThanOrEqual(5);
  });

  it('flags impossible or insufficient budgets with actionable levers', () => {
    const underBudgetInput: EventInput = {
      ...baseWeddingInput,
      guestCount: 500,
      totalBudget: 50000, // ₹100/guest for a premium wedding (impossible)
    };

    const report = calculateBudgetFeasibility(underBudgetInput);

    expect(report.isFeasible).toBe(false);
    expect(report.shortfallAmount).toBeGreaterThan(0);
    expect(report.feasibilityWarnings.length).toBeGreaterThan(0);
    expect(report.actionableLevers.length).toBeGreaterThanOrEqual(2);
  });

  it('formats Indian currency correctly with standard en-IN formatting', () => {
    expect(formatINR(3500000)).toMatch(/₹\s?35,00,000/);
    expect(formatINR(125000)).toMatch(/₹\s?1,25,000/);
    expect(formatINR(0)).toMatch(/₹\s?0/);
  });

  it('formats readable Indian denominations (Lakhs / Crores)', () => {
    expect(formatLakhCrore(3500000)).toBe('₹35.00 L');
    expect(formatLakhCrore(15000000)).toBe('₹1.50 Cr');
    expect(formatLakhCrore(50000)).toBe('₹50.0 K');
  });

  it('dynamically adjusts contingency when user manually edits a category allocation', () => {
    const initialReport = calculateBudgetFeasibility(baseWeddingInput);
    const initialContingency = initialReport.contingencyAmount;

    // Increase Catering by ₹1,00,000
    const cateringCat = initialReport.categories.find((c) => c.id === 'catering_fnb')!;
    const updated = updateCategoryBudget(initialReport, 'catering_fnb', cateringCat.allocatedAmount + 100000);

    const updatedCatering = updated.categories.find((c) => c.id === 'catering_fnb')!;
    expect(updatedCatering.allocatedAmount).toBe(cateringCat.allocatedAmount + 100000);
    expect(updatedCatering.provenance).toBe('user_specified');

    // Contingency absorbs the difference so total budget remains 100% reconciled
    const newSum = updated.categories.reduce((acc, c) => acc + c.allocatedAmount, 0);
    expect(newSum).toBe(baseWeddingInput.totalBudget);
    expect(updated.contingencyAmount).toBe(initialContingency - 100000);
  });
});
