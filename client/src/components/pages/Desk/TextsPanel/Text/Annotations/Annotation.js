import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import { IconContext } from 'react-icons';
import {
  BsX,
  BsArrowRightShort,
  BsBoxArrowRight,
  BsPlus,
  BsArrowRepeat
} from 'react-icons/bs';
import {
  deleteNote,
  updateNote
  // syncAnnotationWith
} from '../../../../../../store/actions';
import {
  // extractNumber,
  // updateNoteWithAnnotation,
  committChangesToAnnotation
} from '../../../../../../functions/main';

const Annotation = ({ annotationId, quillNoteRefs }) => {
  const dispatch = useDispatch();
  const quillAnnotationRef = useRef(null);
  const {
    notes,
    annotations,
    notesPanel: { activeNote }
  } = useSelector(s => s);
  const annotation = annotations.byId[annotationId];
  const quillNoteRef = React.useRef(null);
  const [changedEditorCounter, setChangedEditorCounter] = useState(-1);
  const [mouseoverAnnotation, setMouseoverAnnotation] = useState(false);

  const deleteClickHandler = () => dispatch(deleteNote(annotationId));
  const toggleSyncWith = e => {
    if (!annotation.syncWith.includes(activeNote)) {
      dispatch();
      // syncAnnotationWith(annotationId, [...annotation.syncWith, activeNote])
      createCommittChangesToAnnotation({ to: activeNote });
    } else {
      dispatch();
      // syncAnnotationWith(
      //   annotationId,
      //   annotation.syncWith.filter(id => id !== activeNote)
      // )
    }
  };
  const mouseEnterHandler = () => setMouseoverAnnotation(true);
  const mouseLeaveHandler = () => setMouseoverAnnotation(false);
  const onChangeHandler = () => {
    if (!quillAnnotationRef.current) return;
    setChangedEditorCounter(prevState => prevState + 1);
  };
  const createCommittChangesToAnnotation = forceUpdate => {
    console.log(quillNoteRef);
    console.log(quillNoteRefs);
    committChangesToAnnotation(
      annotation,
      quillAnnotationRef,
      quillNoteRefs,
      notes,
      [...annotation.syncWith, ...(forceUpdate ? [forceUpdate.to] : [])],
      dispatch,
      updateNote,
      deleteNote,
      forceUpdate
    );
  };

  // mount noteRefs
  useEffect(() => {
    if (
      quillNoteRef &&
      quillNoteRefs &&
      quillNoteRefs.current &&
      Object.keys(quillNoteRefs.current)
        .map(id => !!quillNoteRefs.current[id])
        .some(el => !!el)
    ) {
      quillNoteRef.current =
        quillNoteRefs.current[
          annotation.syncWith.length > 0 ? annotation.syncWith[0] : activeNote
        ];
    }
    return () => {};
  }, [
    Object.keys(quillNoteRefs.current)
      .map(id => !!quillNoteRefs.current[id])
      .some(el => !el)
  ]);

  // improve commit function: ones it known where to insert, keep on inserting without expensive check.
  useEffect(() => {
    if (changedEditorCounter < 0) return;
    console.log('starting commitChangetimer', changedEditorCounter);
    const commitChangeTimer = setTimeout(() => {
      console.log('exec timer');
      createCommittChangesToAnnotation(null);
    }, 1500);

    return () => {
      clearTimeout(commitChangeTimer);
    };
  }, [changedEditorCounter]);

  React.useEffect(() => {
    if (!annotation.plainText) quillAnnotationRef.current.focus();
    return () => {
      if (!quillAnnotationRef.current) return;
      createCommittChangesToAnnotation(null);
    };
  }, []);

  return (
    <div
      className='d-flex SidepanelAnnotation'
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <div className='flex-grow-1 SidepanelAnnotation'>
        <div style={{ display: 'block' }}>
          <ReactQuill
            id={`${annotationId}_quill`}
            ref={quillAnnotationRef}
            onChange={onChangeHandler}
            theme='bubble'
            defaultValue={annotation.html}
            placeholder={'Add a note...'}
            modules={{
              toolbar: [
                [{ header: [2, 3, 4, 5, false] }],
                ['bold', 'italic', 'underline'],
                [{ color: [] }, { background: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ align: [] }]
              ],
              history: {
                delay: 1000,
                maxStack: 20
              }
            }}
          />
        </div>
      </div>
      <div
        className='flex-shrink-1 ml-n2  align-items-center'
        style={{ zIndex: 10, float: 'right' }}
      >
        <div
          className='row flex-shrink-1'
          style={{ visibility: mouseoverAnnotation ? 'visible' : 'hidden' }}
          onClick={deleteClickHandler}
        >
          <BsX />
        </div>
        <div className='row growContent'>
          <button
            style={{ height: '100%' }}
            className={`btn btn-sm btn-light ${
              annotation.syncWith.includes(activeNote) ? 'active' : ''
            }`}
            onClick={toggleSyncWith}
          >
            {(annotation.syncWith.length > 0
              ? annotation.syncWith
              : ['none']
            ).map(noteId => (
              <div key={noteId}>
                <IconContext.Provider
                  value={{
                    size: '0.9rem',
                    color: noteId === 'none' ? '#aaa' : '#000'
                  }}
                >
                  <div>
                    <BsArrowRepeat />
                  </div>
                </IconContext.Provider>
              </div>
            ))}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Annotation;

// 2do: observed weird behaviour:
// auto delte notes doesnt work well...
// focus newly created notes
// save connection to note also
