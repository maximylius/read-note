import React from 'react';

// needs to be on individual scroll panel
// scrolling through text and panel should connect section symbols with text
// how shall the height be transformed:
//   height^0.5
// thickness shall depend on importance.
// alignment shall depend on

const FlowSections = ({}) => {
  const quillTextPanel = document.getElementById('quillTextPanel');
  const textSectionsNodeList = quillTextPanel
    ? [...quillTextPanel.querySelectorAll('.TextPanelSectionBlot')]
    : [];

  return (
    <div>
      {textSectionsNodeList.map(el => (
        <div></div>
      ))}
    </div>
  );
};

export default FlowSections;
