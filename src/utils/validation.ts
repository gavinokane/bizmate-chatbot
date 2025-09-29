export const validateMessage = (message: string): boolean => {
  if (!message || message.trim().length === 0) {
    return false;
  }
  
  if (message.length > 1000) {
    return false;
  }

  // Check for potential injection attempts
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /\$\{.*\}/,
    /eval\s*\(/i
  ];

  return !dangerousPatterns.some(pattern => pattern.test(message));
};

export const sanitizeMessage = (message: string): string => {
  return message
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const validateSessionId = (sessionId: string): boolean => {
  const sessionPattern = /^session_\d+_[a-zA-Z0-9]{9}$/;
  return sessionPattern.test(sessionId);
};
