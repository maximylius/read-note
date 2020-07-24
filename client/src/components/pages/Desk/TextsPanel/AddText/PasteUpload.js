import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TextareaWithPrepend from '../../../../Metapanel/TextareaWithPrepend';
import { BsCardText } from 'react-icons/bs';
import { uploadTextcontent, loadText } from '../../../../../store/actions';
import ReactQuill from 'react-quill';

function PasteUpload() {
  const dispatch = useDispatch();
  const history = useHistory();
  const spareIds = useSelector(s => s.spareIds);
  const quillUploadRef = React.useRef(null);
  const [textcontent, setTextcontent] = useState('');
  const [delta, setDelta] = useState(null);
  const onChangeHandler = () => {
    if (!quillUploadRef || !quillUploadRef.current) return;
    setTextcontent(quillUploadRef.current.editor.getText());
    setDelta(quillUploadRef.current.editor.getContents());
  };
  const onSubmit = () => {
    if (!quillUploadRef || !quillUploadRef.current) return;
    dispatch(
      uploadTextcontent(
        {
          textcontent: textcontent,
          delta: delta
        },
        true
      )
    );
    setTimeout(() => {
      dispatch(
        loadText({ textId: spareIds.texts[0], openText: true, history })
      );
    }, 100);
  };
  return (
    <div className='upload-paste'>
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
          display: textcontent.length > 0 || delta ? 'block' : 'none'
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
