import React from 'react';
import { IconContext } from 'react-icons';
import { BsBook, BsClipboard, BsPlus } from 'react-icons/bs';

function Placeholder() {
  return (
    <div className='row grow flex-row'>
      <div className='col-6'>
        <button className='btn btn-lg btn-light w-100 h-100'>
          <IconContext.Provider value={{ size: '35%', color: '#bbb' }}>
            <BsBook />
          </IconContext.Provider>
        </button>
      </div>
      <div className='col-6'>
        <button className='btn btn-lg btn-light w-100 h-100'>
          <IconContext.Provider value={{ size: '35%', color: '#ccc' }}>
            <BsClipboard> + </BsClipboard>
          </IconContext.Provider>
        </button>
      </div>
    </div>
  );
}

export default Placeholder;
