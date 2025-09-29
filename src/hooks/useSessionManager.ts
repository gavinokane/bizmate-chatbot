import { useState, useEffect, useCallback } from 'react';
import { generateSessionId } from '../utils/helpers';

const SESSION_STORAGE_KEY = 'chat_session_id';
const SESSION_TIMESTAMP_KEY = 'chat_session_timestamp';
const SESSION_MAX_AGE = 30 * 60 * 1000; // 30 minutes

export const useSessionManager = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionValid, setIsSessionValid] = useState(false);

  useEffect(() => {
    // Load existing session
    const existingSession = localStorage.getItem(SESSION_STORAGE_KEY);
    const timestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);

    if (existingSession && timestamp) {
      const sessionAge = Date.now() - parseInt(timestamp);
      if (sessionAge < SESSION_MAX_AGE) {
        setSessionId(existingSession);
        setIsSessionValid(true);
      } else {
        // Session expired
        clearSession();
      }
    }
  }, []);

  const createSession = useCallback(() => {
    const newSessionId = generateSessionId();
    const timestamp = Date.now().toString();

    localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
    localStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp);
    
    setSessionId(newSessionId);
    setIsSessionValid(true);
    
    return newSessionId;
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_TIMESTAMP_KEY);
    localStorage.removeItem('chat_conversation');
    setSessionId(null);
    setIsSessionValid(false);
  }, []);

  const updateTimestamp = useCallback(() => {
    if (sessionId) {
      localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
    }
  }, [sessionId]);

  return {
    sessionId,
    isSessionValid,
    createSession,
    clearSession,
    updateTimestamp
  };
};
