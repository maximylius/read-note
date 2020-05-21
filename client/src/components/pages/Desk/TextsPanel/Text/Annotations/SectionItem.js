import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Annotations from './Annotation';
import {
  changeSectionEditState,
  uncommitFromSection,
  setTentativeSections,
  setCommittedSections,
  deleteSection
} from '../../../../../../store/actions';
import AddAnnotation from './AddAnnotation';
import { BsPencil, BsCheck, BsDash, BsTrash } from 'react-icons/bs';

const SectionItem = ({ sectionId }) => {
  const dispatch = useDispatch();
  const {
    sections,
    annotations,
    categories,
    textsPanel: {
      expandAll,
      editState,
      committedSectionIds,
      tentativeSectionIds,
      holdControl
    }
  } = useSelector(state => state);
  const section = sections.byId[sectionId];
  const [low, std, high] = [0.3, 0.7, 1];

  const sectionItemClickHandler = e => {
    // 2do: optimize opening and closing behaviour
    console.log(e.target.className, e.target.parentElement.className);
    if (
      !['delete-item', 'save-item', 'minimize-item'].some(el =>
        [
          e.target.className,
          e.target.parentElement.className,
          e.target.parentElement.parentElement.className
        ].includes(el)
      )
    ) {
      dispatch(setCommittedSections([section._id], holdControl));
    }
  };
  const sectionItemOnMouseEnterHandler = () =>
    dispatch(setTentativeSections([sectionId], holdControl));

  const deleteClickHandler = () => dispatch(deleteSection(section._id));
  const mininmizeClickHandler = () =>
    dispatch(uncommitFromSection([section._id]));
  const editStateClickHandler = () =>
    dispatch(
      changeSectionEditState(sectionEditState ? 'done' : 'edit', section._id)
    );

  // conditional render
  const sectionEditState = editState.includes(section._id) ? true : false;
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
      className='list-group-item list-group-item-action'
      id={`sec_${section._id}`}
      style={{ backgroundColor: backgroundColor }}
      onClick={sectionItemClickHandler}
      onMouseEnter={sectionItemOnMouseEnterHandler}
    >
      <strong> {section.title} </strong>
      <p className='text-right'>
        <a
          href='#!'
          className={sectionEditState ? 'save-item' : 'edit-item'}
          onClick={editStateClickHandler}
        >
          {sectionEditState ? <BsCheck /> : <BsPencil />}
        </a>{' '}
        <a
          href='#!'
          className='minimize-item'
          onClick={mininmizeClickHandler}
          style={{ display: committedToSection ? 'inline' : 'none' }}
        >
          <BsDash />
        </a>{' '}
        <a href='#!' className='delete-item' onClick={deleteClickHandler}>
          <BsTrash />
        </a>
      </p>

      <div
        style={{
          display: committedToSection || expandAll ? 'block' : 'none'
        }}
      >
        {annotationsToDisplay.map(id => (
          <Annotations
            key={`sec_${section._id}+des_${id}`}
            sectionId={section._id}
            annotation={annotations.byId[id]}
            sectionEditState={sectionEditState}
          />
        ))}
        <AddAnnotation
          sectionId={section._id}
          displayStyle={
            section.annotationIds.length === 0 || sectionEditState
              ? 'block'
              : 'none'
          }
        />
      </div>
    </li>
  );
};

export default SectionItem;
