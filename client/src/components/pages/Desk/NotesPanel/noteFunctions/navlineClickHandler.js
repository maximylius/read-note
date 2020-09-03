import handleEditorChange from './handleEditorChange';
import { updateMentionIdOpenStatus } from '../../../../Metapanel/mentionModule';
// ok

const navlineClickHandler = (e, g) => {
  const { quillNoteRef, deltaRef } = g.current;
  const editor = quillNoteRef.current.editor;
  const resInfo = e.target.dataset.resInfo;
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
  if (begin < 0 || end < 0) throw 'embed doesnt exist';
  delta.ops[begin - 1].insert.mention.id = updateMentionIdOpenStatus(
    delta.ops[begin - 1].insert.mention.id,
    'false'
  ); // close mention
  handleEditorChange(g); //2do check whether closed embeds or "grandchild" embeds need update
  const newOps = [
    { delete: editor.getLength() },
    ...delta.ops.slice(0, begin),
    ...delta.ops.slice(end + 1)
  ];
  editor.updateContents({
    ops: newOps
  });
  deltaRef.current = {
    ops: [...delta.ops.slice(0, begin), ...delta.ops.slice(end + 1)]
  };
};

export default navlineClickHandler;
