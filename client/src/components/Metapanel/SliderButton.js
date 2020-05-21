import React from 'react';
import { IconContext } from 'react-icons';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';

function SliderButton({ onClickHandler, addClasses, direction, display }) {
  let icon = '?';
  if (direction === 'left') {
    icon = <BsChevronCompactLeft />;
  } else if (direction === 'right') {
    icon = <BsChevronCompactRight />;
  }

  return (
    <button
      className={`btn ${addClasses} p-0 text-center`}
      onClick={onClickHandler}
      style={{
        width: '2.5rem',
        display: display,
        zIndex: 900
      }}
    >
      <IconContext.Provider value={{ size: '2rem' }}>
        <div>{icon}</div>
      </IconContext.Provider>
    </button>
  );
}

export default SliderButton;
