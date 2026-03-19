// lib/rate-limit.ts

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  public check(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing timestamps for this identifier
    const timestamps = this.requests.get(identifier) || [];
    
    // Filter timestamps to only keep those within the current window
    const recentTimestamps = timestamps.filter(ts => ts > windowStart);
    
    if (recentTimestamps.length >= this.limit) {
      return false; // Rate limit exceeded
    }
    
    // Allow request and record timestamp
    recentTimestamps.push(now);
    this.requests.set(identifier, recentTimestamps);
    
    return true; // Request allowed
  }
}

// Global instance for AI analysis (e.g., 5 requests per minute per user)
export const aiRateLimiter = new RateLimiter(5, 60 * 1000);

// Global instance for File uploads (e.g., 20 requests per minute per user)
export const fileUploadRateLimiter = new RateLimiter(20, 60 * 1000);
