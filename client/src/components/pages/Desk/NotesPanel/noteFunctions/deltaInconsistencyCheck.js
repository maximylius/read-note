import { extractAtValueResId } from '../../../../Metapanel/mentionModule';
// ok

const deltaInconsistencyCheck = (delta, noteId) => {
  let isInconsistent = false,
    allEmbedSeperators = [],
    currentPath = [noteId];

  isInconsistent = delta.ops.some((op, index) => {
    if (!op.attributes) return false;
    if (!op.attributes.embedSeperator) return false;
    const resInfo = op.attributes.embedSeperator.resInfo;
    const prevOp = delta.ops[index - 1];
    if (!prevOp) {
      console.log('!prevOp', prevOp, index);
      return true;
    }
    if (op.attributes.embedSeperator.case === 'begin') {
      if (
        !prevOp.insert ||
        !prevOp.insert.mention ||
        extractAtValueResId(prevOp.insert.mention.id) !==
          extractAtValueResId(resInfo)
      ) {
        console.log(
          'preOp not mention',
          prevOp,
          'resInfo',
          resInfo,
          'op',
          op,
          'ops',
          delta.ops
        );
        return true;
      } //opening must be after mention
      if (allEmbedSeperators.includes(resInfo)) return true;
      allEmbedSeperators.push(resInfo);
      currentPath.push(resInfo);
      return false;
    } else {
      if (currentPath[currentPath.length - 1] !== resInfo) {
        console.log(1);
        return true;
      }
      currentPath.pop();
      if (prevOp.insert[prevOp.insert.length - 1] !== '\n') return true; // last linebreak of note needs to be preserved.
      return false;
    }
  });
  // check whether there are still unclosed embeds:
  if (currentPath.length !== 1 || currentPath[0] !== noteId)
    isInconsistent = false;

  return isInconsistent;
};
export default deltaInconsistencyCheck;
