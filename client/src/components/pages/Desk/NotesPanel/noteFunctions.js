import _isEqual from 'lodash/isEqual';
import {
  mentionModuleCreator,
  atValuesCreator,
  extractAtValueResType,
  extractAtValueResId,
  updateMentionIdOpenStatus,
  mentionIdIsOpen,
  mentionColorClass
} from '../../../Metapanel/mentionModule';

export const classNameIncludes = (className, checkFor) => {
  if (typeof className !== 'string') return false;
  return className.includes(checkFor);
};

export const embedSeperatorCreator = (
  resType,
  resId,
  resInfo,
  beginEnd,
  color_class
) => {
  return {
    insert: beginEnd === 'begin' ? ' \n' : ' ',
    attributes: {
      embedSeperator: {
        case: beginEnd,
        embedType: resType,
        resId: resId,
        resInfo: resInfo,
        color_class: color_class || 'willBeAssignedBelow'
      }
    }
  };
};

export const preProcessDelta = (
  delta,
  notes,
  texts,
  sections,
  maxDepth,
  allEmbeds,
  colorPath
) => {
  if (maxDepth === 0) return delta;
  if (!colorPath) colorPath = [0];
  const preProcessedOps = delta.ops.flatMap(op => {
    if (!op.insert || !op.insert.mention) return op;
    const resType = extractAtValueResType(op.insert.mention.id);
    const resId = extractAtValueResId(op.insert.mention.id);
    if (resType === 'note') {
      if (notes[resId]) {
        op.insert.mention.value = notes[resId].title;

        if (mentionIdIsOpen(op.insert.mention.id)) {
          if (allEmbeds.includes(resId)) return [op];

          allEmbeds.push(resId);
          op.insert.mention.id = updateMentionIdOpenStatus(
            op.insert.mention.id,
            `color_class-${colorPath.join('-')}`
          );

          const embedDelta = preProcessDelta(
            notes[resId].delta,
            notes,
            texts,
            sections,
            maxDepth - 1,
            allEmbeds,
            [...colorPath, 0]
          );
          colorPath[colorPath.length - 1] += 1;
          return [
            op, //add cp
            embedSeperatorCreator(
              resType,
              resId,
              op.insert.mention.id,
              'begin',
              mentionColorClass(op.insert.mention.id)
            ),
            ...embedDelta.ops,
            embedSeperatorCreator(
              resType,
              resId,
              op.insert.mention.id,
              'end',
              mentionColorClass(op.insert.mention.id)
            )
          ];
        }
        return [op];
      } else {
        return [op];
      }
    } else if (resType === 'text') {
      if (texts[resId]) {
        op.insert.mention.value = texts[resId].title;
      }
      return [op];
    } else if (resType === 'section') {
      const textId = extractAtValueResId(op.insert.mention.id, 'textId');
      if (texts[textId] && sections[resId].title) {
        op.insert.mention.value =
          texts[textId].title + ' - ' + sections[resId].title;
      }
      return [op];
    }
    console.log('ERROR: UNKOWN MENTION-TYPE', resType, resId, op);
    return [op];
  });
  // 2do: add color_class?
  return { ops: preProcessedOps };
};

export const getNotesPath = (delta, mainNoteId) => {
  const notesConnectedWith = {},
    nestPath = [mainNoteId];
  const displayedNotes = {
    [mainNoteId]: { begin: 0, end: delta.ops.length - 1, embeds: [] }
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
  return {
    notesConnectedWith,
    displayedNotes
  };
};

export const compareDisplayedNotesDelta = (
  delta,
  displayedNotes,
  notesConnectedWith,
  notes
) => {
  const noteUpdateArray = Object.keys(displayedNotes).flatMap(resId => {
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
    // somehow additional linebreak gets added in front. if so remove.
    if (
      typeof noteOps[0].insert === 'string' &&
      noteOps[0].insert[0] === '\n'
    ) {
      noteOps[0].insert = noteOps[0].insert.slice(1);
    }
    console.log('noteOps', noteOps);
    const savedOps = (notes[resId].delta && notes[resId].delta.ops) || []; //when note is not yet initialized
    // 2do: wrong behaviour when embed is changed: parent is changed also. embed is also changed on first parent change.
    let shouldUpdate =
      noteOps.length !== savedOps.length ||
      noteOps.some((op, i) => {
        // mentions are DOMStringMaps and need to be converted to simple object to enable comparison with plain object from store
        if (!op.insert || !op.insert.mention) return !_isEqual(op, savedOps[i]);
        op.insert.mention = { ...op.insert.mention };
        return !_isEqual(op, savedOps[i]);
      });
    if (shouldUpdate) {
      console.log('will update', notes[resId].title);
      console.log('noteOps', noteOps);
      const notePlainText = noteOps
        .map(op =>
          typeof op.insert === 'string'
            ? op.insert
            : op.insert.mention
            ? op.insert.mention.value
            : ' '
        )
        .join('');
      return [
        {
          _id: resId,
          delta: { ops: noteOps },
          plainText: notePlainText,
          directConnections: notesConnectedWith[resId] || []
        }
      ];
    } else {
      console.log('doesnt need to update', notes[resId].title);
      return [];
    }
  });
  return noteUpdateArray;
};

export const mentionCharClickHandler = (
  e,
  sections,
  dispatch,
  history,
  loadText,
  loadNotes,
  setCommittedSections,
  setTentativeSections
) => {
  const resInfo = e.target.parentElement.parentElement.dataset.id;
  const resId = extractAtValueResId(resInfo);
  const resType = extractAtValueResType(resInfo);
  console.log(resId);
  if (resType === 'text') {
    console.log('loadtext');
    dispatch(
      loadText({
        textId: resId,
        openText: true,
        setToActive: true,
        history: history
      })
    );
  } else if (resType === 'note') {
    console.log('load notebokk');
    dispatch(
      loadNotes({
        noteIds: [resId],
        open: true,
        setToActive: resId,
        history: history
      })
    );
  } else if (resType === 'section') {
    console.log('load text section');
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
  }
};

export const deltaInconsistencyCheck = (delta, noteId) => {
  let isInconsistent = false,
    allEmbedSeperators = [],
    currentPath = [noteId];

  isInconsistent = delta.ops.some((op, index) => {
    if (!op.attributes) return false;
    if (!op.attributes.embedSeperator) return false;
    const resInfo = op.attributes.embedSeperator.resInfo;
    const prevOp = delta.ops[index - 1];
    if (!prevOp) {
      console.log('!prevOp', prevOp, index);
      return true;
    }
    if (op.attributes.embedSeperator.case === 'begin') {
      if (
        !prevOp.insert ||
        !prevOp.insert.mention ||
        extractAtValueResId(prevOp.insert.mention.id) !==
          extractAtValueResId(resInfo)
      ) {
        console.log(
          'preOp not mention',
          prevOp,
          'resInfo',
          resInfo,
          'op',
          op,
          'ops',
          delta.ops
        );
        return true;
      } //opening must be after mention
      if (allEmbedSeperators.includes(resInfo)) return true;
      allEmbedSeperators.push(resInfo);
      currentPath.push(resInfo);
      return false;
    } else {
      if (currentPath[currentPath.length - 1] !== resInfo) {
        console.log(1);
        return true;
      }
      currentPath.pop();
      if (prevOp.insert[prevOp.insert.length - 1] !== '\n') return true; // last linebreak of note needs to be preserved.
      return false;
    }
  });

  isInconsistent = isInconsistent || !_isEqual(currentPath, [noteId]);
  return isInconsistent;
};
