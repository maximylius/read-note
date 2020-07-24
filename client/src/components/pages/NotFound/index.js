import React from 'react';
import { useDispatch } from 'react-redux';
import { closeAllModals } from '../../../store/actions';

const NotFound = () => {
  const dispatch = useDispatch();
  return (
    <div
      className='page-modal-outer'
      onClick={() => dispatch(closeAllModals())}
    >
      <div className='page-modal-body'>
        <h1 className='display-4'>Not Found</h1>
        <p className='lead'>The page you are looking for does not exist...</p>
      </div>
    </div>
  );
};

export default NotFound;
