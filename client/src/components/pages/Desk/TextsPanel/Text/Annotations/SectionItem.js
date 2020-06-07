import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Annotations from './Annotation';
import {
  changeSectionEditState,
  uncommitFromSection,
  setTentativeSections,
  setCommittedSections,
  deleteSection,
  updateSection,
  addAnnotation
} from '../../../../../../store/actions';
import annotationTypes from '../../../../../Metapanel/annotationTypes';
import { BsDash, BsTrash, BsBookmark, BsPlus } from 'react-icons/bs';
const sectionItemClassName =
  'section-item list-group-item list-group-item-action';
const sectionItemIdPrepend = 'sec_';

const SectionItem = ({
  sectionId,
  quillTextRef,
  quillNotebookRef,
  addAnnotationsTo
}) => {
  const dispatch = useDispatch();
  const {
    sections,
    annotations,
    categories,
    textsPanel: {
      activeTextPanel,
      expandAll,
      committedSectionIds,
      tentativeSectionIds,
      holdControl
    }
  } = useSelector(state => state);
  const section = sections.byId[sectionId];
  const [selectedCategory, setSelectedCategory] = useState(
    section.categoryIds[0]
  );
  const [low, std, high] = [0.3, 0.7, 1];

  const sectionItemClickHandler = e => {
    if (
      committedSectionIds.includes(sectionId) &&
      committedSectionIds.length === 1
    )
      return;
    dispatch(setCommittedSections([section._id], holdControl));
  };
  const sectionItemOnMouseEnterHandler = () =>
    dispatch(setTentativeSections([sectionId], holdControl));

  const deleteClickHandler = e => {
    e.stopPropagation();
    dispatch(deleteSection(section._id));
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
  };
  const mininmizeClickHandler = e => {
    e.stopPropagation();
    dispatch(uncommitFromSection([section._id]));
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
    console.log('newNoteClick-------------------------');
    dispatch(
      addAnnotation({
        type: annotationTypes.note.type,
        sectionId: sectionId
      })
    );
  };
  // conditional render
  const committedToSection = committedSectionIds.includes(section._id)
    ? true
    : false;
  const tentativeToSection = tentativeSectionIds.includes(section._id)
    ? true
    : false;

  const annotationsToDisplay = section.annotationIds.filter(id =>
    Object.keys(annotations.byId).includes(id)
  );
  const occupancy = committedToSection || tentativeToSection ? high : std;
  const backgroundColor =
    'rgb(' +
    categories.byId[section.categoryIds[0]].rgbColor +
    `,${occupancy})`;

  return (
    <li
      className={sectionItemClassName}
      id={`${sectionItemIdPrepend}${section._id}`}
      style={{ backgroundColor: backgroundColor }}
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
      <div
        style={{
          display: committedToSection || expandAll ? 'block' : 'none'
        }}
      >
        <div className='input-group input-group-sm mb-2'>
          <div className='input-group-prepend' id={`${sectionId}_secCatSelect`}>
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

        {annotationsToDisplay.map(id => (
          <Annotations
            key={id}
            annotationId={id}
            addAnnotationsTo={addAnnotationsTo}
            quillNotebookRef={quillNotebookRef}
          />
        ))}
        <button
          className='btn btn-light btn-block btn-sm'
          onClick={newNoteClickhandler}
        >
          <BsPlus /> new note
        </button>
      </div>
    </li>
  );
};

export default SectionItem;
