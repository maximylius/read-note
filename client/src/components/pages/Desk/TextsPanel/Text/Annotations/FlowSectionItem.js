import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setInspectFlowSection,
  setCommittedSections,
  setTentativeSections
} from '../../../../../../store/actions';
import { colorGenerator } from '../../../../../../functions/main';

const FlowSectionItem = ({ sectionId, top, left, height, width }) => {
  const dispatch = useDispatch();
  const sectionTitle = useSelector(s => s.sections[sectionId].title);
  const rgbValue = useSelector(s =>
    colorGenerator(
      { [sectionId]: s.sections[sectionId].categoryIds },
      [],
      s.categories
    )
  );

  const clickHandler = () => {
    dispatch(setCommittedSections([sectionId], false));
    dispatch(setTentativeSections([sectionId], false));
    dispatch(setInspectFlowSection(sectionId));
  };
  const mouseEnterHandler = () => {
    dispatch(setTentativeSections([sectionId], false));
  };

  return (
    <div
      className='flow-section-item'
      style={{
        top,
        left,
        height,
        width,
        backgroundColor: `rgb(${rgbValue})`
      }}
      onClick={clickHandler}
      onMouseEnter={mouseEnterHandler}
    >
      <span className='flow-section-item-title'>{sectionTitle}</span>
    </div>
  );
};

export default FlowSectionItem;
