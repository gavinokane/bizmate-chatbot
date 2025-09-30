import React, { useState, useCallback } from 'react';
import { css } from '@emotion/css';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { CloseIcon, ChatIcon, InfoCircleIcon } from '../UI/Icons';
import { Message, ChatRequest } from '../../types/chat';
import { chatAPI } from '../../services/api/chatAPI';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useSessionManager } from '../../hooks/useSessionManager';
import { useRateLimiting } from '../../hooks/useRateLimiting';
import { sanitizeMessage } from '../../utils/validation';
import { ErrorHandler } from '../../services/errorHandler';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const chatWindowStyles = css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease-out;
  
  &.open {
    transform: translateY(0);
    opacity: 1;
  }
`;

const headerStyles = css`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const titleStyles = css`
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const closeButtonStyles = css`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const errorMessageStyles = css`
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-left: 4px solid #dc3545;
  margin: 16px;
  border-radius: 4px;
  font-size: 14px;
`;

export const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useLocalStorage<Message[]>('chat_conversation', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [citationsSidebarOpen, setCitationsSidebarOpen] = useState(false);
  const [sidebarCitations, setSidebarCitations] = useState<any[]>([]);
  const [sidebarMessage, setSidebarMessage] = useState<Message | null>(null);
  const [isExploded, setIsExploded] = useState(false);
  
  const { sessionId, createSession, updateTimestamp } = useSessionManager();
  const { checkRateLimit, isRateLimited } = useRateLimiting();

  // Auto-update citations panel on new bot response
  React.useEffect(() => {
    if (!citationsSidebarOpen) return;
    // Find the latest bot message with sources
    const latestBotMsg = [...messages].reverse().find(
      (msg) => msg.sender === 'bot' && msg.sources && msg.sources.length > 0
    );
    if (latestBotMsg) {
      setSidebarCitations(latestBotMsg.sources || []);
      setSidebarMessage(latestBotMsg);
    }
  }, [messages, citationsSidebarOpen]);

  // Create session when chat opens
  React.useEffect(() => {
    if (isOpen && !sessionId) {
      createSession();
    }
  }, [isOpen, sessionId, createSession]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!sessionId || isLoading || isRateLimited) {
      return;
    }

    // Check rate limit
    if (!checkRateLimit()) {
      setError('Too many requests. Please wait a moment before sending another message.');
      return;
    }

    // Clear any existing errors
    setError(null);

    // Sanitize message content
    const sanitizedContent = sanitizeMessage(content);

    // Add user message immediately
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: sanitizedContent,
      sender: 'user',
      timestamp: new Date()
    };

    // Build conversation history from all previous messages (excluding the new user message)
    // Normalize timestamps and sort messages chronologically
    const historyMessages = [...messages].map(msg => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date
        ? msg.timestamp
        : new Date(msg.timestamp)
    })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    console.log('handleSendMessage: full messages array before building history:', historyMessages);
    const conversation_history = [];
    let lastUserMsg = null;
    for (let i = 0; i < historyMessages.length; i++) {
      const msg = historyMessages[i];
      if (msg.sender === 'user') {
        lastUserMsg = msg;
      } else if (msg.sender === 'bot' && lastUserMsg) {
        conversation_history.push({
          prompt: lastUserMsg.content,
          answer: msg.content,
          created_at: lastUserMsg.timestamp.toISOString()
        });
        lastUserMsg = null;
      }
      // Optionally, log for debugging
      console.log(
        `handleSendMessage: conversation_history so far:`,
        conversation_history
      );
    }
    console.log('handleSendMessage: constructed conversation_history:', conversation_history);

    setMessages((prev: Message[]) => {
      const updated = [...prev, userMessage];
      console.log('handleSendMessage: messages array after adding userMessage:', updated);
      return updated;
    });
    setIsLoading(true);

    try {
      // Prepare request for DoozerAI
      const request: ChatRequest = {
        query: sanitizedContent,
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        conversation_history
      };
      console.log('handleSendMessage: request object sent to sendMessage:', request);

      // Send to DoozerAI API
      const response = await chatAPI.sendMessage(request);

      // Add bot response
      const botMessage: Message = {
        id: response.id,
        content: response.message,
        sender: 'bot',
        timestamp: new Date(),
        sources: response.sources,
        followUpQuestions: response.followUpQuestions
      };

      setMessages((prev: Message[]) => {
        // Ensure the user message is present before adding the bot message
        let updated = prev;
        if (
          updated.length === 0 ||
          updated[updated.length - 1].id !== userMessage.id
        ) {
          updated = [...updated, userMessage];
        }
        const result = [...updated, botMessage];
        console.log('handleSendMessage: messages array after adding botMessage:', result);
        return result;
      });
      updateTimestamp();

    } catch (error) {
      ErrorHandler.logError(error, 'ChatWindow.sendMessage');
      
      const errorMsg = ErrorHandler.handleChatError(error);
      setError(errorMsg);

      // Add error message to chat
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading, isRateLimited, checkRateLimit, setMessages, updateTimestamp]);

  const handleFollowUpClick = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);

  const handleClearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, [setMessages]);

  return (
    <div
      className={`${chatWindowStyles} ${isOpen ? 'open' : ''}`}
      style={
        citationsSidebarOpen
          ? {
              width: isExploded ? '1400px' : '700px',
              height: isExploded ? '750px' : '500px',
              transition: 'width 0.3s, height 0.3s'
            }
          : {
              width: isExploded ? '760px' : '380px',
              height: isExploded ? '750px' : '500px',
              transition: 'width 0.3s, height 0.3s'
            }
      }
    >
      <div className={headerStyles}>
        <div className={titleStyles}>
          <ChatIcon size={20} />
          Maddie - AI Assistant
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {(() => {
            // Always show citations icon if REACT_APP_SHOW_CITATIONS === 'true'
            const latestBotMsg = [...messages].reverse().find(
              (msg) => msg.sender === 'bot' && msg.sources && msg.sources.length > 0
            );
            const hasCitations = !!latestBotMsg;
            return (
              <button
                className={closeButtonStyles}
                style={{ fontSize: '18px', marginRight: '2px', opacity: hasCitations ? 1 : 0.5, cursor: hasCitations ? 'pointer' : 'not-allowed' }}
                title={hasCitations ? "Show citations for latest message" : "No citations available"}
                onClick={() => {
                  if (hasCitations) {
                    setSidebarCitations(latestBotMsg.sources || []);
                    setSidebarMessage(latestBotMsg);
                    setCitationsSidebarOpen(true);
                  }
                }}
                disabled={!hasCitations}
              >
                <InfoCircleIcon size={18} />
              </button>
            );
          })()}
          <button
            className={closeButtonStyles}
            onClick={() => setIsExploded((prev) => !prev)}
            title={isExploded ? "Shrink chat window" : "Expand chat window"}
          >
            {isExploded ? "🗕" : "🗖"}
          </button>
          <button
            className={closeButtonStyles}
            onClick={handleClearConversation}
            title="Clear conversation"
          >
            🗑️
          </button>
          <button
            className={closeButtonStyles}
            onClick={onClose}
            title="Close chat"
          >
            <CloseIcon size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className={errorMessageStyles}>
          {error}
        </div>
      )}

      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        onFollowUpClick={handleFollowUpClick}
      />
      
      <MessageInput
        onSend={handleSendMessage}
        disabled={isLoading || !sessionId || isRateLimited}
        placeholder={
          isRateLimited 
            ? "Rate limit exceeded. Please wait..." 
            : "Ask Maddie anything..."
        }
      />

      {citationsSidebarOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '320px',
            height: '100%',
            background: '#fffbe6',
            borderLeft: '2px solid #ffd700',
            boxShadow: '-4px 0 16px rgba(0,0,0,0.10)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 16px',
            overflowY: 'auto',
            transition: 'right 0.3s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#212529' }}>Citations</span>
            <button
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#212529',
                borderRadius: '4px',
                padding: '4px 8px'
              }}
              onClick={() => setCitationsSidebarOpen(false)}
              title="Close citations"
            >
              <CloseIcon size={20} />
            </button>
          </div>
          <div style={{ fontSize: '15px', color: '#555', marginBottom: '12px' }}>
            {sidebarMessage && sidebarMessage.content}
          </div>
          <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
            {sidebarCitations.map((citation, idx) => (
              <li key={idx} style={{ marginBottom: '18px' }}>
                <div style={{ fontWeight: 500 }}>{citation.name}</div>
                <div style={{ fontSize: '13px', color: '#555' }}>{citation.content}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
