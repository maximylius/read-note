import React from 'react';

const ArrowHeadUp = ({ color, active }) => {
  return (
    <marker
      id={`arrowhead-up${active ? '-active' : ''}`}
      viewBox='0 0 30 30'
      orient='238'
      strokeWidth='1'
      markerWidth='10'
      markerHeight='10'
      refX='17'
      refY='17'
    >
      <path d={`M 5 8 L 25 15 L 5 22 z`} fill={color} stroke={color} />
    </marker>
  );
};

export default ArrowHeadUp;
