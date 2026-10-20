import type { EventInput, EventPlan, ReplanDelta } from '../domain/types';
import { generateDeterministicPlan } from '../engine/deterministicFallback';
import { calculateReplanDelta } from '../engine/replanEngine';
import type { ReplanConstraintsInput } from '../engine/replanEngine';

export interface PlanGenerationResult {
  plan: EventPlan;
  isFallback: boolean;
  message?: string;
}

export async function requestPlanGeneration(input: EventInput): Promise<PlanGenerationResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 14000);

    const res = await fetch('/api/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const plan: EventPlan = await res.json();
      return {
        plan,
        isFallback: plan.modelUsed === 'deterministic-fallback',
        message: plan.modelUsed === 'gemini-flash' 
          ? 'Plan generated dynamically with Gemini GenAI' 
          : 'Plan generated via Deterministic Indian Celebration Engine',
      };
    }

    console.warn(`[Client] Server responded with status ${res.status}. Using in-browser deterministic engine.`);
    const fallbackPlan = generateDeterministicPlan(input);
    return {
      plan: fallbackPlan,
      isFallback: true,
      message: 'Server unavailable. Switched to offline deterministic engine.',
    };
  } catch (err: any) {
    console.warn('[Client] Network / API error. Falling back gracefully to deterministic engine:', err.message);
    const fallbackPlan = generateDeterministicPlan(input);
    return {
      plan: fallbackPlan,
      isFallback: true,
      message: 'Operating in reliable deterministic fallback mode.',
    };
  }
}

export async function requestPlanReplan(
  currentPlan: EventPlan,
  changes: ReplanConstraintsInput
): Promise<{ updatedPlan: EventPlan; delta: ReplanDelta }> {
  try {
    const res = await fetch('/api/replan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPlan, changes }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[Client] Server replan failed, running locally:', err);
  }

  // Local fallback
  return calculateReplanDelta(currentPlan, changes);
}
