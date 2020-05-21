import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Textpage from './Text/';
import AddText from './AddText/';
import Nav from './Nav';
import {
  expandFinderPanel,
  expandNotebooksPanel,
  collapseTextsPanel
} from '../../../../store/actions';
import SliderButton from '../../../Metapanel/SliderButton';

function TextsPanel() {
  const dispatch = useDispatch();
  const {
    ui,
    textsPanel: { activeTextPanel }
  } = useSelector(state => state);
  const onClickHandlerBtn1 = () => dispatch(expandFinderPanel());
  const onClickHandlerBtn2 = () => {
    if (ui.mdNotebooksPanel === 0) {
      return dispatch(expandNotebooksPanel());
    } else {
      return dispatch(collapseTextsPanel());
    }
  };

  return (
    <div
      className={`row grow flex-row dont-pr-${
        ui.mdNotebooksPanel > 0 ? '3' : '0'
      } px-4 `}
    >
      <SliderButton
        onClickHandler={onClickHandlerBtn1}
        direction='right'
        addClasses='btn-light'
        display={ui.mdFinderPanel === 0 ? 'block' : ' none'}
      />

      <div className='col px-0 mx-0 box'>
        <Nav />
        {activeTextPanel === 'addTextPanel' ? <AddText /> : <Textpage />}
      </div>

      <SliderButton
        onClickHandler={onClickHandlerBtn2}
        direction='left'
        addClasses='btn-light'
        display='block'
      />
    </div>
  );
}

export default TextsPanel;
