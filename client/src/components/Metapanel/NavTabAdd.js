import React from 'react';
import { BsPlus } from 'react-icons/bs';

const NavTabAdd = ({ isActive, openAction, tooltip }) => {
  const openClickHandler = e => openAction();
  return (
    <li className='nav-item nav-add' onClick={openClickHandler}>
      <span
        className={`nav-link noSelect
      ${isActive ? 'active' : ''} string-tooltip string-tooltip-bottom`}
        data-string-tooltip={tooltip}
      >
        <BsPlus />
      </span>
    </li>
  );
};

export default NavTabAdd;
