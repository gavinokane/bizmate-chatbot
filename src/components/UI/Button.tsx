import React from 'react';
import { css } from '@emotion/css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const buttonStyles = css`
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const variants = {
  primary: css`
    background-color: #007bff;
    color: white;
    &:hover:not(:disabled) {
      background-color: #0056b3;
    }
  `,
  secondary: css`
    background-color: #6c757d;
    color: white;
    &:hover:not(:disabled) {
      background-color: #545b62;
    }
  `,
  danger: css`
    background-color: #dc3545;
    color: white;
    &:hover:not(:disabled) {
      background-color: #c82333;
    }
  `
};

const sizes = {
  small: css`
    padding: 4px 8px;
    font-size: 12px;
  `,
  medium: css`
    padding: 8px 16px;
    font-size: 14px;
  `,
  large: css`
    padding: 12px 24px;
    font-size: 16px;
  `
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${buttonStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};
