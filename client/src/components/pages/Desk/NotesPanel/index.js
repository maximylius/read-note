import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NotePanel from './NotePanel';
import NotePlaceholder from './NotePlaceholder';
import Nav from './Nav';
import {
  collapseNotesPanel,
  expandTextsPanel
} from '../../../../store/actions';
import SliderButton from '../../../Metapanel/SliderButton';

const Notes = ({ createSetNoteRef, quillNoteRefs }) => {
  const dispatch = useDispatch();
  const notes = useSelector(s => s.notes);
  const openNotes = useSelector(s => s.notesPanel.openNotes);
  const activeNote = useSelector(s => s.notesPanel.activeNote);
  const mdTextsPanel = useSelector(s => s.ui.mdTextsPanel);

  const [notesToRender, setNotesToRender] = useState(openNotes);
  // const notesInSync = (expandAll
  //   ? texts[activeTextPanel].sectionIds
  //   : committedSectionIds
  // )
  // .flatMap(sectionId => sections[sectionId].annotationIds)
  // .flatMap(annotationId => annotations.byId[annotationId].syncWith);
  const syncNotesToRender = [
    ...new Set([
      ...// notesInSync
      []
    ])
  ].filter(noteId => noteId !== activeNote);
  const changeInNotesToRender =
    [...openNotes, ...syncNotesToRender].some(
      id => !notesToRender.includes(id)
    ) ||
    notesToRender.some(
      id => !notesToRender.includes([...openNotes, ...syncNotesToRender])
    );

  const onClickHandler = () => {
    if (mdTextsPanel === 0) {
      dispatch(expandTextsPanel());
    } else {
      dispatch(collapseNotesPanel());
    }
  };

  React.useEffect(() => {
    setNotesToRender([...new Set([...openNotes, ...syncNotesToRender])]);
    return () => {};
  }, [changeInNotesToRender, activeNote]);

  return (
    <div className='row grow  flex-row'>
      <SliderButton
        onClickHandler={onClickHandler}
        direction='right'
        addClasses='btn-light'
        display='block'
      />

      <div className='col px-0 box pr-4'>
        <Nav />
        <div className='row growContent mx-0 notepanel-background'>
          {activeNote && notes[activeNote] && (
            <div key={activeNote}>
              <NotePanel noteId={activeNote} containerType='note-panel' />
            </div>
          )}
          {/* {notesToRender.map(noteId => (
            <div
              style={{
                display: noteId === activeNote ? 'block' : 'none'
              }}
              key={noteId}
            >
              <NotePanel
                quillNoteRefs={quillNoteRefs}
                setNoteRef={createSetNoteRef(noteId)}
                noteId={noteId}
              />
            </div>
          ))} */}
          {openNotes.length === 0 && <NotePlaceholder />}
        </div>
      </div>
    </div>
  );
};

export default Notes;
