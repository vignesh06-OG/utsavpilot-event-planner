import type { EventInput, EventPlan } from '../../src/domain/types';
import { calculateBudgetFeasibility, formatINR } from '../../src/engine/budgetEngine';
import { generateDeterministicPlan } from '../../src/engine/deterministicFallback';
import { sanitizeInput } from '../middleware/security';

interface RawGeminiTask {
  id?: string;
  title?: string;
  category?: string;
  phase?: string;
  daysBeforeEvent?: number;
  priority?: string;
  notes?: string;
}

interface RawGeminiVendor {
  id?: string;
  category?: string;
  serviceTitle?: string;
  benchmarkCostRange?: string;
  keyQuestionsToAsk?: string[];
  verificationTip?: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function generateGeminiEventPlan(input: EventInput): Promise<EventPlan> {
  // If no API key is provided, execute deterministic fallback immediately
  if (!GEMINI_API_KEY) {
    console.log('[GeminiService] No GEMINI_API_KEY set. Using deterministic fallback engine.');
    return generateDeterministicPlan(input);
  }

  // 1. Calculate deterministic budget first so AI cannot hallucinate totals
  const deterministicBudget = calculateBudgetFeasibility(input);

  // 2. Construct safe, sanitized prompt
  const sanitizedTitle = sanitizeInput(input.title);
  const sanitizedCity = sanitizeInput(input.city);
  const sanitizedTheme = sanitizeInput(input.styleTheme);
  const sanitizedNotes = sanitizeInput(input.notes || '');

  const prompt = `
You are an expert Indian celebration planner for "UtsavPilot". 
Generate a realistic, culturally sensitive, actionable celebration plan in pure JSON format.

Event Parameters:
- Title: ${sanitizedTitle}
- Type: ${input.eventType}
- City: ${sanitizedCity}
- Tier: ${input.tier}
- Guest Count: ${input.guestCount}
- Total Budget: ${formatINR(input.totalBudget)}
- Dietary Requirements: ${JSON.stringify(input.dietaryRequirements)}
- Accessibility Needs: ${JSON.stringify(input.accessibilityNeeds)}
- Priorities: ${JSON.stringify(input.priorities)}
- Style Theme: ${sanitizedTheme}
- Notes: ${sanitizedNotes}

Pre-Calculated Deterministic Budget Summary:
- Total Budget: ${deterministicBudget.totalBudget} INR
- Contingency Reserve: ${deterministicBudget.contingencyAmount} INR (${deterministicBudget.contingencyPercentage}%)
- Cost Per Guest: ${deterministicBudget.costPerGuest} INR
- Feasibility: ${deterministicBudget.isFeasible ? 'Feasible' : 'Requires Adjustment'}

JSON Output Requirements (Do not wrap in markdown or backticks, return ONLY valid raw JSON):
{
  "summary": "2-3 concise sentences summarizing the vision and execution focus",
  "assumptions": ["3 realistic assumptions about Indian guest arrival, vendor buffers, etc."],
  "unresolvedDecisions": ["2-3 key decisions the host family needs to make immediately"],
  "tasks": [
    {
      "id": "task_1",
      "title": "Actionable task name",
      "category": "Category name",
      "phase": "months_before" | "weeks_before" | "days_before" | "day_of" | "post_event",
      "daysBeforeEvent": 60,
      "priority": "critical" | "high" | "medium" | "low",
      "notes": "Practical tip for execution in India"
    }
  ],
  "vendorChecklist": [
    {
      "id": "v_1",
      "category": "Venue & Hospitality",
      "serviceTitle": "Service title",
      "status": "not_contacted",
      "benchmarkCostRange": "e.g. ₹2,00,000 - ₹3,00,000",
      "provenance": "estimated",
      "keyQuestionsToAsk": ["Negotiation or operational question to ask the vendor"],
      "verificationTip": "Specific tip to verify vendor reliability"
    }
  ],
  "suggestions": {
    "themeAndDecor": ["3 distinct decor ideas"],
    "foodAndBeverage": ["3 distinct regional food/counter ideas"],
    "entertainmentAndRituals": ["3 interactive ritual or entertainment ideas"],
    "culturalConsiderations": ["2 Indian cultural etiquette pointers"],
    "accessibilityPlan": ["2 accessibility accommodations for elders or children"]
  }
}
`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout

    // Try Gemini 1.5 Flash endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.4,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[GeminiService] API returned ${response.status}. Falling back to deterministic engine.`);
      return generateDeterministicPlan(input);
    }

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      console.warn('[GeminiService] Empty response from Gemini. Falling back to deterministic engine.');
      return generateDeterministicPlan(input);
    }

    // Clean text in case markdown backticks were added
    const cleanedText = textOutput.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
    const parsed = JSON.parse(cleanedText);

    // Reconcile with deterministic budget
    const plan: EventPlan = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      input,
      summary: parsed.summary || `${input.title} - Indian celebration plan`,
      budgetReport: deterministicBudget,
      tasks: Array.isArray(parsed.tasks) && parsed.tasks.length > 0 ? parsed.tasks.map((t: RawGeminiTask, idx: number) => ({
        id: t.id || `task_${idx + 1}`,
        title: t.title || 'Event Milestone',
        category: t.category || 'General',
        phase: (t.phase && ['months_before', 'weeks_before', 'days_before', 'day_of', 'post_event'].includes(t.phase)) ? t.phase : 'weeks_before',
        daysBeforeEvent: typeof t.daysBeforeEvent === 'number' ? t.daysBeforeEvent : 14,
        isCompleted: false,
        priority: (t.priority && ['critical', 'high', 'medium', 'low'].includes(t.priority)) ? t.priority : 'medium',
        notes: t.notes || '',
      })) : generateDeterministicPlan(input).tasks,
      vendorChecklist: Array.isArray(parsed.vendorChecklist) && parsed.vendorChecklist.length > 0 ? parsed.vendorChecklist.map((v: RawGeminiVendor, idx: number) => ({
        id: v.id || `v_${idx + 1}`,
        category: v.category || 'Vendor',
        serviceTitle: v.serviceTitle || 'Service Partner',
        status: 'not_contacted',
        benchmarkCostRange: v.benchmarkCostRange || 'Market benchmark',
        provenance: 'estimated',
        keyQuestionsToAsk: Array.isArray(v.keyQuestionsToAsk) ? v.keyQuestionsToAsk : ['What are the cancellation terms?'],
        verificationTip: v.verificationTip || 'Inspect past portfolios.',
      })) : generateDeterministicPlan(input).vendorChecklist,
      suggestions: {
        themeAndDecor: parsed.suggestions?.themeAndDecor || ['Traditional floral theme'],
        foodAndBeverage: parsed.suggestions?.foodAndBeverage || ['Multi-course buffet'],
        entertainmentAndRituals: parsed.suggestions?.entertainmentAndRituals || ['Family ceremony and music'],
        culturalConsiderations: parsed.suggestions?.culturalConsiderations || ['Family elders welcome'],
        accessibilityPlan: parsed.suggestions?.accessibilityPlan || ['Wheelchair friendly ramps'],
      },
      assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions : ['Turnout estimated at 85%'],
      unresolvedDecisions: Array.isArray(parsed.unresolvedDecisions) ? parsed.unresolvedDecisions : ['Final venue selection'],
      isDemoSample: false,
      modelUsed: 'gemini-flash',
    };

    return plan;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[GeminiService] Error calling Gemini (${errMsg}). Safe failover to deterministic engine.`);
    return generateDeterministicPlan(input);
  }
}
