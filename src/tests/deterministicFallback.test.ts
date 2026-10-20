import { describe, it, expect } from 'vitest';
import { generateDeterministicPlan } from '../engine/deterministicFallback';
import { SAMPLE_DEMO_EVENTS } from '../domain/eventDefaults';

describe('DeterministicFallbackEngine - Zero Network Reliability', () => {
  it('generates a full actionable plan instantaneously for all event presets', () => {
    SAMPLE_DEMO_EVENTS.forEach((preset) => {
      const plan = generateDeterministicPlan(preset);

      expect(plan.id).toBeDefined();
      expect(plan.modelUsed).toBe('deterministic-fallback');
      expect(plan.tasks.length).toBeGreaterThanOrEqual(4);
      expect(plan.vendorChecklist.length).toBeGreaterThanOrEqual(4);
      expect(plan.budgetReport.categories.length).toBeGreaterThanOrEqual(4);
      expect(plan.suggestions.themeAndDecor.length).toBeGreaterThan(0);
      expect(plan.suggestions.accessibilityPlan.length).toBeGreaterThan(0);
      expect(plan.budgetReport.allocatedSum).toBe(preset.totalBudget);
    });
  });

  it('guarantees vendor checklist items include key negotiation questions and verification tips', () => {
    const plan = generateDeterministicPlan(SAMPLE_DEMO_EVENTS[0]);
    plan.vendorChecklist.forEach((vendor) => {
      expect(vendor.keyQuestionsToAsk.length).toBeGreaterThan(0);
      expect(vendor.verificationTip.length).toBeGreaterThan(10);
      expect(vendor.provenance).toBe('estimated');
    });
  });
});
