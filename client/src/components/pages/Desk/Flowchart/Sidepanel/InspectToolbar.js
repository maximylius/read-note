import React from 'react';
import { useDispatch } from 'react-redux';
import { BsXCircle, BsTrash } from 'react-icons/bs';
import { closeFlowchartElement } from '../../../../../store/actions';

const InspectToolbar = ({ id, openAction }) => {
  const dispatch = useDispatch();
  const removeElementFromInspect = e => {
    dispatch(closeFlowchartElement(id));
    e.stopPropagation();
  };
  const openClickHandler = () => {
    dispatch(openAction());
  };

  return (
    <div className='inspect-toolbar'>
      <span className='inspect-toolbar'>
        <button
          className='btn btn-sm btn-light string-tooltip string-tooltip-bottom'
          data-string-tooltip='Open in desk'
          onClick={openClickHandler}
        >
          open
        </button>
        <button
          className='btn btn-sm btn-light string-tooltip string-tooltip-bottom'
          data-string-tooltip='Permantly delete this element (n.a.)'
        >
          <BsTrash />
        </button>
        <button
          className='btn btn-sm btn-light string-tooltip string-tooltip-bottom'
          data-string-tooltip='Hide'
          onClick={removeElementFromInspect}
        >
          <BsXCircle />
        </button>
      </span>
    </div>
  );
};

export default InspectToolbar;
