import React from 'react';

const ConnectingArrow = ({ startX, startY, endX, endY, id, active }) => {
  // d={`M20 20 C20 20, 50 70, 20,120`}
  return (
    <>
      <path
        className={`section-arc-path${active ? ' active-arc' : ''}`}
        d={`M${startX} ${startY} Q${startX / 2 + endX / 2 + 30} ${
          startY / 2 + endY / 2
        }, ${endX},${endY}`}
        markerEnd={`url(#arrowhead)`}
        // markerStart={`url(#arrowhead)`}
        fill='transparent'
      ></path>
    </>
  );
};

export default ConnectingArrow;
