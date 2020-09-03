import {
  extractAtValueResId,
  extractAtValueResType
} from '../../../../Metapanel/mentionModule';
// ok

const getNotesPath = (delta, mainNoteId) => {
  const notesConnectedWith = {},
    nestPath = [mainNoteId];
  const displayedNotes = {
    [mainNoteId]: { begin: 0, end: delta.ops.length - 1, embeds: [] }
  };
  delta.ops.forEach((op, opIndex) => {
    if (op.insert && op.insert.mention) {
      const resId = extractAtValueResId(op.insert.mention.id);
      const resType = extractAtValueResType(op.insert.mention.id);
      if (!notesConnectedWith[nestPath[nestPath.length - 1]])
        notesConnectedWith[nestPath[nestPath.length - 1]] = [];

      notesConnectedWith[nestPath[nestPath.length - 1]].push({
        resId,
        resType
      });
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
export default getNotesPath;
