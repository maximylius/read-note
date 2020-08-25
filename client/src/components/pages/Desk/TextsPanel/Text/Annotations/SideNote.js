import React from 'react'; // , { useState, useCallback, useEffect, useRef }
// import { useDispatch, useSelector } from 'react-redux';
import NotePanel from '../../../NotesPanel/NotePanel';
import Replies from './Replies';
import Reactions from './Reactions';

const SideNote = ({ noteId, triggerRemeasure }) => {
  // const dispatch = useDispatch();

  // const [mouseoverSideNote, setMouseoverSideNote] = useState(false);
  // const mouseEnterHandler = () => setMouseoverSideNote(true);
  // const mouseLeaveHandler = () => setMouseoverSideNote(false);

  return (
    <div
      className='d-flex side-note-container'
      // onMouseEnter={mouseEnterHandler}
      // onMouseLeave={mouseLeaveHandler}
    >
      <Reactions noteId={noteId} />
      <div className='flex-grow-1 SidepanelSideNote'>
        <div style={{ display: 'block' }}>
          <NotePanel
            noteId={noteId}
            containerType='side-note'
            informParentAboutChange={triggerRemeasure}
          />
          <Replies noteId={noteId} triggerRemeasure={triggerRemeasure} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(SideNote);
