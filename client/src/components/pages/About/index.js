import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { closeAllModals } from '../../../store/actions';
import { BsXCircle } from 'react-icons/bs';

function About() {
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
        <h1 className='display-4'>About this app</h1>
        <p className='lead'>
          This App has been created by a very slow reader, to help him and
          others to work with their literature. The tool aims to provide
          assistance for reading and understanding texts quicker and to take
          notes in an organized manner.
        </p>
        <p className='lead'>
          This App has been created by a very slow reader, to help him and
          others to work with their literature. The tool aims to provide
          assistance for reading and understanding texts quicker and to take
          notes in an organized manner.
        </p>
      </div>
    </>
  );
}

export default About;
