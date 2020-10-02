import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { BsXCircle, BsTrash } from 'react-icons/bs';
import { closeFlowchartElement, loadText } from '../../../../../store/actions';

const InspectText = ({ id }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const text = useSelector(s => s.texts[id]);
  const removeElementFromInspect = () => dispatch(closeFlowchartElement(id));
  const openClickHandler = () =>
    dispatch(
      loadText({
        textId: id,
        openText: true,
        setToActive: true,
        history: history
      })
    );
  // onclick function that selections mindmap node also
  return (
    <div>
      <h5>{text.title}</h5>
      <p className='inspect-toolbar'>
        <span className='inspect-toolbar'>
          <button className='btn btn-sm btn-light' onClick={openClickHandler}>
            open
          </button>
          <button className='btn btn-sm btn-light'>
            <BsTrash />
          </button>
          <button
            className='btn btn-sm btn-light'
            onClick={removeElementFromInspect}
          >
            <BsXCircle />
          </button>
        </span>
      </p>
      <div className='inspect-text-quill-wrapper'>
        <ReactQuill defaultValue={text.delta} theme='bubble' readOnly={true} />
      </div>
    </div>
  );
};

export default InspectText;
