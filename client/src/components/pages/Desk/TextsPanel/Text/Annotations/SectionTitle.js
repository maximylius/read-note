import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsCheck, BsX } from 'react-icons/bs';
import { updateSection } from '../../../../../../store/actions';

const SectionTitle = ({ sectionId, triggerRemeasure }) => {
  const dispatch = useDispatch();
  const titleInputRef = useRef();
  const sectionTitle = useSelector(s => s.sections[sectionId].title);
  const sectionIsExpanded = useSelector(
    s =>
      s.textsPanel.expandAll ||
      s.textsPanel.committedSectionIds.includes(sectionId)
  );
  const [titleState, setTitleState] = useState(sectionTitle);

  const titleChange = e => {
    setTitleState(e.target.value);
    triggerRemeasure();
  };
  const discardChange = () => {
    titleInputRef.current.value = sectionTitle;
    setTitleState(sectionTitle);
    triggerRemeasure();
  };
  const saveChange = () => {
    dispatch(updateSection({ _id: sectionId, title: titleState }));
    triggerRemeasure();
  };

  useEffect(() => {
    setTitleState(sectionTitle);
    return () => {};
  }, [sectionTitle]);

  return sectionIsExpanded ? (
    <>
      <input
        ref={titleInputRef}
        type='text'
        value={titleState}
        onChange={titleChange}
        className={`section-title-input ${
          sectionTitle !== titleState ? 'changed' : ''
        }`}
      ></input>

      {sectionTitle !== titleState && (
        <>
          <button className='btn btn-sm btn-secondary' onClick={saveChange}>
            <BsCheck />
          </button>
          <button className='btn btn-sm btn-secondary' onClick={discardChange}>
            <BsX />
          </button>
        </>
      )}
    </>
  ) : (
    <span className='section-title'>{sectionTitle}</span>
  );
};

export default SectionTitle;
