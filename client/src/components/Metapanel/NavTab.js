import React, { useState } from 'react';
import { BsX } from 'react-icons/bs';

const NavTab = ({
  isActive,
  titleEditAction,
  currentTitle,
  maxTitleLength,
  openAction,
  closeAction
}) => {
  const [mouseOver, setMouseOver] = useState(null);
  const [editState, setEditState] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const titleRef = React.useRef();

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
  const onTitleClick = e => {
    setEditState(true);
    e.target.innerText = title;
    e.target.focus();
    // titleRef
  };
  const titlePasteHandler = e => {
    e.target.innerText = e.target.innerText
      .replace(/<[^>]*/g, '')
      .replace(/[^a-z0-9-_\ ]/gi, '');
  };
  const onTitleEditBlur = e => {
    const innerText = e.target.innerText
      .replace(/<[^>]*/g, '')
      .replace(/[^a-z0-9-_\ ]/gi, '');
    if (title !== innerText) {
      titleEditAction(innerText);
      setTitle(innerText);
    }
    console.log(
      'blur',
      e.target.innerText,
      innerText,
      innerText.length <= maxTitleLength
        ? innerText
        : innerText.slice(0, maxTitleLength - 3) + '...'
    );
    e.target.innerText =
      innerText.length <= maxTitleLength
        ? innerText
        : innerText.slice(0, maxTitleLength - 3) + '...';
    setEditState(false);
  };

  React.useEffect(() => {
    if (currentTitle !== title) {
      setTitle(currentTitle);
    }
    return () => {};
  }, [currentTitle]);

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
            ref={titleRef}
            {...(titleEditAction && { onDoubleClick: onTitleClick })}
            {...(editState && {
              contentEditable: true,
              onPaste: titlePasteHandler,
              suppressContentEditableWarning: true,
              onBlur: onTitleEditBlur
            })}
          >
            {title.length <= maxTitleLength
              ? title
              : title.slice(0, maxTitleLength - 3) + '...'}
          </span>
          <span>{` `}</span>
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

export default NavTab;
