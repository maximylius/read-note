// 2do how to handle when opening a note before the changes to it (from an open place elsewhere are committed?) // use a pending / loading state?
// 2do finish note-info.
// 2do "op not allowed" appears to often
// 2do color_class get out of sync
// 2do re-apply color_class at first load of note
// 2do optimize code / move outside of component / prevent rerenders
// 2do: when having an embeded note open. you can go with the cursor below mention tag, which is were the embed seperator is. There you can enter contents which will not be saved anywhere. Best behaviour: if selection is at the embed seperator move selection forward / backward, depending on previous position of the cursor.
// 2do: somehow notes do not get saved as soon as a mention tag is included. Or Rather embeds get removed from saved note.
// 2do: focus is jumping between editors

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import QuillMention from 'quill-mention';
import _isEqual from 'lodash/isEqual';
import BlotEmbedSeperator from '../../../Metapanel/BlotEmbedSeperator';
import {
  mentionModuleCreator,
  atValuesCreator,
  extractAtValueResType,
  extractAtValueResId,
  updateMentionIdOpenStatus,
  mentionIdIsOpen,
  mentionColorClass
} from '../../../Metapanel/mentionModule';
import {
  loadText,
  setCommittedSections,
  setTentativeSections,
  updateNote,
  loadNotes,
  addAlert
} from '../../../../store/actions';
import Navline from './Navline';
import { Error } from 'mongoose';
import {
  classNameIncludes,
  embedSeperatorCreator,
  preProcessDelta,
  getNotesPath,
  compareDisplayedNotesDelta,
  mentionCharClickHandler,
  deltaInconsistencyCheck
} from './noteFunctions';
import SaveStatus from './SaveStatus';
import { AddBubble } from './AddBubble';

ReactQuill.Quill.register(BlotEmbedSeperator);

