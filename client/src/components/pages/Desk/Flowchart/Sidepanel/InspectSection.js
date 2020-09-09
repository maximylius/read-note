import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import {  BsXCircle, BsTrash } from 'react-icons/bs';
import { closeFlowchartElement, loadText } from '../../../../../store/actions';

const InspectSection = ({ id }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const section = useSelector(s => s.sections[id]);
  const removeElementFromInspect = () => dispatch(closeFlowchartElement(id));
  const openClickHandler = () => {
    dispatch(
      loadText({
        textId: section.textId,
        openText: true,
        setToActive: true,
        history: history
      })
    );
    //set committed to sectionId
  };
  // onclick function that selections mindmap node also
  return (
    <div>
      <h5>{section.title}</h5>
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
      <ReactQuill
        defaultValue={`<blockquoute>${section.fullWords}</blockquoute>`}
        theme='bubble'
        readOnly={true}
      />
    </div>
  );
};

export default InspectSection;
