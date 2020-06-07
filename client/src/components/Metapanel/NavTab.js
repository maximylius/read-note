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
  const onTitleClick = () => setEditState(true);
  const titlePasteHandler = e => {
    e.target.innerText = e.target.innerText
      .replace(/<[^>]*/g, '')
      .replace(/[^a-z0-9-_\ ]/gi, '');
  };
  const onTitleEditBlur = e => {
    e.target.innerText = e.target.innerText
      .replace(/<[^>]*/g, '')
      .replace(/[^a-z0-9-_\ ]/gi, '');
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
      <span
        className={`nav-link noSelect
      ${isActive ? 'active' : ''} `}
      >
        <small>
          <span
            {...(titleEditAction && { onClick: onTitleClick })}
            {...(editState && {
              contentEditable: true,
              onPaste: titlePasteHandler,
              suppressContentEditableWarning: true,
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
