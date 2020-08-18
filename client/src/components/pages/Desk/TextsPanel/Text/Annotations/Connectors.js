import React from 'react';

// 2do: rename.
// when panels scroll individually a listener for the scroll has to be implemented, that rerenders this component.
const Connectors = ({ sectionDimensions, textDimensions }) => {
  return (
    <div className='section-connection-container'>
      {[].map(id => (
        <div
          key={`section-connection-${id}`}
          className='section-connection'
          style={{
            topleft: textDimensions[id].top,
            bottomleft: textDimensions[id].bottom,
            topright: sectionDimensions[id].top,
            bottomright: sectionDimensions[id].bottom
          }}
        />
      ))}
    </div>
  );
};

export default Connectors;
