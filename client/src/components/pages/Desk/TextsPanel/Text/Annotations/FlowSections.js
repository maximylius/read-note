import React from 'react';
import { useSelector } from 'react-redux';
import SectionsSvgContainer from './SectionsSvgContainer';
import FlowSectionItem from './FlowSectionItem';

// needs to be on individual scroll panel
// scrolling through text and panel should connect section symbols with text
// how shall the height be transformed:
//   height^0.5
// thickness shall depend on importance.
// alignment shall depend on

const SECTION_ITEM_HEIGHT = 60,
  SECTION_ITEM_MARGIN = 40;

const FlowSections = ({}) => {
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
    let arcsFromSection = sections[id].directConnections.filter(connection =>
      sectionsToDisplay.includes(connection.resId)
    );
    return arcsFromSection.length > 0
      ? arcsFromSection.map(to => ({
          from: id,
          to: to.resId,
          twoWay: sections[id].indirectConnections.includes(to.resId)
        }))
      : [];
  });
  // const [committedOffset, setCommittedOffset] = useState(50)
  const flowRef = React.useRef();

  // define vars measuring DOM elements
  const quillTextPanel = document.getElementById('quillTextPanel'),
    textSectionsNodeList = quillTextPanel
      ? [...quillTextPanel.querySelectorAll('.TextPanelSectionBlot')]
      : [],
    bounds = (flowRef.current && flowRef.current.getBoundingClientRect()) || {},
    adjustTop = bounds.top || 0, //2do this adjust top depends on the scrollvalue also. so maybe its better to user scrollcontainer? but that could hold nevatvie values for top
    boundsLeft = bounds.left || 500,
    boundsWith = bounds.width || 400,
    boundsRight = bounds.right || 900,
    scrollContainer = document.getElementById('textContentFlexGrow'),
    firstDiv = textSectionsNodeList.find(el =>
      el.dataset.sectionIds.includes(firstCommittedSection)
    ),
    quillTop = quillTextPanel.getBoundingClientRect().top,
    quillHeight = quillTextPanel.getBoundingClientRect().height;

  // prepare ForEach
  const blocks = [],
    sortedSections = [];
  sectionsToDisplay.forEach((sectionId, index) => {
    const firstIndex = textSectionsNodeList.findIndex(el =>
        el.dataset.sectionIds.includes(sectionId)
      ),
      lastIndex =
        textSectionsNodeList.length -
        1 -
        [...textSectionsNodeList]
          .reverse()
          .findIndex(el => el.dataset.sectionIds.includes(sectionId));
    if (firstIndex < 0) return;

    let top_text = textSectionsNodeList[firstIndex].getBoundingClientRect().top;
    let bottom_text = textSectionsNodeList[lastIndex].getBoundingClientRect()
      .bottom;

    // 2do check if new block is needed
    // possible cases: 1. no block yet created, 2. previous block has ended, new has to be created, 3. previous block is continued and a) id has to pushed b) id can take place of another id
    const lastBlock = blocks[blocks.length - 1];
    if (!lastBlock || lastBlock.end <= top_text) {
      if (
        blocks.length > 0 &&
        lastBlock.ids.length > 0 &&
        lastBlock.bottomId !== lastBlock.ids[lastBlock.ids.length - 1]
      ) {
        lastBlock.height += SECTION_ITEM_HEIGHT / 2;
        lastBlock.positions[lastBlock.bottomId].height += SECTION_ITEM_HEIGHT;
      }
      // maybe the height of last open element from previous block, if itself was not the last element needs to be expanded
      blocks.push({
        ids: [sectionId],
        begin: top_text,
        end: bottom_text,
        bottomId: sectionId,
        offsetTop: lastBlock
          ? lastBlock.offsetTop + lastBlock.height + SECTION_ITEM_MARGIN
          : 0, //2do: or offset top
        height: SECTION_ITEM_HEIGHT,
        positions: {
          [sectionId]: {
            top: 0,
            height: SECTION_ITEM_HEIGHT,
            col: 1,
            end: bottom_text
          }
        }
      });
    } else {
      const currentBlock = blocks.pop();
      const nullIndex = currentBlock.ids.indexOf(null);
      currentBlock.ids.forEach(id => {
        if (currentBlock.positions[id].end > bottom_text) {
          currentBlock.positions[id].height += SECTION_ITEM_HEIGHT;
        }
      });
      if (nullIndex >= 0) {
        currentBlock.ids[nullIndex] = sectionId;
      } else currentBlock.ids.push(sectionId);
      currentBlock.end = Math.max(currentBlock.end, bottom_text);
      currentBlock.positions[sectionId] = {
        top: currentBlock.height - SECTION_ITEM_HEIGHT / 2,
        height: SECTION_ITEM_HEIGHT,
        col: currentBlock.ids.indexOf(sectionId),
        end: bottom_text
      };
      currentBlock.height += SECTION_ITEM_HEIGHT / 2;
      if (currentBlock.positions[currentBlock.bottomId].end <= bottom_text)
        currentBlock.bottomId = sectionId;
      blocks.push(currentBlock);
    }

    sortedSections.push({
      sectionId,
      blockIndex: blocks.length - 1, // will hold all info for section.
      top_text: top_text - adjustTop,
      bottom_text: bottom_text - adjustTop
    });
  });
  sortedSections.sort((a, b) => a.begin - b.begin);

  // if have to substract the relative heigth from the offset
  if (firstCommittedSection) {
    const committedBlockIndex = blocks.findIndex(block =>
      Object.keys(block.positions).includes(firstCommittedSection)
    );
    const committedItemOffset =
      committedBlockIndex < 0
        ? 100
        : blocks
            .slice(0, committedBlockIndex + 1)
            .reduce((a, b) => a + b.offsetTop, 0) +
          blocks[committedBlockIndex].positions[firstCommittedSection].top;

    const committedOffset =
      firstDiv && scrollContainer
        ? firstDiv.getBoundingClientRect().top + scrollContainer.scrollTop
        : 100;

    const offset = Math.max(0, committedOffset - committedItemOffset);
    blocks.forEach((block, index) => (blocks[index].offsetTop += offset));
    console.log(
      'offset',
      offset,
      'committedOffset',
      committedOffset,
      'committedItemOffset',
      committedItemOffset
    );
  }

  sortedSections.forEach((el, index) => {
    const sectionId = el.sectionId;
    const currentBlock = blocks[el.blockIndex];
    const top_section =
      currentBlock.offsetTop + currentBlock.positions[sectionId].top;
    const height_section = currentBlock.positions[sectionId].height;
    const width_section =
      currentBlock.ids.length === 1
        ? boundsWith / 2
        : (0.9 * boundsWith) / currentBlock.ids.length;
    const left_section =
      boundsLeft +
      (currentBlock.ids.length > 1
        ? (boundsWith * currentBlock.ids.indexOf(sectionId)) /
          currentBlock.ids.length
        : boundsWith / 4);

    sortedSections[index] = {
      ...el,
      top_section: top_section,
      height_section,
      bottom_section: top_section + height_section,
      width_section,
      left_section: left_section,
      right_section: left_section + width_section
    };
  });
  const finalPositions = Object.fromEntries(
    sortedSections.map(el => [
      el.sectionId,
      { ...el, left_section: boundsLeft }
    ])
  );
  const textBoxTop = blocks.length > 0 ? blocks[0].offsetTop - 75 : 0,
    textBoxHeight =
      blocks.length > 0
        ? blocks[blocks.length - 1].offsetTop +
          blocks[blocks.length - 1].height +
          150
        : textBoxTop + 500,
    textBox = {
      top_right: textBoxTop,
      bottom_right: textBoxTop + textBoxHeight,
      height_right: textBoxHeight,
      top_left: quillTop - adjustTop,
      bottom_left: quillTop + quillHeight - adjustTop,
      container_left: boundsLeft,
      container_right: boundsRight
    };

  console.log('blocks', blocks);
  React.useEffect(() => {
    if (!scrollContainer || !firstCommittedSection) return;
    const div = textSectionsNodeList.find(el =>
      el.dataset.sectionIds.includes(firstCommittedSection)
    );
    if (!div) return;

    scrollContainer.scrollTo(0, div.getBoundingClientRect().top - adjustTop);

    return () => {};
  }, [firstCommittedSection]);

  return (
    <div className='flow-section-container' ref={flowRef}>
      {sortedSections.map(el => (
        <FlowSectionItem
          key={el.sectionId}
          sectionId={el.sectionId}
          top={el.top_section + 'px'}
          left={el.left_section - boundsLeft + 'px'}
          height={el.height_section + 'px'}
          width={el.width_section + 'px'}
        />
      ))}
      {Object.keys(finalPositions).length && (
        <SectionsSvgContainer
          arcsToDisplay={arcsToDisplay}
          finalPositions={finalPositions}
          textBox={textBox}
        />
      )}
    </div>
  );
};
// reuse other functions maybe?

export default FlowSections;
