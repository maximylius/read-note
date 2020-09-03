import deltaInconsistencyCheck from './deltaInconsistencyCheck';
// ok

const onChangeHandler = (__HTML, changeDelta, source, editor, g) => {
  if (source === 'api') {
    // console.log('api change....');
    return;
  }
  const {
    noteId,
    quillNoteRef,
    deltaRef,
    addAlert,
    dispatch,
    setChangedEditorCounter,
    informParentAboutChange
  } = g.current;
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
export default onChangeHandler;
