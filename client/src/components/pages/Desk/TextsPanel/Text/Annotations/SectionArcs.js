import React, { useRef } from 'react';
import SectionArc from './SectionArc';
/**
 * point A (xA, yA)
 * point B (xB, yB)
 * xA === xB
 * radius > abs(yA-yB)
 *
 *
 *
 * MAKE SURE TO DRAW ARC ONLY ONCE
 */
const SectionArcs = ({ arcsToDisplay, finalPositions }) => {
  const svgRef = useRef();

  const textContainer = document.querySelector('#textMainCard');
  const textContainerHeight = textContainer
    ? textContainer.getBoundingClientRect().height + 'px'
    : '95vH';
  const containerLeft = svgRef.current
    ? svgRef.current.getBoundingClientRect().left
    : '500';

  const containerTop = svgRef.current
    ? svgRef.current.getBoundingClientRect().top
    : '50';
  console.log(
    'arcsToDisplay',
    arcsToDisplay,
    finalPositions,
    textContainerHeight
  );

  if (!Object.keys(finalPositions) || !Object.keys(finalPositions).length)
    return <></>;
  return (
    // <div className='section-arcs-svg-container'>
    <svg
      className='section-arcs-svg-container'
      style={{ height: textContainerHeight }}
      ref={svgRef}
      // viewBox='0 0 300 1000'
    >
      {arcsToDisplay.map(arc => (
        <SectionArc
          key={`arc_${arc.from}_${arc.to}`}
          startX={finalPositions[arc.from].right - containerLeft}
          startY={finalPositions[arc.from].top - containerTop}
          endX={finalPositions[arc.to].right - containerLeft}
          endY={finalPositions[arc.to].top - containerTop}
        />
      ))}
    </svg>
    // </div>
  );
};

export default SectionArcs;
