import React from 'react';
import { EMAIL_CONSTRAINTS } from '../../config/constraints';
import type { EmailTextProps, PaddingSize } from '../../types';

interface Props extends EmailTextProps {
  puck?: { isEditing: boolean };
}

export function EmailText({
  content,
  fontSize,
  fontFamily,
  color,
  align,
  lineHeight,
  padding,
}: Props) {
  const paddingValue = EMAIL_CONSTRAINTS.padding[padding as PaddingSize] || '20px';

  const style: React.CSSProperties = {
    fontSize,
    fontFamily,
    color,
    textAlign: align,
    lineHeight,
    padding: paddingValue,
    margin: 0,
    width: '100%',
    boxSizing: 'border-box',
  };

  // Simple HTML rendering (in production, use a safe HTML renderer)
  return (
    <div
      style={style}
      data-block-type="EmailText"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default EmailText;
