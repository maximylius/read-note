import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import { IconContext } from 'react-icons';
import {
  BsX,
  BsArrowRightShort,
  BsBoxArrowRight,
  BsPlus,
  BsArrowRepeat
} from 'react-icons/bs';
import { deleteNote } from '../../../../../../store/actions';
import NotePanel from '../../../NotesPanel/NotePanel';

const SideNote = ({ noteId, triggerRemeasure }) => {
  const dispatch = useDispatch();
  const quillSideNoteRef = useRef(null);

  const [mouseoverSideNote, setMouseoverSideNote] = useState(false);

  const deleteClickHandler = () => dispatch(deleteNote(noteId));
  const mouseEnterHandler = () => setMouseoverSideNote(true);
  const mouseLeaveHandler = () => setMouseoverSideNote(false);

  // what has to be considered additionally to othwr note? different margins. needs to inform parent about changes.
  return (
    <div
      className='d-flex SidepanelSideNote'
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <div className='flex-grow-1 SidepanelSideNote'>
        <div style={{ display: 'block' }}>
          <NotePanel
            noteId={noteId}
            containerType='side-note'
            informParentAboutChange={() => triggerRemeasure()}
          />
        </div>
      </div>
      <div
        className='flex-shrink-1 ml-n2  align-items-center'
        style={{ zIndex: 10, float: 'right' }}
      >
        <div
          className='row flex-shrink-1'
          style={{ visibility: mouseoverSideNote ? 'visible' : 'hidden' }}
          onClick={deleteClickHandler}
        >
          <BsX />
        </div>
      </div>
    </div>
  );
};

export default SideNote;

// 2do: observed weird behaviour:
// auto delte notes doesnt work well...
// focus newly created notes
// save connection to note also
