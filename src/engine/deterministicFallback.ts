import type { 
  EventInput, 
  EventPlan, 
  PlanTask, 
  VendorChecklistItem, 
  PersonalizedSuggestions 
} from '../domain/types';
import { calculateBudgetFeasibility, formatINR } from './budgetEngine';

/**
 * Generates an end-to-end event plan using deterministic Indian event planning heuristics.
 * Operates with 100% reliability even when offline or when no AI API key is configured.
 */
export function generateDeterministicPlan(input: EventInput): EventPlan {
  const budgetReport = calculateBudgetFeasibility(input);
  const now = new Date().toISOString();

  // Tasks mapped by event type
  const tasks: PlanTask[] = getDeterministicTasks(input);

  // Vendor checklist with negotiation questions
  const vendorChecklist: VendorChecklistItem[] = getDeterministicVendors(input);

  // Culturally personalized suggestions
  const suggestions: PersonalizedSuggestions = getDeterministicSuggestions(input);

  const assumptions: string[] = [
    `Guest turnout assumption: approximately 85% to 90% of invited ${input.guestCount} guests will attend.`,
    `Standard Indian celebration timing: Evening functions typically run 45-60 minutes behind official invite time.`,
    `Catering minimum guarantee (MG) should be fixed at 85% of total RSVPs 7 days before event.`,
    `Contingency reserve (${budgetReport.contingencyPercentage}%) is kept aside for unexpected guest additions, electricity generator fuel, or overtime crew tips.`,
  ];

  const unresolvedDecisions: string[] = [
    'Final choice between plated sit-down dinner vs live multi-cuisine buffet stalls.',
    'Confirmation of sound decibel curfew permissions (10:00 PM standard in most Indian municipal jurisdictions).',
    'Selection of anchor / emcee to drive stage coordination and family engagement.',
    'Design sign-off for digital invite GIF / video.',
  ];

  const summary = `Comprehensive Indian Celebration Blueprint for '${input.title}' (${input.eventType.replace('_', ' ')}). Organized in ${input.city} for ${input.guestCount} guests with a budget of ${formatINR(input.totalBudget)}. Feasibility Status: ${budgetReport.isFeasible ? 'Budget Feasible' : 'Requires Optimization'}.`;

  return {
    id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
    input,
    summary,
    budgetReport,
    tasks,
    vendorChecklist,
    suggestions,
    assumptions,
    unresolvedDecisions,
    isDemoSample: false,
    modelUsed: 'deterministic-fallback',
  };
}

