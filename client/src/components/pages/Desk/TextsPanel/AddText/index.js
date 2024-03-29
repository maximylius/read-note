import React from 'react';
import { useSelector } from 'react-redux';
import SecondStage from './SecondStage';
import FirstStage from './FirstStage';

function AddText() {
  const addedId = useSelector(s => s.textsPanel.addedId);
  return (
    <div
      className='row growContent flex-row card mr-4'
      style={{ fontWeight: 'bold', color: 'gray', textAlign: 'center' }}
    >
      <div className='card-body'>
        {!addedId ? <FirstStage /> : <SecondStage />}
      </div>
    </div>
  );
}

export default AddText;
