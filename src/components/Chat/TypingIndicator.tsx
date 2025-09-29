import React from 'react';
import { css, keyframes } from '@emotion/css';

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const typingStyles = css`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  margin: 8px 0;
  max-width: 80px;
  border: 1px solid #e9ecef;
`;

const dotStyles = css`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #6c757d;
  margin: 0 2px;
  animation: ${bounce} 1.4s infinite ease-in-out both;

  &:nth-of-type(1) { animation-delay: -0.32s; }
  &:nth-of-type(2) { animation-delay: -0.16s; }
  &:nth-of-type(3) { animation-delay: 0s; }
`;

const containerStyles = css`
  display: flex;
  justify-content: flex-start;
  margin: 12px 0;
`;

export const TypingIndicator: React.FC = () => {
  return (
    <div className={containerStyles}>
      <div className={typingStyles}>
        <div className={dotStyles} />
        <div className={dotStyles} />
        <div className={dotStyles} />
      </div>
    </div>
  );
};
