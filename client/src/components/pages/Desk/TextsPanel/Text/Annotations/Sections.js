import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsInfoCircle } from 'react-icons/bs';
import _isEqual from 'lodash/isEqual';
import MeasureSection from './MeasureSection';

const marginBottom = 5;
const calcBestPositions = sectionsToDisplay => {
  const quillTextPanel = document.getElementById('quillTextPanel');
  const textSectionsNodeList = quillTextPanel
    ? [...quillTextPanel.querySelectorAll('.TextPanelSectionBlot')]
    : [];

  const sectionsContainer = document.getElementById('sectionsContainer');
  const sectionsNodeList = sectionsContainer
    ? [...sectionsContainer.children]
    : [];
  console.log('textSectionsNodeList', textSectionsNodeList);
  console.log('sectionsNodeList', sectionsNodeList);
  const adjustTop =
    (quillTextPanel &&
      quillTextPanel.getBoundingClientRect().top - 1.25 * 16) || //2do? adjust with scroll?
    0;

  const bestPositions = {};
  sectionsToDisplay.forEach(id => {
    const firstIndex = textSectionsNodeList.findIndex(el =>
      el.dataset.sectionIds.includes(id)
    );

    bestPositions[id] =
      firstIndex < 0
        ? {
            top: 0,
            bottom: 0
          }
        : {
            top:
              textSectionsNodeList[firstIndex].getBoundingClientRect().top -
              adjustTop,
            bottom:
              textSectionsNodeList[
                textSectionsNodeList.length -
                  1 -
                  [...textSectionsNodeList]
                    .reverse()
                    .findIndex(el => el.dataset.sectionIds.includes(id))
              ].getBoundingClientRect().bottom - adjustTop
          };

    const sectionNode = sectionsNodeList.filter(el => el.id.includes(id))[0];
    console.log('sectionNode', sectionNode);
    bestPositions[id].height = !!sectionNode
      ? sectionNode.getBoundingClientRect().height
      : 40;

    console.log('bestPositions[id].height', bestPositions[id].height);
  });
  return bestPositions;
};

const calcAllFinalPositions = (sectionsToDisplay, bestPositions) => {
  const finalPositions = {};
  sectionsToDisplay.forEach((id, index) => {
    let positionTop = bestPositions[id].top;
    if (index > 0) {
      const lastId = sectionsToDisplay[index - 1];
      finalPositions[lastId].freeSpaceBottom =
        finalPositions[lastId].top - positionTop - marginBottom;
      const positionBottomAbove =
        finalPositions[lastId].top + bestPositions[lastId].height;

      if (positionBottomAbove >= positionTop) {
        positionTop = positionBottomAbove + marginBottom;
      }
    }
    finalPositions[id] = {
      top: positionTop,
      freeSpaceBottom: 10000
    };
  });
  return finalPositions;
};

const calcSpecificFinalPositions = (
  sectionIndex,
  sectionsToDisplay,
  bestPositions,
  finalPositions
) => {
  let i = sectionIndex + 1;
  console.log('statz while loop');
  while (i < sectionsToDisplay.length) {
    const id = sectionsToDisplay[i];
    let positionTop = bestPositions[id].top;
    const lastId = sectionsToDisplay[i - 1];
    finalPositions[lastId].freeSpaceBottom =
      finalPositions[lastId].top - positionTop - marginBottom;
    if (finalPositions[lastId].freeSpaceBottom > 0) break; //you can break here as it is pushed down no further.
    const positionBottomAbove =
      finalPositions[lastId].top + bestPositions[lastId].height;

    if (positionBottomAbove >= positionTop) {
      positionTop = positionBottomAbove + marginBottom;
    }

    finalPositions[id] = {
      top: positionTop,
      freeSpaceBottom: 10000
    };
    i++;
  }
  console.log('end while loop');

  return finalPositions;
};

