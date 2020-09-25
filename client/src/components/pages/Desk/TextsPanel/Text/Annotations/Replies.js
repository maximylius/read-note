import React from 'react';
import SideNote from './SideNote';

const Replies = ({ replies, triggerRemeasure, scrollParentId }) => {
  return (
    <div className='side-note-reply-container'>
      {replies.map(replyId => (
        <SideNote
          key={`reply${replyId}`}
          noteId={replyId}
          triggerRemeasure={triggerRemeasure}
          scrollParentId={scrollParentId}
        />
      ))}
    </div>
  );
};

export default Replies;
