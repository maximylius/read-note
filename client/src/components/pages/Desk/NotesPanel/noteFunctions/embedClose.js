import handleEditorChange from './handleEditorChange';
import { updateMentionIdOpenStatus } from '../../../../Metapanel/mentionModule';

const embedClose = (resInfo, g) => {
  const {
    quillNoteRef,
    deltaRef,
    informParentAboutChange,
    setEmbedClickCounter
  } = g.current;
  console.log('resInfo', resInfo);
  const editor = quillNoteRef.current.editor;
  const delta = editor.getContents();

  // check if embed is open and if so at which indexes.
  let begin = delta.ops.findIndex(
    op =>
      op.attributes &&
      op.attributes.embedSeperator &&
      op.attributes.embedSeperator.resInfo === resInfo &&
      op.attributes.embedSeperator.case === 'begin'
  );
  let end =
    begin +
    delta.ops
      .slice(begin)
      .findIndex(
        op =>
          op.attributes &&
          op.attributes.embedSeperator &&
          op.attributes.embedSeperator.resInfo === resInfo &&
          op.attributes.embedSeperator.case === 'end'
      );
  console.log(begin, end, delta.ops);
  const noBegin = begin < 0,
    noEnd = end - begin <= 0;

  // define new ops
  let newOps,
    newSelectionIndex = 0,
    foundSelectionIndex = false;
  // if not emebeded only update mention span and new selection
  if (noBegin && noEnd) {
    // update mention and find new selectionIndex
    newOps = delta.ops.map((op, index) => {
      if (!foundSelectionIndex) {
        newSelectionIndex += op.insert.length || 1;
      }
      if (op.insert && op.insert.mention && op.insert.mention.id === resInfo) {
        op.insert.mention.id = updateMentionIdOpenStatus(
          op.insert.mention.id,
          'false'
        );
        foundSelectionIndex = true;
      }
      return op;
    });
  } else if (noBegin || noEnd) {
    throw 'inconsistent emebed!';
  } else {
    // update mention span, close embeds and set new selection.index

    // modify op to close mention
    delta.ops[begin - 1].insert.mention.id = updateMentionIdOpenStatus(
      delta.ops[begin - 1].insert.mention.id,
      'false'
    );
    // do check whether closed embeds or "grandchild" embeds need update
    handleEditorChange(g);
    // compose newOps
    newOps = [...delta.ops.slice(0, begin), ...delta.ops.slice(end + 1)];
    newSelectionIndex = delta.ops
      .slice(0, begin)
      .reduce((a, b) => a + (b.insert.length || 1), 0);
  }

  // update editor and set selection
  editor.updateContents({
    ops: [{ delete: editor.getLength() }, ...newOps]
  });
  deltaRef.current = { ops: newOps };
  editor.setSelection(newSelectionIndex); // should set seltion index not op index

  setTimeout(() => {
    setEmbedClickCounter(prevState => prevState + 1);
  }, 10);
  if (informParentAboutChange)
    setTimeout(() => {
      informParentAboutChange();
    }, 200);
};
export default embedClose;
