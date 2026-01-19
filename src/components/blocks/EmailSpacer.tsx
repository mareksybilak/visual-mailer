import React from 'react';
import type { EmailSpacerProps } from '../../types';

interface Props extends EmailSpacerProps {
  puck?: { isEditing: boolean };
}

export function EmailSpacer({ height, puck }: Props) {
  const style: React.CSSProperties = {
    height,
    width: '100%',
    display: 'block',
    backgroundColor: puck?.isEditing ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
    position: 'relative',
  };

  return (
    <div style={style} data-block-type="EmailSpacer">
      {puck?.isEditing && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 10,
            color: '#666',
          }}
        >
          {height}px
        </span>
      )}
    </div>
  );
}

export default EmailSpacer;
