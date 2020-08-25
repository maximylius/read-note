import React from 'react';

const SectionArc = ({ startX, startY, endX, endY }) => {
  // d={`M20 20 C20 20, 50 70, 20,120`}
  return (
    <path
      className='section-arc-path'
      d={`M${startX} ${startY} Q${startX / 2 + endX / 2 + 30} ${
        startY / 2 + endY / 2
      }, ${endX},${endY}`}
      fill='transparent'
      stroke='black'
    ></path>
  );
};

export default SectionArc;
