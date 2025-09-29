import React from 'react';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';
import { useChatStore } from '../../store/chatStore';

export const ChatWidget: React.FC = () => {
  const { isOpen, unreadCount, toggleChat, closeChat } = useChatStore();

  return (
    <>
      {!isOpen && (
        <ChatButton onClick={toggleChat} unreadCount={unreadCount} />
      )}
      <ChatWindow isOpen={isOpen} onClose={closeChat} />
    </>
  );
};
