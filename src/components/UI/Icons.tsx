import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

export const SendIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 24 24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 24 24">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>
);

export const LoadingIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 24 24" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
);

export const ErrorIcon: React.FC<IconProps> = ({ size = 20, color = '#dc3545' }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

export const InfoCircleIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <text x="12" y="16" textAnchor="middle" fontSize="12" fontFamily="Arial, sans-serif" fill={color} fontWeight="bold">i</text>
  </svg>
);
