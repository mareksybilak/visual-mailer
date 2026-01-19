import React from 'react';
import type { EmailButtonProps } from '../../types';

const PADDING_MAP = {
  sm: '10px 20px',
  md: '15px 30px',
  lg: '20px 40px',
};

interface Props extends EmailButtonProps {
  puck?: { isEditing: boolean };
}

export function EmailButton({
  text,
  href,
  backgroundColor,
  textColor,
  fontSize,
  borderRadius,
  align,
  fullWidth,
  padding,
}: Props) {
  const containerStyle: React.CSSProperties = {
    textAlign: align,
    padding: '10px 20px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const buttonStyle: React.CSSProperties = {
    display: fullWidth ? 'block' : 'inline-block',
    backgroundColor,
    color: textColor,
    fontSize,
    borderRadius,
    padding: PADDING_MAP[padding] || PADDING_MAP.md,
    textDecoration: 'none',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 'bold',
    textAlign: 'center',
    border: 'none',
    cursor: 'pointer',
    width: fullWidth ? '100%' : 'auto',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle} data-block-type="EmailButton">
      <a href={href || '#'} style={buttonStyle}>
        {text || 'Button'}
      </a>
    </div>
  );
}

export default EmailButton;
