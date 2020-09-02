export default handleEditorChange = (state, store) => {
  const { quillNoteRef, noteId, savedRef } = state;
  const { dispatch, updateNote } = store;
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
  noteUpdateArray.forEach(noteUpdateObj => dispatch(updateNote(noteUpdateObj)));
  savedRef.current = Date.now();
  return;
};
