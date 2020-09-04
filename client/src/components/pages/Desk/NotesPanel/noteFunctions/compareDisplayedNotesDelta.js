import _isEqual from 'lodash/isEqual';
// ok

const compareDisplayedNotesDelta = (
  delta,
  displayedNotes,
  notesConnectedWith,
  g
) => {
  const { notes } = g.current;

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
export default compareDisplayedNotesDelta;
