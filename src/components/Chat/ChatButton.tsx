import React from 'react';
import { css } from '@emotion/css';
import { ChatIcon } from '../UI/Icons';

interface ChatButtonProps {
  onClick: () => void;
  unreadCount?: number;
}

const buttonStyles = css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
  z-index: 999;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(0, 123, 255, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const badgeStyles = css`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
`;

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick, unreadCount = 0 }) => {
  return (
    <button
      className={buttonStyles}
      onClick={onClick}
      title="Open support chat"
    >
      <ChatIcon size={28} />
      {unreadCount > 0 && (
        <div className={badgeStyles}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
    </button>
  );
};
