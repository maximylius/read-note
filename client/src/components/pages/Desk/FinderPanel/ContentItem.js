import React from 'react';
import { useSelector } from 'react-redux';

function ContentItem({ title, onClickAction }) {
  const { ui } = useSelector(state => state);
  return (
    <div onClick={onClickAction}>
      <span className='btn btn-secondary btn-block '>
        {title.length < 18
          ? title
          : ui.mdTextsPanel > 0 || ui.mdNotebooksPanel > 0
          ? `${title.slice(0, 16)}...`
          : title.length < 50
          ? title
          : `${title.slice(0, 48)}...`}
      </span>
    </div>
  );
}

export default ContentItem;
