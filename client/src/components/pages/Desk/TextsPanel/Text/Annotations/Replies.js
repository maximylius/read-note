import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SideNote from './SideNote';
import { BsDash, BsPlus, BsChevronUp, BsChevronDown } from 'react-icons/bs';

const Replies = ({ noteId, triggerRemeasure }) => {
  const dispatch = useDispatch();
  const replies = useSelector(s => s.notes[noteId].replies);
  const [displayReplies, setDisplayReplies] = useState(false); // 2do move this to the reducer to be able to memorize and to adjust when new replies are created.
  const toggleDisplayReplies = () => {
    setDisplayReplies(s => !s);
    triggerRemeasure();
  };
  if (!replies.length) return <></>;
  if (displayReplies)
    return (
      <>
        <div className='side-note-reply-container'>
          {replies.map(
            reply =>
              reply.resType === 'note' && (
                <SideNote
                  noteId={reply.resId}
                  triggerRemeasure={triggerRemeasure}
                />
              )
          )}
        </div>

        <button
          className='side-note-replies-toggle-display hide-replies'
          onClick={toggleDisplayReplies}
        >
          <span>
            <BsChevronUp />
            Hide {replies.length > 1 ? `${replies.length} replies` : '1 reply'}
          </span>
        </button>
      </>
    );
  return (
    <button
      className='side-note-replies-toggle-display'
      onClick={toggleDisplayReplies}
    >
      <span>
        <BsChevronDown />
        Display {replies.length > 1 ? `${replies.length} replies` : '1 reply'}
      </span>
    </button>
  );
};

export default Replies;
