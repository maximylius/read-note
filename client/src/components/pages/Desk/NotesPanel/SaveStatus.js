import React from 'react';
import { BsCheck, BsArrowClockwise } from 'react-icons/bs';

const SaveStatus = ({ current }) => {
  return (
    <div className='save-statusbar'>
      {current ? (
        <span>
          Saved <BsCheck />
        </span>
      ) : (
        <span>Saving...</span>
      )}
    </div>
  );
};

export default SaveStatus;
