import React, { useEffect, useRef } from 'react';
import { css } from '@emotion/css';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { Message as MessageType } from '../../types/chat';
import { scrollToBottom } from '../../utils/helpers';

interface MessageListProps {
  messages: MessageType[];
  isLoading?: boolean;
  onFollowUpClick?: (question: string) => void;
}

const containerStyles = css`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: white;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const emptyStateStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  color: #6c757d;
  padding: 40px 20px;
`;

const welcomeMessageStyles = css`
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  color: #495057;
`;

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading = false, 
  onFollowUpClick 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      scrollToBottom(containerRef.current);
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={containerStyles} ref={containerRef}>
        <div className={emptyStateStyles}>
          <div className={welcomeMessageStyles}>
            <h3>Hi! I'm Maddie</h3>
            <p>I'm your AI assistant powered by BizMate from Konica Minolta.</p>
            <p>I can help you with:</p>
            <ul style={{ textAlign: 'left', margin: '12px 0' }}>
              {/* <li>Checking your open cases</li> */}
              <li>Finding support documentation</li>
              {/* <li>Answering questions about your account</li> */}
              <li>General support inquiries</li>
            </ul>
            <p><strong>How can I help you today?</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerStyles} ref={containerRef}>
      {messages.map((message) => (
        <Message 
          key={message.id} 
          message={message} 
          onFollowUpClick={onFollowUpClick}
        />
      ))}
      
      {isLoading && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
