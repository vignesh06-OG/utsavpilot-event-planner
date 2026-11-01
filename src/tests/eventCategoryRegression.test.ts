import { describe, it, expect } from 'vitest';
import { EVENT_CATEGORY_CONFIG } from '../domain/eventDefaults';
import type { EventType, EventInput } from '../domain/types';
import { generateDeterministicPlan } from '../engine/deterministicFallback';
import { EventPlanSchema, EventInputSchema } from '../domain/schemas';

describe('Event Category & Title Contextual Regression Suite', () => {
  const categories: EventType[] = [
    'wedding',
    'engagement',
    'anniversary',
    'birthday',
    'puja',
    'community_event',
    'college_fest',
    'corporate_celebration',
  ];

  it('provides verified contextual example titles and placeholders for all 8 archetypes', () => {
    // 1. Wedding
    expect(EVENT_CATEGORY_CONFIG.wedding.exampleTitle).toBe('Sharma & Verma Wedding');
    expect(EVENT_CATEGORY_CONFIG.wedding.titlePlaceholder).toContain('Sharma & Verma Wedding');

    // 2. Birthday
    expect(EVENT_CATEGORY_CONFIG.birthday.exampleTitle).toBe("Lara's Birthday");
    expect(EVENT_CATEGORY_CONFIG.birthday.titlePlaceholder).toContain("Lara's Birthday");

    // 3. Anniversary
    expect(EVENT_CATEGORY_CONFIG.anniversary.exampleTitle).toBe("Aarav & Meera's Anniversary");
    expect(EVENT_CATEGORY_CONFIG.anniversary.titlePlaceholder).toContain("Aarav & Meera's Anniversary");

    // 4. Engagement
    expect(EVENT_CATEGORY_CONFIG.engagement.exampleTitle).toBe("Riya & Arjun's Engagement");
    expect(EVENT_CATEGORY_CONFIG.engagement.titlePlaceholder).toContain("Riya & Arjun's Engagement");

    // 5. Puja
    expect(EVENT_CATEGORY_CONFIG.puja.exampleTitle).toBe('Griha Pravesh & Satyanarayan Puja');

    // 6. Community Event / Festival
    expect(EVENT_CATEGORY_CONFIG.community_event.exampleTitle).toBe('Ganesh Utsav Community Mahotsav');

    // 7. College Fest
    expect(EVENT_CATEGORY_CONFIG.college_fest.exampleTitle).toBe('Vibrance Annual Cultural Fest');

    // 8. Corporate Celebration
    expect(EVENT_CATEGORY_CONFIG.corporate_celebration.exampleTitle).toBe('Annual Leadership Summit & Gala');

    // Verify all 8 categories are non-empty and unique
    categories.forEach((cat) => {
      const cfg = EVENT_CATEGORY_CONFIG[cat];
      expect(cfg.label).toBeTruthy();
      expect(cfg.icon).toBeTruthy();
      expect(cfg.desc).toBeTruthy();
      expect(cfg.exampleTitle).toBeTruthy();
      expect(cfg.titlePlaceholder).toContain('e.g.');
      expect(cfg.cityPlaceholder).toBeTruthy();
    });
  });

  it('guarantees NO wedding tasks or mandap samagri leak into Birthday celebrations', () => {
    const birthdayInput: EventInput = {
      eventType: 'birthday',
      title: "Lara's 5th Birthday Carnival",
      date: '2026-11-20',
      durationDays: 1,
      city: 'Bengaluru',
      tier: 'standard',
      guestCount: 50,
      totalBudget: 150000,
      currency: 'INR',
      dietaryRequirements: ['Eggless Cake', 'Kids Snacks'],
      accessibilityNeeds: [],
      priorities: ['Magic show'],
      styleTheme: 'Pastel Unicorn Carousel',
    };

    const plan = generateDeterministicPlan(birthdayInput);
    expect(EventPlanSchema.safeParse(plan).success).toBe(true);

    const taskTitles = plan.tasks.map((t) => t.title.toLowerCase()).join(' ');
    const taskNotes = plan.tasks.map((t) => (t.notes || '').toLowerCase()).join(' ');
    const allTaskText = `${taskTitles} ${taskNotes}`;

    // Verify absence of wedding-specific terms
    expect(allTaskText).not.toContain('mandap');
    expect(allTaskText).not.toContain('baraat');
    expect(allTaskText).not.toContain('sangeet');
    expect(allTaskText).not.toContain('pandit ji');

    // Verify presence of birthday-relevant terms
    expect(allTaskText).toContain('cake');
    expect(allTaskText).toContain('return gift');

    // Verify vendor checklist is birthday specific
    const vendorServices = plan.vendorChecklist.map((v) => v.serviceTitle.toLowerCase()).join(' ');
    expect(vendorServices).toContain('cake');
    expect(vendorServices).not.toContain('mandap');
  });

  it('guarantees NO wedding tasks leak into College Fest celebrations', () => {
    const festInput: EventInput = {
      eventType: 'college_fest',
      title: 'Vibrance 2026 Campus Gala',
      date: '2026-12-10',
      durationDays: 1,
      city: 'Delhi NCR',
      tier: 'standard',
      guestCount: 600,
      totalBudget: 800000,
      currency: 'INR',
      dietaryRequirements: ['Food Stalls'],
      accessibilityNeeds: ['Ramp to stage'],
      priorities: ['Concert Sound'],
      styleTheme: 'Neon Horizon',
    };

    const plan = generateDeterministicPlan(festInput);
    const taskTitles = plan.tasks.map((t) => t.title.toLowerCase()).join(' ');
    const vendorServices = plan.vendorChecklist.map((v) => v.serviceTitle.toLowerCase()).join(' ');

    expect(taskTitles).not.toContain('mandap');
    expect(taskTitles).not.toContain('baraat');
    expect(taskTitles).toContain('sound');
    expect(taskTitles).toContain('artist');

    expect(vendorServices).toContain('sound');
    expect(vendorServices).toContain('artist');
    expect(vendorServices).not.toContain('mandap');
  });

  it('generates rich, culturally authentic Vedic tasks for Puja celebrations', () => {
    const pujaInput: EventInput = {
      eventType: 'puja',
      title: 'Griha Pravesh & Satyanarayan Puja',
      date: '2026-11-15',
      durationDays: 1,
      city: 'Pune',
      tier: 'standard',
      guestCount: 80,
      totalBudget: 200000,
      currency: 'INR',
      dietaryRequirements: ['Strict Satvik Pure Ghee Bhojan'],
      accessibilityNeeds: ['Low seating gaddi'],
      priorities: ['Vedic authenticity'],
      styleTheme: 'Temple Jasmine & Marigold',
    };

    const plan = generateDeterministicPlan(pujaInput);
    const taskTitles = plan.tasks.map((t) => t.title.toLowerCase()).join(' ');
    expect(taskTitles).toContain('pandit ji');
    expect(taskTitles).toContain('prasadam');

    const vendorServices = plan.vendorChecklist.map((v) => v.serviceTitle.toLowerCase()).join(' ');
    expect(vendorServices).toContain('pandit');
    expect(vendorServices).toContain('prasadam');
  });

  it('guarantees community events generate community pandal and langar vendors rather than corporate suites', () => {
    const communityInput: EventInput = {
      eventType: 'community_event',
      title: 'Ganesh Utsav Community Mahotsav',
      date: '2026-11-20',
      durationDays: 3,
      city: 'Pune',
      tier: 'standard',
      guestCount: 800,
      totalBudget: 400000,
      currency: 'INR',
      dietaryRequirements: ['Community Mahaprasad'],
      accessibilityNeeds: [],
      priorities: ['Pandal setup', 'Sound'],
      styleTheme: 'Traditional Mahotsav',
    };

    const plan = generateDeterministicPlan(communityInput);
    const vendorServices = plan.vendorChecklist.map((v) => v.serviceTitle.toLowerCase()).join(' ');

    expect(vendorServices).not.toContain('corporate');
    expect(vendorServices).not.toContain('trophies');
    expect(vendorServices).not.toContain('leadership');
    expect(vendorServices).toContain('pandal');
    expect(vendorServices).toContain('caterer');
  });

  it('validates all 8 archetypes through EventInputSchema', () => {
    categories.forEach((cat) => {
      const input = {
        eventType: cat,
        title: `Test ${cat} Celebration`,
        date: '2026-12-25',
        durationDays: 1,
        city: 'Mumbai',
        tier: 'standard',
        guestCount: 100,
        totalBudget: 500000,
        currency: 'INR',
      };
      const res = EventInputSchema.safeParse(input);
      expect(res.success, `Schema validation failed for category ${cat}`).toBe(true);
    });
  });
});

