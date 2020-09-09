import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { colorGenerator } from '../../../../../../functions/main';
import SectionsSvgContainer from './SectionsSvgContainer';
import {
  setInspectFlowSection,
  setCommittedSections,
  setTentativeSections
} from '../../../../../../store/actions';

// needs to be on individual scroll panel
// scrolling through text and panel should connect section symbols with text
// how shall the height be transformed:
//   height^0.5
// thickness shall depend on importance.
// alignment shall depend on

const FlowSections = ({}) => {
  const dispatch = useDispatch();
  const categories = useSelector(s => s.categories);
  const sections = useSelector(s => s.sections);
  const texts = useSelector(s => s.texts);
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const firstCommittedSection = useSelector(
    s => s.textsPanel.committedSectionIds[0]
  );
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
  let adjustTop = 0,
    boundsLeft = 0,
    boundsWith = 200;
  if (
    flowSectionContainerRef.current &&
    flowSectionContainerRef.current.getBoundingClientRect()
  ) {
    const bounds = flowSectionContainerRef.current.getBoundingClientRect();
    adjustTop = bounds.top; //2do this adjust top depends on the scrollvalue also. so maybe its better to user scrollcontainer? but that could hold nevatvie values for top
    boundsLeft = bounds.left;
    boundsWith = bounds.width;
  }
  let committedOffset = 100;
  const scrollContainer = document.getElementById('textContentFlexGrow');
  let firstCommittedDiv = textSectionsNodeList.filter(el =>
    el.dataset.sectionIds.includes(firstCommittedSection)
  )[0];
  if (firstCommittedDiv && scrollContainer) {
    committedOffset =
      firstCommittedDiv.getBoundingClientRect().top + scrollContainer.scrollTop;
    // add scroll
    console.log(
      'committedOffset',
      committedOffset,
      firstCommittedDiv.getBoundingClientRect().top,
      scrollContainer.scrollTop
    );
  }

  const clickHandler = sectionId => {
    dispatch(setCommittedSections([sectionId], false));
    dispatch(setTentativeSections([sectionId], false));
    dispatch(setInspectFlowSection(sectionId));
    const div = textSectionsNodeList.filter(el =>
      el.dataset.sectionIds.includes(sectionId)
    )[0];

    if (scrollContainer && div) {
      console.log(
        'y scrroll',
        div.getBoundingClientRect().top - adjustTop,
        div.getBoundingClientRect().top,
        adjustTop
      );
      scrollContainer.scrollTo(0, div.getBoundingClientRect().top - adjustTop);
    }
  };

  let indentLevel = 0,
    lastEnd = 0,
    maxIndentLevel = 1;
  const sortedSections = [];
  sectionsToDisplay.forEach((sectionId, index) => {
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
    let top_text = textSectionsNodeList[firstIndex].getBoundingClientRect().top;
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
      // possibly work with columns
      // possibly
    }
    const shrinkFactor = Math.min(
      3, // Math.max(2, ...sortedSections.map(el => el.end / 1000)),
      4
    );

    maxIndentLevel = Math.max(maxIndentLevel, indentLevel);
    lastEnd = bottom_text;
    sortedSections.push({
      top_section:
        (top_text - committedOffset) / shrinkFactor -
        adjustTop / shrinkFactor +
        committedOffset,
      height_section: (bottom_text - top_text) / shrinkFactor,
      bottom_section:
        (bottom_text - committedOffset) / shrinkFactor -
        adjustTop / shrinkFactor +
        committedOffset,
      top_text: top_text - adjustTop,
      bottom_text: bottom_text - adjustTop,
      left_section: boundsLeft + 20,
      indentLevel: indentLevel,
      right_section: (boundsWith * (indentLevel / maxIndentLevel)) / 2 + 20,
      left: `calc(${((indentLevel / maxIndentLevel) * 100) / 2}% + 20px)`,
      width: `calc(${((1 / maxIndentLevel) * 100 * 1) / 3}%)`,

      section: sections[sectionId],
      rgbValue: colorGenerator(
        { [sectionId]: sections[sectionId].categoryIds },
        [],
        categories
      )
    });
  });
  sortedSections.sort((a, b) => a.begin - b.begin);
  console.log('sortedSections', sortedSections);
  const finalPositions = Object.fromEntries(
    sortedSections.map(el => [el.section._id, el])
  );
  return (
    <div className='flow-section-container' ref={flowSectionContainerRef}>
      {sortedSections.map(el => (
        <div
          key={el.section._id}
          className='flow-section-item'
          style={{
            top: el.top_section + 'px',
            left: '30px',
            height: el.height_section + 'px',
            width: el.width,
            backgroundColor: 'rgb(' + el.rgbValue + ')'
          }}
          onClick={() => clickHandler(el.section._id)}
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
