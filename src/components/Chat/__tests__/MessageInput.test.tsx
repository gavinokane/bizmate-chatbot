import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageInput } from '../MessageInput';

describe('MessageInput Component', () => {
  const mockOnSend = jest.fn();

  beforeEach(() => {
    mockOnSend.mockClear();
  });

  it('renders input field and send button', () => {
    render(<MessageInput onSend={mockOnSend} />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onSend when valid message is submitted', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSend={mockOnSend} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button');
    
    await user.type(input, 'Hello, world!');
    await user.click(sendButton);
    
    expect(mockOnSend).toHaveBeenCalledWith('Hello, world!');
  });

  it('does not submit empty messages', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSend={mockOnSend} />);
    
    const sendButton = screen.getByRole('button');
    
    await user.click(sendButton);
    
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(<MessageInput onSend={mockOnSend} disabled={true} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button');
    
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });
});
