import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextareaWithPrepend from '../../../../Metapanel/TextareaWithPrepend';
import { BsCardText } from 'react-icons/bs';
import { uploadTextcontent } from '../../../../../store/actions';
import ReactQuill from 'react-quill';

function PasteUpload() {
  const dispatch = useDispatch();
  const quillUploadRef = React.useRef(null);
  const [textcontent, setTextcontent] = useState('');
  const [deltas, setDeltas] = useState([]);
  const onChangeHandler = () => {
    if (!quillUploadRef || !quillUploadRef.current) return;
    setTextcontent(quillUploadRef.current.editor.getText());
    setDeltas(quillUploadRef.current.editor.getContents());
  };
  const onSubmit = () => {
    if (!quillUploadRef || !quillUploadRef.current) return;
    dispatch(
      uploadTextcontent(
        {
          textcontent: textcontent,
          deltas: deltas
        },
        true
      )
    );
  };
  return (
    <div>
      <ReactQuill
        defaultValue=''
        ref={quillUploadRef}
        onChange={onChangeHandler}
        theme='bubble'
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, false] }],
            ['bold', 'italic', 'underline'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }]
          ]
        }}
        placeholder='Paste in text...'
        sanitize='true'
      />

      <div
        style={{
          display:
            textcontent.length > 0 || deltas.length > 1 ? 'block' : 'none'
        }}
      >
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
