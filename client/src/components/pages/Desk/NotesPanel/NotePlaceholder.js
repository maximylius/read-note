import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BsPlus } from 'react-icons/bs';
import { addNote } from '../../../../store/actions';

function NotePlaceholder() {
  const dispatch = useDispatch();
  const history = useHistory();

  const addNoteClickHandler = () => {
    dispatch(addNote({ history }));
  };
  return (
    <div className='card-body'>
      <button
        className='btn btn-lg bg-light w-100 h-100'
        onClick={addNoteClickHandler}
      >
        <BsPlus /> new note
      </button>
    </div>
  );
}

export default NotePlaceholder;