const Sections = ({ quillTextRef, quillNoteRefs }) => {
  const sections = useSelector(s => s.sections);
  const texts = useSelector(s => s.texts);
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const sectionsToDisplay = texts[activeTextPanel]
    ? texts[activeTextPanel].sectionIds.filter(id =>
        Object.keys(sections).includes(id)
      )
    : [];
  //   const sectionsToDisplay = useSelector(s => s.texts[s.textsPanel.activeTextPanel]  ? s.texts[s.textsPanel.activeTextPanel].sectionIds.filter(id => Object.keys( s.sections).includes(id) ) : [] ); //2do use this instead of the above to prevent unnecessary rerenders. add custom hook that performs deep equal check whether sections to display have changed.

  const expandAll = useSelector(s => s.textsPanel.expandAll);
  const committedSectionIds = useSelector(
    s => s.textsPanel.committedSectionIds
  );
  const mdTextsPanel = useSelector(s => s.ui.mdTextsPanel);
  const mdTextsPanelRef = useRef(mdTextsPanel);
  const bestPositionsRef = useRef({});
  const [finalPositions, setFinalPositions] = useState({});

  const [updateDimensions, setUpdateDimensions] = useState({
    count: 0,
    from: 0
  });

  const sectionsToDisplayRef = useRef(sectionsToDisplay);
  const committedSectionIdsRef = useRef(committedSectionIds);

  useEffect(() => {
    // initial set up
    bestPositionsRef.current = calcBestPositions(sectionsToDisplay);
    setFinalPositions(
      calcAllFinalPositions(sectionsToDisplay, bestPositionsRef.current)
    );

    return () => {};
  }, []);

  useEffect(() => {
    // changes in sectionsToDisplay
    if (_isEqual(sectionsToDisplayRef.current, sectionsToDisplay)) return;
    // check which of is true: section added, section removed, section moved
    bestPositionsRef.current = calcBestPositions(sectionsToDisplay);
    setFinalPositions(
      calcAllFinalPositions(sectionsToDisplay, bestPositionsRef.current)
    );
    sectionsToDisplayRef.current = sectionsToDisplay;
    return () => {};
  }, [_isEqual(sectionsToDisplayRef.current, sectionsToDisplay)]);

  useEffect(() => {
    if (updateDimensions.count === 0) return;
    console.log('UPDATING DEMENSIONS---specific-----', updateDimensions);
    // specific update
    bestPositionsRef.current[updateDimensions.sectionId].height =
      updateDimensions.currentHeight;
    setFinalPositions(
      calcSpecificFinalPositions(
        updateDimensions.sectionIndex,
        sectionsToDisplayRef.current,
        bestPositionsRef.current,
        { ...finalPositions }
      )
    );
    console.log('DONE SPECIFIC POSITION-REF UPDATE');
    return () => {};
  }, [updateDimensions]);

  useEffect(() => {
    if (expandAll) return;
    if (_isEqual(committedSectionIds, committedSectionIdsRef.current)) return;
    bestPositionsRef.current = calcBestPositions(sectionsToDisplay);
    setFinalPositions(
      calcAllFinalPositions(sectionsToDisplay, bestPositionsRef.current)
    );
    committedSectionIdsRef.current = committedSectionIds;
    console.log('UPDATING DEMENSIONS----------', 'change in COMMITTED');
    return () => {};
  }, [_isEqual(committedSectionIds, committedSectionIdsRef.current)]);

  useEffect(() => {
    console.log('UPDATING DEMENSIONS----------', 'expandAll set to', expandAll);
    // update all
    bestPositionsRef.current = calcBestPositions(sectionsToDisplay);
    setFinalPositions(
      calcAllFinalPositions(sectionsToDisplay, bestPositionsRef.current)
    );
    return () => {};
  }, [expandAll, mdTextsPanel]);

  return (
    <>
      {sectionsToDisplay.length > 0 ? (
        <div id='sectionsContainer'>
          {sectionsToDisplay.map((id, index) => (
            <MeasureSection
              key={`side-note-${id}`}
              sectionId={id}
              sectionIndex={index}
              // quillTextRef={quillTextRef}
              // quillNoteRefs={quillNoteRefs}
              top={finalPositions[id] && finalPositions[id].top}
              freeSpaceBottom={
                finalPositions[id] && finalPositions[id].freeSpaceBottom
              }
              setUpdateDimensions={setUpdateDimensions}
              isExpanded={expandAll || committedSectionIds.includes(id)}
            />
          ))}
        </div>
      ) : (
        <p>
          <small>
            <BsInfoCircle /> Add sections and annotations by selecting text...
          </small>{' '}
        </p>
      )}
    </>
  );
};

export default Sections;
