import React from 'react';

const ConnectingArrow = ({
  startX,
  startY,
  endX,
  endY,
  id,
  active,
  twoWay
}) => {
  // d={`M20 20 C20 20, 50 70, 20,120`}
  return (
    <>
      <path
        className={`section-arc-path${active ? ' active-arc' : ''}`}
        d={`M${startX} ${startY} Q${startX / 2 + endX / 2 + 33} ${
          startY / 2 + endY / 2
        }, ${endX},${endY}`}
        {...(twoWay && {
          markerStart: `url(#arrowhead${active ? '-active' : ''})`
        })}
        markerEnd={`url(#arrowhead${active ? '-active' : ''})`}
        fill='transparent'
      ></path>
    </>
  );
};

export default ConnectingArrow;
