import React, { useState, useCallback } from 'react';
import _isEqual from 'lodash/isEqual';
import { useSelector, useDispatch } from 'react-redux';
import SectionItem from './SectionItem';
import {
  setExpandAll,
  collapseAnnotationsPanel,
  setDisplayTextMeta,
  openSpeedReader,
  addSection,
  playSpeedReader
} from '../../../../../../store/actions';
import { IconContext } from 'react-icons';
import {
  BsBoxArrowInRight,
  BsArrowsCollapse,
  BsArrowsExpand,
  BsInfoCircle,
  BsPlus,
  BsPlay,
  BsPlayFill
} from 'react-icons/bs';
import TextMeta from './TextMeta';

const Sidepanel = ({ quillTextRef, quillNotebookRefs }) => {
  const dispatch = useDispatch();
  const {
    sections,
    texts,
    textsPanel: { activeTextPanel, expandAll, displayTextMeta, speedReader }
  } = useSelector(state => state);
  const sectionsToDisplay = texts.byId[activeTextPanel]
    ? texts.byId[activeTextPanel].sectionIds.filter(id =>
        Object.keys(sections.byId).includes(id)
      )
    : [];

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
  const addSectionClickHandler = () => {
    const words = speedReader.words;
    const speedReaderDetails = speedReader.byId[activeTextPanel];
    const begin =
      words[speedReaderDetails.lastIndex || speedReaderDetails.begin].index;
    const end =
      words[speedReaderDetails.index].index +
      words[speedReaderDetails.index].plainText.length;
    dispatch(
      addSection({
        categoryId: 'none',
        begin: begin,
        end: end
      })
    );

    console.log('speedReaderDetails.index', speedReaderDetails.index);
    console.log('speedReaderDetails.lastIndex', speedReaderDetails.lastIndex);
    console.log('speedReaderDetails.begin', speedReaderDetails.begin);
    console.log('begin', begin, 'end', end);
  };

  return (
    <>
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

      {!displayTextMeta ? (
        <ul className='list-group pt-2'>
          {sectionsToDisplay.length > 0 ? (
            sectionsToDisplay.map(id => (
              <SectionItem
                key={id}
                sectionId={id}
                quillTextRef={quillTextRef}
                quillNotebookRefs={quillNotebookRefs}
              />
            ))
          ) : (
            <p>
              <small>
                <BsInfoCircle /> Add sections and annotations by selecting
                text...
              </small>{' '}
            </p>
          )}
          {speedReader.isOpenFor.includes(activeTextPanel) && (
            <button
              className='btn btn-light btn-block btn-lg'
              onClick={addSectionClickHandler}
            >
              <BsPlus /> section
            </button>
          )}
        </ul>
      ) : (
        <TextMeta />
      )}
    </>
  );
};

export default Sidepanel;
