import React from 'react';
import type { EmailColumnsProps } from '../../types';

const GAP_MAP = {
  none: '0px',
  sm: '10px',
  md: '20px',
  lg: '30px',
};

interface Props extends EmailColumnsProps {
  puck?: { isEditing: boolean };
  children?: React.ReactNode;
}

export function EmailColumns({
  columns,
  gap,
  verticalAlign,
  stackOnMobile,
  children,
  puck,
}: Props) {
  const gapValue = GAP_MAP[gap] || GAP_MAP.md;
  const columnWidth = `${100 / columns}%`;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: stackOnMobile ? 'wrap' : 'nowrap',
    gap: gapValue,
    width: '100%',
    boxSizing: 'border-box',
  };

  const columnStyle: React.CSSProperties = {
    flex: `0 0 calc(${columnWidth} - ${gapValue})`,
    minWidth: stackOnMobile ? '280px' : 'auto',
    verticalAlign,
    boxSizing: 'border-box',
  };

  // In editor mode, show placeholders
  const columnElements = React.Children.count(children)
    ? React.Children.map(children, (child, index) => (
        <div key={index} style={columnStyle}>
          {child}
        </div>
      ))
    : Array.from({ length: columns }, (_, index) => (
        <div key={index} style={columnStyle}>
          <div
            style={{
              backgroundColor: '#f0f0f0',
              padding: '20px',
              textAlign: 'center',
              color: '#999',
              fontSize: 14,
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {puck?.isEditing ? `Column ${index + 1}` : ''}
          </div>
        </div>
      ));

  return (
    <div style={containerStyle} data-block-type="EmailColumns">
      {columnElements}
    </div>
  );
}

export default EmailColumns;
