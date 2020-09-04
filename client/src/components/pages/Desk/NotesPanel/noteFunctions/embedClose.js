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
  const begin = delta.ops.findIndex(
    op =>
      op.attributes &&
      op.attributes.embedSeperator &&
      op.attributes.embedSeperator.resInfo === resInfo &&
      op.attributes.embedSeperator.case === 'begin'
  );
  const end =
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
  if (begin < 0 || end - begin <= 0) {
    if (begin + end > -1) throw 'inconsistent emebed!';
    // call open embed here.
  }
  // modify op to close mention
  delta.ops[begin - 1].insert.mention.id = updateMentionIdOpenStatus(
    delta.ops[begin - 1].insert.mention.id,
    'false'
  );

  // do check whether closed embeds or "grandchild" embeds need update
  handleEditorChange(g);

  // compose newOps
  const newOps = [...delta.ops.slice(0, begin), ...delta.ops.slice(end + 1)];
  editor.updateContents({
    ops: [{ delete: editor.getLength() }, ...newOps]
  });
  deltaRef.current = { ops: newOps };
  editor.setSelection(begin);

  setTimeout(() => {
    setEmbedClickCounter(prevState => prevState + 1);
  }, 10);
  if (informParentAboutChange)
    setTimeout(() => {
      informParentAboutChange();
    }, 200);
};
export default embedClose;
