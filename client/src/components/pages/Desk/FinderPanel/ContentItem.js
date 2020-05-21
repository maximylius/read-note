import React from 'react';

function ContentItem({ title, onClickAction }) {
  return (
    <div onClick={onClickAction}>
      <span className='btn btn-secondary btn-block '>
        {title.length > 30 ? `${title.slice(0, 30)}...` : title}
      </span>
    </div>
  );
}

export default ContentItem;
