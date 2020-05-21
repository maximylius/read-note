import React, { useState } from 'react';
import { BsX } from 'react-icons/bs';

const NotebookTab = ({
  isActive,
  titleEditAction,
  currentTitle,
  openAction,
  closeAction
}) => {
  const [mouseOver, setMouseOver] = useState(null);
  const [editState, setEditState] = useState(false);

  const onMouseEnterHandler = e => {
    if (
      [
        e.target.className,
        e.target.parentElement.className,
        e.target.parentElement.parentElement.className
      ].includes('close')
    ) {
      setMouseOver('close');
    } else {
      setMouseOver('tab');
    }
  };
  const onMouseLeaveHandler = () => setMouseOver(null);
  const openClickHandler = e => {
    if (
      [
        e.target.className,
        e.target.parentElement.className,
        e.target.parentElement.parentElement.className
      ].includes('close')
    ) {
      closeAction();
    } else if (!isActive) {
      openAction();
    }
  };
  const onTitleDoubleClick = () => setEditState(true);
  const onTitleEditBlur = e => {
    if (currentTitle !== e.target.innerText) {
      titleEditAction(e.target.innerText);
    }
    setEditState(false);
  };

  return (
    <li
      className='nav-item'
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={openClickHandler}
    >
      <span className={`nav-link ${isActive ? 'active' : ''}`}>
        <small>
          <span
            {...(titleEditAction && { onDoubleClick: onTitleDoubleClick })}
            {...(editState && {
              contentEditable: true,
              onBlur: onTitleEditBlur
            })}
          >
            {currentTitle}{' '}
          </span>
          <span
            className='close'
            style={{
              visibility: mouseOver || isActive ? 'visible' : 'hidden'
            }}
          >
            <BsX />
          </span>
        </small>
      </span>
    </li>
  );
};

export default NotebookTab;
