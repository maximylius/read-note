import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BsPlus,
  BsQuestion,
  BsChat,
  BsExclamation,
  BsFunnel,
  BsFileText,
  BsLightning,
  BsFile,
  BsThreeDots
} from 'react-icons/bs';
import { addNote } from '../../../../../../store/actions';

const AddNoteButton = ({ sectionId, triggerRemeasure }) => {
  const dispatch = useDispatch();
  // const [freshNote, setFreshNote] = useState(false); //2do
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);

  const newNoteClickhandler = (e, type) => {
    e.stopPropagation();
    console.log('newNoteClick---------New sectionId-----', sectionId);
    dispatch(
      addNote({
        isAnnotation: {
          textId: activeTextPanel,
          sectionId: sectionId
        },
        delta: type ? { ops: [{ insert: `#${type}\n\n` }] } : null
      })
    );
    setTimeout(() => triggerRemeasure(), 30);
  };

  return (
    <div className='add-side-note'>
      <BsPlus /> new
      <button
        className='add-side-note-type'
        onClick={e => newNoteClickhandler(e, '')}
      >
        <BsFile />
      </button>
      <button
        className='add-side-note-type'
        onClick={e => newNoteClickhandler(e, 'summary')}
      >
        <BsFunnel />
      </button>
      <button
        className='add-side-note-type'
        onClick={e => newNoteClickhandler(e, 'comment')}
      >
        <BsChat />
      </button>
      <button
        className='add-side-note-type'
        onClick={e => newNoteClickhandler(e, 'question')}
      >
        <BsQuestion />
      </button>
      <button
        className='add-side-note-type'
        onClick={e => newNoteClickhandler(e, 'critique')}
      >
        <BsExclamation />
      </button>
      <button
        className='add-side-note-type'
        onClick={e => newNoteClickhandler(e, 'idea')}
      >
        <BsLightning />
      </button>
      {/* <button className='add-side-note-type' onClick={e => {}}>
        <BsThreeDots />
      </button> */}
    </div>
  );
};

export default AddNoteButton;
