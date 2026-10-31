import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { EventInputSchema } from '../src/domain/schemas';
import { rateLimiter } from './middleware/security';
import { generateGeminiEventPlan } from './services/geminiService';
import { calculateReplanDelta } from '../src/engine/replanEngine';
import type { ReplanConstraintsInput } from '../src/engine/replanEngine';
import type { EventPlan } from '../src/domain/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'UtsavPilot Backend Engine',
    hasGeminiKey,
    mode: hasGeminiKey ? 'gemini-ready' : 'deterministic-fallback',
  });
});

// Generate Plan
app.post('/api/plan', rateLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = EventInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid event parameters',
        details: parseResult.error.format(),
      });
    }

    const plan = await generateGeminiEventPlan(parseResult.data);
    return res.json(plan);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[API /plan Error]:', message);
    return res.status(500).json({
      error: 'Failed to generate celebration plan',
      message,
    });
  }
});

// Adaptive Replan
app.post('/api/replan', rateLimiter, (req: Request, res: Response) => {
  try {
    const { currentPlan, changes } = req.body as {
      currentPlan: EventPlan;
      changes?: ReplanConstraintsInput;
    };
    if (!currentPlan || !currentPlan.input) {
      return res.status(400).json({ error: 'Valid currentPlan is required for replanning' });
    }

    const { updatedPlan, delta } = calculateReplanDelta(currentPlan, changes || {});
    return res.json({ updatedPlan, delta });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[API /replan Error]:', message);
    return res.status(500).json({
      error: 'Failed to adapt celebration plan',
      message,
    });
  }
});

// Start server if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[UtsavPilot Server] running on http://localhost:${PORT}`);
  });
}

export default app;
