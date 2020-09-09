import React, { useState, useEffect, useRef, useCallback } from 'react';
import SectionItem from './SectionItem';

const sectionItemIdPrepend = 'sec_';

const MeasureSection = ({
  sectionId,
  sectionIndex,
  top,
  freeSpaceBottom,
  setUpdateDimensions,
  isExpanded,
  bestPositionsRef
}) => {
  const [remeasure, setRemeasure] = useState(0);
  const triggerRemeasure = useCallback(() => {
    setRemeasure(s => s + 1);
  }, [setRemeasure]);
  const elementHeightRef = useRef(null);
  const topRef = useRef(top);

  // useEffect(() => {
  //   const currentHeight = document
  //     .getElementById(`${sectionItemIdPrepend}${sectionId}`)
  //     .getBoundingClientRect().height;
  //   elementHeightRef.current = currentHeight;
  //   return () => {};
  // }, [isExpanded]);

  useEffect(() => {
    // re-measure
    const rect = document
      .getElementById(`${sectionItemIdPrepend}${sectionId}`)
      .getBoundingClientRect();
    const currentHeight = rect.height;
    if (elementHeightRef.current === currentHeight && topRef.current === top)
      return;

    // if (
    //   currentHeight >= freeSpaceBottom ||
    //   elementHeightRef.current >= freeSpaceBottom ||
    //   freeSpaceBottom < 0
    // ) {
    if (!bestPositionsRef.current[sectionId])
      bestPositionsRef.current[sectionId] = {};
    bestPositionsRef.current[sectionId].top_section = rect.top;
    bestPositionsRef.current[sectionId].bottom_section = rect.bottom;
    bestPositionsRef.current[sectionId].height_section = rect.height;

    setUpdateDimensions(prevState => ({
      count: (prevState.count || 0) + 1,
      sectionId: sectionId,
      sectionIndex: sectionIndex,
      currentHeight: currentHeight
    }));
    // }

    elementHeightRef.current = currentHeight;
    return () => {};
  }, [freeSpaceBottom, remeasure, isExpanded, top]);

  return (
    <>
      <SectionItem
        sectionId={sectionId}
        sectionIndex={sectionIndex}
        top={top}
        freeSpaceBottom={freeSpaceBottom}
        triggerRemeasure={triggerRemeasure}
      />
    </>
  );
};

export default React.memo(MeasureSection);
