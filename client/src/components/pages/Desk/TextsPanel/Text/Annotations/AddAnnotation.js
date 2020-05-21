import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAnnotation } from '../../../../../../store/actions';
import {
  BsThreeDots,
  BsFileText,
  BsLightning,
  BsFunnel,
  BsHash,
  BsQuestion
} from 'react-icons/bs';
const AddAnnotation = ({ sectionId, displayStyle }) => {
  const dispatch = useDispatch();
  const [annotationType, setAnnotationType] = useState('note');
  const [annotationTextcontent, setAnnotationTextcontent] = useState('');

  const submitAnnotation = e => {
    e.preventDefault();
    dispatch(addAnnotation(annotationType, annotationTextcontent, sectionId));
  };
  const annotationTypes = {
    note: { placeholder: 'take a note...', icon: <BsFileText /> },
    summary: { placeholder: 'summarize...', icon: <BsFunnel /> },
    question: { placeholder: 'question...', icon: <BsQuestion /> },
    idea: { placeholder: 'annote idea...', icon: <BsLightning /> },
    keyword: { placeholder: 'tag with keyword...', icon: <BsHash /> },
    other: { placeholder: 'annote other...', icon: <BsThreeDots /> }
  };
  return (
    <form style={{ display: displayStyle }}>
      <div className='btn-toolbar'>
        <div className='btn-group-sm'>
          {Object.keys(annotationTypes).map(key => (
            <button
              key={key}
              type='button'
              className={`btn btn-sm btn-secondary ${
                annotationType === key ? 'active' : ''
              }`}
              onClick={() => setAnnotationType(key)}
            >
              {annotationTypes[key].icon}
            </button>
          ))}
        </div>
      </div>
      <div className='input-group input-group-sm mb-2'>
        <textarea
          className='form-control'
          placeholder={annotationTypes[annotationType].placeholder}
          aria-label='Annote'
          aria-describedby={`inputAnnotationTextcontent_${sectionId}`}
          value={annotationTextcontent}
          onChange={e => setAnnotationTextcontent(e.target.value)}
        />
      </div>
      <button
        id={`sec_${sectionId}_btn`}
        className='add-btn btn btn-secondary btn-block btn-sm'
        onClick={submitAnnotation}
        style={{ display: annotationTextcontent ? 'block' : 'none' }}
      >
        Add annotation
      </button>
    </form>
  );
};

export default AddAnnotation;
