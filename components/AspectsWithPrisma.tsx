"use client";

import React from 'react';
import AspectsAnimation from './AspectsBaseSvg';

interface AspectsAnimationProps {
  setColourAspectHighlighted?: (value: boolean) => void; // Accept state-tracking functions from parent page (optional)
}

const AspectsWithPrisma: React.FC<AspectsAnimationProps> = ({}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* AspectsAnimation component */}
      <div style={{ width: '100px', height: '100px', marginRight: '20px' }}>
        <AspectsAnimation minDuration={90} maxDuration={110} defaultInterAspectsHighlight={true} />
      </div>

      {/* Text next to the animation */}
      <div style={{ fontSize: '2.4rem', height: '75px' }}>
        <object
          data='/prisma-name-text.svg'
          type="image/svg+xml"
          style={{
              width: `100%`,
              height: `100%`,
              background: 'transparent'
          }}
        />
      </div>
    </div>
  );
};

export default AspectsWithPrisma;
