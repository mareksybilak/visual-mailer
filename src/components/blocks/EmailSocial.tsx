import React from 'react';
import type { EmailSocialProps } from '../../types';

// Social network icon URLs (using simple text/emoji for now - in production use actual icons)
const SOCIAL_ICONS: Record<string, { label: string; color: string }> = {
  facebook: { label: 'FB', color: '#1877f2' },
  twitter: { label: 'TW', color: '#1da1f2' },
  linkedin: { label: 'IN', color: '#0077b5' },
  instagram: { label: 'IG', color: '#e4405f' },
  youtube: { label: 'YT', color: '#ff0000' },
};

interface ExtendedProps extends Omit<EmailSocialProps, 'networks'> {
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  puck?: { isEditing: boolean };
}

export function EmailSocial({
  iconSize,
  align,
  iconStyle,
  facebookUrl,
  twitterUrl,
  linkedinUrl,
  instagramUrl,
  youtubeUrl,
  puck,
}: ExtendedProps) {
  const networks = [
    { type: 'facebook', url: facebookUrl },
    { type: 'twitter', url: twitterUrl },
    { type: 'linkedin', url: linkedinUrl },
    { type: 'instagram', url: instagramUrl },
    { type: 'youtube', url: youtubeUrl },
  ].filter((n) => n.url);

  const containerStyle: React.CSSProperties = {
    textAlign: align,
    padding: '20px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const getIconStyle = (network: string): React.CSSProperties => {
    const icon = SOCIAL_ICONS[network];
    let bgColor = icon?.color || '#666';

    if (iconStyle === 'black') bgColor = '#000000';
    if (iconStyle === 'white') bgColor = '#ffffff';

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: iconSize,
      height: iconSize,
      borderRadius: '50%',
      backgroundColor: bgColor,
      color: iconStyle === 'white' ? '#000' : '#fff',
      fontSize: iconSize * 0.4,
      fontWeight: 'bold',
      textDecoration: 'none',
      margin: '0 5px',
      border: iconStyle === 'white' ? '1px solid #ddd' : 'none',
    };
  };

  if (networks.length === 0 && puck?.isEditing) {
    return (
      <div style={containerStyle} data-block-type="EmailSocial">
        <span style={{ color: '#999', fontSize: 14 }}>
          Add social media URLs in the sidebar
        </span>
      </div>
    );
  }

  return (
    <div style={containerStyle} data-block-type="EmailSocial">
      {networks.map((network) => (
        <a
          key={network.type}
          href={network.url}
          target="_blank"
          rel="noopener noreferrer"
          style={getIconStyle(network.type)}
        >
          {SOCIAL_ICONS[network.type]?.label || '?'}
        </a>
      ))}
    </div>
  );
}

export default EmailSocial;
