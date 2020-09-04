// 2do how to handle when opening a note before the changes to it (from an open place elsewhere are committed?) // use a pending / loading state?
// 2do "op not allowed" appears to often
// 2do color_class get out of sync
// 2do re-apply color_class at first load of note
// 2do optimize code / move outside of component / prevent rerenders
// 2do: when having an embeded note open. you can go with the cursor below mention tag, which is were the embed seperator is. There you can enter contents which will not be saved anywhere. Best behaviour: if selection is at the embed seperator move selection forward / backward, depending on previous position of the cursor.
// 2do: somehow notes do not get saved as soon as a mention tag is included. Or Rather embeds get removed from saved note.
// 2do: focus is jumping between editors

import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import QuillMention from 'quill-mention';
import _isEqual from 'lodash/isEqual';
import BlotEmbedSeperator from '../../../Metapanel/BlotEmbedSeperator';
import {
  mentionModuleCreator,
  atValuesCreator
  // extractAtValueResType,
  // extractAtValueResId,
  // updateMentionIdOpenStatus,
  // mentionIdIsOpen,
  // mentionColorClass
} from '../../../Metapanel/mentionModule';
// import {
//   // loadText,
//   // setCommittedSections,
//   // setTentativeSections,
//   // updateNote,
//   // loadNotes,
//   // addAlert
// } from '../../../../store/actions';
import Navline from './Navline';
import SaveStatus from './SaveStatus';
import { AddBubble } from './AddBubble';
import classNameIncludes from './noteFunctions/classNameIncludes';
import mentionCharClickHandler from './noteFunctions/mentionCharClickHandler';
import navlineClickHandler from './noteFunctions/navlineClickHandler';
import mentionSpanClickHandler from './noteFunctions/mentionSpanClickHandler';
import handleEditorChange from './noteFunctions/handleEditorChange';
import onChangeHandler from './noteFunctions/onChangeHandler';
import preProcessDelta from './noteFunctions/preProcessDelta';
import selectionChangeHandler from './noteFunctions/selectionChangeHandler';

ReactQuill.Quill.register(BlotEmbedSeperator);
const g = {}; // serves as a ref container for component state to be passed into outsourced functions in Order to simplify their input parameters

