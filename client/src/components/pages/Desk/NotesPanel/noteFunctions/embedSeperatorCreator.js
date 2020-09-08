import {
  extractAtValueResId,
  extractAtValueResType,
  updateMentionIdOpenStatus
} from '../../../../Metapanel/mentionModule';

// check whether embed seperator could be simplified into purely resInfo

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
