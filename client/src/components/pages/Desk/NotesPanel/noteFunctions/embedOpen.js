import {
  extractAtValueResId,
  extractAtValueResType,
  updateMentionIdOpenStatus,
  mentionIdIsOpen
} from '../../../../Metapanel/mentionModule';
import embedSeperatorCreator from './embedSeperatorCreator';
import alreadyInsideRes from './alreadyInsideRes';
import preProcessDelta from './preProcessDelta';
import returnDeltaToEmbed from './returnDeltaToEmbed';

const isMentionResInfo = (op, resInfo) =>
  op.insert && op.insert.mention && op.insert.mention.id === resInfo
    ? true
    : false;

const embedOpen = (resInfo, g) => {
  const { noteId, notes, quillNoteRef, deltaRef, dispatch } = g.current;

  // 0 defining variables
  const resType = extractAtValueResType(resInfo),
    resId = extractAtValueResId(resInfo);
  let dontOpen, closeIndexes;
  const editor = quillNoteRef.current.editor;
  const delta = editor.getContents();

  // 0.0 check whether delta to embed is already loaded - if not load

  // check where clicked at (and other operations?)
  console.log('mentionSpanClickHandler: delta:\n', delta);
  const flexPath = [noteId],
    currentPath = [noteId],
    allPaths = {
      [noteId]: { begin: 0, embeds: [], end: delta.ops.length, nestLevel: -1 }
    };
  // colorPath: => nestLevel: 0,1,2,3,4,5,6,7,8,9
  const selection = editor.getSelection();
  if (!selection) return; // 2do check whether this early return is okay: //2do if embed is unique then its not okay.
  let deltaPosition = 0,
    deltaIndex = -1;

  //  here we can manipulate the color of the embeds
  // within for Each:
  //    1: defines deltaIndex = if(deltaPosition === selection.index)
  //    2: currentPath (until mention) to check whether already working within resource
  //    3: flexPath equals currentPath but continues afer mention
  //    flexpath can determine nestLevel!
  const arrIndexes = []; // 2do remove this. only purpose is to console log its result.
  let deltaOpPosition;

  delta.ops.forEach((op, index) => {
    if (op.insert && op.insert.mention) {
      // tries to open any closes embed of id
      if (mentionIdIsOpen(op.insert.mention.id))
        op.insert.mention.id = updateMentionIdOpenStatus(
          op.insert.mention.id,
          `color_class-${flexPath.length - 1}`
        );
    } else if (op.attributes && op.attributes.embedSeperator) {
      const sep = op.attributes.embedSeperator;
      const resId = sep.resId;
      // update embed color_class
      const nestLevel = flexPath.length - 1 - (sep.case === 'end');
      sep.resInfo = updateMentionIdOpenStatus(
        sep.resInfo,
        `color_class-${nestLevel}`
      );
      sep.color_class = `color_class-${nestLevel}`;

      if (sep.case === 'begin') {
        allPaths[flexPath[flexPath.length - 1]].embeds.push(resId);
        allPaths[resId] = {
          begin: index,
          embeds: [],
          nestLevel: nestLevel
        };
        flexPath.push(resId);
        if (deltaPosition < selection.index) {
          currentPath.push(resId);
          console.log('new currentPath:', flexPath);
        }
      } else {
        allPaths[resId].end = index;
        flexPath.pop();
        if (deltaPosition < selection.index) {
          currentPath.pop();
          console.log('new currentPath:', flexPath);
        }
      }
    }
    // Problem many times the position is not registered correctly
    // irregularities arising from previous selection index and (nested) formatting
    deltaPosition += op.insert.length || 1;
    arrIndexes.push({ [deltaPosition]: { l: op.insert.length || 1, ...op } });
    if (deltaPosition < selection.index) {
      deltaOpPosition = deltaPosition;
      deltaIndex = index + 0;
    } else if (deltaPosition === selection.index) {
      deltaOpPosition = deltaPosition;

      deltaIndex = isMentionResInfo(delta.ops[index + 2], resInfo)
        ? index + 2
        : isMentionResInfo(delta.ops[index + 1], resInfo)
        ? index + 1
        : isMentionResInfo(delta.ops[index + 3], resInfo)
        ? index + 3
        : index + 4; // possible errors due to nested formatting.
      console.log('oC +2');
    }
  });

  // problematic when embed is open afterwards
  console.log(
    'oC deltaIndex',
    deltaIndex,
    'selection.index',
    selection.index,
    arrIndexes
  );
  console.log(
    'oC',
    selection.index,
    deltaOpPosition,
    selection.index - deltaOpPosition // 1  ok // 0 when not okay.
  );
  if (deltaPosition !== editor.getLength())
    alert('character count doesnt match', deltaPosition, editor.getLength());
  console.log('deltaIndex', deltaIndex, 'currentPath', currentPath);
  console.log('d-1', delta.ops[deltaIndex - 1]);
  console.log('d-0', delta.ops[deltaIndex - 0]);
  console.log('d+1', delta.ops[deltaIndex + 1]);
  console.log('d+2', delta.ops[deltaIndex + 2]);

  // THROW ERROR WHEN SELECTION BUGGED OUT
  if (
    !delta.ops[deltaIndex] ||
    !delta.ops[deltaIndex].insert ||
    !delta.ops[deltaIndex].insert.mention ||
    extractAtValueResId(delta.ops[deltaIndex].insert.mention.id) !== resId
  ) {
    console.log(
      selection,
      editor.getLength(),
      resId,
      deltaIndex,
      delta.ops.map((el, index) => ({ [index]: el }))
    );
    // 2do handle this case: if uncertain where clicked at, then just look for resId_isOpen and close this.
    throw 'selection is not at clicked position. returned out of function';
  }

  // return ALERT - ALREADY OPEN
  if (currentPath.includes(resId)) return alreadyInsideRes(resId, g);

  // define closeIndexes if open elsewhere
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

  // prepare delta to be embeded
  const currentNestLevel = currentPath.length - 1;
  // update mention span
  delta.ops[deltaIndex].insert.mention.id = updateMentionIdOpenStatus(
    resInfo,
    `color_class-${currentNestLevel}`
  );

  let deltaToEmbed;
  if (closeIndexes) {
    deltaToEmbed = {
      ops: delta.ops.slice(closeIndexes.begin + 1, closeIndexes.end)
    };
    if (
      // remove linebreak inherited from embedSeperator
      typeof deltaToEmbed.ops[0].insert === 'string' &&
      deltaToEmbed.ops[0].insert[0] === '\n'
    ) {
      deltaToEmbed.ops[0].insert = deltaToEmbed.ops[0].insert.slice(1);

      // update color class of embed that is now beeing moved - if nestLevel has changed
      if (allPaths[resId].nestLevel !== currentNestLevel) {
        let adjustedLevel = currentNestLevel + 1;
        deltaToEmbed.ops.forEach(op => {
          if (op.insert && op.insert.mention) {
            op.insert.mention.id = updateMentionIdOpenStatus(
              op.insert.mention.id,
              `color_class-${adjustedLevel}`
            );
          } else if (op.attributes && op.attributes.embedSeperator) {
            const sep = op.attributes.embedSeperator;
            console.log('adjustedLevel sep', sep);
            const nestLevel = adjustedLevel - (sep.case === 'end');
            sep.resInfo = updateMentionIdOpenStatus(
              sep.resInfo,
              `color_class-${nestLevel}`
            );
            sep.color_class = `color_class-${nestLevel}`;
            if (sep.case === 'begin') {
              console.log('adjustedLevel', adjustedLevel, '+1');
              adjustedLevel++;
            } else {
              console.log('adjustedLevel', adjustedLevel, '-1');
              adjustedLevel--;
            }
          }
        });
      }
    }
  } else {
    deltaToEmbed = returnDeltaToEmbed(resId, g);
    if (!deltaToEmbed) {
      console.log('no data from promise', deltaToEmbed);
      return;
    }
    // 2do: preprocess this delta
    console.log('currentNestLevel', currentNestLevel);
    deltaToEmbed = preProcessDelta(
      deltaToEmbed,
      11 - currentNestLevel,
      Object.keys(allPaths),
      [...new Array(currentNestLevel + 2)],
      g
    );
  }
  console.log(
    'resId',
    resId,
    'notes',
    notes,
    'notes[resId]',
    notes[resId],
    'deltaToEmbed',
    deltaToEmbed
  );

  // Update Editor contents
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
          embedSeperatorCreator(
            resInfo,
            'begin',
            `color_class-${currentNestLevel}`
          ),
          ...deltaToEmbed.ops,
          embedSeperatorCreator(
            resInfo,
            'end',
            `color_class-${currentNestLevel}`
          )
        ]),
    ...(closeAfter
      ? [
          ...delta.ops.slice(deltaIndex + 1, closeIndexes.begin),
          ...delta.ops.slice(closeIndexes.end + 1, delta.ops.length)
        ]
      : delta.ops.slice(deltaIndex + 1, delta.ops.length))
  ];
  editor.updateContents({ ops: [{ delete: editor.getLength() }, ...newOps] });
  deltaRef.current = { ops: newOps };

  // set new selection
  const newSelectionIndex =
    selection.index +
    3 -
    (!!closeBefore
      ? delta.ops
          .slice(closeIndexes.begin, closeIndexes.end + 1)
          .reduce((a, b) => a + ((b.insert && b.insert.length) || 1), 0)
      : 0);
  editor.setSelection(newSelectionIndex);
};
export default embedOpen;

// 1. decide case
// const indexesOfResIdMentions = delta.ops.flatMap((op, index) =>
//   op.insert && op.insert.mention && op.insert.mention.id === resInfo
//     ? [index]
//     : []
// );
// const embedIsUnique = indexesOfResIdMentions.length === 1;

// const indexesOfResIdEmbedBegins = embedIsUnique
//   ? []
//   : delta.ops.flatMap((op, index) =>
//       op.attributes &&
//       op.attributes.embedSeperator &&
//       op.attributes &&
//       op.attributes.embedSeperator.resInfo === resInfo
//         ? [index]
//         : []
//     );

// const embedIsOpenElsewhere = indexesOfResIdEmbedBegins.length > 0;

// // simplify function: unique embed should return newDelta
// // early return
// if (noteId === resId) return alreadyInsideRes(resId, g);
// if (embedIsUnique) {
//   // insert embeds via splice & update mention
// } else if (!embedIsUnique) {
//   //    check where clicked at  which one shall be opened
//   if (!embedIsOpenElsewhere) {
//     // insert embeds via splice (at found position) & update mention
//   } else {
//     // check whether alreadyInsideRes
//   }
// }
