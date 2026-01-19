import React from 'react';
import { EMAIL_CONSTRAINTS } from '../../config/constraints';
import type { EmailHeaderProps, PaddingSize } from '../../types';

interface Props extends EmailHeaderProps {
  puck?: { isEditing: boolean };
}

export function EmailHeader({
  logoUrl,
  logoAlt,
  logoWidth,
  backgroundColor,
  align,
  padding,
  puck,
}: Props) {
  const paddingValue = EMAIL_CONSTRAINTS.padding[padding as PaddingSize] || '20px';

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding: paddingValue,
    textAlign: align,
    width: '100%',
    boxSizing: 'border-box',
  };

  const imageStyle: React.CSSProperties = {
    width: logoWidth,
    maxWidth: '100%',
    height: 'auto',
    display: 'inline-block',
  };

  return (
    <div style={containerStyle} data-block-type="EmailHeader">
      {logoUrl ? (
        <img src={logoUrl} alt={logoAlt || 'Logo'} style={imageStyle} />
      ) : (
        <div
          style={{
            width: logoWidth,
            height: 50,
            backgroundColor: '#e0e0e0',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: 12,
            margin: '0 auto',
          }}
        >
          {puck?.isEditing ? 'Add Logo URL' : ''}
        </div>
      )}
    </div>
  );
}

export default EmailHeader;
