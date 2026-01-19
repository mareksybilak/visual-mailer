import React from 'react';
import { EMAIL_CONSTRAINTS } from '../../config/constraints';
import type { EmailImageProps, PaddingSize } from '../../types';

interface Props extends EmailImageProps {
  puck?: { isEditing: boolean };
}

export function EmailImage({
  src,
  alt,
  width,
  align,
  href,
  padding,
  puck,
}: Props) {
  const paddingValue = EMAIL_CONSTRAINTS.padding[padding as PaddingSize] || '20px';
  const imageWidth = width === 'full' || width === 0 ? '100%' : width;

  const containerStyle: React.CSSProperties = {
    padding: paddingValue,
    textAlign: align,
    width: '100%',
    boxSizing: 'border-box',
  };

  const imageStyle: React.CSSProperties = {
    width: imageWidth,
    maxWidth: '100%',
    height: 'auto',
    display: 'inline-block',
  };

  const placeholderStyle: React.CSSProperties = {
    width: typeof imageWidth === 'number' ? imageWidth : 300,
    height: 150,
    backgroundColor: '#e0e0e0',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    fontSize: 14,
  };

  const imageElement = src ? (
    <img src={src} alt={alt || ''} style={imageStyle} />
  ) : (
    <div style={placeholderStyle}>
      {puck?.isEditing ? 'Add Image URL' : ''}
    </div>
  );

  return (
    <div style={containerStyle} data-block-type="EmailImage">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
    </div>
  );
}

export default EmailImage;
