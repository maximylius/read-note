import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NotebookPanel from './NotebookPanel';
import NotebookPlaceholder from './NotebookPlaceholder';
import Nav from './Nav';
import {
  collapseNotebooksPanel,
  expandTextsPanel
} from '../../../../store/actions';
import SliderButton from '../../../Metapanel/SliderButton';

const Notebooks = () => {
  const dispatch = useDispatch();
  const {
    notebooksPanel: { openNotebooks },
    ui
  } = useSelector(state => state);
  const onClickHandler = () => {
    if (ui.mdTextsPanel === 0) {
      dispatch(expandTextsPanel());
    } else {
      dispatch(collapseNotebooksPanel());
    }
  };

  return (
    <div className='row grow  flex-row'>
      <SliderButton
        onClickHandler={onClickHandler}
        direction='right'
        addClasses='btn-light'
        display='block'
      />

      <div className='col px-0 box pr-4'>
        <Nav />
        <div className='row growContent card'>
          {openNotebooks.length > 0 ? (
            <>
              <NotebookPanel />
            </>
          ) : (
            <NotebookPlaceholder />
          )}
        </div>
      </div>
    </div>
  );
};

export default Notebooks;
