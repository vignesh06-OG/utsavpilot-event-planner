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
    `Standard celebration timing: Functions typically commence 30-45 minutes after official invite schedule.`,
    `Catering minimum guarantee (MG) should be confirmed at 85% of total RSVPs 7 days before event.`,
    `Contingency reserve (${budgetReport.contingencyPercentage}%) is allocated for unanticipated guest additions, weather adjustments, or overtime equipment runs.`,
  ];

  const unresolvedDecisions: string[] = [
    'Final selection between sit-down curated dining vs live multi-cuisine buffet stalls.',
    'Confirmation of sound decibel curfew permissions (10:00 PM standard in most municipal jurisdictions).',
    'Designation of primary host lead for stage flow and vendor coordination.',
    'Sign-off on digital invite visuals and RSVP tracking link.',
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
  const { eventType } = input;

  if (eventType === 'wedding') {
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

  if (eventType === 'engagement') {
    return [
      {
        id: 'task_e_1',
        title: 'Reserve Elegant Banquet Hall & Changing Suites',
        category: 'Venue & Hospitality',
        phase: 'weeks_before',
        daysBeforeEvent: 45,
        isCompleted: false,
        priority: 'critical',
        notes: 'Ensure intimate indoor hall acoustic acoustics and dedicated bridal lounge.',
      },
      {
        id: 'task_e_2',
        title: 'Finalize Ring Ceremony Stage & Floral Backdrop',
        category: 'Decor & Floral',
        phase: 'weeks_before',
        daysBeforeEvent: 30,
        isCompleted: false,
        priority: 'high',
        notes: 'Design pastel floral ring frame and illuminated monogram couple logo.',
      },
      {
        id: 'task_e_3',
        title: 'Book Candid Couple Portrait Photographer',
        category: 'Photography',
        phase: 'weeks_before',
        daysBeforeEvent: 25,
        isCompleted: false,
        priority: 'high',
        notes: 'Schedule dedicated 45-minute golden hour couple portrait session before guest arrival.',
      },
      {
        id: 'task_e_4',
        title: 'Coordinate Ring Trays, Sagai Gifts & Family Shagun',
        category: 'Rituals & Coordination',
        phase: 'weeks_before',
        daysBeforeEvent: 14,
        isCompleted: false,
        priority: 'high',
        notes: 'Assign trusted family leads for ring box custody and dry-fruit gift hamper distribution.',
      },
      {
        id: 'task_e_5',
        title: 'Finalize High Tea, Live Chaat & Dinner Buffet Menu',
        category: 'Catering',
        phase: 'days_before',
        daysBeforeEvent: 7,
        isCompleted: false,
        priority: 'critical',
        notes: 'Balance evening live appetizers with royal dessert counter.',
      },
      {
        id: 'task_e_6',
        title: 'Ring Exchange Music Cue & Toast Coordination',
        category: 'Entertainment',
        phase: 'day_of',
        daysBeforeEvent: 0,
        isCompleted: false,
        priority: 'high',
        notes: 'Test wireless microphone for family speeches and play couple entrance track.',
      },
    ];
  }

  if (eventType === 'anniversary') {
    return [
      {
        id: 'task_a_1',
        title: 'Book Private Banquet Hall & Dining Lawn',
        category: 'Venue',
        phase: 'weeks_before',
        daysBeforeEvent: 30,
        isCompleted: false,
        priority: 'critical',
        notes: 'Verify comfortable senior-friendly seating and soft background acoustic sound.',
      },
      {
        id: 'task_a_2',
        title: 'Compile Couple Milestone Journey Video & Photo Slideshow',
        category: 'Media & Memories',
        phase: 'weeks_before',
        daysBeforeEvent: 20,
        isCompleted: false,
        priority: 'high',
        notes: 'Collect family archival photographs and set up high-definition AV projector.',
      },
      {
        id: 'task_a_3',
        title: 'Order Multi-Tiered Anniversary Celebration Cake',
        category: 'Catering',
        phase: 'weeks_before',
        daysBeforeEvent: 10,
        isCompleted: false,
        priority: 'high',
        notes: 'Confirm customized cake topper, anniversary message, and timely delivery.',
      },
      {
        id: 'task_a_4',
        title: 'Coordinate Family Toast Speeches & Retro DJ Music',
        category: 'Entertainment',
        phase: 'days_before',
        daysBeforeEvent: 5,
        isCompleted: false,
        priority: 'medium',
        notes: 'Curate couple nostalgic playlist featuring classic hits from their wedding era.',
      },
      {
        id: 'task_a_5',
        title: 'Arrange Return Mementos for Attending Families',
        category: 'Gifting',
        phase: 'days_before',
        daysBeforeEvent: 3,
        isCompleted: false,
        priority: 'medium',
        notes: 'Prepare personalized souvenir gift boxes with artisanal dry fruits.',
      },
      {
        id: 'task_a_6',
        title: 'Day-of Milestone Toast & Cake Cutting Coordination',
        category: 'Execution',
        phase: 'day_of',
        daysBeforeEvent: 0,
        isCompleted: false,
        priority: 'high',
        notes: 'Gather children and grandchildren for milestone couple champagne/sparkling toast.',
      },
    ];
  }

  if (eventType === 'birthday') {
    return [
      {
        id: 'task_b_1',
        title: 'Book Party Banquet Hall / Society Clubhouse',
        category: 'Venue',
        phase: 'weeks_before',
        daysBeforeEvent: 30,
        isCompleted: false,
        priority: 'critical',
        notes: 'Verify air conditioning, audio speaker support, and guest parking space.',
      },
      {
        id: 'task_b_2',
        title: 'Finalize Custom Theme Designer Cake & Sweet Treats',
        category: 'Food & Cake',
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

  if (eventType === 'puja') {
    return [
      {
        id: 'task_p_1',
        title: 'Consult Pandit Ji for Auspicious Muhurat & Samagri List',
        category: 'Rituals & Vedic',
        phase: 'weeks_before',
        daysBeforeEvent: 25,
        isCompleted: false,
        priority: 'critical',
        notes: 'Obtain exact list of havan wood, pure ghee, kalash, coconut, and sacred items.',
      },
      {
        id: 'task_p_2',
        title: 'Order Fresh Floral Garlands, Lotus Blooms & Mango Torans',
        category: 'Flowers & Decor',
        phase: 'weeks_before',
        daysBeforeEvent: 10,
        isCompleted: false,
        priority: 'high',
        notes: 'Ensure early morning delivery of fresh marigold, jasmine, and tulsi leaves.',
      },
      {
        id: 'task_p_3',
        title: 'Finalize Pure Ghee Prasadam & Traditional Satvik Bhojan',
        category: 'Prasadam & Dining',
        phase: 'weeks_before',
        daysBeforeEvent: 7,
        isCompleted: false,
        priority: 'critical',
        notes: 'Prepare traditional halwa / panjiri prasadam and satvik meal without onion/garlic.',
      },
      {
        id: 'task_p_4',
        title: 'Setup Low Wooden Chowkis, Gaddi & Elder Seating',
        category: 'Venue & Seating',
        phase: 'days_before',
        daysBeforeEvent: 2,
        isCompleted: false,
        priority: 'high',
        notes: 'Arrange clean floor carpets with supportive backrest chairs for senior citizens.',
      },
      {
        id: 'task_p_5',
        title: 'Coordinate Bhajan Mandali & Microphones for Aarti',
        category: 'Devotional Music',
        phase: 'days_before',
        daysBeforeEvent: 1,
        isCompleted: false,
        priority: 'medium',
        notes: 'Check harmonium and dholak sound levels to maintain serene temple ambiance.',
      },
      {
        id: 'task_p_6',
        title: 'Pooja Sankalpam, Havan Execution & Prasadam Distribution',
        category: 'Execution',
        phase: 'day_of',
        daysBeforeEvent: 0,
        isCompleted: false,
        priority: 'critical',
        notes: 'Organize systematic prasad distribution in eco-friendly sal leaf boxes.',
      },
    ];
  }

  if (eventType === 'college_fest') {
    return [
      {
        id: 'task_f_1',
        title: 'Obtain Campus Permissions, Sound Clearances & Police Intimation',
        category: 'Administration & Clearances',
        phase: 'months_before',
        daysBeforeEvent: 45,
        isCompleted: false,
        priority: 'critical',
        notes: 'Formal clearance from Dean, Local Police Station, and Fire Department.',
      },
      {
        id: 'task_f_2',
        title: 'Book Line-Array Pro Concert Sound & Moving Head Lighting Truss',
        category: 'Production & AV',
        phase: 'weeks_before',
        daysBeforeEvent: 30,
        isCompleted: false,
        priority: 'critical',
        notes: 'Confirm minimum wattage for ground coverage, generator power, and sound tech crew.',
      },
      {
        id: 'task_f_3',
        title: 'Sign Headliner Artist / Band Contract & Hospitality Rider',
        category: 'Artist Management',
        phase: 'weeks_before',
        daysBeforeEvent: 25,
        isCompleted: false,
        priority: 'critical',
        notes: 'Arrange green room hospitality, airport transfers, and soundcheck slot.',
      },
      {
        id: 'task_f_4',
        title: 'Print Fest Wristbands, Volunteer Badges & Event Trophies',
        category: 'Merchandise & Branding',
        phase: 'weeks_before',
        daysBeforeEvent: 14,
        isCompleted: false,
        priority: 'high',
        notes: 'Setup secure color-coded barcode wristbands for security checkpoint access.',
      },
      {
        id: 'task_f_5',
        title: 'Setup Heavy-Duty Crowd Barricades & Emergency Medical Desk',
        category: 'Campus Security',
        phase: 'days_before',
        daysBeforeEvent: 2,
        isCompleted: false,
        priority: 'critical',
        notes: 'Brief student volunteer bouncers and station ambulance near backstage gate.',
      },
      {
        id: 'task_f_6',
        title: 'Soundcheck, Crowd Gates Open & Concert Flow Execution',
        category: 'Live Operations',
        phase: 'day_of',
        daysBeforeEvent: 0,
        isCompleted: false,
        priority: 'critical',
        notes: 'Enforce strict 10:00 PM sound cutoff and coordinate safe phased student dispersal.',
      },
    ];
  }

  if (eventType === 'community_event') {
    return [
      {
        id: 'task_c_1',
        title: 'Confirm Community Ground Booking & Municipal Sound Permits',
        category: 'Administration & Permits',
        phase: 'weeks_before',
        daysBeforeEvent: 30,
        isCompleted: false,
        priority: 'critical',
        notes: 'Ensure sound permits, municipal clearances, and electrical safety sanction.',
      },
      {
        id: 'task_c_2',
        title: 'Setup Waterproof Shamiana Pandal & Stage Seating Canopy',
        category: 'Infrastructure',
        phase: 'weeks_before',
        daysBeforeEvent: 15,
        isCompleted: false,
        priority: 'high',
        notes: 'Verify weatherproof rain protection and stable aluminum stage scaffolding.',
      },
      {
        id: 'task_c_3',
        title: 'Finalize Community Feast / Langar Menu & Food Distribution',
        category: 'Catering & Prasadam',
        phase: 'weeks_before',
        daysBeforeEvent: 10,
        isCompleted: false,
        priority: 'critical',
        notes: 'Arrange drinking water jars, biodegradable dining plates, and waste bins.',
      },
      {
        id: 'task_c_4',
        title: 'Setup Horn Speakers, PA Amplifiers & Stage Lights',
        category: 'Audio & Lighting',
        phase: 'days_before',
        daysBeforeEvent: 2,
        isCompleted: false,
        priority: 'high',
        notes: 'Sound check with community cultural performers and announcers.',
      },
      {
        id: 'task_c_5',
        title: 'Cultural Performances, Aarti & Community Coordination',
        category: 'Coordination',
        phase: 'day_of',
        daysBeforeEvent: 0,
        isCompleted: false,
        priority: 'high',
        notes: 'Maintain crowd discipline during peak evening ceremonies.',
      },
      {
        id: 'task_c_6',
        title: 'Post-Event Cleanliness Drive & Premises Handover',
        category: 'Operations & Ecology',
        phase: 'post_event',
        daysBeforeEvent: -1,
        isCompleted: false,
        priority: 'medium',
        notes: 'Dismantle tentage, clear disposable waste, and inspect ground for clearance.',
      },
    ];
  }

  // Default: corporate_celebration
  return [
    {
      id: 'task_corp_1',
      title: 'Confirm Business Hotel Banquet Hall & AV Infrastructure',
      category: 'Venue & Hotel',
      phase: 'months_before',
      daysBeforeEvent: 45,
      isCompleted: false,
      priority: 'critical',
      notes: 'Verify high-speed Wi-Fi, motorized projection screens, and corporate banquet setup.',
    },
    {
      id: 'task_corp_2',
      title: 'Setup High-Definition LED Video Wall & Stage Podium',
      category: 'Production & AV',
      phase: 'weeks_before',
      daysBeforeEvent: 20,
      isCompleted: false,
      priority: 'high',
      notes: 'Test presentation clickers, HDMI inputs, and wireless lapel/collar microphones.',
    },
    {
      id: 'task_corp_3',
      title: 'Design & Engrave Corporate Excellence Awards & Mementos',
      category: 'Awards & Mementos',
      phase: 'weeks_before',
      daysBeforeEvent: 14,
      isCompleted: false,
      priority: 'high',
      notes: 'Check name spellings, winner citations, and trophy presentation order.',
    },
    {
      id: 'task_corp_4',
      title: 'Finalize Multi-Cuisine Dinner Buffet & Cocktail Bar Menu',
      category: 'Catering & Dining',
      phase: 'weeks_before',
      daysBeforeEvent: 10,
      isCompleted: false,
      priority: 'critical',
      notes: 'Accommodate diverse dietary choices including Jain, vegan, and gluten-free plates.',
    },
    {
      id: 'task_corp_5',
      title: 'Brief Professional Corporate Emcee on Leadership Agenda',
      category: 'Entertainment',
      phase: 'days_before',
      daysBeforeEvent: 3,
      isCompleted: false,
      priority: 'medium',
      notes: 'Align on executive keynote introductions, timing cues, and audience icebreakers.',
    },
    {
      id: 'task_corp_6',
      title: 'Event Run-of-Show Execution & Leadership Gala Night',
      category: 'Operations',
      phase: 'day_of',
      daysBeforeEvent: 0,
      isCompleted: false,
      priority: 'critical',
      notes: 'Manage onstage transition flow and ensure seamless AV presentation playback.',
    },
  ];
}

function getDeterministicVendors(input: EventInput): VendorChecklistItem[] {
  const { eventType, totalBudget } = input;

  if (eventType === 'wedding') {
    return [
      {
        id: 'v_venue',
        category: 'Venue & Hospitality',
        serviceTitle: 'Banquet Hall & Lawn Management',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.22)} - ${formatINR(totalBudget * 0.28)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Is outside catering permitted, or is there an in-house royalty penalty fee?',
          'What is the sound curfew hour (10:00 PM)? Is an indoor extension feasible?',
          'Does the quote include generator diesel backup and air conditioning units?',
          'What is the security deposit and cancellation/refund policy?',
        ],
        verificationTip: 'Request a written copy of all mandatory venue in-house vendor restrictions before paying any token advance.',
      },
      {
        id: 'v_catering',
        category: 'Catering & Dining',
        serviceTitle: 'Royal Wedding Catering Service',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.28)} - ${formatINR(totalBudget * 0.35)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'What is the minimum guarantee (MG) plate policy if attendance drops?',
          'Are live chaat stalls, mocktail mixers, and service staff uniforms included in the per-plate rate?',
          'How do you manage separate kitchen utensils and cooking areas for pure vegetarian / Jain preparations?',
          'What happens to leftover clean food? Can it be packed or donated to a local charity?',
        ],
        verificationTip: 'Always attend a live banquet catering session to taste hot dishes and inspect counter cleanliness.',
      },
      {
        id: 'v_decor',
        category: 'Decor & Florals',
        serviceTitle: 'Stage, Mandap & Floral Decorator',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.12)} - ${formatINR(totalBudget * 0.18)}`,
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
        benchmarkCostRange: `${formatINR(totalBudget * 0.08)} - ${formatINR(totalBudget * 0.12)}`,
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
        benchmarkCostRange: `${formatINR(totalBudget * 0.05)} - ${formatINR(totalBudget * 0.08)}`,
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

  if (eventType === 'birthday') {
    return [
      {
        id: 'v_venue',
        category: 'Venue & Banquet',
        serviceTitle: 'Party Hall / Society Clubhouse Management',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.20)} - ${formatINR(totalBudget * 0.28)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'What is the rental duration (3 or 4 hours)? Is early setup access granted for decorators?',
          'Are party music speakers allowed, and what is the maximum volume threshold?',
          'Is parking available for parent drop-offs and family vehicles?',
        ],
        verificationTip: 'Inspect air conditioning vents and washroom cleanliness before signing hall booking.',
      },
      {
        id: 'v_catering',
        category: 'Food & Cake',
        serviceTitle: 'Custom Theme Designer Cake & Buffet Caterer',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.30)} - ${formatINR(totalBudget * 0.40)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Can you create customized 3D fondant/buttercream theme designs matching our party colors?',
          'Are eggless options guaranteed for vegetarian guests?',
          'What kid-friendly finger foods (mini pizzas, pasta, fries) are included in the menu?',
        ],
        verificationTip: 'Sample a miniature cupcake or pastry from the baker to verify freshness and sponge texture.',
      },
      {
        id: 'v_decor',
        category: 'Theme Decor',
        serviceTitle: 'Balloon Sculptor & Backdrop Decorator',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.15)} - ${formatINR(totalBudget * 0.22)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Do you use biodegradable latex balloons, and how long will the arch stay inflated?',
          'Are customized character cutouts, welcome standee, and number marquee lights included?',
          'What time will the decor setup be 100% complete before guests arrive?',
        ],
        verificationTip: 'Request recent photographs of balloon arches constructed at the same venue.',
      },
      {
        id: 'v_entertainment',
        category: 'Entertainment',
        serviceTitle: 'Kids Party Host, Magician & Puppet Artist',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.10)} - ${formatINR(totalBudget * 0.16)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'How long is the interactive performance (standard 45-60 minutes)?',
          'Do you bring small prizes and activity materials for participation games?',
          'Can you customize games for the specific age group of attending children?',
        ],
        verificationTip: 'Watch a short unedited video clip of the entertainer holding children’s attention.',
      },
      {
        id: 'v_favors',
        category: 'Return Gifts',
        serviceTitle: 'Themed Return Gift & Favor Supplier',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.08)} - ${formatINR(totalBudget * 0.12)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Are return gifts educational or age-appropriate for the invite list?',
          'Are gift bags personalized with guest names or theme stickers?',
          'What is the lead time for 10% extra pieces?',
        ],
        verificationTip: 'Inspect sample gift quality to verify durability and non-toxic materials.',
      },
    ];
  }

  if (eventType === 'puja') {
    return [
      {
        id: 'v_priest',
        category: 'Rituals & Vedic',
        serviceTitle: 'Vedic Pandit Ji & Samagri Supplier',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.15)} - ${formatINR(totalBudget * 0.22)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'How many assisting priests will participate in the ceremony?',
          'Is the complete havan samagri, dry fruits, and sacred utensils provided by you or procured by the family?',
          'What is the precise Muhurat timing window for the main Sankalpam and Aarti?',
        ],
        verificationTip: 'Confirm samagri checklist items in writing at least 5 days prior to avoid morning delays.',
      },
      {
        id: 'v_prasadam',
        category: 'Catering & Prasadam',
        serviceTitle: 'Satvik Traditional Prasadam & Bhojan Caterer',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.35)} - ${formatINR(totalBudget * 0.45)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Is the entire food preparation strictly satvik (no onion, no garlic, pure ghee)?',
          'Do you serve on fresh banana leaves with traditional meal hospitality?',
          'Can you pack separate take-home prasad boxes for elderly relatives unable to attend?',
        ],
        verificationTip: 'Verify dedicated pure vegetarian kitchen facilities and ghee quality certificates.',
      },
      {
        id: 'v_decor',
        category: 'Altar Decor',
        serviceTitle: 'Temple Floral Decorator & Altar Canopy',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.12)} - ${formatINR(totalBudget * 0.18)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Are fresh marigold, jasmine, and mango leaves sourced on the morning of the puja?',
          'Can you create traditional rangoli floor art at the main threshold and altar?',
          'Do you bring traditional brass diyas, urlis, and wooden chowkis?',
        ],
        verificationTip: 'Ensure floral delivery reaches venue 2 hours before Muhurat so altar setup is serene.',
      },
      {
        id: 'v_bhajan',
        category: 'Music & Sound',
        serviceTitle: 'Devotional Bhajan Singer & Compact PA System',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.08)} - ${formatINR(totalBudget * 0.14)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'What devotional instruments (Harmonium, Dholak, Manjira) will accompany the singers?',
          'Are microphones and small speaker monitors balanced for soft indoor temple acoustics?',
        ],
        verificationTip: 'Confirm bhajan repertoire matches family traditions (e.g. Sundarkand, Satyanarayan, Mata ki Chowki).',
      },
    ];
  }

  if (eventType === 'college_fest') {
    return [
      {
        id: 'v_sound_stage',
        category: 'Production & AV',
        serviceTitle: 'Line-Array Concert Sound & Stage Rigging Agency',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.35)} - ${formatINR(totalBudget * 0.45)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'What line-array wattage is allocated for our expected crowd density?',
          'Are heavy-duty generator power backups and electrical earthing included in the quote?',
          'Do you have moving-head intelligent lighting and smoke/haze machines for artist performances?',
        ],
        verificationTip: 'Check sound technician certifications and earthing test reports before powering heavy amplifiers.',
      },
      {
        id: 'v_artist',
        category: 'Artist Management',
        serviceTitle: 'Headliner Band & Celebrity Artist Agency',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.25)} - ${formatINR(totalBudget * 0.35)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'What are the artist technical rider requirements (mics, in-ear monitors, stage dimensions)?',
          'What is the performance duration guarantee (standard 75-90 minutes)?',
          'What is the force majeure / weather cancellation policy?',
        ],
        verificationTip: 'Demand an official booking confirmation letter directly signed by artist management.',
      },
      {
        id: 'v_security',
        category: 'Campus Security',
        serviceTitle: 'Bouncer Security & Crowd Barricading Agency',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.10)} - ${formatINR(totalBudget * 0.16)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'How many certified security guards and bouncers are deployed for perimeter control?',
          'Do you provide MOJO aluminum crash barricades for front-of-stage separation?',
          'Are female security personnel stationed at bag-check gates?',
        ],
        verificationTip: 'Walk the campus ground layout with the security chief to mark emergency ambulance exit paths.',
      },
      {
        id: 'v_merch',
        category: 'Merchandise',
        serviceTitle: 'Fest Badges, Wristbands & Trophies Supplier',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.08)} - ${formatINR(totalBudget * 0.12)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Are wristbands tamper-evident with unique serial numbering?',
          'What is the print lead time for student volunteer fest t-shirts and winner trophies?',
        ],
        verificationTip: 'Inspect sample wristband snap locks to prevent gate re-entry fraud.',
      },
    ];
  }

  if (eventType === 'anniversary') {
    return [
      {
        id: 'v_venue',
        category: 'Venue & Banquet',
        serviceTitle: 'Banquet Hall & Intimate Dining Lawn',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.25)} - ${formatINR(totalBudget * 0.35)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Is the hall air-conditioned with ramp accessibility for senior family members?',
          'Can we bring outside AV equipment for a memory slideshow projection?',
          'What is the hall closing hour and overtime fee policy?',
        ],
        verificationTip: 'Check acoustics and seating comfort to ensure conversation remains enjoyable for elders.',
      },
      {
        id: 'v_catering',
        category: 'Catering & Dining',
        serviceTitle: 'Gourmet Multi-Course Banquet Caterer',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.32)} - ${formatINR(totalBudget * 0.40)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Can you cater custom heirloom family recipes or regional culinary favorites?',
          'Are mocktail bars, hot dessert counters, and live chaat included?',
          'What is the minimum guarantee plate policy for family RSVP drops?',
        ],
        verificationTip: 'Conduct a menu tasting with family elders to align spice and sugar levels.',
      },
      {
        id: 'v_photo',
        category: 'Cinematography',
        serviceTitle: 'Couple Memory Cinematographer & Portrait Photographer',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.10)} - ${formatINR(totalBudget * 0.16)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Can you digitize and edit old wedding photographs into a cinematic milestone montage?',
          'Will you capture candid group portraits of all generations attending?',
        ],
        verificationTip: 'Review past anniversary memory films to ensure heartwarming pacing.',
      },
      {
        id: 'v_decor',
        category: 'Ambient Decor',
        serviceTitle: 'Silver/Gold Milestone Floral & Light Decorator',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.10)} - ${formatINR(totalBudget * 0.15)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Do you provide photo arches, fairy lights, and elegant candle centerpieces?',
          'Can you build an archival memory photo wall displaying the couple’s journey?',
        ],
        verificationTip: 'Review past anniversary photo backdrops to verify elegant design.',
      },
    ];
  }

  if (eventType === 'engagement') {
    return [
      {
        id: 'v_venue',
        category: 'Venue & Banquet',
        serviceTitle: 'Boutique Banquet Hall & Changing Suites',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.26)} - ${formatINR(totalBudget * 0.34)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Is there a comfortable changing room for the bride and groom?',
          'Does the stage support customized floral backdrops and LED lighting?',
        ],
        verificationTip: 'Verify stage height and sightlines from back dining tables.',
      },
      {
        id: 'v_catering',
        category: 'Catering',
        serviceTitle: 'High Tea & Dinner Celebration Caterer',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.28)} - ${formatINR(totalBudget * 0.36)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'What high-tea starter assortment is served during initial family arrivals?',
          'Are live dessert and chaat stalls included in the package?',
        ],
        verificationTip: 'Taste welcome drinks and starter appetizers prior to finalizing menu.',
      },
      {
        id: 'v_decor',
        category: 'Stage Decor',
        serviceTitle: 'Ring Ceremony Stage & Floral Decorator',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.14)} - ${formatINR(totalBudget * 0.20)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Can you create a pastel floral ring arch with custom couple neon monogram?',
          'Are ring trays and stage lighting included?',
        ],
        verificationTip: 'Inspect stage backdrop dimensions to ensure it comfortably fits both immediate families.',
      },
      {
        id: 'v_photo',
        category: 'Photography',
        serviceTitle: 'Candid Couple Portrait Photographer',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.08)} - ${formatINR(totalBudget * 0.14)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Do you offer an engagement teaser video for social media sharing within 72 hours?',
          'Can we conduct a pre-event couple portrait shoot at the venue?',
        ],
        verificationTip: 'Check candid ring exchange capture albums from recent clients.',
      },
    ];
  }

  if (eventType === 'community_event') {
    return [
      {
        id: 'v_pandal',
        category: 'Infrastructure',
        serviceTitle: 'Pandal / Shamiana & Canopy Infrastructure Contractor',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.22)} - ${formatINR(totalBudget * 0.30)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Is the pandal material certified fire-retardant and waterproof?',
          'What is the dismantle and site restoration timeline after the event concludes?',
        ],
        verificationTip: 'Inspect anchor poles, guy-wire tensions, and emergency exit clearance widths.',
      },
      {
        id: 'v_langar_catering',
        category: 'Catering',
        serviceTitle: 'Community Feast / Langar / Mahaprasad Caterer',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.35)} - ${formatINR(totalBudget * 0.45)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Can your team manage continuous batch cooking for variable guest turnout?',
          'Are biodegradable leaf plates (pattal/donas) and drinking water drums included?',
        ],
        verificationTip: 'Review past experience catering for large public community gatherings or temple festivals.',
      },
      {
        id: 'v_pa_sound',
        category: 'Audio & Lighting',
        serviceTitle: 'Public Address (PA) Sound & Stage Lighting Operator',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.12)} - ${formatINR(totalBudget * 0.18)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Are long-throw horn speakers and directional stage monitors provided?',
          'Does the quote include a diesel generator backup for sound during power cuts?',
        ],
        verificationTip: 'Verify municipal sound curfew compliance (10:00 PM cutoff) and limiter settings.',
      },
      {
        id: 'v_sanitation',
        category: 'Sanitation & Permits',
        serviceTitle: 'Municipal Waste Clearance & Portable Sanitation Service',
        status: 'not_contacted',
        benchmarkCostRange: `${formatINR(totalBudget * 0.08)} - ${formatINR(totalBudget * 0.12)}`,
        provenance: 'estimated',
        keyQuestionsToAsk: [
          'Will your team place segregated wet/dry waste bins throughout the venue grounds?',
          'Is post-event ground cleaning and waste handover to municipal vehicles included?',
        ],
        verificationTip: 'Confirm local ward health officer clearance requirements and designated dump points.',
      },
    ];
  }

  // Default: corporate_celebration
  return [
    {
      id: 'v_venue',
      category: 'Venue & Hotel',
      serviceTitle: 'Hotel Banquet Hall & Conference Management',
      status: 'not_contacted',
      benchmarkCostRange: `${formatINR(totalBudget * 0.35)} - ${formatINR(totalBudget * 0.45)}`,
      provenance: 'estimated',
      keyQuestionsToAsk: [
        'Is high-speed dedicated enterprise Wi-Fi provided for attendees?',
        'What are the room block corporate rates for visiting leadership guests?',
      ],
      verificationTip: 'Inspect podium AV connection compatibility (HDMI, USB-C, audio jack) in person.',
    },
    {
      id: 'v_av_production',
      category: 'Production & AV',
      serviceTitle: 'LED Video Wall & Audio-Visual Production Team',
      status: 'not_contacted',
      benchmarkCostRange: `${formatINR(totalBudget * 0.18)} - ${formatINR(totalBudget * 0.25)}`,
      provenance: 'estimated',
      keyQuestionsToAsk: [
        'What is the pixel pitch of the LED video wall (P2.5 or P3 recommended for text)?',
        'Are backup lapel microphones and seamless switcher consoles included?',
      ],
      verificationTip: 'Test corporate slide presentations on the actual LED wall to check color calibration.',
    },
    {
      id: 'v_catering',
      category: 'Catering',
      serviceTitle: 'Corporate Dinner Buffet & Cocktail Caterer',
      status: 'not_contacted',
      benchmarkCostRange: `${formatINR(totalBudget * 0.25)} - ${formatINR(totalBudget * 0.32)}`,
      provenance: 'estimated',
      keyQuestionsToAsk: [
        'How are dietary restrictions (vegan, Jain, gluten-free) tagged on the buffet?',
        'What is the service staff to guest ratio during peak dining hours?',
      ],
      verificationTip: 'Ensure hot chafing dishes maintain consistent temperature throughout extended awards dinner.',
    },
    {
      id: 'v_mementos',
      category: 'Awards',
      serviceTitle: 'Corporate Trophies & Executive Mementos Supplier',
      status: 'not_contacted',
      benchmarkCostRange: `${formatINR(totalBudget * 0.08)} - ${formatINR(totalBudget * 0.12)}`,
      provenance: 'estimated',
      keyQuestionsToAsk: [
        'What is the laser engraving proof approval timeline?',
        'Are premium velvet presentation boxes included with trophies?',
      ],
      verificationTip: 'Proofread all engraved executive citations before batch production begins.',
    },
  ];
}

function getDeterministicSuggestions(input: EventInput): PersonalizedSuggestions {
  const { eventType } = input;

  if (eventType === 'wedding') {
    return {
      themeAndDecor: [
        'Royal Indian Brass & Genda Phool: Deep marigold garlands with brass urlis and floating candles at entrance.',
        'Sunset Pastel Mandap: Peach, ivory, and dusty rose draping with soft warm fairy lights for Muhurat photos.',
        'Interactive Welcome Photo Wall: Customized neon signage with the couple hashtag surrounded by botanical foliage.',
      ],
      foodAndBeverage: [
        'Welcome Drinks: Traditional spiced Aam Panna, Badam Milk, and Kokum Sherbet in earthen kulhads.',
        'Live Chaat Counter: Dahi Puri, Palak Patta Chaat, and Kolkata-style Puchkas served fresh.',
        'Main Course: Regional specialties reflecting the family heritage with hot tandoori breads baked on-demand.',
        'Dessert Finale: Warm Gulab Jamun paired with artisanal Kulfi Falooda and hot Jalebi with Rabdi.',
      ],
      entertainmentAndRituals: [
        'Energetic Baraat Dhol Tasha procession with synchronized Punjabi dholis.',
        'Family Sangeet Dance Face-off between bride and groom sides with a charismatic emcee.',
        'Express Mehendi counter for ladies with intricate organic herbal henna.',
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

  if (eventType === 'engagement') {
    return {
      themeAndDecor: [
        'Pastel Romance: Blush pink, champagne, and sage green floral installations with fairy light strings.',
        'Illuminated Ring Stage: Minimalist circular ring backdrop with warm amber backlight.',
        'Memory Journey Corridor: Floating framed photos of the couple leading into the main banquet hall.',
      ],
      foodAndBeverage: [
        'High-Tea Welcome: Artisanal mini samosas, cheese corn tarts, and masala chai shooters.',
        'Live Gourmet Pasta & Dimsum Counters alongside traditional North Indian delicacies.',
        'Signature Celebration Mocktail bar with personalized couple drink recipes.',
      ],
      entertainmentAndRituals: [
        'Special Ring Exchange Cues: Soft romantic instrumental melody during the ring exchange moment.',
        'Family Toast & Blessing: Immediate family members share 2-minute heartfelt congratulations.',
        'Acoustic Live Duo performing soulful Bollywood and contemporary acoustic melodies.',
      ],
      culturalConsiderations: [
        'Sagai Exchange: Designated family elders present gifts and traditional shagun with ceremonial sweets.',
        'Photo Flow: Organize immediate family portraits on stage before opening general guest congratulations.',
      ],
      accessibilityPlan: [
        'Elevator and level pathway access directly from venue entrance to the ring ceremony stage.',
        'Reserved front sofas for grandparents with comfortable armrests.',
      ],
    };
  }

  if (eventType === 'anniversary') {
    return {
      themeAndDecor: [
        'Silver / Golden Jubilee Splendor: Ivory linens with silver/gold runners, candlelit centerpieces, and white orchids.',
        'Archival Memory Walk: Chronological photo gallery showcasing the couple’s journey across decades.',
        'Fairy Light Canopy: Draped fairy lights creating a warm, nostalgic banquet atmosphere.',
      ],
      foodAndBeverage: [
        'Retro Feast Menu: Heirloom family dishes and classic regional banquet specialties from the couple’s wedding era.',
        'Tiered Anniversary Cake Cutting accompanied by artisanal dessert platters.',
        'Mild spice and low-sodium custom preparation options for senior guests.',
      ],
      entertainmentAndRituals: [
        'Milestone Tribute Video: 8-minute family documentary featuring video wishes from relatives across the globe.',
        'Couple Blessing Dance: Couple anniversary slow dance followed by family members joining on the dance floor.',
        'Children & Grandchildren Speeches with dedicated cordless microphone.',
      ],
      culturalConsiderations: [
        'Elder Blessings: Dedicate opening 15 minutes for younger generation to take blessings from celebrating couple.',
        'Memory Keepsakes: Distribute framed anniversary souvenir portrait or brass keepsake to close relatives.',
      ],
      accessibilityPlan: [
        'Acoustic Decibel Monitoring: Keep music volume under 65 dB during dinner so conversation remains easy for seniors.',
        'Spacious Table Layout: Ample walking clearance between dining tables for guests with walking sticks or wheelchairs.',
      ],
    };
  }

  if (eventType === 'birthday') {
    return {
      themeAndDecor: [
        'Whimsical Balloon Arch & Character Cutouts matching the guest age group.',
        'Personalized Milestone Photo Garland displaying precious year-by-year memories.',
        'Interactive Candy & Dessert Station with coordinated theme colors.',
      ],
      foodAndBeverage: [
        'Kid-Friendly Snack Bar: Crispy potato wedges, mini pizzas, pasta bowls, and fruit skewers.',
        'Custom Designer Birthday Cake with coordinating cupcakes and cake pops.',
        'Refreshing Fruit Mocktails and chilled milkshakes served in colorful sippers.',
      ],
      entertainmentAndRituals: [
        'Interactive magic show and musical games tailored to keep children and parents engaged.',
        'Cake Cutting Countdown with festive party poppers and birthday anthem.',
        'Tattoo and face-painting booth with organic, skin-safe colors.',
      ],
      culturalConsiderations: [
        'Birthday Aarti: Traditional family aarti blessing with sweet peda before public cake cutting.',
        'Orderly Return Gift Distribution at departure to ensure every child receives their favor set.',
      ],
      accessibilityPlan: [
        'Stroller Parking Zone near banquet entrance with dedicated attendant.',
        'Private quiet feeding / diaper changing room for young mothers and infants.',
      ],
    };
  }

  if (eventType === 'puja') {
    return {
      themeAndDecor: [
        'Traditional Temple Motif: Fresh banana tree entrance pillars with fragrant jasmine torans.',
        'Rangoli Floor Art: Geometric Kolam / Rangoli crafted with fresh flower petals and brass diyas.',
        'Low-Slung Wooden Chowkis with traditional silk cloths for ceremonial seating.',
      ],
      foodAndBeverage: [
        'Pure Ghee Prasadam: Authentic roasted wheat Halwa / Panjiri and Panchamrit offered during Aarti.',
        'Satvik Banana Leaf Feast: Traditional multi-course meal completely free of onion and garlic.',
        'Fresh Coconut Water and spiced buttermilk served in eco-friendly clay kulhads.',
      ],
      entertainmentAndRituals: [
        'Live Devotional Bhajan Mandali chanting sacred shlokas, stotras, and Aarti.',
        'Systematic Prasadam Distribution queue management with eco-friendly sal leaf donas.',
        'Sacred Havan Purnahuti ceremony with participation from all attending family branches.',
      ],
      culturalConsiderations: [
        'Footwear Etiquette: Dedicated shoe rack at entrance with wet wipes and clean carpets.',
        'Pooja Muhurat Adherence: Strict punctuality for commencement of main Vedic rituals.',
      ],
      accessibilityPlan: [
        'Low and High Seating Options: Floor carpets for youth alongside cushioned chairs for senior citizens.',
        'Well-Ventilated Havan Zone: Exhaust fans or open-air canopy to ensure smoke does not bother elderly lungs.',
      ],
    };
  }

  if (eventType === 'college_fest') {
    return {
      themeAndDecor: [
        'Neon Cyberpunk Horizon: Industrial metal trussing with neon LED accents and laser projections.',
        'Sponsor & Wall of Fame: High-impact branded backdrop with student selfie illumination zones.',
        'Fest Wristband Checkpoint: Glow-in-the-dark wristbands for evening concert entry.',
      ],
      foodAndBeverage: [
        'Student Food Court Stalls: Quick-service rolls, burgers, biryani boxes, and momos.',
        'Free Hydration Stations: Filtered drinking water refill points across event grounds.',
        'Energy & Mocktail Stations serving iced tea, cold brews, and mocktails.',
      ],
      entertainmentAndRituals: [
        'Battle of the Bands & Celebrity Headliner Concert on the main campus stage.',
        'Inter-college dance competition with professional external jury.',
        'Closing DJ Night with synchronized stage laser display wrapping by 9:30 PM.',
      ],
      culturalConsiderations: [
        'Campus Code of Conduct: Zero tolerance for substances, strict ID card verification at gates.',
        'Equal Opportunity Access: Volunteer coordinators assisting differently-abled student attendees.',
      ],
      accessibilityPlan: [
        'Accessible Ramp to Main Stage for physically-challenged performers and awardees.',
        'Clearly marked emergency evacuation corridors and on-site student first-aid station.',
      ],
    };
  }

  if (eventType === 'community_event') {
    return {
      themeAndDecor: [
        'Vibrant Festive Pandal: Colorful fabric drapes with marigold hangings and warm amber lanterns.',
        'Community Stage Backdrop: Handcrafted artwork celebrating regional heritage and festivals.',
        'Eco-Friendly Shamiana: Waterproof canopy designed to withstand changing weather.',
      ],
      foodAndBeverage: [
        'Community Langar / Maha-Prasad: Hygienically prepared community feast served in biodegradable plates.',
        'Continuous drinking water stations with clay matkas or filtered dispensers.',
        'Evening masala tea and traditional snacks served to volunteers and elders.',
      ],
      entertainmentAndRituals: [
        'Traditional Folk Dance & Dandiya Raas with live dhol and percussion.',
        'Community Talent Showcase: Children drama performance and senior citizen felicitations.',
        'Grand Evening Maha-Aarti with community participation.',
      ],
      culturalConsiderations: [
        'Inclusivity: Welcoming all community sections with dignity and equitable seating.',
        'Green Event Protocol: Zero plastic bottles; 100% waste segregation at collection points.',
      ],
      accessibilityPlan: [
        'Reserved front seating for community elders and pregnant women.',
        'Wide entry gates to prevent bottlenecks during peak entry hours.',
      ],
    };
  }

  // Default: corporate_celebration
  return {
    themeAndDecor: [
      'Modern Monochrome & Metallic Gold: Sleek architectural stage lines with ambient uplighting.',
      'Corporate Monogram Video Wall: High-resolution motion graphics displaying company values and achievements.',
      'Executive Photo Lounge: Professional headshot corner with corporate branded backdrops.',
    ],
    foodAndBeverage: [
      'Live Gourmet Appetizer Passes: Miniature hors d\'oeuvres and artisanal skewers.',
      'Multi-Cuisine Dinner Buffet: Balanced corporate menu featuring regional and continental specialties.',
      'Artisanal Coffee & Dessert Bar: Freshly brewed espresso and handcrafted confectionery.',
    ],
    entertainmentAndRituals: [
      'Inspiring Keynote Address & Annual Milestones Presentation by leadership.',
      'Excellence Awards Ceremony with customized background entrance fanfare.',
      'Corporate Mentalist or Stand-up Comedian tailored for professional workplace humor.',
    ],
    culturalConsiderations: [
      'Professional decorum and clear adherence to company diversity and inclusion guidelines.',
      'Punctual agenda schedule ensuring dinner concludes at an executive-friendly hour.',
    ],
    accessibilityPlan: [
      'Live Real-Time Captions on presentation screens for hearing-impaired attendees.',
      'Step-free ramp access to the main speaker podium and stage for all award recipients.',
    ],
  };
}
