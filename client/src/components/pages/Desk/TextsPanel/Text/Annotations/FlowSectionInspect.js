import React from 'react';
import SectionItem from './SectionItem';
const noReMeasure = () => {};
const FlowSectionInspect = ({ inspectFlowSection }) => {
  const scrollContainer = document.getElementById('textContentFlexGrow');
  const quillTextPanel = document.getElementById('quillTextPanel');
  const textSectionsNodeList = quillTextPanel
    ? [...quillTextPanel.querySelectorAll('.TextPanelSectionBlot')]
    : [];
  const div = textSectionsNodeList.filter(el =>
    el.dataset.sectionIds.includes(inspectFlowSection)
  )[0];
  let committedOffset = 200;
  if (div && scrollContainer) {
    committedOffset =
      div.getBoundingClientRect().top + scrollContainer.scrollTop;
  }
  return (
    <div>
      <SectionItem
        sectionId={inspectFlowSection}
        sectionIndex={1}
        top={committedOffset - 100}
        freeSpaceBottom={10000}
        triggerRemeasure={noReMeasure}
      />
    </div>
  );
};

export default React.memo(FlowSectionInspect);
