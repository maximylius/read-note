import {
  extractAtValueResType,
  extractAtValueResId,
  updateMentionIdOpenStatus,
  mentionIdIsOpen,
  mentionColorClass
} from '../../../../Metapanel/mentionModule';
import embedSeperatorCreator from './embedSeperatorCreator';
import returnDeltaToEmbed from './returnDeltaToEmbed';
// ok

const preProcessDelta = (delta, maxDepth, allEmbeds, colorPath, g) => {
  console.log('preProcessDelta maxDepth', maxDepth);
  const { notes, texts, sections } = g.current;
  // if (maxDepth === 0) return delta;
  if (!colorPath) colorPath = [0];
  const preProcessedOps = delta.ops.flatMap(op => {
    if (!op.insert || !op.insert.mention) return op;
    const resType = extractAtValueResType(op.insert.mention.id);
    const resId = extractAtValueResId(op.insert.mention.id);
    if (resType === 'note') {
      if (notes[resId]) {
        op.insert.mention.value = notes[resId].title;

        if (mentionIdIsOpen(op.insert.mention.id)) {
          if (allEmbeds.includes(resId) || maxDepth === 0) {
            console.log(
              'preProcess',
              allEmbeds.includes(resId),
              maxDepth === 0
            );
            op.insert.mention.id = updateMentionIdOpenStatus(
              op.insert.mention.id,
              `false`
            );
            return [op];
          }

          let deltaToEmbed = returnDeltaToEmbed(resId, g);
          console.log('preProcess deltaToEmbed', deltaToEmbed);
          if (!deltaToEmbed) {
            op.insert.mention.id = updateMentionIdOpenStatus(
              op.insert.mention.id,
              `false`
            );
            return [op];
          }

          // if delta to embed is found, embed it
          allEmbeds.push(resId);
          op.insert.mention.id = updateMentionIdOpenStatus(
            op.insert.mention.id,
            `color_class-${colorPath.length - 1}`
          );
          const embedDelta = preProcessDelta(
            deltaToEmbed,
            maxDepth - 1,
            allEmbeds,
            [...colorPath, 0],
            g
          );
          colorPath[colorPath.length - 1] += 1;
          return [
            op, //add cp
            embedSeperatorCreator(
              op.insert.mention.id,
              'begin',
              mentionColorClass(op.insert.mention.id)
            ),
            ...embedDelta.ops,
            embedSeperatorCreator(
              op.insert.mention.id,
              'end',
              mentionColorClass(op.insert.mention.id)
            )
          ];
        }
        return [op];
      } else {
        return [op];
      }
    } else if (resType === 'text') {
      if (texts[resId]) {
        op.insert.mention.value = texts[resId].title;
      }
      return [op];
    } else if (resType === 'section') {
      const textId = extractAtValueResId(op.insert.mention.id, 'textId');
      if (texts[textId] && sections[resId].title) {
        op.insert.mention.value =
          texts[textId].title + ' - ' + sections[resId].title;
      }
      return [op];
    }
    console.log('ERROR: UNKOWN MENTION-TYPE', resType, resId, op);
    return [op];
  });
  // 2do: add color_class?
  return { ops: preProcessedOps };
};

export default preProcessDelta;
