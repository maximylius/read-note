import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import openResClick from './noteFunctions/openResClick';

const NoteInfoConnection = ({ resId, resType, direction }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const sections = useSelector(s => s.sections);
  const title = useSelector(s =>
    s[`${resType}s`][resId] ? s[`${resType}s`][resId].title : 'NOT FOUND'
  );

  return (
    <span
      className={`note-info-connection ${direction}-connection connection-${resType}`}
      onClick={() =>
        openResClick(resId, resType, {
          current: { sections, dispatch, history }
        })
      }
    >
      {title}
    </span>
  );
};

export default NoteInfoConnection;
