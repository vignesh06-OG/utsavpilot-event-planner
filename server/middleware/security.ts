import type { Request, Response, NextFunction } from 'express';

// Simple in-memory sliding window rate limiter
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitRecord>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 25; // 25 requests per minute

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-client';
  const now = Date.now();

  const record = ipMap.get(ip);
  if (!record || now > record.resetTime) {
    ipMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait before generating another plan.',
      retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
    });
  }

  record.count += 1;
  next();
}

/**
 * Sanitizes text to protect against prompt injection and escape delimiters.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, '') // remove script tags and content
    .replace(/<style[\s\S]*?<\/style>/gi, '') // remove style tags and content
    .replace(/<system>[\s\S]*?<\/system>/gi, '') // remove XML system tags
    .replace(/<[^>]+>/g, '') // strip remaining HTML tags
    .replace(/```/g, '') // remove markdown code blocks that can confuse model
    .replace(/ignore (previous|all) instructions/gi, '[Filtered]')
    .trim()
    .slice(0, 1500); // strict length restriction
}