function getDeterministicTasks(input: EventInput): PlanTask[] {
  const isWedding = input.eventType === 'wedding';
  const isBirthday = input.eventType === 'birthday';

  if (isWedding) {
    return [
      {
        id: 'task_w_1',
        title: 'Lock & advance book Wedding Venue & Mandap Lawn',
        category: 'Venue & Hospitality',
        phase: 'months_before',
        daysBeforeEvent: 90,
        isCompleted: false,
        priority: 'critical',
        notes: 'Check air-conditioned green rooms for bride and groom, generator backup, and parking capacity.',
      },
      {
        id: 'task_w_2',
        title: 'Finalize Catering Menu & Conduct Food Tasting Session',
        category: 'Catering & Dining',
        phase: 'months_before',
        daysBeforeEvent: 60,
        isCompleted: false,
        priority: 'critical',
        dependencies: ['task_w_1'],
        notes: 'Ensure separate pure vegetarian/Jain prep area and live counter rotation.',
      },
      {
        id: 'task_w_3',
        title: 'Book Candid Photographer & Drone Cinematographer',
        category: 'Photography',
        phase: 'months_before',
        daysBeforeEvent: 60,
        isCompleted: false,
        priority: 'high',
        notes: 'Review previous full wedding album deliverables, not just Instagram highlights.',
      },
      {
        id: 'task_w_4',
        title: "Design & Send Digital 'Save The Date' WhatsApp Invites",
        category: 'Invitations',
        phase: 'weeks_before',
        daysBeforeEvent: 30,
        isCompleted: false,
        priority: 'high',
        notes: 'Include Google Maps venue location link and RSVP contact point.',
      },
      {
        id: 'task_w_5',
        title: 'Sangeet Choreography Practices & DJ Playlist Submission',
        category: 'Music & Entertainment',
        phase: 'weeks_before',
        daysBeforeEvent: 20,
        isCompleted: false,
        priority: 'medium',
        notes: 'Compile couple entrance song and family group dance sequences.',
      },
      {
        id: 'task_w_6',
        title: 'Pandit Ji Meeting & Samagri Checklist Verification',
        category: 'Rituals & Pooja',
        phase: 'weeks_before',
        daysBeforeEvent: 14,
        isCompleted: false,
        priority: 'high',
        notes: 'Verify exact Muhurat timings and designate family member to manage puja items.',
      },
      {
        id: 'task_w_7',
        title: 'Finalize Seating, Mandap Layout & Stage Lighting',
        category: 'Decor & Floral',
        phase: 'days_before',
        daysBeforeEvent: 3,
        isCompleted: false,
        priority: 'high',
        dependencies: ['task_w_1'],
        notes: 'Walk through venue floor with decorator to confirm flower freshness and photo angles.',
      },
      {
        id: 'task_w_8',
        title: 'Day-of Guest Hospitality Desk & Baraat Reception Setup',
        category: 'Logistics',
        phase: 'day_of',
        daysBeforeEvent: 0,
        isCompleted: false,
        priority: 'critical',
        notes: 'Station family co-host at welcome desk with room keys, varmala, and cold welcome drinks.',
      },
      {
        id: 'task_w_9',
        title: 'Post-Event Vendor Settlements & Deposit Returns',
        category: 'Finance',
        phase: 'post_event',
        daysBeforeEvent: -2,
        isCompleted: false,
        priority: 'medium',
        notes: 'Collect security deposits from venue after room inspection and settle final balances.',
      },
    ];
  }

  if (isBirthday) {
    return [
      {
        id: 'task_b_1',
        title: 'Book Party Banquet Hall / Society Clubhouse',
        category: 'Venue',
        phase: 'weeks_before',
        daysBeforeEvent: 30,
        isCompleted: false,
        priority: 'critical',
        notes: 'Verify air conditioning, audio speaker support, and parking space.',
      },
      {
        id: 'task_b_2',
        title: 'Finalize Custom Theme Designer Cake & Sweet Treats',
        category: 'Food',
        phase: 'weeks_before',
        daysBeforeEvent: 15,
        isCompleted: false,
        priority: 'high',
        notes: 'Confirm cake flavor, eggless requirements, and delivery time 2 hours prior to start.',
      },
      {
        id: 'task_b_3',
        title: 'Engage Kids Party Game Host & Magician / Artist',
        category: 'Entertainment',
        phase: 'weeks_before',
        daysBeforeEvent: 14,
        isCompleted: false,
        priority: 'high',
        notes: 'Schedule 45-min magic or puppet show between cake cutting and dinner.',
      },
      {
        id: 'task_b_4',
        title: 'Procure Themed Return Gifts & Goodie Bags',
        category: 'Favors',
        phase: 'days_before',
        daysBeforeEvent: 5,
        isCompleted: false,
        priority: 'medium',
        notes: 'Prepare 10% extra gift bags for unexpected sibling plus-ones.',
      },
      {
        id: 'task_b_5',
        title: 'Balloon Backdrop Installation & Welcome Standee',
        category: 'Decor',
        phase: 'day_of',
        daysBeforeEvent: 0,
        isCompleted: false,
        priority: 'high',
        notes: 'Decorator must complete setup 1 hour before first guest arrival.',
      },
      {
        id: 'task_b_6',
        title: 'Photo Backup & Thank You WhatsApp Notes',
        category: 'Execution',
        phase: 'post_event',
        daysBeforeEvent: -1,
        isCompleted: false,
        priority: 'low',
        notes: 'Share photo gallery link with attending families.',
      },
    ];
  }

  // Default / Puja / Fest / Community
  return [
    {
      id: 'task_c_1',
      title: 'Confirm Event Venue / Ground Booking & Requisite Clearances',
      category: 'Venue & Administration',
      phase: 'weeks_before',
      daysBeforeEvent: 30,
      isCompleted: false,
      priority: 'critical',
      notes: 'Ensure sound permits, municipal clearances, and electrical safety sanction.',
    },
    {
      id: 'task_c_2',
      title: 'Finalize Catering / Community Feast Menu and Logistics',
      category: 'Catering & Prasadam',
      phase: 'weeks_before',
      daysBeforeEvent: 15,
      isCompleted: false,
      priority: 'critical',
      notes: 'Arrange drinking water jars, biodegradable dining plates, and waste bins.',
    },
    {
      id: 'task_c_3',
      title: 'Setup Audio PA System, Microphones & Seating Canopy',
      category: 'Production',
      phase: 'days_before',
      daysBeforeEvent: 2,
      isCompleted: false,
      priority: 'high',
      notes: 'Sound check with lead performer / priest / speaker 24 hours prior.',
    },
    {
      id: 'task_c_4',
      title: 'Event Stage Coordination & Chief Guest / Anchor Briefing',
      category: 'Coordination',
      phase: 'day_of',
      daysBeforeEvent: 0,
      isCompleted: false,
      priority: 'high',
      notes: 'Assign timekeeper for stage transitions and ceremony flow.',
    },
    {
      id: 'task_c_5',
      title: 'Post-Event Cleanliness & Site Handover',
      category: 'Operations',
      phase: 'post_event',
      daysBeforeEvent: -1,
      isCompleted: false,
      priority: 'medium',
      notes: 'Clear shamiana, return rented furniture, and inspect premises.',
    },
  ];
}

