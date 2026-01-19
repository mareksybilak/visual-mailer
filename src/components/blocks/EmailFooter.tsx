import React from 'react';
import type { EmailFooterProps } from '../../types';

interface Props extends EmailFooterProps {
  puck?: { isEditing: boolean };
}

export function EmailFooter({
  companyName,
  address,
  showUnsubscribe,
  unsubscribeText,
  backgroundColor,
  textColor,
}: Props) {
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding: '30px 20px',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
  };

  const textStyle: React.CSSProperties = {
    color: textColor,
    fontSize: 12,
    lineHeight: 1.6,
    margin: 0,
    fontFamily: 'Arial, Helvetica, sans-serif',
  };

  const linkStyle: React.CSSProperties = {
    color: textColor,
    textDecoration: 'underline',
  };

  return (
    <div style={containerStyle} data-block-type="EmailFooter">
      <p style={textStyle}>
        {companyName && <strong>{companyName}</strong>}
        {companyName && address && <br />}
        {address && (
          <span style={{ whiteSpace: 'pre-line' }}>{address}</span>
        )}
      </p>
      {showUnsubscribe && (
        <p style={{ ...textStyle, marginTop: 15 }}>
          <a href="{{unsubscribe_url}}" style={linkStyle}>
            {unsubscribeText || 'Unsubscribe'}
          </a>
        </p>
      )}
    </div>
  );
}

export default EmailFooter;
