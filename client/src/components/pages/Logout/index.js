import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { closeAllModals } from '../../../store/actions';
import { BsXCircle } from 'react-icons/bs';

const Logout = () => {
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
        <h1 className='display-4'>Logout successfull.</h1>
        <h5 className='lead'>Thanks for your visit. See you soon.</h5>
      </div>
    </>
  );
};

export default Logout;
