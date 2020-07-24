import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { closeAllModals } from '../../../store/actions';
import { BsXCircle } from 'react-icons/bs';

function Welcome() {
  const history = useHistory();
  const dispatch = useDispatch();
  return (
    <>
      <div
        className='page-modal-outer'
        onClick={() => dispatch(closeAllModals(history))}
      ></div>
      <div className='page-modal-body'>
        <div className='page-modal-toolbar'>
          <button
            className='page-modal-close'
            onClick={() => dispatch(closeAllModals(history))}
          >
            <BsXCircle />
          </button>
        </div>
        <h1 className='display-4'>Welcome.</h1>
        <p className='lead'>It's free.</p>
        <p className='lead'>Wow. Nice Design.</p>
        <p className='lead'>
          Upload your text to start reading and annotating.
        </p>

        <p className='lead'>
          Showcase what this site can do: Speedread, organize, keep track.
        </p>
      </div>
    </>
  );
}

export default Welcome;
