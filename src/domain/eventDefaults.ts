import type { EventInput, EventType, EventTier } from './types';

export interface CategoryAllocationPreset {
  id: string;
  name: string;
  defaultPercentage: number;
  typicalItems: string[];
}

export const INDIAN_EVENT_ALLOCATION_PRESETS: Record<EventType, CategoryAllocationPreset[]> = {
  wedding: [
    {
      id: 'venue_hospitality',
      name: 'Venue & Guest Rooms',
      defaultPercentage: 25,
      typicalItems: ['Lawn / Banquet Hall Rental', 'Air Conditioning & Power Backup', 'Guest Rooms Block (10-20 rooms)'],
    },
    {
      id: 'catering_fnb',
      name: 'Catering & Dining',
      defaultPercentage: 30,
      typicalItems: ['Welcome Drinks & High Tea', 'Live Chaat & Starter Stalls', 'Multi-Course Buffet', 'Mithai & Dessert Bar'],
    },
    {
      id: 'decor_floral',
      name: 'Decor, Mandap & Floral',
      defaultPercentage: 15,
      typicalItems: ['Mandap Architecture & Fresh Florals', 'Stage Backdrop & Lighting', 'Entrance Arch & Pathway', 'Seating & Table Linens'],
    },
    {
      id: 'photo_video',
      name: 'Photography & Cinematic Video',
      defaultPercentage: 10,
      typicalItems: ['Traditional & Candid Photography', 'Drone Coverage', 'Cinematic Wedding Teaser & Full Film', 'Hardcover Premium Albums'],
    },
    {
      id: 'music_entertainment',
      name: 'Sound, DJ & Sangeet Artist',
      defaultPercentage: 6,
      typicalItems: ['Dhol Players for Baraat', 'Pro DJ, Sound & Truss Lighting', 'Sangeet Choreographer', 'Anchor / Emcee'],
    },
    {
      id: 'invites_favors',
      name: 'Invitations & Guest Return Gifts',
      defaultPercentage: 4,
      typicalItems: ['Digital WhatsApp Video Invites', 'Printed Boxed Mithai / Gift Hampers', 'Mehendi Giveaway Favors'],
    },
    {
      id: 'rituals_pooja',
      name: 'Pandit, Samagri & Rituals',
      defaultPercentage: 2,
      typicalItems: ['Pandit Ji / Priest Dakshina', 'Havan Samagri, Varmala & Puja Items', 'Haldi & Chooda Ceremony Essentials'],
    },
    {
      id: 'contingency',
      name: 'Contingency & Emergency Reserve',
      defaultPercentage: 8,
      typicalItems: ['Last-minute Guest Count Overshoot', 'Overtime Generator Fuel', 'Extra Transportation & Tips'],
    },
  ],

  birthday: [
    {
      id: 'venue_fnb',
      name: 'Venue & Party Food',
      defaultPercentage: 45,
      typicalItems: ['Party Hall Rental (3-4 hrs)', 'Appetizers, Buffet Dinner & Mocktails', 'Custom Theme Designer Cake & Cupcakes'],
    },
    {
      id: 'decor_balloon',
      name: 'Theme Decor & Balloons',
      defaultPercentage: 20,
      typicalItems: ['Theme Balloon Garland & Backdrop', 'Photo Booth Props', 'Welcome Standee & Table Centerpieces'],
    },
    {
      id: 'entertainment_games',
      name: 'Host, Magic Show & Activities',
      defaultPercentage: 15,
      typicalItems: ['Professional Game Host / Emcee', 'Magic Show / Puppet Show', 'Tattoo / Face Painting Artist'],
    },
    {
      id: 'favors_gifts',
      name: 'Return Gifts & Goodie Bags',
      defaultPercentage: 10,
      typicalItems: ['Age-appropriate Return Gift Sets', 'Personalized Gift Bags with Goodies'],
    },
    {
      id: 'contingency',
      name: 'Contingency Reserve',
      defaultPercentage: 10,
      typicalItems: ['Extra Party Snacks & Drink Refills', 'Unexpected Kid Plus-Ones'],
    },
  ],

  puja: [
    {
      id: 'prasadam_bhojan',
      name: 'Prasadam, Sweets & Bhojan',
      defaultPercentage: 45,
      typicalItems: ['Pure Ghee Maha-Prasadam (Laddoo, Halwa)', 'Satvik Traditional Multi-course Bhoj', 'Fruit & Dry Fruit Offerings'],
    },
    {
      id: 'priest_samagri',
      name: 'Pandit Ji Dakshina & Samagri',
      defaultPercentage: 20,
      typicalItems: ['Priest Dakshina (Chief + Assisting)', 'Havan Samagri, Camphor, Ghee & Sacred Utensils', 'Fresh Flowers, Garlands & Mango Leaves'],
    },
    {
      id: 'decor_mandir',
      name: 'Altar, Mandir Decor & Seating',
      defaultPercentage: 15,
      typicalItems: ['Marigold & Jasmine Floral Backdrop', 'Floor Gaddi, Chatai & Seating Carpets', 'Pooja Diya Setup & Shamiana Canopy'],
    },
    {
      id: 'bhajan_music',
      name: 'Bhajan Singer & Sound Setup',
      defaultPercentage: 10,
      typicalItems: ['Devotional Bhajan Mandali (Harmonium, Dholak)', 'Small PA Sound System & Microphones'],
    },
    {
      id: 'contingency',
      name: 'Contingency Reserve',
      defaultPercentage: 10,
      typicalItems: ['Extra Prasad Packing Boxes', 'Emergency Samagri Additions'],
    },
  ],

  college_fest: [
    {
      id: 'artist_sound',
      name: 'Pro Sound, Stage, Lights & Artist',
      defaultPercentage: 45,
      typicalItems: ['Headliner Musical Band / Stand-up Comic', 'Line Array Concert Sound System', 'Moving Head Stage Lights & LED Backdrop Wall'],
    },
    {
      id: 'venue_permissions',
      name: 'Campus Ground, Permissions & Power',
      defaultPercentage: 15,
      typicalItems: ['Industrial Power Generators & Cabling', 'Campus Security, Bouncers & Barricading', 'Police & Fire Department Clearances'],
    },
    {
      id: 'marketing_prizes',
      name: 'Trophies, Cash Prizes & Merchandise',
      defaultPercentage: 20,
      typicalItems: ['Winner Cash Prizes & Trophies', 'Volunteer Badges, Wristbands & Fest Tees', 'Posters, Flex Banners & Social Ads'],
    },
    {
      id: 'hospitality_crews',
      name: 'Artist Hospitality & Crew Food',
      defaultPercentage: 10,
      typicalItems: ['Green Room Catering & Artist Stays', 'Volunteer & Crew Food Packets'],
    },
    {
      id: 'contingency',
      name: 'Contingency Reserve',
      defaultPercentage: 10,
      typicalItems: ['Equipment Breakage Contingency', 'Emergency Medical First Aid Team'],
    },
  ],

  community_event: [
    {
      id: 'catering_prasad',
      name: 'Community Feast & Refreshments',
      defaultPercentage: 40,
      typicalItems: ['Community Langar / Bhandara / Buffet', 'Water Dispensers & Eco-Friendly Plates'],
    },
    {
      id: 'tent_stage',
      name: 'Pandal / Tent, Seating & PA System',
      defaultPercentage: 25,
      typicalItems: ['Waterproof Shamiana / Tent Setup', 'Plastic Chairs & Rented Carpets', 'Sound Amplifier & Horn Speakers'],
    },
    {
      id: 'cultural_programs',
      name: 'Cultural Performances & Anchoring',
      defaultPercentage: 15,
      typicalItems: ['Local Folk Dance / Drama Troupe', 'Emcee Honorarium & Stage Lighting'],
    },
    {
      id: 'permissions_waste',
      name: 'Permits, Power & Waste Management',
      defaultPercentage: 10,
      typicalItems: ['Municipal Clearances & Police Intimation', 'Waste Bins & Post-Event Cleaners'],
    },
    {
      id: 'contingency',
      name: 'Contingency Reserve',
      defaultPercentage: 10,
      typicalItems: ['Weather Contingency Covers', 'Emergency Power Backup'],
    },
  ],

  corporate_celebration: [
    {
      id: 'venue_banquet',
      name: 'Hotel Banquet & Dinner Buffet',
      defaultPercentage: 50,
      typicalItems: ['Hotel Banquet Hall with AV Support', 'Multi-Cuisine Dinner Buffet & Welcome Drinks'],
    },
    {
      id: 'av_production',
      name: 'Stage, Podium & AV Production',
      defaultPercentage: 20,
      typicalItems: ['LED Video Wall & Podium Setup', 'Wireless Collar & Handheld Mics'],
    },
    {
      id: 'awards_entertainment',
      name: 'Awards, Mementos & Team Activities',
      defaultPercentage: 15,
      typicalItems: ['Engraved Corporate Trophies & Gifts', 'Team Building Host / Corporate Mentalist'],
    },
    {
      id: 'contingency',
      name: 'Contingency Reserve',
      defaultPercentage: 15,
      typicalItems: ['Last minute headcount billing buffer'],
    },
  ],
};

