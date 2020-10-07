import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { loadText } from '../../../../../store/actions';
import InspectToolbar from './InspectToolbar';

const InspectText = ({ id }) => {
  const history = useHistory();
  const text = useSelector(s => s.texts[id]);
  const openAction = () =>
    loadText({
      textId: id,
      openText: true,
      setToActive: true,
      history: history
    });

  // onclick function that selections mindmap node also
  return (
    <div>
      <h5>{text.title}</h5>
      <InspectToolbar id={id} openAction={openAction} />
      <div className='inspect-text-quill-wrapper'>
        <ReactQuill defaultValue={text.delta} theme='bubble' readOnly={true} />
      </div>
    </div>
  );
};

export default InspectText;
