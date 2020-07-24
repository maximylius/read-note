import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setExpandAll,
  collapseAnnotationsPanel,
  setDisplayTextMeta,
  openSpeedReader,
  playSpeedReader
} from '../../../../../../store/actions';
import { IconContext } from 'react-icons';
import {
  BsBoxArrowInRight,
  BsArrowsCollapse,
  BsArrowsExpand,
  BsInfoCircle,
  BsPlay,
  BsPlayFill
} from 'react-icons/bs';

const ButtonToolbar = () => {
  const dispatch = useDispatch();
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const displayTextMeta = useSelector(s => s.textsPanel.displayTextMeta);
  const expandAll = useSelector(s => s.textsPanel.expandAll);
  const speedReader = useSelector(s => s.textsPanel.speedReader);

  const toggleAnnotationsPanel = useCallback(
    () => dispatch(collapseAnnotationsPanel()),
    []
  );
  const playClickHandler = () => {
    if (!speedReader.isOpenFor.includes(activeTextPanel)) {
      dispatch(
        openSpeedReader(
          activeTextPanel,
          speedReader.byId[activeTextPanel].begin || 0,
          speedReader.byId[activeTextPanel].end || speedReader.words.length - 1,
          speedReader.byId[activeTextPanel].index || 0
        )
      );
    } else {
      dispatch(playSpeedReader(activeTextPanel));
    }
  };
  const toggleExpandAll = () =>
    dispatch(setExpandAll({ expandAll: !expandAll }));
  const toggleDisplayTextMeta = () => {
    dispatch(setDisplayTextMeta(!displayTextMeta));
  };

  return (
    <div className='annotation-button-toolbar'>
      <button
        className='btn btn-lg btn-light mt-1'
        onClick={toggleAnnotationsPanel}
      >
        <IconContext.Provider value={{ size: '1.5rem' }}>
          <BsBoxArrowInRight />
        </IconContext.Provider>
      </button>
      <span style={{ visibility: !displayTextMeta ? 'visible' : 'hidden' }}>
        <button
          className='btn btn-lg btn-light mt-1'
          onClick={playClickHandler}
        >
          {/* 2do: fill background color of button with percentage of text read. */}
          <IconContext.Provider value={{ size: '1.5rem' }}>
            {!speedReader.isOpenFor.includes(activeTextPanel) ? (
              <BsPlay />
            ) : (
              <BsPlayFill />
            )}
          </IconContext.Provider>
        </button>
        <button className='btn btn-lg btn-light mt-1' onClick={toggleExpandAll}>
          <IconContext.Provider value={{ size: '1.5rem' }}>
            {expandAll ? <BsArrowsCollapse /> : <BsArrowsExpand />}
          </IconContext.Provider>
        </button>
      </span>

      <button
        className={`btn btn-lg btn-light mt-1 ${
          displayTextMeta ? 'active' : ''
        }`}
        onClick={toggleDisplayTextMeta}
      >
        <IconContext.Provider value={{ size: '1.5rem' }}>
          <BsInfoCircle />
        </IconContext.Provider>
      </button>
    </div>
  );
};

export default ButtonToolbar;
