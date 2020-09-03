// ok

const selectionChangeHandler = (range, source, editorInstance, g) => {
  const {
    window,
    noteId,
    addBubble,
    setAddBubble,
    selectionIndexRef,
    quillNoteRef
  } = g.current;
  console.log(range);
  const selectionIncreased = range && range.index > selectionIndexRef.current;
  selectionIndexRef.current = range && range.index;
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
    console.log('scrollAtPos', scrollAtPos);
    const scrollClassList = [...(scrollAtPos.domNode.classList || [])];
    const anchorOffset = window.getSelection().anchorOffset;
    const offsetSelection = (pos, neg) => {
      const newIndex = range.index + (selectionIncreased ? pos : -neg);
      const newLength =
        range.length && range.length + (selectionIncreased ? -pos : neg);
      editor.setSelection(newIndex, newLength);
    };
    if (
      // if directly after mention tag push away
      scrollAtPos.domNode.tagName === 'SPAN' &&
      scrollClassList.includes('mention') &&
      anchorOffset === 1
    ) {
      offsetSelection(2, 1);
      return;
    }
    if (
      // if directly at embed seperator push away
      scrollAtPos.domNode.tagName === 'HR' &&
      scrollClassList.includes('embedSeperator')
    ) {
      if (scrollClassList.includes('case-begin')) {
        offsetSelection(1, 2);
      } else if (scrollClassList.includes('case-end')) {
        offsetSelection(1 + 1 - anchorOffset, 1 + anchorOffset);
      }
      return;
    }

    // if at BR consider allowing new note embed
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

  // runs if range.length > 0
  // check whether selection could be transformed into new note.
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

  console.log(
    'selectionChangeHandler',
    opBegin,
    opEnd,
    delta.ops,
    allowNewNote
  );

  //     let selectedOps =
};
export default selectionChangeHandler;
