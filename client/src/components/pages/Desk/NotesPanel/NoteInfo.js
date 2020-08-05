import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsXCircle, BsCheck, BsQuestion } from 'react-icons/bs';
import InputWithPrepend from '../../../Metapanel/InputWithPrepend';
import { updateNote, addAlert } from '../../../../store/actions';
import { connection } from 'mongoose';
const titlePlaceholderArr = [
  'Give this note distinguishable title',
  'e.g. project - topic - content'
];
const titlePlaceholder =
  titlePlaceholderArr[Math.floor(Math.random(titlePlaceholderArr.length))];

const NoteInfo = ({ noteInfo, setNoteInfo }) => {
  const dispatch = useDispatch();
  const notes = useSelector(s => s.notes);
  const [title, setTitle] = useState(notes[noteInfo.id].title);
  const note = notes[noteInfo.id];
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

  return (
    <div className='note-info' style={{ top: noteInfo.top + 'px' }}>
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
      <p className='note-info-subheading'>direct connections</p>
      {note.directConnections.length === 0 ? (
        <span className='note-info-no-connections'>None</span>
      ) : (
        note.directConnections
          // .filter(el => Object.keys(notes).includes(el.resId))
          .map(el => (
            <span
              key={el.resId}
              className={`note-info-connection direct-connection connection-${el.resType}`}
            >
              {notes[el.resId].title}
            </span>
          ))
      )}
      <p className='note-info-subheading'>indirect connections</p>
      {note.indirectConnections.length === 0 ? (
        <span className='note-info-no-connections'>None</span>
      ) : (
        note.indirectConnections
          // .filter(el => Object.keys(notes).includes(el.resId))
          .map(el => (
            <div
              key={el.resId}
              className={`note-info-connection indirect-connection connection-${el.resType}`}
            >
              {notes[el.resId].title}
            </div>
          ))
      )}
      <p className='note-info-subheading'>
        meta category: isAnnotation: show full words / go to text project
      </p>
      <br />
      <button className='btn btn-block btn-secondary'>
        open network graph for note
      </button>
      <button className='btn btn-block btn-secondary'>open note</button>
      <button className='btn btn-block btn-danger'>
        permantly delete this note
      </button>
    </div>
  );
};

export default NoteInfo;
