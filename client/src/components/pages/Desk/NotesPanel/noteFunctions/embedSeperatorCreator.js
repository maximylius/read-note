// ok

const embedSeperatorCreator = (
  resType,
  resId,
  resInfo,
  beginEnd,
  color_class
) => {
  return {
    insert: beginEnd === 'begin' ? ' \n' : ' ',
    attributes: {
      embedSeperator: {
        case: beginEnd,
        embedType: resType,
        resId: resId,
        resInfo: resInfo,
        color_class: color_class || 'willBeAssignedBelow'
      }
    }
  };
};
export default embedSeperatorCreator;
