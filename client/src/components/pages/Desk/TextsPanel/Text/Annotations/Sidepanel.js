import React, { useState, useCallback } from 'react';
import _isEqual from 'lodash/isEqual';
import { useSelector, useDispatch } from 'react-redux';
import SectionItem from './SectionItem';
import {
  setExpandAll,
  collapseAnnotationsPanel
} from '../../../../../../store/actions';
import { IconContext } from 'react-icons';
import {
  BsBoxArrowInRight,
  BsArrowsCollapse,
  BsArrowsExpand,
  BsInfoCircle
} from 'react-icons/bs';

const Sidepanel = ({ quillTextRef, quillNotebookRef }) => {
  const dispatch = useDispatch();
  const {
    sections,
    texts,
    textsPanel: { activeTextPanel, expandAll },
    notebooks,
    notebooksPanel: { openNotebooks, activeNotebook }
  } = useSelector(state => state);
  const [addNotesToNotebook, setAddNotesToNotebook] = useState({
    add: activeNotebook ? true : false,
    to: activeNotebook ? activeNotebook : 'none'
  });
  const sectionsToDisplay = texts.byId[activeTextPanel]
    ? texts.byId[activeTextPanel].sectionIds.filter(id =>
        Object.keys(sections.byId).includes(id)
      )
    : [];

  const [notebooksToDisplay, setNotebooksToDisplay] = useState(
    openNotebooks.filter(id => Object.keys(notebooks.byId).includes(id))
  );

  const toggleAnnotationsPanel = useCallback(
    () => dispatch(collapseAnnotationsPanel()),
    []
  );
  const toggleExpandAll = useCallback(
    () => dispatch(setExpandAll({ expandAll: !expandAll })),
    []
  );
  const changeNotebookSelectorHandler = useCallback(e => {
    e.persist(); //check what it actually does...
    console.log(e.target.value);
    setAddNotesToNotebook(prevState => ({ ...prevState, to: e.target.value }));
  }, []);

  const toggleAddNotesToNotebook = useCallback(e => {
    setAddNotesToNotebook(prevState => ({
      ...prevState,
      add: !prevState.add
    }));
  }, []);

  React.useEffect(() => {
    console.log('openNotebooks', openNotebooks);
    console.log('notebooksToDisplay', notebooksToDisplay);
    setNotebooksToDisplay(
      openNotebooks.filter(id => Object.keys(notebooks.byId).includes(id))
    );
    console.log('addNotesToNotebook.to', addNotesToNotebook.to);
    console.log('notebooksToDisplay', notebooksToDisplay);
    console.log('activeNotebook', activeNotebook);

    if (notebooksToDisplay.includes(addNotesToNotebook.to)) return;
    if (notebooksToDisplay.length === 0) {
      setAddNotesToNotebook(prevState => ({
        add: false,
        to: 'none'
      }));
      return;
    }
    setAddNotesToNotebook(prevState => ({
      add: prevState.to === 'none' ? true : prevState.add,
      to: activeNotebook
    }));
    return () => {};
  }, [
    _isEqual(
      notebooksToDisplay,
      openNotebooks.filter(id => Object.keys(notebooks.byId).includes(id))
    )
  ]);

  console.log('render sidepanel. sectionsToDisplay', sectionsToDisplay);
  return (
    <>
      <button
        className='btn btn-lg btn-light mt-2'
        onClick={toggleAnnotationsPanel}
      >
        <IconContext.Provider value={{ size: '1.5rem' }}>
          <BsBoxArrowInRight />
        </IconContext.Provider>
      </button>

      <button className='btn btn-lg btn-light mt-2' onClick={toggleExpandAll}>
        <IconContext.Provider value={{ size: '1.5rem' }}>
          {expandAll ? <BsArrowsCollapse /> : <BsArrowsExpand />}
        </IconContext.Provider>
      </button>
      <div className='input-group mb-3'>
        <div className='input-group-prepend'>
          <span className='input-group-text'>
            <input
              type='checkbox'
              aria-label='add annotations to'
              checked={
                addNotesToNotebook.to === 'none'
                  ? false
                  : addNotesToNotebook.add
              }
              onChange={toggleAddNotesToNotebook}
              {...(addNotesToNotebook.to === 'none' && {
                disabled: true
              })}
            ></input>
          </span>
        </div>
        <div className='input-group-prepend'>
          <span className='input-group-text'>
            <small>add notes to</small>
          </span>
        </div>
        <select
          className='custom-select'
          value={addNotesToNotebook.to}
          onChange={changeNotebookSelectorHandler}
          {...(addNotesToNotebook.to === 'none' && {
            disabled: true
          })}
        >
          {notebooksToDisplay.length === 0 ? (
            <option value='none'> - none available - </option>
          ) : (
            notebooksToDisplay.map(id => (
              <option key={`${id}_option`} value={id}>
                {notebooks.byId[id].title}
              </option>
            ))
          )}
        </select>
      </div>
      <ul className='list-group pt-4'>
        {/* 2do: sort sections correctly /.reduce can create new sorted object/ */}
        {sectionsToDisplay.length > 0 ? (
          sectionsToDisplay.map(id => (
            <SectionItem
              key={id}
              sectionId={id}
              addAnnotationsTo={
                addNotesToNotebook.add ? addNotesToNotebook.to : null
              }
              quillTextRef={quillTextRef}
              quillNotebookRef={quillNotebookRef}
            />
          ))
        ) : (
          <p>
            <small>
              <BsInfoCircle /> Add sections and annotations by selecting text...
            </small>{' '}
          </p>
        )}
      </ul>
    </>
  );
};

export default Sidepanel;
