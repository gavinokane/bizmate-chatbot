import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { css } from '@emotion/css';
import { Message as MessageType, Citation } from '../../types/chat';
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

const citationPillStyles = css`
  display: inline-block;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 12px;
  padding: 4px 10px;
  margin: 2px 6px 2px 0;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #a5b4fc;
  transition: background 0.2s;
  &:hover {
    background: #c7d2fe;
  }
`;

const citationDetailsStyles = css`
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 14px;
  margin-top: 6px;
  font-size: 13px;
  color: #374151;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const sourcesStyles = css`
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.8;
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
  const [expandedCitation, setExpandedCitation] = useState<number | null>(null);

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
        
        {message.sources && message.sources.length > 0 && (
          <div className={sourcesStyles} style={{ position: 'relative', display: 'inline-block' }}>
            <span
              className={citationPillStyles}
              style={{
                fontWeight: 'bold',
                fontSize: '14px',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                marginRight: '6px',
                cursor: 'pointer'
              }}
              tabIndex={0}
              aria-label="Show citations"
              onMouseEnter={() => setExpandedCitation(0)}
              onMouseLeave={() => setExpandedCitation(null)}
              onFocus={() => setExpandedCitation(0)}
              onBlur={() => setExpandedCitation(null)}
            >
              i
            </span>
            {expandedCitation === 0 && (
              <div
                className={citationDetailsStyles}
                style={{
                  position: 'absolute',
                  left: '28px',
                  top: '-10px',
                  minWidth: '220px',
                  zIndex: 10,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.10)'
                }}
                role="tooltip"
              >
                <strong>Citations</strong>
                <ul style={{ paddingLeft: 0, margin: '8px 0 0 0', listStyle: 'none' }}>
                  {message.sources.map((citation: Citation, idx: number) => (
                    <li key={idx} style={{ marginBottom: '10px' }}>
                      <div style={{ fontWeight: 500 }}>{citation.name}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}>{citation.content}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
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
