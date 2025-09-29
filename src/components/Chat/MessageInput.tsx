import React, { useState, KeyboardEvent } from 'react';
import { css } from '@emotion/css';
import { Button } from '../UI/Button';
import { SendIcon } from '../UI/Icons';
import { validateMessage } from '../../utils/validation';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const containerStyles = css`
  display: flex;
  padding: 16px;
  border-top: 1px solid #e9ecef;
  background-color: white;
  gap: 8px;
`;

const inputStyles = css`
  flex: 1;
  border: 1px solid #ced4da;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  outline: none;
  resize: none;
  max-height: 100px;
  min-height: 20px;
  
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const sendButtonStyles = css`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled = false,
  placeholder = "Type your message..."
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !validateMessage(trimmedMessage) || disabled) {
      return;
    }
    
    onSend(trimmedMessage);
    setMessage('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={containerStyles}>
      <textarea
        className={inputStyles}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
      />
      <Button
        onClick={handleSend}
        disabled={disabled || !message.trim() || !validateMessage(message.trim())}
        className={sendButtonStyles}
      >
        <SendIcon size={16} />
      </Button>
    </div>
  );
};
