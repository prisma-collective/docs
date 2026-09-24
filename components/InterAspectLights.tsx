import React from 'react';

interface InterAspectLightsProps {
  highlighted?: boolean;
}

const InterAspectLights: React.FC<InterAspectLightsProps> = ({ highlighted }) => {
  return (
    <object
        className={highlighted ? 'highlighted' : 'unhighlighted'}
        id='inter_aspect_lights'
        data='/inter-aspect-lights.svg'
        type="image/svg+xml"
        style={{
            position: 'absolute',
            zIndex: 0, // Ensure it is behind the aspects
            width: `55%`,
            height: `auto`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)', // Center the graphic
            pointerEvents: 'none', // Prevent interaction interference
        }}
    />
  );
};

export default InterAspectLights;
