import React from 'react';
import FlowSections from './FlowSections';
import FlowSectionInspect from './FlowSectionInspect';
import { useSelector } from 'react-redux';

const FlowSectionView = ({}) => {
  const inspectFlowSection = useSelector(s => s.inspect.inspectFlowSection);
  // 2do: make row with columns
  return (
    <div className='row flex-row '>
      <div className={`col-${inspectFlowSection ? 6 : 6}`}>
        <FlowSections />
      </div>
      <div className={`col-${inspectFlowSection ? 6 : 6}`}>
        {inspectFlowSection && (
          <FlowSectionInspect inspectFlowSection={inspectFlowSection} />
        )}
      </div>
    </div>
  );
};

export default FlowSectionView;
