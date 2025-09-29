import { useState, useCallback } from 'react';

const RATE_LIMIT_REQUESTS = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_STORAGE_KEY = 'chat_rate_limit';

interface RateLimitData {
  requests: number[];
  lastReset: number;
}

export const useRateLimiting = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const storageKey = RATE_LIMIT_STORAGE_KEY;
    
    let rateLimitData: RateLimitData;
    
    try {
      const stored = localStorage.getItem(storageKey);
      rateLimitData = stored ? JSON.parse(stored) : { requests: [], lastReset: now };
    } catch {
      rateLimitData = { requests: [], lastReset: now };
    }

    // Clean old requests outside the window
    const windowStart = now - RATE_LIMIT_WINDOW;
    rateLimitData.requests = rateLimitData.requests.filter(time => time > windowStart);

    // Check if limit exceeded
    if (rateLimitData.requests.length >= RATE_LIMIT_REQUESTS) {
      setIsRateLimited(true);
      return false;
    }

    // Add current request
    rateLimitData.requests.push(now);
    localStorage.setItem(storageKey, JSON.stringify(rateLimitData));
    
    setIsRateLimited(false);
    return true;
  }, []);

  const resetRateLimit = useCallback(() => {
    localStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
    setIsRateLimited(false);
  }, []);

  return {
    checkRateLimit,
    resetRateLimit,
    isRateLimited
  };
};
