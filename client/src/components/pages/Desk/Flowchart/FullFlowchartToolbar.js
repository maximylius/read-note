import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from './Sidepanel/Search';
import { IconContext } from 'react-icons';
import { BsBoxArrowInLeft } from 'react-icons/bs';
import { openFlowchartSidepanel } from '../../../../store/actions';
import SearchOptions from './Sidepanel/SearchOptions';

const FullFlowchartToolbar = () => {
  const dispatch = useDispatch();
  const openSidePanel = () => {
    dispatch(openFlowchartSidepanel());
  };
  return (
    <div className='flowchart-fullscreen-toolbar'>
      <Search />
      <SearchOptions container='fullscreen' />
      <button className='btn btn-lg btn-light mt-1' onClick={openSidePanel}>
        <IconContext.Provider value={{ size: '1.5rem' }}>
          <BsBoxArrowInLeft />
        </IconContext.Provider>
      </button>
    </div>
  );
};

export default FullFlowchartToolbar;
