import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Textpage from './Text/';
import AddText from './AddText/';
import Nav from './Nav';
import {
  expandFinderPanel,
  expandNotesPanel,
  collapseTextsPanel
} from '../../../../store/actions';
import SliderButton from '../../../Metapanel/SliderButton';

function TextsPanel({ quillNoteRefs }) {
  const dispatch = useDispatch();
  const mdNotesPanel = useSelector(s => s.ui.mdNotesPanel);
  const mdFinderPanel = useSelector(s => s.ui.mdFinderPanel);
  const texts = useSelector(s => s.texts);
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);

  const onClickHandlerBtn1 = () => dispatch(expandFinderPanel());
  const onClickHandlerBtn2 = () => {
    if (mdNotesPanel === 0) {
      return dispatch(expandNotesPanel());
    } else {
      return dispatch(collapseTextsPanel());
    }
  };

  return (
    <div
      className={`row grow flex-row mx-0 
      pl-${mdFinderPanel === 0 ? '0' : '4'}
      pr-${mdNotesPanel === 0 ? '0' : '3'}`}
    >
      <SliderButton
        onClickHandler={onClickHandlerBtn1}
        direction='right'
        addClasses='btn-light'
        display={mdFinderPanel === 0 ? 'block' : ' none'}
      />

      <div className='col px-0 mx-0 box'>
        <Nav />
        {!activeTextPanel ||
        activeTextPanel === 'addTextPanel' ||
        !texts[activeTextPanel] ? (
          <AddText key={activeTextPanel} />
        ) : (
          <Textpage key={activeTextPanel} quillNoteRefs={quillNoteRefs} />
        )}
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
