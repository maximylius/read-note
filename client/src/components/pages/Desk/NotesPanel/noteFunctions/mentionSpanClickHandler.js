import {
  extractAtValueResId,
  extractAtValueResType,
  updateMentionIdOpenStatus
} from '../../../../Metapanel/mentionModule';
import handleEditorChange from './handleEditorChange';
import embedSeperatorCreator from './embedSeperatorCreator';
// ok

const mentionSpanClickHandler = (e, g) => {
  const {
    noteId,
    history,
    sections,
    notesRef,
    quillNoteRef,
    deltaRef,
    dispatch,
    loadText,
    setCommittedSections,
    setTentativeSections,
    addAlert
  } = g.current;
  const editor = quillNoteRef.current.editor;
  const notes = notesRef.current;
  // what about ref // can it be passed in?
  const resInfo =
    e.target.dataset.id ||
    e.target.parentElement.dataset.id ||
    e.target.parentElement.parentElement.dataset.id;
  console.log(resInfo);
  let dontOpen, closeIndexes;
  const resType = extractAtValueResType(resInfo);
  const resId = extractAtValueResId(resInfo);
  if (resType !== 'note') {
    if (resType === 'section') {
      dispatch(
        loadText({
          textId: sections[resId].textId,
          openText: true,
          setToActive: true,
          history: history
        })
      );
      dispatch(setCommittedSections([resId], false));
      dispatch(setTentativeSections([resId], false));
    } else if (resType === 'text') {
      dispatch(
        loadText({
          textId: resId,
          openText: true,
          setToActive: true,
          history: history
        })
      );
    }
    return;
  }
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
  const selection = editor.getSelection();
  if (!selection) return; // 2do check whether this early return is okay: //2do if embed is unique then its not okay.
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
    throw new Error('error: embeds not closed propperly', allPaths, delta.ops);

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
  ) {
    // 2do handle this case: if uncertain where clicked at, then just look for resId_isOpen and close this.
    throw 'selection is not at clicked position. returned out of function';
  }

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
    const newOps = [...delta.ops.slice(0, begin), ...delta.ops.slice(end + 1)];
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
export default mentionSpanClickHandler;
