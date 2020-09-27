import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setExpandAll,
  collapseAnnotationsPanel,
  setDisplayTextMeta,
  openSpeedReader,
  playSpeedReader,
  toggleFlowSectionView
} from '../../../../../../store/actions';
import { IconContext } from 'react-icons';
import {
  BsBoxArrowInRight,
  BsArrowsCollapse,
  BsArrowsExpand,
  BsInfoCircle,
  BsPlay,
  BsPlayFill,
  BsPuzzle,
  BsPuzzleFill
} from 'react-icons/bs';

const ButtonToolbar = () => {
  const dispatch = useDispatch();
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const displayTextMeta = useSelector(s => s.textsPanel.displayTextMeta);
  const expandAll = useSelector(s => s.textsPanel.expandAll);
  const flowSectionView = useSelector(s => s.panel.flowSectionView);
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
  const toggleFlowView = () => dispatch(toggleFlowSectionView());

  return (
    <div className='side-panel-button-toolbar'>
      <button
        data-string-tooltip='Hide side panel'
        className='btn btn-lg btn-light mt-1 string-tooltip string-tooltip-bottom'
        onClick={toggleAnnotationsPanel}
      >
        <IconContext.Provider value={{ size: '1.5rem' }}>
          <BsBoxArrowInRight />
        </IconContext.Provider>
      </button>
      <span style={{ visibility: !displayTextMeta ? 'visible' : 'hidden' }}>
        <button
          data-string-tooltip='Start speed-reader'
          className='btn btn-lg btn-light mt-1 string-tooltip string-tooltip-bottom'
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
        <button
          data-string-tooltip={
            expandAll ? 'Collapse sections' : 'Expand all sections'
          }
          className='btn btn-lg btn-light mt-1 string-tooltip string-tooltip-bottom'
          onClick={toggleExpandAll}
        >
          <IconContext.Provider value={{ size: '1.5rem' }}>
            {expandAll ? <BsArrowsCollapse /> : <BsArrowsExpand />}
          </IconContext.Provider>
        </button>
        <button
          data-string-tooltip={
            flowSectionView ? 'Show structure diagram' : 'Hide structure digram'
          }
          className='btn btn-lg btn-light mt-1 string-tooltip string-tooltip-bottom'
          onClick={toggleFlowView}
        >
          <IconContext.Provider value={{ size: '1.5rem' }}>
            {flowSectionView ? <BsPuzzleFill /> : <BsPuzzle />}
          </IconContext.Provider>
        </button>
      </span>

      <button
        data-string-tooltip={
          displayTextMeta ? 'Show text info' : 'Show side panel'
        }
        className={`btn btn-lg btn-light mt-1 ${
          displayTextMeta ? 'active' : ''
        } string-tooltip string-tooltip-bottom`}
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
