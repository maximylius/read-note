import React, { useState, useEffect, useRef, useCallback } from 'react';
import SectionItem from './SectionItem';

const sectionItemIdPrepend = 'sec_';

const MeasureSection = ({
  sectionId,
  sectionIndex,
  top,
  freeSpaceBottom,
  setUpdateDimensions,
  isExpanded
}) => {
  const [remeasure, setRemeasure] = useState(0);
  const triggerRemeasure = useCallback(() => {
    setRemeasure(s => s + 1);
  }, [setRemeasure]);
  const elementHeightRef = useRef(null);

  useEffect(() => {
    const currentHeight = document
      .getElementById(`${sectionItemIdPrepend}${sectionId}`)
      .getBoundingClientRect().height;
    elementHeightRef.current = currentHeight;
    return () => {};
  }, [isExpanded]);

  useEffect(() => {
    // re-measure
    const currentHeight = document
      .getElementById(`${sectionItemIdPrepend}${sectionId}`)
      .getBoundingClientRect().height;
    if (!elementHeightRef.current) {
      elementHeightRef.current = currentHeight;
      return;
    }
    if (elementHeightRef.current === currentHeight) return;

    if (
      currentHeight >= freeSpaceBottom ||
      elementHeightRef.current >= freeSpaceBottom
    )
      setUpdateDimensions(prevState => ({
        count: (prevState.count || 0) + 1,
        sectionId: sectionId,
        sectionIndex: sectionIndex,
        currentHeight: currentHeight
      }));

    elementHeightRef.current = currentHeight;
    return () => {};
  }, [freeSpaceBottom, remeasure]);

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
