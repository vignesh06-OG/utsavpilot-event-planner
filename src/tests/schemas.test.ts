import { describe, it, expect } from 'vitest';
import { EventInputSchema } from '../domain/schemas';

describe('Schemas - Zod Runtime Validation', () => {
  it('passes on a valid event input structure', () => {
    const valid = {
      eventType: 'wedding',
      title: 'Mehta Sangeet',
      date: '2026-11-15',
      durationDays: 2,
      city: 'Udaipur',
      tier: 'premium',
      guestCount: 200,
      totalBudget: 2500000,
      currency: 'INR',
      dietaryRequirements: ['Strict Vegetarian'],
      accessibilityNeeds: [],
      priorities: ['Catering'],
      styleTheme: 'Lakeview Palace',
      notes: '',
    };

    const result = EventInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects negative budgets or zero guest counts', () => {
    const invalid = {
      eventType: 'wedding',
      title: 'Bad Event',
      date: '2026-11-15',
      durationDays: 1,
      city: 'Delhi',
      tier: 'budget',
      guestCount: 0, // Must be >= 5
      totalBudget: -5000, // Negative budget
      currency: 'INR',
    };

    const result = EventInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects invalid or unparseable dates', () => {
    const invalidDate = {
      eventType: 'birthday',
      title: 'Birthday Bash',
      date: 'not-a-real-date',
      durationDays: 1,
      city: 'Pune',
      tier: 'budget',
      guestCount: 30,
      totalBudget: 50000,
      currency: 'INR',
    };

    const result = EventInputSchema.safeParse(invalidDate);
    expect(result.success).toBe(false);
  });
});
