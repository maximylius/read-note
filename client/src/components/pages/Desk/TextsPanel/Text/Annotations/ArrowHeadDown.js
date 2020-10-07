import React from 'react';

const ArrowHeadDown = ({ color, active }) => {
  return (
    <marker
      id={`arrowhead-down${active ? '-active' : ''}`}
      viewBox='0 0 30 30'
      orient='110'
      strokeWidth='1'
      markerWidth='10'
      markerHeight='10'
      refX='20'
      refY='13'
    >
      <path d={`M 5 8 L 25 15 L 5 22 z`} fill={color} stroke={color} />
    </marker>
  );
};

export default ArrowHeadDown;
