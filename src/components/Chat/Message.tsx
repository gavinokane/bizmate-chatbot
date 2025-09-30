import React from 'react';
import ReactMarkdown from 'react-markdown';
import { css } from '@emotion/css';
import { Message as MessageType } from '../../types/chat';
import { formatTimestamp } from '../../utils/helpers';

interface MessageProps {
  message: MessageType;
  onFollowUpClick?: (question: string) => void;
}

const messageContainerStyles = css`
  display: flex;
  margin: 12px 0;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const userMessageStyles = css`
  justify-content: flex-end;
`;

const botMessageStyles = css`
  justify-content: flex-start;
`;

const messageBubbleStyles = css`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
`;

const userBubbleStyles = css`
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
`;

const botBubbleStyles = css`
  background-color: #f8f9fa;
  color: #212529;
  border-bottom-left-radius: 4px;
  border: 1px solid #e9ecef;
`;

const timestampStyles = css`
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
`;




const followUpStyles = css`
  margin-top: 8px;
`;

const followUpButtonStyles = css`
  background: rgba(0, 123, 255, 0.1);
  border: 1px solid #007bff;
  color: #007bff;
  border-radius: 12px;
  padding: 4px 8px;
  margin: 2px 4px 2px 0;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 123, 255, 0.2);
  }
`;

export const Message: React.FC<MessageProps> = ({ message, onFollowUpClick }) => {
  const isUser = message.sender === 'user';

  const handleFollowUpClick = (question: string) => {
    if (onFollowUpClick) {
      onFollowUpClick(question);
    }
  };

  // Ensure we have a valid date
  const messageDate = message.timestamp instanceof Date 
    ? message.timestamp 
    : new Date(message.timestamp);

  return (
    <div className={`${messageContainerStyles} ${isUser ? userMessageStyles : botMessageStyles}`}>
      <div className={`${messageBubbleStyles} ${isUser ? userBubbleStyles : botBubbleStyles}`}>
        <ReactMarkdown>{message.content}</ReactMarkdown>
        <div className={timestampStyles}>
          {formatTimestamp(messageDate)}
        </div>
        
        
        {message.followUpQuestions && message.followUpQuestions.length > 0 && (
          <div className={followUpStyles}>
            {message.followUpQuestions.map((question: string, index: number) => (
              <button
                key={index}
                className={followUpButtonStyles}
                onClick={() => handleFollowUpClick(question)}
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
