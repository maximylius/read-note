import React, { useSelector } from 'react';
import { useDispatch } from 'react-redux';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { toggleShowNoteReplies } from '../../../../../../store/actions';

const ToggleReplies = ({ noteId, showReplies, replies, triggerRemeasure }) => {
  const dispatch = useDispatch();
  const toggleDisplayReplies = () => {
    dispatch(toggleShowNoteReplies(noteId));
    setTimeout(() => {
      triggerRemeasure();
    }, 30);
  };
  return (
    <button
      className={`side-note-replies-toggle-display ${
        showReplies ? 'hide' : 'show'
      }-replies`}
      onClick={toggleDisplayReplies}
    >
      <span>
        {showReplies ? (
          <>
            <BsChevronUp />
            {' Hide '}
          </>
        ) : (
          <>
            <BsChevronDown />
            {' Display '}
          </>
        )}
        {replies.length > 1 ? `${replies.length} replies` : '1 reply'}
      </span>
    </button>
  );
};

export default ToggleReplies;
