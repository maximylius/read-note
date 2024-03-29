import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MyContents from './MyContents';
import { collapseFinderPanel } from '../../../../store/actions';
import SliderButton from '../../../Metapanel/SliderButton';

const FinderPanel = () => {
  const dispatch = useDispatch();
  const mdTextsPanel = useSelector(s => s.panel.mdTextsPanel);
  const mdNotesPanel = useSelector(s => s.panel.mdNotesPanel);
  const onClickHandler = () => dispatch(collapseFinderPanel());
  // 2do: position arrow
  return (
    <div className='row grow flex-row mx-0 px-0 text-white bg-secondary'>
      <div className='col box'>
        <MyContents />
      </div>

      <SliderButton
        onClickHandler={onClickHandler}
        direction='left'
        addClasses={'btn-secondary'}
        display={mdTextsPanel === 0 && mdNotesPanel === 0 ? 'none' : 'block'}
      />
    </div>
  );
};

export default FinderPanel;
