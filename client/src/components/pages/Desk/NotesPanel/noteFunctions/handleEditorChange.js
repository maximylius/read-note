import compareDisplayedNotesDelta from './compareDisplayedNotesDelta';
import getNotesPath from './getNotesPath';
// ok

// check which notes to update.
// if update: update connectedWith for the note(s).
const handleEditorChange = g => {
  const { quillNoteRef, noteId, savedRef, dispatch, updateNote } = g.current;
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
    g
  );
  console.log('noteUpdateArray', noteUpdateArray);
  noteUpdateArray.forEach(noteUpdateObj => dispatch(updateNote(noteUpdateObj)));
  savedRef.current = Date.now();
  return;
};
export default handleEditorChange;
