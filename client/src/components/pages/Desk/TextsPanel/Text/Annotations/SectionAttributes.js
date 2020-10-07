import React from 'react';
import Importance from './Importance';
import SectionCategories from './SectionCategories';
import SectionConnections from './SectionConnections';
// 2do:  improve UI for connection selection.

const SectionAttributes = ({ sectionId, triggerRemeasure }) => {
  return (
    <div className='section-attrinutes-container'>
      <Importance sectionId={sectionId} />
      <SectionCategories
        sectionId={sectionId}
        triggerRemeasure={triggerRemeasure}
      />
      <SectionConnections
        sectionId={sectionId}
        triggerRemeasure={triggerRemeasure}
      />
    </div>
  );
};

export default React.memo(SectionAttributes);
