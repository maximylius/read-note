import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BsXCircle, BsCheck, BsQuestion } from 'react-icons/bs';
import InputWithPrepend from '../../../Metapanel/InputWithPrepend';
import NoteInfoConnections from './NoteInfoConnections';
import {
  updateNote,
  addAlert,
  openNote,
  deleteNote,
  toggleFlowchart
} from '../../../../store/actions';
import { useCallback } from 'react';
const titlePlaceholderArr = [
  'Give this note distinguishable title',
  'e.g. project - topic - content'
];
const titlePlaceholder =
  titlePlaceholderArr[Math.floor(Math.random(titlePlaceholderArr.length))];

const NoteInfo = ({ noteInfo, setNoteInfo }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const notes = useSelector(s => s.notes);
  const [title, setTitle] = useState(notes[noteInfo.id].title);
  const note = notes[noteInfo.id];
  const directConnections = note.directConnections;
  const parents = [
    ...(note.isAnnotation
      ? [
          { resId: note.isAnnotation.textId, resType: 'text' },
          { resId: note.isAnnotation.sectionId, resType: 'section' }
        ]
      : []),
    ...(note.isReply ? [{ resId: note.isReply.noteId, resType: 'note' }] : [])
  ];
  const indirectConnections = [
    ...parents,
    ...note.indirectConnections.filter(
      c => !parents.some(p => p.resId === c.resId)
    )
  ];
  const noteInfoRef = useRef();
  const closeInfo = () => setNoteInfo(null);
  const updateNoteTitle = () => {
    if (
      Object.keys(notes)
        .filter(id => id !== note._id)
        .some(id => notes[id].title === title.trim())
    ) {
      dispatch(
        addAlert({
          message: `<p>Note title <strong>${title.trim()}</strong> is already taken. Try to make the note title distinguishable from others.</p>`,
          type: 'info'
        })
      );
    } else {
      dispatch(updateNote({ _id: note._id, title: title.trim() }));
      setTimeout(() => {
        closeInfo();
      }, 500);
    }
  };

  const openNoteGraphClick = () => {
    dispatch(toggleFlowchart()); //2do filter flowchart to display only the note
  };
  const openNoteClick = () => {
    closeInfo();
    dispatch(openNote({ noteId: noteInfo.id, history }));
  };
  const deleteNoteClick = () => {
    dispatch(deleteNote(noteInfo.id));
  };

  const trackClick = useCallback(e => {
    if (noteInfoRef && !noteInfoRef.current.contains(e.target)) closeInfo();
  }, []);

  useEffect(() => {
    document.addEventListener('click', trackClick);
    return () => {
      document.removeEventListener('click', trackClick);
    };
  }, []);

  return (
    <div
      className='note-info'
      style={{ top: noteInfo.top + 'px' }}
      ref={noteInfoRef}
    >
      <div className='note-info-toolbar'>
        {!title.trim() || title.trim() === note.title ? (
          <button className='btn note-info-is-saved'>
            {!title.trim() ? (
              <>Enter title</>
            ) : (
              <>
                saved
                <BsCheck />
              </>
            )}
          </button>
        ) : (
          <button
            className='btn note-info-needs-save'
            onClick={updateNoteTitle}
          >
            save <BsQuestion />
          </button>
        )}
        <button className='note-info-close' onClick={closeInfo}>
          <BsXCircle />
        </button>
      </div>
      <InputWithPrepend
        id='TextMetaPublicationDate'
        type='date'
        prepend='Note Title'
        placeholder={titlePlaceholder}
        value={title}
        onEvent={{ onChange: e => setTitle(e.target.value) }}
      />

      <NoteInfoConnections direction='direct' connections={directConnections} />
      <NoteInfoConnections
        direction='indirect'
        connections={indirectConnections}
      />
      <p className='note-info-subheading'>
        meta category: isAnnotation: show full words / go to text project
      </p>
      <br />
      <button
        className='btn btn-block btn-secondary'
        onClick={openNoteGraphClick}
      >
        open network graph for note
      </button>
      <button className='btn btn-block btn-secondary' onClick={openNoteClick}>
        open note
      </button>
      <button className='btn btn-block btn-danger' onClick={deleteNoteClick}>
        <span>
          <strong>permantly delete</strong> this note
        </span>
      </button>
    </div>
  );
};

export default NoteInfo;
