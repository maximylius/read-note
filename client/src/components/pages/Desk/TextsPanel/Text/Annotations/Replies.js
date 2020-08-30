import React from 'react';
import SideNote from './SideNote';

const Replies = ({ replies, triggerRemeasure }) => {
  return (
    <div className='side-note-reply-container'>
      {replies.map(
        reply =>
          reply.resType === 'note' && (
            <SideNote
              key={`reply${reply.resId}`}
              noteId={reply.resId}
              triggerRemeasure={triggerRemeasure}
            />
          )
      )}
    </div>
  );
};

export default Replies;
