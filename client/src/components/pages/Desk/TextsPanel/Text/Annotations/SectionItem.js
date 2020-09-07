import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SideNote from './SideNote';
import SectionTitle from './SectionTitle';
import {
  setTentativeSections,
  setCommittedSections
} from '../../../../../../store/actions';
import SectionAttributes from './SectionAttributes';
import AddNoteButton from './AddNoteButton';
import { colorGenerator } from '../../../../../../functions/main';
import SectionPreview from './SectionPreview';
import SectionOutsideBtn from './SectionOutsideBtn';

const sectionItemClassName = 'section-item';
const sectionItemIdPrepend = 'sec_';
const [std, high] = [0.7, 1];

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
  // sectionIndex,
  // quillTextRef,
  // quillNoteRefs,
  top,
  triggerRemeasure
}) => {
  const dispatch = useDispatch();
  const sections = useSelector(s => s.sections);
  const notes = useSelector(s => s.notes);
  const categories = useSelector(s => s.categories);
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

  const notesToDisplay = section.noteIds.filter(noteId =>
    Object.keys(notes).includes(noteId)
  );
  const occupancy = committedToSection || tentativeToSection ? high : std;
  const rgbColor = colorGenerator(
    { [sectionId]: section.categoryIds },
    [...committedSectionIds, ...tentativeSectionIds],
    categories
  );
  const color = 'rgb(' + rgbColor + `,${occupancy})`; //2do blend colors? // or make outline dashed?
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
      style={{ border: `5px solid ${color}`, top: top }}
      onClick={sectionItemClickHandler}
      onMouseEnter={sectionItemOnMouseEnterHandler}
    >
      <SectionOutsideBtn
        sectionId={sectionId}
        triggerRemeasure={triggerRemeasure}
        isExpanded={committedToSection || expandAll}
        tentativeToSection={tentativeToSection}
        holdControl={holdControl}
        color={color}
      />
      <SectionTitle sectionId={sectionId} triggerRemeasure={triggerRemeasure} />
      <div className='section-scroll'>
        {committedToSection || expandAll ? (
          <>
            <SectionAttributes
              sectionId={sectionId}
              triggerRemeasure={triggerRemeasure}
            />
            <div className='side-notes-container'>
              {notesToDisplay.map(noteId => (
                <SideNote
                  key={noteId}
                  sectionId={sectionId}
                  noteId={noteId}
                  triggerRemeasure={triggerRemeasure}
                />
              ))}
            </div>
            <AddNoteButton
              sectionId={sectionId}
              triggerRemeasure={triggerRemeasure}
            />
          </>
        ) : (
          <SectionPreview sectionId={sectionId} />
        )}
      </div>
    </div>
  );
};

export default React.memo(SectionItem);