function getDeterministicVendors(input: EventInput): VendorChecklistItem[] {
  return [
    {
      id: 'v_venue',
      category: 'Venue & Hospitality',
      serviceTitle: 'Banquet Hall / Lawn Management',
      status: 'not_contacted',
      benchmarkCostRange: `${formatINR(input.totalBudget * 0.25)} - ${formatINR(input.totalBudget * 0.32)}`,
      provenance: 'estimated',
      keyQuestionsToAsk: [
        'Is outside catering permitted, or is there an in-house catering royalty fee?',
        'What is the sound curfew hour (e.g. 10:00 PM)? Is an indoor sound extension possible?',
        'Does the price include power backup generator fuel and air conditioning hours?',
        'What is the security deposit and cancellation/refund policy?',
      ],
      verificationTip: 'Request a written copy of all mandatory venue in-house vendor restrictions before paying any token advance.',
    },
    {
      id: 'v_catering',
      category: 'Catering & Dining',
      serviceTitle: 'Celebration Catering Service',
      status: 'not_contacted',
      benchmarkCostRange: `${formatINR(input.totalBudget * 0.28)} - ${formatINR(input.totalBudget * 0.35)}`,
      provenance: 'estimated',
      keyQuestionsToAsk: [
        'What is the minimum guarantee (MG) plate policy if attendance drops?',
        'Are live chaat stalls, mocktail mixers, and service staff uniforms included in the per-plate rate?',
        'How do you manage separate kitchen utensils and cooking areas for pure vegetarian / Jain preparations?',
        'What happens to leftover clean food? Can it be packed or donated to a local charity?',
      ],
      verificationTip: 'Always attend a live wedding or banquet catering session to taste hot dishes and inspect counter cleanliness.',
    },
    {
      id: 'v_decor',
      category: 'Decor & Florals',
      serviceTitle: 'Stage, Mandap & Floral Decorator',
      status: 'not_contacted',
      benchmarkCostRange: `${formatINR(input.totalBudget * 0.12)} - ${formatINR(input.totalBudget * 0.18)}`,
      provenance: 'estimated',
      keyQuestionsToAsk: [
        'Are flowers fresh local market blooms or imported/artificial florals?',
        'Are truss structures, fairy lights, and generators included, or billed separately?',
        'Can you provide a 3D sketch or past reference photos of this exact venue space?',
      ],
      verificationTip: 'Clarify setup start time—ensure decorators have access at least 8 hours prior to start.',
    },
    {
      id: 'v_photo',
      category: 'Photography',
      serviceTitle: 'Cinematographer & Candid Photographer',
      status: 'not_contacted',
      benchmarkCostRange: `${formatINR(input.totalBudget * 0.08)} - ${formatINR(input.totalBudget * 0.12)}`,
      provenance: 'estimated',
      keyQuestionsToAsk: [
        'How many total photographers and cinematographers will be physically present on site?',
        'Who retains raw RAW camera footage and what is the exact delivery timeline for the teaser and full album?',
        'Are drone permissions and operators included in the contract?',
      ],
      verificationTip: 'Inspect a full deliverable Google Drive link from a recent client, not a curated Instagram reel.',
    },
    {
      id: 'v_music',
      category: 'Entertainment',
      serviceTitle: 'DJ, Sound & Light Setup',
      status: 'not_contacted',
      benchmarkCostRange: `${formatINR(input.totalBudget * 0.05)} - ${formatINR(input.totalBudget * 0.08)}`,
      provenance: 'estimated',
      keyQuestionsToAsk: [
        'What wattage sound system and brand of speakers will be deployed for the hall size?',
        'Do you bring wireless handheld microphones for family announcements and rituals?',
        'Can we provide a custom blacklist of songs that should never be played?',
      ],
      verificationTip: 'Test wireless microphone range in the actual venue to avoid feedback squeals.',
    },
  ];
}

