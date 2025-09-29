import { validateMessage, sanitizeMessage, validateSessionId } from '../validation';

describe('Validation Utils', () => {
  describe('validateMessage', () => {
    it('returns true for valid messages', () => {
      expect(validateMessage('Hello, world!')).toBe(true);
      expect(validateMessage('This is a normal message.')).toBe(true);
    });

    it('returns false for empty messages', () => {
      expect(validateMessage('')).toBe(false);
      expect(validateMessage('   ')).toBe(false);
    });

    it('returns false for too long messages', () => {
      const longMessage = 'a'.repeat(1001);
      expect(validateMessage(longMessage)).toBe(false);
    });

    it('returns false for potentially dangerous content', () => {
      expect(validateMessage('<script>alert("xss")</script>')).toBe(false);
      expect(validateMessage('javascript:alert("xss")')).toBe(false);
      expect(validateMessage('onclick="alert()"')).toBe(false);
    });
  });

  describe('sanitizeMessage', () => {
    it('escapes HTML characters', () => {
      // Fix: The function correctly escapes forward slashes too
      expect(sanitizeMessage('<div>Hello</div>')).toBe('&lt;div&gt;Hello&lt;&#x2F;div&gt;');
      expect(sanitizeMessage('"Hello"')).toBe('&quot;Hello&quot;');
      expect(sanitizeMessage("'Hello'")).toBe('&#x27;Hello&#x27;');
    });

    it('trims whitespace', () => {
      expect(sanitizeMessage('  Hello  ')).toBe('Hello');
    });
  });

  describe('validateSessionId', () => {
    it('returns true for valid session IDs', () => {
      expect(validateSessionId('session_1234567890_abcdefghi')).toBe(true);
    });

    it('returns false for invalid session IDs', () => {
      expect(validateSessionId('invalid_session')).toBe(false);
      expect(validateSessionId('session_123')).toBe(false);
      expect(validateSessionId('')).toBe(false);
    });
  });
});
