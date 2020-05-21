import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteAnnotation } from '../../../../../../store/actions';

const Annotation = ({ annotation, sectionId, sectionEditState }) => {
  const dispatch = useDispatch();
  if (!sectionEditState)
    return (
      <span id={`sec_${sectionId}+des_${annotation._id}`}>
        <a href='#!' className='search-label badge badge-light badge-pill'>
          <b>#&nbsp;</b>
          {annotation.type + ': '}
          <strong>{annotation.textcontent}</strong>
        </a>
        &nbsp;&nbsp;
      </span>
    );

  if (sectionEditState)
    return (
      <span id={`sec_${sectionId}+des_${annotation._id}`}>
        <a href='#!' className='delete-label badge badge-light badge-pill'>
          <b
            style={{ color: 'red' }}
            onClick={() =>
              dispatch(deleteAnnotation(annotation._id, sectionId))
            }
          >
            x&nbsp;
          </b>
          {annotation.type + ': '}
          <strong>{annotation.textcontent}</strong>
        </a>
        &nbsp;&nbsp;
      </span>
    );
};

export default Annotation;
