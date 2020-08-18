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
import SectionAttributes from './SectionAttributes';
import AddNoteButton from './AddNoteButton';

const sectionItemClassName = 'section-item';
const sectionItemIdPrepend = 'sec_';
const [low, std, high] = [0.3, 0.7, 1];

/**

think about UI to categorize section 
  allow selection of multiple
  allow links to custom categories and creation of new
  remember hierarchical categorization.

think about UI to connect section to others unidirectionally 
bidirectonally. 
    3 link types: 
      bidirectional / incoming / outgoing.
      when other section is selected offer three options: a->b; a<-b, a<->b
    chose connection from
      dropdown or
      drag and drop => click to connect, click elsewhere to stop

connected notes with the sections may also be included in the connection graph. shall notes be included?

shall the section have a title? Yes. 

section shall be expandable / collapsable
  very short, when uncommitted: show section-title only?
  short form of just including categories and links
  long from including seperate sections: link types, categories etc

section shall be filterable. Dont display filtered sections at all vs. decrease their opacity and expand only when directly targeted.

also: include mode for flow chart overview. 

make notes only preview notes if they exceed certain height. only when they are focussed they shall expand (and be editable)

 */

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
    `,${occupancy})`; //2do blend colors? // or make outline dashed?
  //2do include section importance in visual weigth

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
          <SectionAttributes
            sectionId={sectionId}
            triggerRemeasure={triggerRemeasure}
          />
          <div className='side-notes-container'>
            {notesToDisplay.map(el => (
              <SideNote
                key={el.resId}
                sectionId={sectionId}
                noteId={el.resId}
                triggerRemeasure={triggerRemeasure}
              />
            ))}
          </div>
          <AddNoteButton
            sectionId={sectionId}
            triggerRemeasure={triggerRemeasure}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(SectionItem);
