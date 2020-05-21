import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextareaWithPrepend from '../../../../Metapanel/TextareaWithPrepend';
import { BsCardText } from 'react-icons/bs';
import { uploadTextcontent } from '../../../../../store/actions';

function PasteUpload() {
  const dispatch = useDispatch();
  const [textcontent, setTextcontent] = useState('');
  const onChangeHandler = e => {
    console.log(e.target.value);
    setTextcontent(e.target.value);
  };
  const onSubmit = () => dispatch(uploadTextcontent(textcontent, true));
  return (
    <div className='container'>
      <TextareaWithPrepend
        id='pasteUploadTextcontent'
        prepend={<BsCardText />}
        ariaLabel='Textcontent'
        placeholder='Paste in text...'
        value={textcontent}
        onEvent={{ onChange: onChangeHandler }}
      />

      <div style={{ display: textcontent ? 'block' : 'none' }}>
        <button
          className='add-btn btn btn-secondary btn-block'
          onClick={onSubmit}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default PasteUpload;
