import React from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import _isEqual from 'lodash/isEqual';

const NavlineButton = ({ noteInfo, setNoteInfo, el }) => {
  return (
    <div className='navline-button-container'>
      <button
        className='navline-button'
        onClick={() =>
          setNoteInfo(noteInfo && noteInfo.id === el.id ? null : el)
        }
      >
        <BsInfoCircle />
      </button>
    </div>
  );
};

export default NavlineButton;