// Benchmark minimum realistic per-guest cost in INR (Tier 1 vs Tier 2)
export const MINIMUM_PER_GUEST_BENCHMARKS: Record<EventType, Record<EventTier, number>> = {
  wedding: {
    budget: 800,
    standard: 1800,
    premium: 3500,
    luxury: 7500,
  },
  birthday: {
    budget: 400,
    standard: 900,
    premium: 1800,
    luxury: 3500,
  },
  puja: {
    budget: 250,
    standard: 500,
    premium: 1000,
    luxury: 2200,
  },
  college_fest: {
    budget: 150,
    standard: 350,
    premium: 800,
    luxury: 1800,
  },
  community_event: {
    budget: 120,
    standard: 250,
    premium: 500,
    luxury: 1200,
  },
  corporate_celebration: {
    budget: 900,
    standard: 1800,
    premium: 3200,
    luxury: 6000,
  },
};

export const SAMPLE_DEMO_EVENTS: EventInput[] = [
  {
    eventType: 'wedding',
    title: 'The Sharma & Verma Sangeet & Vivah',
    date: '2026-11-28',
    durationDays: 2,
    city: 'Jaipur, Rajasthan',
    tier: 'premium',
    guestCount: 300,
    totalBudget: 3500000,
    currency: 'INR',
    dietaryRequirements: ['Strict Vegetarian', 'Separate Jain Counter without onion/garlic', 'Live Rajasthani Chaat'],
    accessibilityNeeds: ['Wheelchair ramp for Mandap & stage', 'Reserved golf carts for elderly grandparents'],
    priorities: ['Memorable culinary experience', 'Top-tier candid cinematography', 'No single-use plastics'],
    styleTheme: 'Royal Rajasthani Heritage with Marigold, Brass Urlis & Amber Lighting',
    notes: 'Baraat on vintage car, Sangeet on evening before wedding with live folk band.',
  },
  {
    eventType: 'puja',
    title: '25th Silver Jubilee Griha Pravesh & Satyanarayan Katha',
    date: '2026-12-15',
    durationDays: 1,
    city: 'Bengaluru, Karnataka',
    tier: 'standard',
    guestCount: 120,
    totalBudget: 350000,
    currency: 'INR',
    dietaryRequirements: ['Traditional South Indian Banana Leaf Satvik Bhojan (No onion/garlic)'],
    accessibilityNeeds: ['Elevator access to 3rd-floor terrace for senior citizens', 'Low seating benches for puja'],
    priorities: ['Vedic authenticity of ritual', 'Traditional fresh jasmine and marigold floral rangoli'],
    styleTheme: 'Traditional South Indian Temple Vibe with Brass Kuthuvilakku and Banana Stems',
    notes: 'Katha begins at 9:30 AM followed by traditional banana leaf feast at 1:00 PM.',
  },
  {
    eventType: 'birthday',
    title: "Aarav's 1st Birthday: Little Krishna Celebration",
    date: '2026-11-08',
    durationDays: 1,
    city: 'Mumbai, Maharashtra',
    tier: 'standard',
    guestCount: 75,
    totalBudget: 150000,
    currency: 'INR',
    dietaryRequirements: ['Kid-friendly non-spicy snacks', 'Eggless chocolate designer cake', 'Pav Bhaji & Pasta counter'],
    accessibilityNeeds: ['Stroller parking area', 'Private feeding and diaper-change room'],
    priorities: ['Interactive kids entertainer & puppet show', 'Cute milestone photo gallery'],
    styleTheme: 'Peacock feather, butter pot motifs with pastel blue, yellow and gold balloon arches',
    notes: 'Cake cutting at 6:30 PM with personalized wooden puzzle return gifts for kids.',
  },
  {
    eventType: 'college_fest',
    title: 'Tarang 2026: Annual Inter-College Cultural Extravaganza',
    date: '2026-12-05',
    durationDays: 1,
    city: 'Delhi NCR',
    tier: 'budget',
    guestCount: 650,
    totalBudget: 600000,
    currency: 'INR',
    dietaryRequirements: ['Meal coupon boxes for attendees', 'Hydration water refill stations'],
    accessibilityNeeds: ['Ramp onto main performance stage', 'Marked emergency exit corridors'],
    priorities: ['Professional acoustic sound system & truss lighting', 'Strict bouncer security & crowd control'],
    styleTheme: 'Neon Retro-Futuristic with glow wristbands and laser stage projection',
    notes: 'Band performance starts at 5:00 PM followed by DJ night wrapping at 9:30 PM sharp.',
  },
];