const NotePanel = ({ noteId, containerType, informParentAboutChange }) => {
  console.log('NOTEPANEL RENDER. NOTEPANEL RENDER. NOTEPANEL RENDER. ');
  const history = useHistory();
  const dispatch = useDispatch();
  const notes = useSelector(s => s.notes);
  const texts = useSelector(s => s.texts);
  const sections = useSelector(s => s.sections);
  const mdNotesPanel = useSelector(s => s.ui.mdNotesPanel);
  const note = notes[noteId];
  const [quillValue, setQuillValue] = useState(
    note.delta && note.delta.ops
      ? preProcessDelta(note.delta, notes, texts, sections, 4, [noteId], null)
      : ''
  );
  const [addBubble, setAddBubble] = useState(null);
  const [changedEditorCounter, setChangedEditorCounter] = useState(-1);
  // const [embedSeperatorsDOM, setEmbedSeperatorsDOM] = useState([]);
  const [embedClickCounter, setEmbedClickCounter] = useState(-1);
  const [atValues, setAtValues] = React.useState(
    atValuesCreator(notes, texts, sections)
  );
  const atKeysRef = React.useRef([
    ...Object.keys(texts),
    ...Object.keys(notes),
    ...Object.keys(sections)
  ]);
  const deltaRef = React.useRef(note.delta);
  const savedRef = React.useRef(Date.now());
  const cardBodyRef = React.useRef();
  const documentBodyRef = React.useRef();
  const quillNoteRef = React.useRef(null);
  const selectionIndexRef = React.useRef(-1);
  g.current = {
    window,
    noteId,
    informParentAboutChange,
    history,
    notes,
    texts,
    sections,
    mdNotesPanel,
    note,
    quillValue,
    setQuillValue,
    addBubble,
    setAddBubble,
    changedEditorCounter,
    setChangedEditorCounter,
    embedClickCounter,
    setEmbedClickCounter,
    atValues,
    setAtValues,
    deltaRef,
    savedRef,
    cardBodyRef,
    documentBodyRef,
    quillNoteRef,
    selectionIndexRef,
    dispatch
  };

  const mentionModule = useCallback(mentionModuleCreator(atValues, []), [
    atValues
  ]);

  // 2do include a paste sanitizer: should check embeds are included only partly.
  const clickHandler = useCallback(e => {
    if (classNameIncludes(e.target.className, 'ql-mention-denotation-char')) {
      mentionCharClickHandler(e, g);
    } else if (classNameIncludes(e.target.className, 'navline')) {
      navlineClickHandler(e, g);
    } else if (
      classNameIncludes(e.target.className, 'mention') ||
      classNameIncludes(e.target.parentElement.className, 'mention') ||
      classNameIncludes(
        e.target.parentElement.parentElement.className,
        'mention'
      )
    ) {
      mentionSpanClickHandler(e, g);
      setTimeout(() => {
        setEmbedClickCounter(prevState => prevState + 1);
      }, 10);
      if (informParentAboutChange)
        setTimeout(() => {
          informParentAboutChange();
        }, 200);
    }
  }, []);

  // settimout handleEditorChange
  useEffect(() => {
    if (changedEditorCounter < 0) return;
    if (!quillNoteRef) return;
    savedRef.current = null;
    const commitChangeTimer = setTimeout(() => {
      handleEditorChange(g);
    }, 5000);
    return () => {
      clearTimeout(commitChangeTimer);
    };
  }, [changedEditorCounter]);

  useEffect(() => {
    return () => {
      handleEditorChange(g);
    };
  }, []);

  // addEventListeners: click
  useEffect(() => {
    console.log('Notepanel_MOUNT_MOUNT_\n', notes[noteId].title);
    documentBodyRef.current = document.getElementById(`root`);
    const cardBody = document.getElementById(`noteCardBody${noteId}`);

    const toggleFocusClass = () => {
      if (cardBodyRef && cardBodyRef.current)
        cardBodyRef.current.classList.toggle('active-editor');
    };
    const setCursorToQuillEnd = e => {
      if (
        cardBodyRef &&
        cardBodyRef.current &&
        quillNoteRef &&
        quillNoteRef.current &&
        e.target === cardBodyRef.current &&
        containerType === 'side-note' // could possibly compare click height with quill rect. then add to all container types.
      )
        quillNoteRef.current.editor.setSelection(
          quillNoteRef.current.editor.getLength(),
          0
        );
    };

    cardBody.addEventListener('click', clickHandler);
    cardBody.addEventListener('focusin', toggleFocusClass);
    cardBody.addEventListener('focusout', toggleFocusClass);
    cardBody.addEventListener('click', setCursorToQuillEnd);

    return () => {
      const cardBody = document.getElementById(`noteCardBody${noteId}`);
      cardBody.removeEventListener('click', clickHandler);
      cardBody.removeEventListener('focusin', toggleFocusClass);
      cardBody.removeEventListener('focusout', toggleFocusClass);
      cardBody.removeEventListener('click', setCursorToQuillEnd);
      console.log('Notepanel_DISMOUNT_DISMOUNT_\n', notes[noteId].title);
    };
  }, []);

  // useEffect(() => {
  //   // history.clear() is somehow not effective as it gets overwritten with previous history
  //   // same with enabling previously disabled editor
  //   // same with setting userOnly from true to false to prevent recording loading change.
  //   console.log(
  //     'CLEAR_HISTORY after changed',
  //     !!quillNoteRef.current,
  //     quillNoteRef.current
  //   );
  //   if (changedEditorCounter < 0 && quillNoteRef.current) {
  //     console.log(
  //       'CLEAR_HISTORY',
  //       quillNoteRef.current.editor.options.readOnly
  //     );

  //     console.log('_HISTORYenable fun ', quillNoteRef.current.editor.enable);
  //     quillNoteRef.current.editor.disable(); // clear history as loading content will count as first action
  //     console.log(
  //       'CLEARED_HISTORY',
  //       quillNoteRef.current.editor.options.readOnly
  //     );
  //   }

  //   return () => {};
  // }, [quillNoteRef.current]);

  // update atValues // possibly more efficient to integrate in redux store
  useEffect(() => {
    const currentKeys = [
      ...Object.keys(texts),
      ...Object.keys(notes),
      ...Object.keys(sections)
    ];
    if (
      // tiny optimzation opportunity here
      currentKeys.length === atKeysRef.current.length &&
      !currentKeys.some(key => !atKeysRef.current.includes(key)) &&
      !atKeysRef.current.some(key => !currentKeys.includes(key))
    )
      return;

    atKeysRef.current = currentKeys;
    setAtValues(atValuesCreator(notes, texts, sections));

    return () => {};
  }, [texts, sections, notes]);

  if (!note) return <></>;
  return (
    <div
      className={`note-container ${containerType}`}
      ref={cardBodyRef}
      id={`noteCardBody${noteId}`}
    >
      {addBubble && (
        <AddBubble
          key={addBubble.range.index}
          addBubble={addBubble}
          setAddBubble={setAddBubble}
          cardBodyRef={cardBodyRef}
          noteRef={quillNoteRef}
          containerType={containerType}
        />
      )}
      {cardBodyRef.current && (
        <Navline
          noteId={noteId}
          cardBodyRef={cardBodyRef}
          changedEditorCounter={changedEditorCounter}
          embedClickCounter={embedClickCounter}
          mdNotesPanel={mdNotesPanel}
          containerType={containerType}
        />
      )}
      <ReactQuill
        ref={quillNoteRef}
        onChange={(__HTML, changeDelta, source, editor) =>
          onChangeHandler(__HTML, changeDelta, source, editor, g)
        }
        onChangeSelection={(range, source, editorInstance) => {
          selectionChangeHandler(range, source, editorInstance, g);
        }}
        defaultValue={quillValue}
        theme={'snow' || 'bubble'}
        modules={{
          //'#notesToolbar'
          toolbar: [
            [
              { header: '1' },
              { header: '2' },
              // { header: '3' },
              // { header: '4' }
              { size: 'small' },
              { size: 'large' }
            ],
            ['bold', 'italic', 'underline'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [
              { indent: '-1' },
              { indent: '+1' },
              { align: 'center' },
              { align: 'right' }
            ]
          ],
          history: {
            delay: 1000,
            maxStack: 50
          },
          mention: mentionModule
        }}
        placeholder='Take a note...'
        sanitize='true'
      />
      <SaveStatus current={savedRef.current} />
    </div>
  );
};

export default React.memo(NotePanel);
