import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BsStar,
  BsStarFill,
  BsArrowUp,
  BsArrowDown,
  BsReply,
  BsX
} from 'react-icons/bs';
import {
  addNote,
  toggleUserFavourite,
  addAlert,
  submitNoteVote,
  deleteNote
} from '../../../../../../store/actions';

const Reactions = ({ noteId, triggerRemeasure }) => {
  const dispatch = useDispatch();
  const userId = useSelector(s => s.user._id);
  const isUserNote = useSelector(
    s =>
      s.notes[noteId].editedBy.length === 0 ||
      s.notes[noteId].editedBy.includes(userId)
  );
  const noteInFavourites = useSelector(s =>
    s.user.favourites.some(fav => fav.resId === noteId)
  );
  const votes = useSelector(
    s => (s.notes[noteId] && s.notes[noteId].votes) || []
  );
  const voteAggregate = votes.reduce((a, b) => a + b.bill, 0); //2do move this task to server backend
  const currentVote = votes.filter(vote => vote.userId === userId)[0];

  const toggleFavourite = () => {
    if (!userId) {
      dispatch(
        addAlert({
          message: '<span>Login to save as a favourite to a profile.</span>',
          type: 'warning'
        })
      );
      // return;
    }
    dispatch(toggleUserFavourite(noteId, 'note'));
  };
  const sumbmitVote = bill => {
    if (!userId) {
      dispatch(
        addAlert({
          message: '<span>Login to vote.</span>',
          type: 'warning'
        })
      );
      // return;
    }
    // 2do: allow to remove vote and show selected vote in ui. try to move this logic out of component
    dispatch(submitNoteVote(noteId, bill));
    if (currentVote && currentVote.bill === bill) {
      dispatch(
        addAlert({
          message: '<span>Successfully removed vote.</span>',
          type: 'warning'
        })
      );
      return;
    } else {
      dispatch(
        addAlert({
          message: '<span>Submitted vote.</span>',
          type: 'success'
        })
      );
    }
  };

  const createReply = () => {
    if (!userId) {
      dispatch(
        addAlert({
          message: '<span>Login to submit a reply.</span>',
          type: 'warning'
        })
      );
      // return;
    }
    dispatch(addNote({ isReply: { noteId } }));
    triggerRemeasure();
  };
  const deleteClickHandler = () => {
    dispatch(deleteNote(noteId));
    triggerRemeasure();
  };

  return (
    <div className='side-note-reaction-container'>
      {isUserNote ? (
        <>
          <button
            className={`side-note-reaction ${
              currentVote && currentVote.bill === -1 ? 'active-reaction' : ''
            }`}
            onClick={deleteClickHandler}
          >
            <BsX />
          </button>
        </>
      ) : (
        <>
          <button
            className={`side-note-reaction ${
              noteInFavourites ? 'active-reaction' : ''
            }`}
            onClick={toggleFavourite}
          >
            {noteInFavourites ? <BsStarFill /> : <BsStar />}
          </button>
          <button
            className={`side-note-reaction ${
              currentVote && currentVote.bill === 1 ? 'active-reaction' : ''
            }`}
            onClick={() => sumbmitVote(1)}
          >
            <BsArrowUp />
          </button>
          <div
            className={`side-note-reaction ${
              voteAggregate ? 'active-reaction' : ''
            }`}
          >
            <span>{voteAggregate}</span>
          </div>
          <button
            className={`side-note-reaction ${
              currentVote && currentVote.bill === -1 ? 'active-reaction' : ''
            }`}
            onClick={() => sumbmitVote(-1)}
          >
            <BsArrowDown />
          </button>
        </>
      )}

      <button className='side-note-reaction' onClick={createReply}>
        <BsReply />
      </button>
    </div>
  );
};

export default Reactions;
