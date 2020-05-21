import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BsPlus } from 'react-icons/bs';
import { addNotebook } from '../../../../store/actions';

function NotebookPlaceholder() {
  const dispatch = useDispatch();
  const history = useHistory();

  const addNotebookClickHandler = () => {
    dispatch(addNotebook({ history }));
  };
  return (
    <div className='card-body'>
      <button
        className='btn btn-lg bg-light w-100 h-100'
        onClick={addNotebookClickHandler}
      >
        <BsPlus /> new notebook
      </button>
    </div>
  );
}

export default NotebookPlaceholder;
