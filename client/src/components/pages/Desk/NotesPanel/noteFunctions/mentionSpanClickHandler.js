import {
  mentionIdIsOpen,
  extractAtValueResId,
  extractAtValueResType
} from '../../../../Metapanel/mentionModule';
import openResClick from './openResClick';
import embedOpen from './embedOpen';
import embedClose from './embedClose';

const mentionSpanClickHandler = (e, g) => {
  const resInfo =
    e.target.dataset.id ||
    e.target.parentElement.dataset.id ||
    e.target.parentElement.parentElement.dataset.id;

  const resId = extractAtValueResId(resInfo);
  const resType = extractAtValueResType(resInfo);
  if (resType !== 'note') return openResClick(resId, resType, g);

  // if (according to resInfo) embed is open then close it, if not open embed
  if (mentionIdIsOpen(resInfo)) return embedClose(resInfo, g);
  embedOpen(resInfo, g);
};
export default mentionSpanClickHandler;
