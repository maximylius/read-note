import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MyContents from './MyContents';
import Search from './Search';
import { collapseFinderPanel } from '../../../../store/actions';
import SliderButton from '../../../Metapanel/SliderButton';

const FinderPanel = () => {
  const dispatch = useDispatch();
  const { ui } = useSelector(state => state);
  const onClickHandler = () => dispatch(collapseFinderPanel());
  // 2do: position arrow
  return (
    <div className='row grow flex-row mx-0 px-0 text-white bg-secondary'>
      <div className='col'>
        <Search />
        <MyContents />
      </div>

      <SliderButton
        onClickHandler={onClickHandler}
        direction='left'
        addClasses={'btn-secondary'}
        display={
          ui.mdTextsPanel === 0 && ui.mdNotebooksPanel === 0 ? 'none' : 'block'
        }
      />
    </div>
  );
};

export default FinderPanel;
