import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { colorGenerator } from '../../../../../../functions/main';
import ConnectingArrow from './ConnectingArrow';
import ParagraphConnector from './ParagraphConnector';
import FlowSectionBox from './FlowSectionBox';

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

const SectionsSvgContainer = ({ arcsToDisplay, finalPositions, textBox }) => {
  const categories = useSelector(s => s.categories);
  const sections = useSelector(s => s.sections);
  const committedSectionIds = useSelector(
    s => s.textsPanel.committedSectionIds
  );
  const tentativeSectionIds = useSelector(
    s => s.textsPanel.tentativeSectionIds
  );
  const svgRef = useRef();

  const textHeight = document.querySelector('#textMainCard')
    ? document.querySelector('#textMainCard').getBoundingClientRect().height +
      'px'
    : '95vH';
  const containerLeft = svgRef.current
    ? svgRef.current.getBoundingClientRect().left
    : 500;

  const containerTop = svgRef.current
    ? svgRef.current.getBoundingClientRect().top
    : '50';
  const scrollTop = document.querySelector('#textContentFlexGrow')
    ? document.querySelector('#textContentFlexGrow').scrollTop
    : 0;

  // console.log(`containerTop: ${containerTop} scrollTop: ${scrollTop}`);
  // console.log(
  //   'arcsToDisplay',
  //   arcsToDisplay,
  //   finalPositions,
  //   textHeight,
  //   !!svgRef.current
  // );

  // check whether num.px might be a problem..
  return (
    // <div className='section-arcs-svg-container'>
    <svg
      className='sections-svg-container'
      style={{ height: textHeight }}
      ref={svgRef}
      // viewBox='0 0 300 1000'
    >
      <defs>
        <marker
          id={'arrowhead'}
          viewBox='0 0 30 30'
          orient='110'
          strokeWidth='1'
          markerWidth='15'
          markerHeight='15'
          refX='20'
          refY='13'
        >
          <path d={`M 5 8 L 25 15 L 5 22 z`} fill='black' stroke='black' />
        </marker>
        <marker
          id={'arrowhead-active'}
          viewBox='0 0 30 30'
          orient='110'
          strokeWidth='1'
          markerWidth='10'
          markerHeight='10'
          refX='20'
          refY='13'
        >
          <path
            d={`M 5 8 L 25 15 L 5 22 z`}
            fill='rgb(5, 225, 5)'
            stroke='rgb(5, 225, 5)'
          />
        </marker>
      </defs>
      {textBox && (
        <FlowSectionBox textBox={textBox} containerLeft={containerLeft} />
      )}
      {Object.keys(finalPositions).map(id => (
        <ParagraphConnector
          key={`ParagraphConnector${id}`}
          sectionId={id}
          top_text={finalPositions[id].top_text + 4}
          bottom_text={finalPositions[id].bottom_text - 4}
          left={2}
          right={finalPositions[id].left_section - containerLeft + 4}
          top_section={finalPositions[id].top_section + 4}
          bottom_section={finalPositions[id].bottom_section - 4}
          color={colorGenerator(
            { [id]: sections[id].categoryIds },
            [...committedSectionIds, ...tentativeSectionIds],
            categories
          )}
          active={tentativeSectionIds.includes(id)}
        />
      ))}
      {arcsToDisplay.map(arc => (
        <ConnectingArrow
          key={`arc_${arc.from}_${arc.to}`}
          id={`arc_${arc.from}_${arc.to}`}
          twoWay={!!arc.twoWay}
          startX={finalPositions[arc.from].right_section - 1 - containerLeft}
          startY={finalPositions[arc.from].top_section + 20}
          endX={finalPositions[arc.to].right_section + 4 - containerLeft}
          endY={finalPositions[arc.to].top_section + 20}
          active={
            committedSectionIds.includes(arc.from) ||
            tentativeSectionIds.includes(arc.from) ||
            committedSectionIds.includes(arc.to) ||
            tentativeSectionIds.includes(arc.to)
          }
        />
      ))}
    </svg>
    // </div>
  );
};

export default SectionsSvgContainer;
