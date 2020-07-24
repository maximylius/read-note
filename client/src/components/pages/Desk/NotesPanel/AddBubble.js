import React from 'react';
import { BsPlus } from 'react-icons/bs';
export const AddBubble = ({
  addBubble: { top, bottom, allow },
  cardBodyRef
}) => {
  const cardBodyRect = cardBodyRef.current.getBoundingClientRect();
  const adjustTop = cardBodyRect.top - 4;
  return (
    <div
      className='add-bubble fade-in'
      style={{
        top: top + (bottom - top - 3 * 16) / 2 - adjustTop
      }}
    >
      <div className='add-bubble-line'></div>
      <div className='add-bubble-svg'>
        <BsPlus />
      </div>
    </div>
  );
};
