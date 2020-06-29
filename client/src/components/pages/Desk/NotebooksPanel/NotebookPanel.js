import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import QuillMention from 'quill-mention';
import _isEqual from 'lodash/isEqual';
import AnnotationBlot from '../../../Metapanel/AnnotationBlot';
import BlotEmbedSeperator from '../../../Metapanel/BlotEmbedSeperator';
import {
  mentionModuleCreator,
  atValuesCreator,
  extractAtValueResType,
  extractAtValueResId
} from '../../../Metapanel/mentionModule';
import {
  loadText,
  setCommittedSections,
  setTentativeSections,
  updateNotebook,
  loadNotebooks,
  addAlert
} from '../../../../store/actions';
import { getAllKeys } from '../../../../functions/main';

ReactQuill.Quill.register(AnnotationBlot);
ReactQuill.Quill.register(BlotEmbedSeperator);

// 2do each notebook needs a title and a section below that is partly uneditable (their ids shall be numbered notebookId_2_outOf_9 ), that contains all notebook links. shall be updated when changes are committed. shall be collapsable.
// also contain a section that contains link to notebook that are only one way.
// shall enable to disable links even though they appear in text?
// does link section need an input field? no
// 2do check how mention module works first.
// 2do possibly by handling selection? do not allow to be at begin? Maybe problem with drag and drop... selection

