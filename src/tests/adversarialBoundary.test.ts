import { describe, it, expect } from 'vitest';
import { calculateBudgetFeasibility, updateCategoryBudget, formatLakhCrore } from '../engine/budgetEngine';
import { calculateReplanDelta } from '../engine/replanEngine';
import { generateDeterministicPlan } from '../engine/deterministicFallback';
import { EventPlanSchema } from '../domain/schemas';
import type { EventInput, EventType } from '../domain/types';
import { sanitizeInput } from '../../server/middleware/security';

describe('Adversarial & Boundary Verification Suite', () => {
  const allArchetypes: EventType[] = [
    'wedding',
    'engagement',
    'anniversary',
    'birthday',
    'puja',
    'college_fest',
    'community_event',
    'corporate_celebration',
  ];

  it('generates fully valid schema-compliant plans for all 6 celebration archetypes', () => {
    allArchetypes.forEach((archetype) => {
      const input: EventInput = {
        eventType: archetype,
        title: `Grand Test ${archetype}`,
        date: '2026-12-01',
        durationDays: 2,
        city: 'Bengaluru',
        tier: 'standard',
        guestCount: 150,
        totalBudget: 1500000,
        currency: 'INR',
        dietaryRequirements: ['Jain Counter', 'No Onion Garlic'],
        accessibilityNeeds: ['Wheelchair access'],
        priorities: ['Hospitality', 'Decor'],
        styleTheme: 'Modern Festive Elegance',
      };

      const plan = generateDeterministicPlan(input);
      const parseResult = EventPlanSchema.safeParse(plan);

      expect(parseResult.success, `Schema validation failed for archetype: ${archetype}`).toBe(true);
      expect(plan.tasks.length).toBeGreaterThanOrEqual(5);
      expect(plan.vendorChecklist.length).toBeGreaterThanOrEqual(4);
      expect(plan.budgetReport.categories.length).toBeGreaterThanOrEqual(4);
      expect(plan.budgetReport.allocatedSum).toBe(input.totalBudget);
    });
  });

  it('handles massive scale budgets (₹50 Crore) without arithmetic overflow', () => {
    const luxuryMegaWedding: EventInput = {
      eventType: 'wedding',
      title: 'Royal Destination Vivah',
      date: '2027-01-15',
      durationDays: 4,
      city: 'Udaipur',
      tier: 'luxury',
      guestCount: 1200,
      totalBudget: 500000000, // ₹50 Crore
      currency: 'INR',
      dietaryRequirements: ['Multi-cuisine Global'],
      accessibilityNeeds: ['Golf carts for campus transfer'],
      priorities: ['Celebrity performance', 'Palace decor'],
      styleTheme: 'Mewar Royal Heritage',
    };

    const report = calculateBudgetFeasibility(luxuryMegaWedding);
    expect(report.isFeasible).toBe(true);
    expect(report.allocatedSum).toBe(500000000);
    expect(formatLakhCrore(luxuryMegaWedding.totalBudget)).toBe('₹50.00 Cr');

    const sum = report.categories.reduce((acc, c) => acc + c.allocatedAmount, 0);
    expect(sum).toBe(500000000);
  });

  it('handles micro budget boundary and identifies infeasibility with actionable levers', () => {
    const microWedding: EventInput = {
      eventType: 'wedding',
      title: 'Micro Budget Wedding',
      date: '2026-11-10',
      durationDays: 1,
      city: 'Delhi',
      tier: 'standard',
      guestCount: 400,
      totalBudget: 10000, // ₹25/guest (Severely infeasible for 400 guests)
      currency: 'INR',
      dietaryRequirements: [],
      accessibilityNeeds: [],
      priorities: [],
      styleTheme: '',
    };

    const report = calculateBudgetFeasibility(microWedding);
    expect(report.isFeasible).toBe(false);
    expect(report.feasibilityWarnings.length).toBeGreaterThan(0);
    expect(report.shortfallAmount).toBeGreaterThan(0);
    expect(report.actionableLevers.length).toBeGreaterThanOrEqual(2);
    // Even when infeasible, exact math conservation must hold
    expect(report.allocatedSum).toBe(10000);
  });

  it('handles extreme replanning budget slash (-70%) without negative category allocations', () => {
    const baseInput: EventInput = {
      eventType: 'corporate_celebration',
      title: 'Annual Tech Summit Gala',
      date: '2026-12-20',
      durationDays: 1,
      city: 'Hyderabad',
      tier: 'premium',
      guestCount: 200,
      totalBudget: 2000000,
      currency: 'INR',
      dietaryRequirements: [],
      accessibilityNeeds: [],
      priorities: [],
      styleTheme: '',
    };

    const plan = generateDeterministicPlan(baseInput);
    const { updatedPlan, delta } = calculateReplanDelta(plan, {
      newBudget: 600000, // 70% budget reduction
      newGuestCount: 80,
    });

    expect(updatedPlan.budgetReport.totalBudget).toBe(600000);
    expect(updatedPlan.budgetReport.allocatedSum).toBe(600000);
    expect(delta.newBudget - delta.previousBudget).toBe(-1400000);

    // Assert that no category has negative allocation
    updatedPlan.budgetReport.categories.forEach((cat) => {
      expect(cat.allocatedAmount).toBeGreaterThanOrEqual(0);
    });
  });

  it('sanitizes aggressive XSS and script tag injection vectors in inputs', () => {
    const attackPayload = '<script>alert("XSS")</script><img src="x" onerror="steal()"/>```DROP TABLE plans;```';
    const sanitized = sanitizeInput(attackPayload);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('<img');
    expect(sanitized).not.toContain('```');
    expect(sanitized).toContain('DROP TABLE plans;');
  });

  it('handles manual category update where requested increase exceeds contingency', () => {
    const input: EventInput = {
      eventType: 'wedding',
      title: 'Test Wedding',
      date: '2026-11-20',
      durationDays: 2,
      city: 'Jaipur',
      tier: 'standard',
      guestCount: 200,
      totalBudget: 1000000,
      currency: 'INR',
      dietaryRequirements: [],
      accessibilityNeeds: [],
      priorities: [],
      styleTheme: '',
    };

    const report = calculateBudgetFeasibility(input);
    const cateringCat = report.categories.find((c) => c.id === 'catering_fnb')!;
    
    // Increase catering by more than the entire contingency fund
    const massiveIncrease = cateringCat.allocatedAmount + report.contingencyAmount + 50000;
    const updated = updateCategoryBudget(report, 'catering_fnb', massiveIncrease);

    // Contingency is depleted to 0
    expect(updated.contingencyAmount).toBe(0);
    // Allocated sum transparently reflects the over-budget amount
    expect(updated.allocatedSum).toBe(1050000);
    expect(updated.allocatedSum).toBeGreaterThan(input.totalBudget);
  });
});