function getDeterministicSuggestions(input: EventInput): PersonalizedSuggestions {
  const isWedding = input.eventType === 'wedding';
  const isBirthday = input.eventType === 'birthday';
  const isPuja = input.eventType === 'puja';

  return {
    themeAndDecor: isWedding
      ? [
          'Royal Indian Brass & Genda Phool: Deep marigold garlands with brass urlis and floating candles at entrance.',
          'Sunset Pastel Mandap: Peach, ivory, and dusty rose draping with soft warm fairy lights for Muhurat photos.',
          'Interactive Welcome Photo Wall: Customized neon signage with the couple hashtag surrounded by botanical foliage.',
        ]
      : isBirthday
      ? [
          'Whimsical Balloon Arch & Character Cutouts matching the guest age group.',
          'Personalized Milestone Photo Garland displaying precious year-by-year memories.',
          'Interactive Candy & Dessert Station with coordinated theme colors.',
        ]
      : [
          'Traditional South/North Indian Temple Motif with banana trunk entrances and fresh jasmine torans.',
          'Rangoli floor art crafted with organic flower petals and brass diyas.',
          'Low-slung wooden chowkis with traditional silk upholstery.',
        ],

    foodAndBeverage: [
      'Welcome Drinks: Traditional spiced Aam Panna, Badam Milk, and Kokum Sherbet in earthen kulhads.',
      'Live Chaat Counter: Dahi Puri, Palak Patta Chaat, and Kolkata-style Puchkas served fresh.',
      'Main Course: Regional specialties reflecting the family heritage with hot tandoori breads baked on-demand.',
      'Dessert Finale: Warm Gulab Jamun paired with artisanal Kulfi Falooda and hot Jalebi with Rabdi.',
    ],

    entertainmentAndRituals: isWedding
      ? [
          'Energetic Baraat Dhol Tasha procession with synchronized Punjabi dholis.',
          'Family Sangeet Dance Face-off between bride and groom sides with a charismatic emcee.',
          'Express Mehendi counter for ladies with intricate organic herbal henna.',
        ]
      : isPuja
      ? [
          'Live devotional Bhajan Mandali chanting sacred shlokas and Aarti.',
          'Prasadam distribution queue management with eco-friendly sal leaf donas.',
        ]
      : [
          'Interactive magic show and musical games tailored to keep both children and parents entertained.',
          'Milestone video tribute screening before the cake-cutting countdown.',
        ],

    culturalConsiderations: [
      'Timing buffer: Build in a 45-minute arrival window before commencing main stage ceremonies.',
      'Dietary segregation: Strict labeling of pure vegetarian, Jain (no root vegetables), and vegan offerings.',
      'Family gifting etiquette: Designate a trusted family member with a secure pouch for envelopes (shagun) and tokens.',
    ],

    accessibilityPlan: [
      'Senior Citizen Comfort: Priority padded seating near the front with low ambient speaker volume.',
      'Mobility Access: Zero-stairway entry ramps for wheelchairs and baby strollers into dining and ceremony zones.',
      'Quiet Decompression Corner: A calm, lower-decibel seating area for toddlers and elderly family members.',
    ],
  };
}
