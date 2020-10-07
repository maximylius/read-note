import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeSectionConnection,
  setCommittedSections
} from '../../../../../../store/actions';
import { BsXCircle } from 'react-icons/bs';

const SectionConnectionSpan = ({ sectionId, connectionId, connectionType }) => {
  const dispatch = useDispatch();
  const title = useSelector(s => s.sections[connectionId]?.title);

  const removeConnection = e => {
    e.stopPropagation();
    dispatch(removeSectionConnection(sectionId, connectionId));
  };

  const clickHandler = () => {
    dispatch(setCommittedSections([connectionId], true));
  };

  return (
    <div
      className={`section-attribute section-connections ${connectionType}-connection`}
      onClick={clickHandler}
    >
      <div
        className='remove-section-attribute'
        onClick={e => removeConnection(e)}
      >
        <BsXCircle />
      </div>
      {title}
    </div>
  );
};

export default SectionConnectionSpan;
