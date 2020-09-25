import React from 'react'; // , { useState, useCallback, useEffect, useRef }
import { useSelector } from 'react-redux';
import NotePanel from '../../../NotesPanel/NotePanel';
import Replies from './Replies';
import Reactions from './Reactions';
import ToggleReplies from './ToggleReplies';

const SideNote = ({ noteId, triggerRemeasure, scrollParentId }) => {
  // const dispatch = useDispatch();
  const replies = useSelector(s => s.notes[noteId].replies);
  const showReplies = useSelector(s =>
    s.textsPanel.openReplyNotes.includes(noteId)
  );

  // const [mouseoverSideNote, setMouseoverSideNote] = useState(false);
  // const mouseEnterHandler = () => setMouseoverSideNote(true);
  // const mouseLeaveHandler = () => setMouseoverSideNote(false);

  return (
    <div
      className='d-flex side-note-container'
      // onMouseEnter={mouseEnterHandler}
      // onMouseLeave={mouseLeaveHandler}
    >
      <Reactions noteId={noteId} triggerRemeasure={triggerRemeasure} />
      <div className='flex-grow-1 SidepanelSideNote'>
        <div style={{ display: 'block' }}>
          <NotePanel
            noteId={noteId}
            containerType='side-note'
            informParentAboutChange={triggerRemeasure}
            scrollParentId={scrollParentId}
          />
          {replies.length > 0 && (
            <div className='side-note-child-replies'>
              {showReplies && (
                <Replies
                  replies={replies}
                  triggerRemeasure={triggerRemeasure}
                  scrollParentId={scrollParentId}
                />
              )}
              <ToggleReplies
                noteId={noteId}
                replies={replies}
                triggerRemeasure={triggerRemeasure}
                showReplies={showReplies}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SideNote);
