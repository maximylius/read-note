import {
  extractAtValueResId,
  extractAtValueResType,
  updateMentionIdOpenStatus
} from '../../../../Metapanel/mentionModule';

const embedSeperatorCreator = (resInfo, beginEnd, color_class) => {
  const resId = extractAtValueResId(resInfo);
  const resType = extractAtValueResType(resInfo);

  return {
    insert: beginEnd === 'begin' ? ' \n' : ' ',
    attributes: {
      embedSeperator: {
        case: beginEnd,
        embedType: resType,
        resId: resId,
        resInfo: color_class
          ? updateMentionIdOpenStatus(resInfo, color_class)
          : resInfo,
        color_class: color_class || 'willBeAssignedBelow'
      }
    }
  };
};
export default embedSeperatorCreator;
