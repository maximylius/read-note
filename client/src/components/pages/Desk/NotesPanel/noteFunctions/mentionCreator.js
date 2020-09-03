// ok

const mentionCreator = (resType, resId, value, color_class) => {
  return {
    insert: {
      //DOMStringMap // is this a problem without domstring attribute?
      mention: {
        denotationChar: '@',
        id: `${resType}=${resId}_isOpen=${color_class}`,
        index: '0',
        value: value || 'New note...'
      }
    }
  };
};
export default mentionCreator;
