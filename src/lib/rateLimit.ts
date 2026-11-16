// src/lib/rateLimit.ts - Simple fixed-window rate limiter for API routes
//
// State lives in process memory, so on serverless hosts each instance counts
// separately. That still blunts scripted abuse; for a hard global limit, back
// this with a shared store such as Redis/Upstash.
import { NextRequest, NextResponse } from 'next/server';

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Returns a 429 response when the caller exceeded `limit` requests in
 * `windowMs` for this bucket, or null when the request may proceed.
 */
export function rateLimit(
  request: NextRequest,
  bucket: string,
  limit: number,
  windowMs: number,
  key: string = clientIp(request)
): NextResponse | null {
  const now = Date.now();
  const id = `${bucket}:${key}`;
  const current = windows.get(id);

  if (!current || current.resetAt <= now) {
    windows.set(id, { count: 1, resetAt: now + windowMs });
    if (windows.size > 10_000) {
      for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
    }
    return null;
  }

  current.count += 1;
  if (current.count <= limit) return null;

  const retryAfter = Math.ceil((current.resetAt - now) / 1000);
  return NextResponse.json(
    { message: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  );
}
