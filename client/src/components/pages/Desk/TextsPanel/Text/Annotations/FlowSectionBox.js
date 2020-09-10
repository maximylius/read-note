import React from 'react';

const FlowSectionBox = ({ textBox, containerLeft }) => {
  // 2do rect with path
  const left = 0,
    center = textBox.container_left - containerLeft + 30,
    right = textBox.container_right - containerLeft;
  return (
    <polygon
      className='flow-section-text-box-polygon'
      points={`${left}, ${Math.max(textBox.top_left)} ${center}, ${
        textBox.top_right
      } ${right}, ${textBox.top_right}  ${right}, ${
        textBox.bottom_right
      } ${center}, ${textBox.bottom_right} ${left}, ${textBox.bottom_left} `}
    ></polygon>
  );
};

export default FlowSectionBox;
