import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { colorGenerator } from '../../../../../../functions/main';

// needs to be on individual scroll panel
// scrolling through text and panel should connect section symbols with text
// how shall the height be transformed:
//   height^0.5
// thickness shall depend on importance.
// alignment shall depend on

const FlowSections = ({}) => {
  const categories = useSelector(s => s.categories);
  const sections = useSelector(s => s.sections);
  const texts = useSelector(s => s.texts);
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const sectionsToDisplay = texts[activeTextPanel]
    ? texts[activeTextPanel].sectionIds.filter(id =>
        Object.keys(sections).includes(id)
      )
    : [];
  const arcsToDisplay = sectionsToDisplay.flatMap(id => {
    const arcsFromSection = sections[id].directConnections.filter(connection =>
      sectionsToDisplay.includes(connection.resId)
    );
    return arcsFromSection.length > 0
      ? arcsFromSection.map(to => ({ from: id, to: to.resId }))
      : [];
  });
  const flowSectionContainerRef = React.useRef();
  const quillTextPanel = document.getElementById('quillTextPanel');
  const textSectionsNodeList = quillTextPanel
    ? [...quillTextPanel.querySelectorAll('.TextPanelSectionBlot')]
    : [];
  const adjustTop =
    (flowSectionContainerRef.current &&
      flowSectionContainerRef.current.getBoundingClientRect().top) ||
    0;

  let indentLevel = 0,
    lastEnd = 0,
    maxIndentLevel = 1;
  const sortedSections = [];
  sectionsToDisplay
    .forEach((sectionId, index) => {
      const firstIndex = textSectionsNodeList.findIndex(el =>
        el.dataset.sectionIds.includes(sectionId)
      );
      const lastIndex =
        textSectionsNodeList.length -
        1 -
        [...textSectionsNodeList]
          .reverse()
          .findIndex(el => el.dataset.sectionIds.includes(sectionId));

      if (firstIndex < 0) return;
      let top_text = textSectionsNodeList[firstIndex].getBoundingClientRect()
        .top;
      let bottom_text = textSectionsNodeList[lastIndex].getBoundingClientRect()
        .bottom;
      let prevIndentLevel = indentLevel;
      indentLevel =
        lastEnd > top_text
          ? indentLevel + 1
          : prevIndentLevel <= 1
          ? Math.max(indentLevel - 1, 0)
          : 'complex';
      if (indentLevel === 'complex') {
        // look back until the indent level is === 0
        // if before reaching that point some bottom_text is larger than this top_text then add indentlevel +1
        // else set to 0
        // wrong: if some of them have closed already space could be free below some element.
        // indentLevel
      }
      maxIndentLevel = Math.max(maxIndentLevel, indentLevel);
      lastEnd = bottom_text;
      sortedSections.push({
        top_section: top_text / shrinkFactor - adjustTop / shrinkFactor + 100,
        height_section: (bottom_section - top_section) / shrinkFactor + 'px',
        bottom_section:
          bottom_text / shrinkFactor - adjustTop / shrinkFactor + 100,
        top_text: top_text,
        bottom_text: bottom_text,
        indentLevel: indentLevel,
        left: `calc(${((el.indentLevel / maxIndentLevel) * 100) / 2}% + 20px)`,
        width: `calc(${((1 / maxIndentLevel) * 100 * 1) / 3}%)`,

        section: sections[sectionId],
        rgbValue: colorGenerator(
          { [sectionId]: sections[sectionId].categoryIds },
          [],
          categories
        )
      });
    })
    .sort((a, b) => a.begin - b.begin);
  console.log('sortedSections', sortedSections);
  const shrinkFactor = Math.min(
    Math.max(2, ...sortedSections.map(el => el.end / 1000)),
    4
  );
  return (
    <div className='flow-section-container' ref={flowSectionContainerRef}>
      {sortedSections.map(el => (
        <div
          key={el.section._id}
          className='flow-section-item'
          style={{
            top: (el.begin - adjustTop) / shrinkFactor + 100 + 'px',
            height: (el.end - el.begin) / shrinkFactor + 'px',
            left: `calc(${
              ((el.indentLevel / maxIndentLevel) * 100) / 2
            }% + 20px)`,
            width: `calc(${((1 / maxIndentLevel) * 100 * 1) / 3}%)`,
            backgroundColor: 'rgb(' + el.rgbValue + ')'
          }}
        ></div>
      ))}
      {Object.keys(finalPositions).length && (
        <SectionsSvgContainer
          arcsToDisplay={arcsToDisplay}
          finalPositions={finalPositions}
        />
      )}
    </div>
  );
};
// reuse other functions maybe?

export default FlowSections;
