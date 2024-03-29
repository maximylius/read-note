import React from 'react';
import { useDispatch } from 'react-redux';
import {
  uncommitFromSection,
  setTentativeSections,
  deleteSection
} from '../../../../../../store/actions';
import { BsDash, BsTrash } from 'react-icons/bs';

const SectionOutsideBtn = ({
  sectionId,
  isExpanded,
  triggerRemeasure,
  tentativeToSection,
  holdControl,
  color
}) => {
  const dispatch = useDispatch();

  const deleteClickHandler = e => {
    e.stopPropagation();
    dispatch(deleteSection(sectionId));
    setTimeout(() => {
      const hoveredSecDiv = [...document.querySelectorAll(':hover')].filter(
        el => el.className === 'section-item'
      );
      if (hoveredSecDiv.length > 0) {
        const hoveredId = hoveredSecDiv[0].id.replace('sec_', '');
        dispatch(setTentativeSections([hoveredId], holdControl));
      }
      console.log('deleted && new tentative');
    }, 20);
    triggerRemeasure();
  };
  const mininmizeClickHandler = e => {
    e.stopPropagation();
    dispatch(uncommitFromSection([sectionId]));
  };

  if (!tentativeToSection && !isExpanded) return <></>;
  return (
    <div
      className='section-outside-btn-container'
      style={{
        borderTop: `5px solid ${color}`,
        borderLeft: `5px solid ${color}`,
        borderRight: `5px solid ${color}`
      }}
    >
      {isExpanded && (
        <button
          className='section-outside-btn string-tooltip string-tooltip-bottom'
          data-string-tooltip='minimize section'
          onClick={mininmizeClickHandler}
        >
          <BsDash />
        </button>
      )}
      <button
        className='section-outside-btn string-tooltip string-tooltip-bottom'
        data-string-tooltip='permantly delete section and contents'
        onClick={deleteClickHandler}
      >
        <BsTrash />
      </button>
    </div>
  );
};

export default SectionOutsideBtn;