const NotePanel = ({ noteId, containerType, informParentAboutChange }) => {
  console.log('NOTEPANEL RENDER. NOTEPANEL RENDER. NOTEPANEL RENDER. ');
  const history = useHistory();
  const dispatch = useDispatch();
  const notes = useSelector(s => s.notes);
  const notesRef = React.useRef(notes);
  const functionsRef = React.useRef({});
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

  // when shall the numbers be updated? at best whenever a mention is used. how to notice?
  const mentionModule = React.useCallback(mentionModuleCreator(atValues, []), [
    atValues
  ]);

  const onChangeHandler = (
    __HTML,
    changeDelta,
    source,
    editor //, quillRef
  ) => {
    if (source === 'api') {
      // console.log('api change....');
      return;
    }
    const delta = editor.getContents();
    // CHECK FOR INCONSINSTENCY
    let isInconsistent = false;
    // if (
    //   changeDelta.ops.some(
    //     op => op.delete || (op.attributes && op.attributes.embedSeperator)
    //   ) // 2do: when copying embed seperator format gets lost.
    // ) { // Problem: this would allow to type between mention span and embeded contents.
    isInconsistent = deltaInconsistencyCheck(delta, noteId);
    // }

    if (isInconsistent) {
      let inconsistencyMessage =
        '<p><strong>Operation not allowed.</strong> <br />Emebed content cannot be removed partly. Collapse or remove completly. </p>';
      console.log('deltadeltadeltadeltadeltaINCONSISTENT_---', delta);
      //history not exposed for editor ref from change event
      // quillNoteRef.editor.history.undo();
      const editor = quillNoteRef.current.editor;
      const newOps = [{ delete: editor.getLength() }, ...deltaRef.current.ops];
      editor.updateContents({
        ops: newOps
      });
      dispatch(
        addAlert({
          message: inconsistencyMessage,
          type: 'warning'
        })
      );
      return;
    }
    setChangedEditorCounter(prevState => prevState + 1);
    deltaRef.current = delta;
    if (informParentAboutChange) informParentAboutChange();
  };

  // check which notes to update.
  // if update: update connectedWith for the note(s).
  const handleEditorChange = () => {
    // external vars: 1.editorRef, 2.{mainNoteId, begin, end} (if not noteId, then begin and end index are necessary), 3.notes (redux), 4.dispatch, 5.updateNote
    console.log('handle change');
    if (!quillNoteRef) return;
    console.log(quillNoteRef, quillNoteRef.current.editor);
    const editor = quillNoteRef.current.editor;
    const delta = editor.getContents();
    const { notesConnectedWith, displayedNotes } = getNotesPath(delta, noteId);
    const noteUpdateArray = compareDisplayedNotesDelta(
      delta,
      displayedNotes,
      notesConnectedWith,
      notesRef.current
    );
    console.log('noteUpdateArray', noteUpdateArray);
    noteUpdateArray.forEach(noteUpdateObj =>
      dispatch(updateNote(noteUpdateObj))
    );
    savedRef.current = Date.now();
    return;
  };

  // settimout handleEditorChange
  useEffect(() => {
    if (changedEditorCounter < 0) return;
    if (!quillNoteRef) return;
    savedRef.current = null;
    const commitChangeTimer = setTimeout(() => {
      handleEditorChange();
    }, 5000);
    return () => {
      clearTimeout(commitChangeTimer);
    };
  }, [changedEditorCounter]);

  useEffect(() => {
    return () => {
      handleEditorChange();
    };
  }, []);

  const mentionSpanClickHandler = (
    e,
    editor,
    notes,
    noteId,
    handleEditorChange
  ) => {
    // what about ref // can it be passed in?
    const resInfo =
      e.target.dataset.id ||
      e.target.parentElement.dataset.id ||
      e.target.parentElement.parentElement.dataset.id;
    console.log(resInfo);
    let dontOpen, closeIndexes;
    const resType = extractAtValueResType(resInfo);
    if (!resType || resType !== 'note') {
      // 2do make "open res" function that calls res specific open function
      // dont embed resource. 2do: open instead!
      return;
    }
    const resId = extractAtValueResId(resInfo);
    console.log('resId', resId, 'notes', notes, 'notes[resId]', notes[resId]);
    let deltaToEmbed = notes[resId] && notes[resId].delta;
    // 2do: if the note is not fetched, request it first, then continue!
    const delta = editor.getContents();
    console.log(
      'delta------------------------------------------------------------------------------------\n',
      delta
    );
    const flexPath = [noteId],
      currentPath = [noteId],
      allPaths = {
        [noteId]: { begin: 0, embeds: [], end: delta.ops.length }
      };
    // colorPath: 0-0, 0-1, 1-0, 2-0, 2-1,
    const selection = quillNoteRef.current.editor.getSelection();
    if (!selection) return; // 2do check whether this early return is okay:
    let deltaPosition = 0,
      deltaIndex = 0,
      seperatorIndexes = null;

    //  here we can manipulate the color of the embeds
    delta.ops.forEach((op, index) => {
      if (op.attributes && op.attributes.embedSeperator) {
        const resId = op.attributes.embedSeperator.resId;
        if (op.attributes.embedSeperator.case === 'begin') {
          allPaths[flexPath[flexPath.length - 1]].embeds.push(resId);
          allPaths[resId] = {
            begin: index,
            embeds: []
          };
          flexPath.push(resId);
          if (deltaPosition < selection.index) {
            console.log('new currentPath:', flexPath);
            currentPath.push(resId);
          }
        } else {
          allPaths[resId].end = index;
          flexPath.pop();
          if (deltaPosition < selection.index) {
            console.log('new currentPath:', flexPath);
            currentPath.pop();
          }
        }
      }
      deltaPosition += op.insert.length || 1;
      if (deltaPosition === selection.index) {
        deltaIndex = index + 1; //2do: think: why +1?
      }
    });
    // CHECK FOR ERROR
    if (
      Object.keys(allPaths).some(
        key => allPaths[key].end && allPaths[key].end < allPaths[key].begin
      )
    )
      throw new Error(
        'error: embeds not closed propperly',
        allPaths,
        delta.ops
      );

    console.log('deltaIndex', deltaIndex, 'currentPath', currentPath);
    console.log('d-1', delta.ops[deltaIndex - 1]);
    console.log('d-0', delta.ops[deltaIndex - 0]);
    console.log('d+1', delta.ops[deltaIndex + 1]);
    console.log('d+2', delta.ops[deltaIndex + 2]);

    // THROW ERROR WHEN SELECTION BUGGED OUT
    if (
      !delta.ops[deltaIndex].insert ||
      !delta.ops[deltaIndex].insert.mention ||
      delta.ops[deltaIndex].insert.mention.id !== resInfo
    )
      throw 'selection is not at clicked position. returned out of function';

    // CLOSE and not open if followed by opening tag
    if (
      delta.ops[deltaIndex + 1] &&
      delta.ops[deltaIndex + 1].attributes &&
      delta.ops[deltaIndex + 1].attributes.embedSeperator &&
      delta.ops[deltaIndex + 1].attributes.embedSeperator.resId === resId
    ) {
      const { begin, end } = allPaths[resId];
      if (begin < 0 || end <= begin) {
        throw new Error('NOT: embed 0<=begin<end ');
      }
      handleEditorChange(); // 2do: check whether change has occured in delta that are about to be closed

      delta.ops[deltaIndex].insert.mention.id = updateMentionIdOpenStatus(
        delta.ops[deltaIndex].insert.mention.id,
        'false'
      ); // close mention tag
      seperatorIndexes = { begin, end };
      const newOps = [
        ...delta.ops.slice(0, begin),
        ...delta.ops.slice(end + 1)
      ];
      editor.updateContents({
        ops: [{ delete: editor.getLength() }, ...newOps]
      });

      console.log('newSelectionIndex', selection.index + 1);
      editor.setSelection(selection.index + 1);

      deltaRef.current = { ops: newOps };
      console.log('close.', seperatorIndexes);
      console.log(
        'newOps',
        newOps,
        'closedOps',
        delta.ops.slice(begin + 1, end + 1 - 1)
      );
      return;
    }

    // 2do: problem with current path: doesnt include the opening tag
    // ALERT - ALREADY OPEN
    if (currentPath.includes(resId)) {
      // necessary only when not open.
      dispatch(
        addAlert({
          message: `<p>You are <strong>already</strong> working within <strong>${notes[resId].title}</strong>.</p>`,
          type: 'info'
        })
      );
      return;
    }

    // OPEN (and close if necessary)
    // if it is open before assign closeIndexes
    if (Object.keys(allPaths).includes(resId)) {
      closeIndexes = {
        begin: allPaths[resId].begin,
        end: allPaths[resId].end
      };
      delta.ops[
        closeIndexes.begin - 1
      ].insert.mention.id = updateMentionIdOpenStatus(
        delta.ops[closeIndexes.begin - 1].insert.mention.id,
        'false'
      ); // close mention
    }

    if (closeIndexes) {
      deltaToEmbed = {
        ops: delta.ops.slice(closeIndexes.begin + 1, closeIndexes.end)
      };
      if (
        // remove linebreak inherited from embedSeperator
        typeof deltaToEmbed.ops[0].insert === 'string' &&
        deltaToEmbed.ops[0].insert[0] === '\n'
      ) {
        console.log('chop of first char!');
        deltaToEmbed.ops[0].insert = deltaToEmbed.ops[0].insert.slice(1);
      }
    } else {
      if (!deltaToEmbed) {
        dispatch(
          addAlert({
            message:
              '<p>Ressource not found: Either deleted or not yet loaded</p>',
            type: 'warning'
          })
        );
        return;
      }
    }

    console.log('open! close:', closeIndexes);
    const closeBefore = closeIndexes && closeIndexes.begin < deltaIndex;
    const closeAfter = closeIndexes && closeIndexes.begin > deltaIndex;
    const newOps = [
      ...(closeBefore
        ? [
            ...delta.ops.slice(0, closeIndexes.begin),
            ...delta.ops.slice(closeIndexes.end + 1, deltaIndex + 1)
          ]
        : delta.ops.slice(0, deltaIndex + 1)),
      ...(dontOpen
        ? []
        : [
            embedSeperatorCreator(resType, resId, resInfo, 'begin'),
            ...deltaToEmbed.ops,
            embedSeperatorCreator(resType, resId, resInfo, 'end')
          ]),
      ...(closeAfter
        ? [
            ...delta.ops.slice(deltaIndex + 1, closeIndexes.begin),
            ...delta.ops.slice(closeIndexes.end + 1, delta.ops.length)
          ]
        : delta.ops.slice(deltaIndex + 1, delta.ops.length))
    ];
    console.log('newOps before color', newOps);

    // COLOR EMBEDS
    const colorPath = {
        [noteId]: {
          begin: 0,
          embeds: [],
          end: delta.ops.length,
          color_class: ''
        }
      },
      currentColorPath = [noteId];
    newOps.forEach((op, index) => {
      if (!op.attributes || !op.attributes.embedSeperator) return;
      const embedResId = op.attributes.embedSeperator.resId;
      if (op.attributes.embedSeperator.case === 'begin') {
        colorPath[currentColorPath[currentColorPath.length - 1]].embeds.push(
          embedResId
        );
        let color_class =
          'color_class-' +
          currentColorPath
            .map((el, index) => colorPath[el].embeds.length - 1)
            .join('-');
        colorPath[embedResId] = {
          embeds: [],
          color_class
        };

        newOps[index].attributes.embedSeperator.color_class =
          colorPath[embedResId].color_class;
        currentColorPath.push(embedResId);
      } else {
        currentColorPath.pop();
        // 2do: error color_class of undefined.
        try {
          newOps[index].attributes.embedSeperator.color_class =
            colorPath[embedResId].color_class;
        } catch (error) {
          console.log('newOps', newOps);
          console.log('index', index);
          console.log('newOps[index]', newOps[index]);
          console.log('colorPath', colorPath);
          console.log('embedResId', embedResId);
          console.log('colorPath[embedResId]', colorPath[embedResId]);
          throw new Error('CANNOT READ COLOR_CLASS OF UNDEFINED');
        }
      }
    });

    // update clicked mention with color_class
    let newDeltaIndex = deltaIndex;
    newDeltaIndex -=
      closeIndexes && closeIndexes.begin < deltaIndex
        ? closeIndexes.end + 1 - closeIndexes.begin
        : 0;
    newOps[newDeltaIndex].insert.mention.id = updateMentionIdOpenStatus(
      newOps[newDeltaIndex].insert.mention.id,
      colorPath[resId].color_class
    );

    console.log(newOps);
    editor.updateContents({ ops: [{ delete: editor.getLength() }, ...newOps] });

    const newSelectionIndex =
      selection.index +
      3 -
      (!!closeBefore &&
        delta.ops
          .slice(closeIndexes.begin, closeIndexes.end + 1)
          .reduce((a, b) => a + (b.insert && b.insert.length) || 1, 0));

    console.log(
      'closeBefore',
      closeBefore,
      !!closeBefore &&
        delta.ops
          .slice(closeIndexes.begin, closeIndexes.end + 1)
          .reduce((a, b) => a + (b.insert && b.insert.length) || 1, 0)
    );
    console.log('newSelectionIndex', newSelectionIndex);

    editor.setSelection(newSelectionIndex);

    deltaRef.current = { ops: newOps };
    if (closeIndexes) {
      handleEditorChange();
    }
  };

  const navlineClickHandler = (e, editor, handleEditorChange) => {
    const resInfo = e.target.dataset.resInfo;
    const delta = editor.getContents();
    const begin = delta.ops.findIndex(
      op =>
        op.attributes &&
        op.attributes.embedSeperator &&
        op.attributes.embedSeperator.resInfo === resInfo &&
        op.attributes.embedSeperator.case === 'begin'
    );
    const end =
      begin +
      delta.ops
        .slice(begin)
        .findIndex(
          op =>
            op.attributes &&
            op.attributes.embedSeperator &&
            op.attributes.embedSeperator.resInfo === resInfo &&
            op.attributes.embedSeperator.case === 'end'
        );
    if (begin < 0 || end < 0) throw 'embed doesnt exist';
    delta.ops[begin - 1].insert.mention.id = updateMentionIdOpenStatus(
      delta.ops[begin - 1].insert.mention.id,
      'false'
    ); // close mention
    handleEditorChange(); //2do check whether closed embeds or "grandchild" embeds need update
    const newOps = [
      { delete: editor.getLength() },
      ...delta.ops.slice(0, begin),
      ...delta.ops.slice(end + 1)
    ];
    editor.updateContents({
      ops: newOps
    });
    deltaRef.current = {
      ops: [...delta.ops.slice(0, begin), ...delta.ops.slice(end + 1)]
    };
  };

  // 2do include a paste sanitizer: should check embeds are included only partly.
  const clickHandler = e => {
    // vars 1.e, 2.editor 3.handleChange,
    const editor = quillNoteRef.current.editor;
    if (classNameIncludes(e.target.className, 'ql-mention-denotation-char')) {
      mentionCharClickHandler(
        e,
        sections,
        dispatch,
        history,
        loadText,
        loadNotes,
        setCommittedSections,
        setTentativeSections
      );
    } else if (classNameIncludes(e.target.className, 'navline')) {
      navlineClickHandler(e, editor, handleEditorChange);
      setTimeout(() => {
        setEmbedClickCounter(prevState => prevState + 1);
      }, 10);
    } else if (
      classNameIncludes(e.target.className, 'mention') ||
      classNameIncludes(e.target.parentElement.className, 'mention') ||
      classNameIncludes(
        e.target.parentElement.parentElement.className,
        'mention'
      )
    ) {
      mentionSpanClickHandler(
        e,
        editor,
        notesRef.current,
        noteId,
        handleEditorChange
      );
      setTimeout(() => {
        setEmbedClickCounter(prevState => prevState + 1);
      }, 10);
    }
  };

  const selectionChangeHandler = (range, source, editorInstance) => {
    console.log(range);
    if (!range) return;
    if (source !== 'user' || !editorInstance || !quillNoteRef) {
      if (addBubble) setAddBubble(null);
      return;
    }

    const editor = quillNoteRef.current.editor;

    if (range.length === 0) {
      if (!quillNoteRef) {
        if (addBubble) setAddBubble(null);
        return;
      }

      console.log(editor);
      const scroll = editor.scroll;
      const scrollAtPos = scroll.path(range.index)[1][0];
      const ops = editor.getContents().ops;
      if (!scrollAtPos.text && scrollAtPos.domNode.tagName === 'BR') {
        const boundingClientRect = scroll
          .path(range.index)[1][0]
          .domNode.getBoundingClientRect();

        // search for last opening embedSeperator before range.index
        // if any use this id, else use noteId
        let parentNoteId = noteId,
          charIndex = 0,
          opBeginIndex = 0;
        while (charIndex <= range.index && opBeginIndex < ops.length) {
          const op = ops[opBeginIndex];
          if (
            op.attributes &&
            op.attributes.embedSeperator &&
            op.attributes.embedSeperator.case === 'begin'
          ) {
            parentNoteId = op.attributes.embedSeperator.resId;
          }
          charIndex += op.insert.length || 1;
          opBeginIndex += 1;
        }
        opBeginIndex = Math.max(0, opBeginIndex - 1);
        console.log('ops', ops, 'opBeginIndex', opBeginIndex);
        console.log('editor', editor);

        setAddBubble({
          range: range,
          boundingClientRect: boundingClientRect,
          delta: null,
          parentNoteId: parentNoteId,
          opBeginIndex: opBeginIndex,
          opEndIndex: null,
          allow: []
        });
        return;
      }
      setAddBubble(null);
      return;
    }
    let allowNewNote = true,
      opBegin = 0,
      charIndex = 0;
    const delta = editor.getContents();
    const ops = delta.ops;
    while (charIndex <= range.index && opBegin < ops.length) {
      charIndex += ops[opBegin].insert.length || 1;
      opBegin += 1;
    }
    opBegin = Math.max(0, opBegin - 1);
    let opEnd = opBegin,
      currentPath = [],
      firstOp = ops[opBegin];
    if (firstOp.attributes && firstOp.attributes.embedSeperator) {
      allowNewNote = false;
    } else {
      while (charIndex <= range.index + range.length && opEnd < ops.length) {
        let op = ops[opEnd];
        if (op.attributes && op.attributes.embedSeperator) {
          if (op.attributes.embedSeperator.case === 'begin') {
            currentPath.push(1);
          } else {
            if (currentPath.length === 0) {
              allowNewNote = false;
              break;
            }
            currentPath.pop();
          }
        }
        charIndex += ops[opEnd].insert.length || 1;
        opEnd += 1;
      }
      if (allowNewNote) {
        //  setAddBubble({
        //  ...delta: {ops: selectedOps}
        //  }) 2do
        opEnd = Math.max(0, opEnd - 1);
        let lastOp = ops[opEnd];
        if (lastOp.attributes && lastOp.attributes.embedSeperator) {
          allowNewNote = false;
        }
      } else {
        if (addBubble) setAddBubble(null);
      }
    }

    console.log(opBegin, opEnd, delta.ops, allowNewNote);

    //     let selectedOps =
  };

  // addEventListeners: click
  useEffect(() => {
    console.log(
      'MOUNT_MOUNT_MOUNT_MOUNT_MOUNT_MOUNT_MOUNT_\n',
      notes[noteId].title
    );
    documentBodyRef.current = document.getElementById(`root`);
    const cardBody = document.getElementById(`noteCardBody${noteId}`);

    cardBody.addEventListener('click', clickHandler);

    functionsRef.current.focusIn = () => {
      if (cardBodyRef && cardBodyRef.current)
        cardBodyRef.current.classList.add('active-editor');
    };
    functionsRef.current.focusOut = () => {
      if (cardBodyRef && cardBodyRef.current)
        cardBodyRef.current.classList.remove('active-editor');
    };
    cardBody.addEventListener('focusin', functionsRef.current.focusIn);
    cardBody.addEventListener('focusout', functionsRef.current.focusOut);

    return () => {
      const cardBody = document.getElementById(`noteCardBody${noteId}`);
      cardBody.removeEventListener('click', clickHandler);
      cardBody.removeEventListener('focusin', functionsRef.current.focusIn);
      cardBody.removeEventListener('focusout', functionsRef.current.focusOut);
      console.log(
        'DISMOUNT_DISMOUNT_DISMOUNT_DISMOUNT_DISMOUNT_DISMOUNT_\n',
        notes[noteId].title
      );
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
      currentKeys.length === atKeysRef.current &&
      !currentKeys.some(key => !atKeysRef.current.includes(key))
    )
      return;

    atKeysRef.current = currentKeys;
    setAtValues(atValuesCreator(notes, texts, sections));

    notesRef.current = notes;

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
        onChange={onChangeHandler}
        onChangeSelection={selectionChangeHandler}
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
