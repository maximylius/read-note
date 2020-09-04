import {
  extractAtValueResType,
  extractAtValueResId
} from '../../../../Metapanel/mentionModule';
import openResClick from './openResClick';
// ok

const mentionCharClickHandler = (e, g) => {
  const resInfo = e.target.parentElement.parentElement.dataset.id;
  const resId = extractAtValueResId(resInfo);
  const resType = extractAtValueResType(resInfo);
  console.log(resId);
  openResClick(resId, resType, g);
};
export default mentionCharClickHandler;