const NotebookPanel = ({ setNotebookRef, quillNotebookRefs, notebookId }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    notebooks,
    texts,
    sections,
    annotations,
    user,
    ui: { mdNotebooksPanel },
    textsPanel: { activeTextPanel }
  } = useSelector(state => state);
  const notebook = notebooks.byId[notebookId];
  const [quillValue, setQuillValue] = useState(notebook.deltas || '');
  const [changedEditorCounter, setChangedEditorCounter] = useState(-1);
  const [atValues, setAtValues] = React.useState(
    atValuesCreator(texts.byId, notebooks.byId, sections.byId)
  );
  const atKeysRef = React.useRef([
    ...Object.keys(texts.byId),
    ...Object.keys(notebooks.byId),
    ...Object.keys(sections.byId)
  ]);

  // when shall the numbers be updated? at best whenever a mention is used. how to notice?
  const mentionModule = React.useCallback(mentionModuleCreator(atValues, []), [
    atValues
  ]);

  const onChangeHandler = (__HTML, changeDelta, source, editor) => {
    console.log(changeDelta, editor, source, '--------------');
    if (source === 'api') {
      console.log('api change....');
      return;
    }
    const currentDelta = editor.getContents();
    let isInconsistent = false,
      listEmbedSeperators = {},
      inconsistencyMessage =
        '<p><strong>Operation not allowed.</strong> <br />Emebed content cannot be removed partly. Collapse or remove completly. </p>';

    // check whether it is inconsistent
    // if (changeDelta.ops.some(op => op.delete)) { // 2do: add pastehandler to uncomment this.
    isInconsistent = currentDelta.ops.some((op, index) => {
      if (op.insert && op.insert.mention) {
        const resInfo = op.insert.mention.id;
        if (!listEmbedSeperators[resInfo]) {
          listEmbedSeperators[resInfo] = {};
        }
      }
      if (!op.attributes) return false;
      if (!op.attributes.embedSeperator) return false;
      const resInfo = op.attributes.embedSeperator.resInfo;
      if (op.attributes.embedSeperator.case === 'begin') {
        if (
          listEmbedSeperators[resInfo] &&
          !listEmbedSeperators[resInfo].begin &&
          !listEmbedSeperators[resInfo].end
        ) {
          listEmbedSeperators[resInfo].begin = true;
          return false;
        } else {
          return inconsistencyMessage;
        }
      } else if (
        listEmbedSeperators[resInfo] &&
        listEmbedSeperators[resInfo].begin &&
        !listEmbedSeperators[resInfo].end
      ) {
        listEmbedSeperators[resInfo].end = true;
        return false;
      } else {
        return inconsistencyMessage;
      }
    });
    // }

    // else if (newMention) {
    //   // if nothing is deleted only added
    //   // then it always needs to update the content with a new number

    //   let allMentionIdPaths = [],
    //     duplicatedMentionIdPaths = [],
    //     mentionOps = [],
    //     embedPaths = [notebookId]; //

    //   currentDelta.ops.forEach((op, index) => {
    //     if (op.insert && op.insert.mention) {
    //       if (
    //         op.insert.mention.id //RegExp
    //           .includes(embedPaths[embedPaths.length - 1])
    //       ) {
    //       }

    //       if (allMentionIdPaths.includes(op.insert.mention.id)) {
    //         duplicatedMentionIdPaths.push(op.insert.mention.id);
    //       }
    //       allMentionIdPaths.push(op.insert.mention.id);
    //       mentionOps.push(index);
    //     } else if (op.attributes && op.attributes.embedSeperator) {
    //       if ((op.attributes.embedSeperator.case = 'begin')) {
    //         embedPaths.push(op.attributes.embedSeperator.resInfo);
    //       } else {
    //         embedPaths.pop();
    //       }
    //     }
    //   });

    //   // it does need to know :
    //   // is resInfo still correct? Maybe mention has been moved inside different notebook
    //   //
    //   console.log(mentionOps);
    //   currentDelta.ops.forEach((op, index) => {
    //     if (!op.insert || !op.insert.mention) return;
    //     if (listMentions.includes(op.insert.mention.id)) {
    //       needsUpdate = true;
    //       currentDelta.ops[index].insert.mention.id =
    //         op.insert.mention.id +
    //         listMentions.filter(
    //           el => el.includes(op.insert.mention.id) //2do: RegExp
    //         ).length -
    //         1;
    //     }
    //     listMentions.push(op.insert.mention.id);
    //   });
    //   // only check for @mentions
    // }

    if (isInconsistent) {
      console.log(currentDelta);
      //history not exposed for editor ref from change event
      quillNotebookRefs.current[notebookId].editor.history.undo();
      dispatch(
        addAlert({
          message: isInconsistent,
          type: 'warning'
        })
      );
      return;
    }
    //  else {
    //   if (needsUpdate) {
    //     // carefully check whether this update is necessary:
    //     //
    //     quillNotebookRefs.current[notebookId].editor.updateContents(
    //       currentDelta
    //     );
    //   }
    // }
    setChangedEditorCounter(prevState => prevState + 1);
  };

  // check which notebooks to update.
  // if update: update connectedWith for the notebook(s).
  const handleEditorChange = () => {
    console.log('handle change');
    if (!quillNotebookRefs.current[notebookId]) return;
    const editor = quillNotebookRefs.current[notebookId].editor;
    const delta = editor.getContents();

    // id:[0  id:[30    70]   id:[90   id:[110  115]    130]    270]
    // id0:ops:: (0,270) ---(30,70), (90, 130)
    // id0:ops:: (0,30), (71,90), (131, 270)
    // this is also the point where the embededPath shall be derived right? // not so important yet.
    // notesConnectedWith={
    // [id1]:[id2, id3, id4],
    // [id3]: [id5],
    // [id5]: [id6]
    // }
    // embeds={
    // [id1]: {begin: 0, end: delta.ops.length-1},
    // [id2]: {begin: 15, end: 22}
    // }
    const notesConnectedWith = {},
      nestPath = [notebookId];
    const displayedNotes = {
      [notebookId]: { begin: 0, end: delta.ops.length - 1, embeds: [] }
    };
    delta.ops.forEach((op, opIndex) => {
      if (op.insert && op.insert.mention) {
        const resId = extractAtValueResId(op.insert.mention.id);
        if (!notesConnectedWith[nestPath[nestPath.length - 1]]) {
          notesConnectedWith[nestPath[nestPath.length - 1]] = [];
        }
        notesConnectedWith[nestPath[nestPath.length - 1]].push(resId);
        return;
      }
      if (!op.attributes || !op.attributes.embedSeperator) return;
      const resId = op.attributes.embedSeperator.resId;
      if (op.attributes.embedSeperator.case === 'begin') {
        if (displayedNotes[resId])
          throw 'ERROR: embed has occured more than once.';
        displayedNotes[nestPath[nestPath.length - 1]].embeds.push(resId);
        displayedNotes[resId] = { begin: opIndex + 1, embeds: [] };
        nestPath.push(resId);
      } else {
        if (!displayedNotes[resId])
          throw 'ERROR: embed was closed before opened.';
        displayedNotes[resId].end = opIndex - 1;
        nestPath.pop();
      }
    });
    console.log(
      'displayedNotes\n',
      displayedNotes,
      '\nnotesConnectedWith\n',
      notesConnectedWith,
      '\nnestPath\n',
      nestPath
    );
    Object.keys(displayedNotes).forEach(resId => {
      const displayedNote = displayedNotes[resId];
      const noteOps = delta.ops.filter(
        (op, i) =>
          displayedNote.begin <= i &&
          displayedNote.end >= i &&
          !displayedNote.embeds.some(
            embedId =>
              displayedNotes[embedId].begin - 1 <= i &&
              displayedNotes[embedId].end + 1 >= i
          )
      );

      console.log('noteOps', noteOps);
      const savedOps = notebooks.byId[resId].deltas.ops;
      // 2do: wrong behaviour when embed is changed: parent is changed also. embed is also changed on first parent change.
      let shouldUpdate =
        noteOps.length !== savedOps.length ||
        noteOps.some((op, i) => {
          // mentions are DOMStringMaps and need to be converted to simple object to enable comparison with plain object from store
          if (!op.insert || !op.insert.mention)
            return !_isEqual(op, savedOps[i]);
          op.insert.mention = { ...op.insert.mention };
          return !_isEqual(op, savedOps[i]);
        });

      if (shouldUpdate) {
        console.log('will update', notebooks.byId[resId].title);
        const notePlainText = noteOps
          .map(op =>
            typeof op.insert === 'string'
              ? op.insert
              : op.insert.mention
              ? op.insert.mention.value
              : ' '
          )
          .join('');
        dispatch(
          updateNotebook({
            _id: resId,
            deltas: { ops: noteOps },
            plainText: notePlainText,
            connectedWith: notesConnectedWith[resId]
          })
        );
      } else {
        console.log('doesnt need to update', notebooks.byId[resId].title);
      }
    });
    // const embeds=[]//2do understand what was the reason
    // embeds.forEach(embed => {
    //   console.log('embed:', embed);
    //   currentPos = embedPath;
    //   currentPath.forEach(el => (currentPos = currentPos[el]));
    //   console.log('currentPath:', currentPath);
    //   if (embed.case === 'begin') {
    //     console.log('begin of embed');
    //     currentPos[embed.resInfo] = { begin: embed.index };
    //     console.log(currentPos, 'currentPos');
    //     currentPath.push(embed.resInfo);
    //   } else {
    //     console.log('end of embed');
    //     if (currentPath[currentPath.length - 1] !== embed.resInfo)
    //       throw 'Error: inconsistent embeds.';
    //     currentPos.end = embed.index;
    //     embededNotebooks.push({
    //       id: embed.id,
    //       beginIndex: currentPos.begin + 1, //excl sep
    //       endIndex: currentPos.end - 1, //excl sep
    //       embedIndexes: Object.keys(currentPos)
    //         .filter(key => !['begin', 'end'].includes(key))
    //         .map(key => ({
    //           begin: currentPos[key].begin,
    //           end: currentPos[key].end
    //         })),
    //       deltas: notebooks.byId[embed.id].deltas
    //     });
    //     currentPath.pop();
    //   }
    //   console.log('currentPath', currentPath, 'embedPath', embedPath);
    // });
    // embededNotebooks[0].embedIndexes = Object.keys(embedPath)
    //   .filter(key => !['begin', 'end'].includes(key))
    //   .map(key => ({
    //     begin: embedPath[key].begin,
    //     end: embedPath[key].end
    //   }));
    // console.log('embedPath final', embedPath);

    // console.log('embededNotebooks', embededNotebooks);
    // 2do: add links to connectedWith state
    // embededNotebooks.forEach(embededNotebook => {
    //   // include from begin Index to first embed index, then exclude until embed end, then include from end+1 to next first embedIndex, then exlude until embed,  then include from embed end +1 until end index
    //   // exclude them seperators
    //   console.log('embededNotebook', embededNotebook);
    //   const concernedOps = [...embededNotebook.embedIndexes, {}].flatMap(
    //     (embedIndex, index) => {
    //       // console.log("slice frrom", ,"to", );
    //       return delta.ops.slice(
    //         index === 0
    //           ? embededNotebook.beginIndex
    //           : embededNotebook.embedIndexes[index - 1].end + 1, //excl sep
    //         index === embededNotebook.embedIndexes.length
    //           ? embededNotebook.endIndex + 1
    //           : embededNotebook.embedIndexes[index].begin //excl sep
    //       ); // more complex: remove its embeds!
    //     }
    //   );

    //   console.log('concernedOps', concernedOps);
    //   console.log('embededNotebook.deltas.ops', embededNotebook.deltas.ops);

    //   if (_isEqual(concernedOps, embededNotebook.deltas.ops)) {
    //     console.log('no change in', notebooks.byId[embededNotebook.id].title);
    //     if (
    //       embededNotebook.id === notebookId &&
    //       !_isEqual(notebooks.byId[notebookId].embedPath, embedPath)
    //     ) {
    //       // think about whether changing the embed path can change the displayed embeds?
    //       dispatch(
    //         updateNotebook({
    //           _id: notebookId,
    //           embedPath
    //         })
    //       );
    //     }
    //     return;
    //   }
    //   // each main notebook should contain a path of what is expanded: embeds: [{id,nr, id_nr: `${id}_${nr}`, expaneded: false, type: "notebook", id:id, embeds: [{...}]},{...}]
    //   // if other notebook than active one is changed than an update / remount has to be forced on those places where it is active

    //   console.log('currentDeltas', delta);
    //   const embedPlainText = concernedOps
    //     .map(op =>
    //       typeof op.insert === 'string'
    //         ? op.insert
    //         : op.insert.mention
    //         ? op.insert.mention.value
    //         : ''
    //     )
    //     .join('');
    //   console.log(
    //     notebooks.byId[embededNotebook.id].title,
    //     'embedPlainText',
    //     embedPlainText
    //   );
    //   dispatch(
    //     updateNotebook({
    //       _id: embededNotebook.id,
    //       deltas: { ops: concernedOps },
    //       plainText: embedPlainText,
    //       embedPath
    //     })
    //   );
    // });
  };

  // settimout handleEditorChange
  useEffect(() => {
    if (changedEditorCounter < 0) return;
    if (!quillNotebookRefs.current[notebookId]) return;
    console.log('start timer');
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

  // 2do include a paste sanitizer: should check whether links are inside. if so it should give the links a new number.
  // 2do improve
  const clickHandler = e => {
    console.log(e.target, e.target.className);
    console.log(
      'selection:::::::::',
      quillNotebookRefs.current[notebookId].editor.getSelection()
    );
    if (
      (!e.target.className.includes('ql-mention-denotation-char') &&
        (e.target.className.includes('mention') ||
          e.target.parentElement.className.includes('mention') ||
          e.target.parentElement.parentElement.className.includes(
            'mention'
          ))) ||
      e.target.className.includes('navline')
    ) {
      const resInfo = e.target.className.includes('navline')
        ? e.target.dataset.resInfo
        : e.target.dataset.id ||
          e.target.parentElement.dataset.id ||
          e.target.parentElement.parentElement.dataset.id;
      console.log(resInfo);
      let dontOpen, closeIndexes;
      // resInfo contains: resource-nr-parentResource
      // will it always be unique?
      // a parentResource can only be opened once. for that reason: yes
      const resType = extractAtValueResType(resInfo);
      if (!resType || resType !== 'note') {
        // dont embed resource. 2do: open instead!
        return;
      }

      const resId = extractAtValueResId(resInfo);
      const deltaToEmbed = notebooks.byId[resId].deltas;
      const editor = quillNotebookRefs.current[notebookId].editor;
      const length = editor.getLength();
      const delta = editor.getContents();
      const currentPath = [notebookId],
        allPaths = {};
      const selection = quillNotebookRefs.current[
        notebookId
      ].editor.getSelection();
      let deltaPosition = 0,
        deltaIndex = 0,
        seperatorIndexes = null;

      while (deltaPosition < selection.index) {
        if (
          delta.ops[deltaIndex].attributes &&
          delta.ops[deltaIndex].attributes.embedSeperator
        ) {
          if (
            (delta.ops[deltaIndex].attributes.embedSeperator.case = 'begin')
          ) {
            allPaths[delta.ops[deltaIndex].attributes.embedSeperator.resId] = {
              begin: deltaIndex
            };
            currentPath.push(
              delta.ops[deltaIndex].attributes.embedSeperator.resId
            );
          } else {
            allPaths[
              delta.ops[deltaIndex].attributes.embedSeperator.resId
            ].end = deltaIndex;
            currentPath.pop();
          }
        }
        deltaPosition += delta.ops[deltaIndex].insert.length || 1;
        deltaIndex++;
      } //2do check what happen when first delta is used
      console.log('d-1', delta.ops[deltaIndex - 1]);
      console.log('d-0', delta.ops[deltaIndex - 0]);
      console.log('d+1', delta.ops[deltaIndex + 1]);
      console.log('d+2', delta.ops[deltaIndex + 2]);
      if (
        delta.ops[deltaIndex + 1].attributes &&
        delta.ops[deltaIndex + 1].attributes.embedSeperator &&
        delta.ops[deltaIndex + 1].attributes.embedSeperator.resId === resId
      ) {
        //  check whether delta is followed by opening tag or not.
        // then close
        let begin = deltaIndex + 1;
        console.log('tested ops', delta.ops.slice(deltaIndex + 1));
        let end =
          deltaIndex +
          1 +
          delta.ops
            .slice(deltaIndex + 1)
            .findIndex(
              op =>
                op.attributes &&
                op.attributes.embedSeperator &&
                op.attributes.embedSeperator.resId === resId &&
                op.attributes.embedSeperator.case === 'end'
            );
        seperatorIndexes = { begin, end };
        editor.updateContents({
          ops: [...delta.ops.slice(0, begin), ...delta.ops.slice(end + 1)]
        });
        // 2do: check if there are unsaved changes in the area that is about to be collapsed. if so dispatch them.
        console.log('close.', seperatorIndexes);
        return;
      }

      if (currentPath.includes(resId)) {
        // this check is only necessary when it is not open.
        // 2do or elsewhere in resInfo
        dispatch(
          addAlert({
            message: `<p>You are <strong>already</strong> working within <strong>${notebooks.byId[notebookId].title}</strong>.</p>`,
            type: 'info'
          })
        );
        console.log('dont open. dont do nothing.');
        return;
      }

      // OPEN: (and possibly close elsewhere.)

      // check whether it is open before
      if (Object.keys(allPaths).includes(resId)) {
        seperatorIndexes = {
          begin: allPaths[resId].begin,
          end: allPaths[resId].end
        };
      } else {
        // search whether resource is open after
        let deltaSearchIndex = deltaIndex;
        while (deltaSearchIndex < delta.ops.length) {
          if (
            delta.ops[deltaIndex].attributes &&
            delta.ops[deltaIndex].attributes.embedSeperator
          ) {
            if (
              (delta.ops[deltaIndex].attributes.embedSeperator.case = 'begin')
            ) {
              allPaths[
                delta.ops[deltaIndex].attributes.embedSeperator.resId
              ] = { begin: deltaIndex };
            } else {
              allPaths[
                delta.ops[deltaIndex].attributes.embedSeperator.resId
              ].end = deltaIndex;
            }
          }
          deltaSearchIndex++;
        }

        if (Object.keys(allPaths).includes(resId)) {
          seperatorIndexes.begin = {
            begin: allPaths[resId].begin,
            end: allPaths[resId].end
          };
        }
      }

      // open resource
      // update change
      console.log('open! close:', closeIndexes);
      const deltaAfterClick = {
        ops: [
          { delete: length },
          ...(closeIndexes && closeIndexes.begin < deltaIndex
            ? [
                ...delta.ops.slice(0, closeIndexes.begin),
                ...delta.ops.slice(closeIndexes.end + 1, deltaIndex + 1)
              ]
            : delta.ops.slice(0, deltaIndex + 1)),
          ...(dontOpen
            ? []
            : [
                {
                  insert: ' \n',
                  attributes: {
                    embedSeperator: {
                      case: 'begin',
                      embedType: resType,
                      resId: resId,
                      resInfo: resInfo,
                      isOpen: true
                    }
                  }
                },
                ...deltaToEmbed.ops,
                {
                  insert: ' ', //2do issued here. block format somehow need to be escaped
                  attributes: {
                    embedSeperator: {
                      case: 'end',
                      embedType: resType,
                      resId: resId,
                      resInfo: resInfo,
                      isOpen: true
                    }
                  }
                }
              ]),
          ...(closeIndexes && closeIndexes.begin > deltaIndex
            ? [
                ...delta.ops.slice(deltaIndex + 1, closeIndexes.begin - 1),
                ...delta.ops.slice(closeIndexes.end + 1, delta.ops.length)
              ]
            : delta.ops.slice(deltaIndex + 1, delta.ops.length))
        ]
      };
      editor.updateContents(deltaAfterClick);

      // // 2do updated embed Path with the change:
      // // either remove it or add it.
      // // shall children always collapsed.
      // // 2do: call a timeout and then add bar next to text
      return;
    }
    if (e.target.className.includes('ql-mention-denotation-char')) {
      const mentionId = e.target.parentElement.parentElement.dataset.id.split(
        '_'
      )[0];
      console.log(mentionId);
      if (user.textIds.includes(mentionId)) {
        console.log('loadtext');
        dispatch(
          loadText({
            textId: mentionId,
            openText: true,
            setToActive: true,
            history: history
          })
        );
      } else if (user.notebookIds.includes(mentionId)) {
        console.log('load notebokk');
        dispatch(
          loadNotebooks({
            notebookIds: [mentionId],
            open: true,
            setToActive: mentionId,
            history: history
          })
        );
      } else if (Object.keys(sections.byId).includes(mentionId)) {
        console.log('load text section');
        dispatch(
          loadText({
            textId: sections.byId[mentionId].textId,
            openText: true,
            setToActive: true,
            history: history
          })
        );
        dispatch(setCommittedSections([mentionId], false));
        dispatch(setTentativeSections([mentionId], false));
      }
    }
    if (!e.target.className.includes('QuillEditorAnnotation')) return;
    dispatch(
      loadText({
        textId: e.target.dataset.textId,
        openText: true,
        setToActive: true,
        history: history
      })
    );
    // console.log('about ot set committed.....', e.target.dataset);
    dispatch(setCommittedSections([e.target.dataset.sectionId], false));
    dispatch(setTentativeSections([e.target.dataset.sectionId], false));
  };

  // clickhandler for section blots // remove or replace with embed clickhandler
  useEffect(() => {
    document
      .getElementById(`notebookCardBody${notebookId}`)
      .addEventListener('click', clickHandler);

    return () => {
      document
        .getElementById(`notebookCardBody${notebookId}`)
        .removeEventListener('click', clickHandler);
    };
  }, [notebookId, user.textIds, user.notebookIds]);

  // navline //only DOM manipulation, no render trigger
  useEffect(() => {
    if (!quillNotebookRefs.current[notebookId]) return;
    console.log('updateNavline');
    const cardBody = document.getElementById(`notebookCardBody${notebookId}`);
    // delete navlines and replace them with new ones
    Array.from(cardBody.querySelectorAll('.navline')).forEach(navline =>
      navline.remove()
    );

    let index = 0; // understand nested hierachy to chose colors

    // add navline for whole
    const cardBodyRect = cardBody.firstElementChild.getBoundingClientRect();
    const [parentPadding, extendTop, extendBottom] = [16 * 1.25, 14, 14];
    const { top, bottom } = cardBodyRect;
    const navline = document.createElement('div');
    navline.className = `navline navline-${index}`;
    navline.id = 'navline_scroll_' + notebookId;
    navline.dataset.resInfo = 'none_none_none';
    navline.style = `height: ${
      cardBodyRect.height + 2 * parentPadding
    }px; left:${cardBodyRect.width + 9}px; top:${top - cardBodyRect.top}px;`;
    cardBody.appendChild(navline);

    const seperators = Array.from(cardBody.querySelectorAll('.embedSeperator'));
    seperators.forEach(seperator => {
      if (seperator.dataset.case === 'end') return;
      const endIndex = seperators.findIndex(
        el =>
          el.dataset.resInfo === seperator.dataset.resInfo &&
          el.dataset.case === 'end'
      );
      if (endIndex < 0) return;
      index += 1;
      const { top } = seperator.getBoundingClientRect();
      const { bottom } = seperators[endIndex].getBoundingClientRect();
      const navline = document.createElement('div');
      navline.className = `navline navline-${index}`;
      navline.id = 'navline_' + seperator.dataset.resInfo;
      navline.dataset.resInfo = seperator.dataset.resInfo;
      navline.style = `height: ${
        bottom - top + extendTop + extendBottom
      }px; left:${cardBodyRect.width + 9}px; top:${
        top - cardBodyRect.top + parentPadding - extendTop //add parent padding
      }px;`;
      cardBody.appendChild(navline);
      index = index === 6 ? 0 : index;
    });
    return () => {};
  }, [
    changedEditorCounter,
    notebooks.byId[notebookId].embedPath,
    mdNotebooksPanel
  ]);

  // update atValues // possible more efficient to integrate in redux store
  useEffect(() => {
    const currentKeys = [
      ...Object.keys(texts.byId),
      ...Object.keys(notebooks.byId),
      ...Object.keys(sections.byId)
    ];
    if (
      currentKeys.length === atKeysRef.current &&
      !currentKeys.some(key => !atKeysRef.current.includes(key))
    )
      return;

    atKeysRef.current = currentKeys;
    setAtValues(atValuesCreator(texts.byId, notebooks.byId, sections.byId));

    return () => {};
  }, [texts.byId, sections.byId, notebooks.byId]);

  if (!notebook) return <></>;
  return (
    <div className='card-body'>
      <div id={`notebookCardBody${notebookId}`} style={{ height: '100%' }}>
        {/* <NotebooksToolbar /> */}
        <ReactQuill
          ref={setNotebookRef}
          onChange={onChangeHandler}
          defaultValue={quillValue}
          theme='bubble'
          modules={{
            //'#notebooksToolbar'
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              // [{ size: ['small', false, 'large'] }],
              ['bold', 'italic', 'underline', 'annotation'],
              [{ color: [] }, { background: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ align: [] }]
            ],
            history: {
              delay: 1000,
              maxStack: 100
            },
            mention: mentionModule
          }}
          placeholder='Add your notes...'
          sanitize='true'
        />
      </div>
      {/* <span>Spinner or check saved</span> */}
    </div>
  );
};

export default NotebookPanel;
