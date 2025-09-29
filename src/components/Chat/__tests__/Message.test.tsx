import React from 'react';
import { render, screen } from '@testing-library/react';
import { Message } from '../Message';
import { Message as MessageType } from '../../../types/chat';

const mockMessage: MessageType = {
  id: '1',
  content: 'Hello, world!',
  sender: 'user',
  timestamp: new Date('2024-01-01T10:00:00Z'),
};

describe('Message Component', () => {
  it('renders user message correctly', () => {
    render(<Message message={mockMessage} />);
    
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    // Check for any time format (more flexible)
    expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
  });

  it('renders bot message with sources', () => {
    const botMessage: MessageType = {
      ...mockMessage,
      sender: 'bot',
      sources: ['Document 1', 'Document 2'],
    };

    render(<Message message={botMessage} />);
    
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('Sources: Document 1, Document 2')).toBeInTheDocument();
  });

  it('renders follow-up questions', () => {
    const messageWithFollowUp: MessageType = {
      ...mockMessage,
      sender: 'bot',
      followUpQuestions: ['Question 1?', 'Question 2?'],
    };

    render(<Message message={messageWithFollowUp} />);
    
    expect(screen.getByText('Question 1?')).toBeInTheDocument();
    expect(screen.getByText('Question 2?')).toBeInTheDocument();
  });
});
