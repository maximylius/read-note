import React, { useState } from 'react';
import { BsX, BsPlus } from 'react-icons/bs';

const NavTab = ({ isActive, openAction }) => {
  const openClickHandler = e => openAction();
  return (
    <li className='nav-item nav-add' onClick={openClickHandler}>
      <span
        className={`nav-link noSelect
      ${isActive ? 'active' : ''} `}
      >
        <BsPlus />
      </span>
    </li>
  );
};

export default NavTab;
