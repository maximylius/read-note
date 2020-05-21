import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNote, updateNote, deleteNote } from '../../../../store/actions';

const NoteElement = ({
  id,
  index,
  notebookId,
  placeholder,
  contentIdsLength
}) => {
  const dispatch = useDispatch();
  const notes = useSelector(state => state.notes);
  const [noteTextcontent, setNoteTextcontent] = useState(
    !Object.keys(notes.byId).includes(id) ? '' : notes.byId[id].textcontent
  );

  const onChange = e => {
    expandTextArea(e.target);
    setNoteTextcontent(e.target.value);
    if (contentIdsLength - 1 === index) {
      if (e.target.value !== '') {
        dispatch(addNote(notebookId, index + 1));
      }
      console.log('changed last element');
    } else if (contentIdsLength - 2 === index) {
      // if empty, remove last
      if (e.target.value === '') {
        dispatch(deleteNote({ index: index + 1 }, notebookId));
      }
    }
  };

  const onBlur = e => {
    dispatch(
      updateNote(
        id,
        noteTextcontent,
        notes.byId[id].editedBy,
        notebookId,
        index
      )
    );
    // create new placeholder note if none at the bottom...
  };

  const expandTextArea = target => {
    // static
    target.style.paddingTop = '5x';
    target.style.paddingBottom = '10px';
    // interactive
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.height = target.scrollHeight + 'px';
  };

  useEffect(() => {
    expandTextArea(document.getElementById(`nb_${notebookId}_n_${index}`));
    return () => {};
  }, []);

  return (
    <>
      <div className='input-group input-group-sm mb-2'>
        <div
          className='input-group-prepend'
          id={`nb_${notebookId}_n_${index}_prep`}
        >
          <span className='input-group-text'>{index + 1}</span>
        </div>
        <textarea
          id={`nb_${notebookId}_n_${index}`}
          type='text'
          className='form-control'
          aria-label={index}
          aria-describedby='notebook-search'
          placeholder={placeholder}
          value={noteTextcontent}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
    </>
  );
};

export default NoteElement;
