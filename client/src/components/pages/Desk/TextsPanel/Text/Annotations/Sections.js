import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsInfoCircle } from 'react-icons/bs';
import _isEqual from 'lodash/isEqual';
import MeasureSection from './MeasureSection';
import SectionsSvgContainer from './SectionsSvgContainer';
import calcBestPositions from './sectionFunctions/calcBestPositions';
import calcAllFinalPositions from './sectionFunctions/calcAllFinalPositions';

const Sections = ({}) => {
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

  if (!_isEqual(sectionsToDisplayRef.current, sectionsToDisplay)) {
    // positions will not always be up to date as reference elements in textpanel might not have been rendered by the time this component renders.
    bestPositionsRef.current = calcBestPositions(sectionsToDisplay);
    setFinalPositions(
      calcAllFinalPositions(sectionsToDisplay, bestPositionsRef.current)
    );
    sectionsToDisplayRef.current = sectionsToDisplay;
  }

  useEffect(() => {
    // initial set up
    bestPositionsRef.current = calcBestPositions(sectionsToDisplay);
    setFinalPositions(
      calcAllFinalPositions(sectionsToDisplay, bestPositionsRef.current)
    );

    return () => {};
  }, []);

  useEffect(() => {
    if (updateDimensions.count === 0) return;
    console.log('UPDATING DEMENSIONS---specific-----', updateDimensions);
    // specific update
    // bestPositionsRef.current[updateDimensions.sectionId].height =
    //   updateDimensions.currentHeight;
    setFinalPositions(
      calcAllFinalPositions(sectionsToDisplay, bestPositionsRef.current)
      // calcSpecificFinalPositions(
      //   updateDimensions.sectionIndex,
      //   sectionsToDisplayRef.current,
      //   bestPositionsRef.current,
      //   { ...finalPositions }
      // )
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
        <>
          <div id='sectionsContainer'>
            {sectionsToDisplay.map((id, index) => (
              <MeasureSection
                key={`side-note-${id}`}
                sectionId={id}
                sectionIndex={index}
                top={finalPositions[id] && finalPositions[id].top_section}
                freeSpaceBottom={
                  finalPositions[id] && finalPositions[id].freeSpaceBottom
                }
                bestPositionsRef={bestPositionsRef}
                setUpdateDimensions={setUpdateDimensions}
                isExpanded={expandAll || committedSectionIds.includes(id)}
              />
            ))}
          </div>
          {Object.keys(finalPositions).length && (
            <SectionsSvgContainer
              arcsToDisplay={arcsToDisplay}
              finalPositions={finalPositions}
            />
          )}
        </>
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

export default React.memo(Sections);
