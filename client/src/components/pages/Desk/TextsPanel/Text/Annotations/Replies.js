import React from 'react';
import SideNote from './SideNote';

const Replies = ({ replies, triggerRemeasure }) => {
  return (
    <div className='side-note-reply-container'>
      {replies.map(replyId => (
        <SideNote
          key={`reply${replyId}`}
          noteId={replyId}
          triggerRemeasure={triggerRemeasure}
        />
      ))}
    </div>
  );
};

export default Replies;
