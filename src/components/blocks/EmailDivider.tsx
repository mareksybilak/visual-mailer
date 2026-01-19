import React from 'react';
import { EMAIL_CONSTRAINTS } from '../../config/constraints';
import type { EmailDividerProps, PaddingSize } from '../../types';

interface Props extends EmailDividerProps {
  puck?: { isEditing: boolean };
}

export function EmailDivider({ color, width, style, padding }: Props) {
  const paddingValue = EMAIL_CONSTRAINTS.padding[padding as PaddingSize] || '20px';

  const containerStyle: React.CSSProperties = {
    padding: paddingValue,
    width: '100%',
    boxSizing: 'border-box',
  };

  const dividerStyle: React.CSSProperties = {
    borderTop: `${width}px ${style} ${color}`,
    width: '100%',
    margin: 0,
  };

  return (
    <div style={containerStyle} data-block-type="EmailDivider">
      <hr style={dividerStyle} />
    </div>
  );
}

export default EmailDivider;
