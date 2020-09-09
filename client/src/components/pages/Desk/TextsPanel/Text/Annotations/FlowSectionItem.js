import React from 'react';

const FlowSectionItem = () => {
  return (
    <div
      className='flow-section-item'
      style={{
        top: (el.begin - adjustTop) / shrinkFactor + 'px',
        height: (el.end - el.begin) / shrinkFactor + 'px',
        left: `calc(${((el.indentLevel / maxIndentLevel) * 100) / 2}% + 20px)`,
        width: `calc(${((1 / maxIndentLevel) * 100 * 1) / 3}%)`
      }}
    ></div>
  );
};

export default FlowSectionItem;
