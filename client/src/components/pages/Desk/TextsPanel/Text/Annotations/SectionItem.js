import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SideNote from './SideNote';
import {
  changeSectionEditState,
  uncommitFromSection,
  setTentativeSections,
  setCommittedSections,
  deleteSection,
  updateSection,
  addNote
} from '../../../../../../store/actions';
import annotationTypes from '../../../../../Metapanel/annotationTypes';
import { BsDash, BsTrash, BsBookmark, BsPlus } from 'react-icons/bs';
const sectionItemClassName = 'section-item';
const sectionItemIdPrepend = 'sec_';
const [low, std, high] = [0.3, 0.7, 1];

const SectionItem = ({
  sectionId,
  sectionIndex,
  // quillTextRef,
  quillNoteRefs,
  top,
  triggerRemeasure
}) => {
  const dispatch = useDispatch();
  const sections = useSelector(s => s.sections);
  const notes = useSelector(s => s.notes);
  const categories = useSelector(s => s.categories);
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const expandAll = useSelector(s => s.textsPanel.expandAll);
  const committedSectionIds = useSelector(
    s => s.textsPanel.committedSectionIds
  );
  const tentativeSectionIds = useSelector(
    s => s.textsPanel.tentativeSectionIds
  );
  const holdControl = useSelector(s => s.textsPanel.holdControl);

  const section = sections[sectionId];
  const [selectedCategory, setSelectedCategory] = useState(
    section.categoryIds[0]
  );

  // conditional render
  const committedToSection = committedSectionIds.includes(section._id)
    ? true
    : false;
  const tentativeToSection = tentativeSectionIds.includes(section._id)
    ? true
    : false;

  const notesToDisplay = section.directConnections.filter(
    el => el.resType === 'note' && Object.keys(notes).includes(el.resId)
  );
  const occupancy = committedToSection || tentativeToSection ? high : std;
  const backgroundColor =
    'rgb(' +
    categories.byId[section.categoryIds[0]].rgbColor +
    `,${occupancy})`;

  // event handlers
  const sectionItemClickHandler = e => {
    if (
      committedSectionIds.includes(sectionId) &&
      committedSectionIds.length === 1
    )
      return;
    dispatch(setCommittedSections([sectionId], holdControl));
  };
  const sectionItemOnMouseEnterHandler = () =>
    dispatch(setTentativeSections([sectionId], holdControl));

  const deleteClickHandler = e => {
    e.stopPropagation();
    dispatch(deleteSection(sectionId));
    setTimeout(() => {
      const hoveredSecDiv = [...document.querySelectorAll(':hover')].filter(
        el => el.className === sectionItemClassName
      );
      if (hoveredSecDiv.length > 0) {
        const hoveredId = hoveredSecDiv[0].id.replace(sectionItemIdPrepend, '');
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

  const onCategoryChangeHandler = e => {
    console.log(e.target.value);
    if (e.target.value === selectedCategory) return;
    setSelectedCategory(e.target.value);
    dispatch(
      updateSection({
        _id: sectionId,
        categoryIds: [e.target.value]
      })
    );
  };
  const newNoteClickhandler = e => {
    e.stopPropagation();
    console.log('newNoteClick---------New sectionId-----', sectionId);
    dispatch(
      addNote({
        isAnnotation: {
          textId: activeTextPanel,
          sectionId: sectionId
        }
      })
    );
    triggerRemeasure();
  };

  return (
    <div
      className={`${sectionItemClassName} ${
        committedToSection
          ? 'committed'
          : tentativeToSection
          ? 'tentative'
          : 'not-active'
      }`}
      id={`${sectionItemIdPrepend}${section._id}`}
      style={{ backgroundColor: backgroundColor, top: top }}
      onClick={sectionItemClickHandler}
      onMouseEnter={sectionItemOnMouseEnterHandler}
    >
      <strong> {section.title} </strong>
      <span style={{ float: 'right' }}>
        <a
          href='#!'
          className='minimize-item'
          onClick={mininmizeClickHandler}
          style={{ visibility: committedToSection ? 'visible' : 'hidden' }}
        >
          <span style={{ visibility: 'hidden' }}>--</span>
          <BsDash />
          <span style={{ visibility: 'hidden' }}>--</span>
        </a>

        <a
          href='#!'
          className='delete-item'
          onClick={deleteClickHandler}
          style={{ visibility: tentativeToSection ? 'visible' : 'hidden' }}
        >
          {'  '}
          <BsTrash />
        </a>
      </span>
      {(committedToSection || expandAll) && (
        <>
          <div className='input-group input-group-sm mb-2'>
            <div
              className='input-group-prepend'
              id={`${sectionId}_secCatSelect`}
            >
              <span className='input-group-text'>
                <BsBookmark />
              </span>
            </div>
            <select
              className='form-control custom-select white-opacity-50'
              value={selectedCategory}
              onChange={onCategoryChangeHandler}
            >
              {Object.keys(categories.byId).map(id => (
                <option key={id} value={id}>
                  {categories.byId[id].title}
                </option>
              ))}
            </select>
          </div>

          {notesToDisplay.map(el => (
            <SideNote
              key={el.resId}
              sectionId={sectionId}
              noteId={el.resId}
              triggerRemeasure={triggerRemeasure}
            />
          ))}

          <button
            className='btn btn-light btn-block btn-sm'
            onClick={newNoteClickhandler}
          >
            <BsPlus /> new note
          </button>
        </>
      )}
    </div>
  );
};

export default React.memo(SectionItem);
