export const extractNumber = (string, index = 0) => {
  const number = parseInt(string.match(/^\d+|\d+\b|\d+(?=\w)/g)[index]);
  return number;
};

export const searchIdUpDOM = (
  e,
  regexpArray = [/^wrd_\d{1,}$/, /^sec_\d{1,}$/]
) => {
  regexpArray = regexpArray instanceof Array ? regexpArray : [regexpArray];
  let target = e.target;
  do {
    let result;
    for (let i = 0; i < regexpArray.length; i++) {
      if (regexpArray[i].test(target.id)) {
        return (result = target);
      }
    }
    if (result) {
      return result;
    }
    target = target.parentElement;
  } while (target);
};

export const filterObjectByKeys = (
  object,
  arrayOfKeysToRemove = [],
  arrayOfKeysToKeep = []
) => {
  if (arrayOfKeysToRemove === null) {
    return Object.keys(object).reduce(
      (result, key) =>
        arrayOfKeysToKeep.includes(key)
          ? { ...result, [key]: object[key] }
          : result,
      {}
    );
  } else if (arrayOfKeysToKeep === null) {
    return Object.keys(object).reduce(
      (result, key) =>
        arrayOfKeysToRemove.includes(key)
          ? result
          : { ...result, [key]: object[key] },
      {}
    );
  } else {
    throw console.error('ERROR in filterObjectByKeys: both supplied...');
  }
};
export const ObjectRemoveKeys = (object, arrayOfKeysToRemove = []) => {
  return Object.keys(object).reduce(
    (result, key) =>
      arrayOfKeysToRemove.includes(key)
        ? result
        : { ...result, [key]: object[key] },
    {}
  );
};
export const ObjectKeepKeys = (object, arrayOfKeysToKeep = []) => {
  return Object.keys(object).reduce(
    (result, key) =>
      arrayOfKeysToKeep.includes(key)
        ? { ...result, [key]: object[key] }
        : result,
    {}
  );
};

export const deepCompare = (x, y) => {
  if (x === y) return true;
  if (!(x instanceof Object) || !(y instanceof Object)) return false;
  if (x.constructor !== y.constructor) return false;
  for (var p in x) {
    if (!x.hasOwnProperty(p)) continue;
    if (!y.hasOwnProperty(p)) return false;
    if (x[p] === y[p]) continue;
    if (typeof x[p] !== 'object') return false;
    if (!Object.equals(x[p], y[p])) return false;
  }
  for (p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
  }
  return true;
};

export const defaultText = () => {
  return {
    divs: [
      {
        textcontent: 'Some span textcontent...',
        div: 'h5',
        bold: false,
        underlined: false,
        strikeThrough: false,
        color: '#000'
      }
    ],
    sectionIds: [],
    ISBN: '',
    url: '',
    title: '',
    author: '',
    language: '',
    keywords: [''],
    publicationDate: '',
    originalText: '',
    created: Date.now(),
    lastEdited: Date.now(),
    editedBy: [],
    accessFor: []
  };
};

export const sortSectionIds = sectionsById => {
  console.log(sectionsById);
  const sectionIds = Object.keys(sectionsById);
  // sort 1. by begin 2. by end
  sectionIds.sort((id1, id2) =>
    Number(sectionsById[id1].begin) > Number(sectionsById[id2].begin)
      ? 1
      : Number(sectionsById[id1].begin) === Number(sectionsById[id2].begin)
      ? Number(sectionsById[id1].end) > Number(sectionsById[id2].end)
        ? 1
        : -1
      : -1
  );
  return sectionIds;
};

export const regExpHistory = (
  currentPath,
  id,
  action = 'open/close',
  type = 'text/notebook'
) => {
  console.log(action, type);
  let nextPath;
  if (type === 'text') {
    if (action === 'open') {
      if (new RegExp(id).test(currentPath)) {
        console.log(1);
        nextPath = currentPath
          .replace(/-1/, '-0')
          .replace(`${id}-0`, `${id}-1`);
      } else if (new RegExp('texts=').test(currentPath)) {
        if (new RegExp('notebooks=').test(currentPath)) {
          nextPath = currentPath
            .replace(/-1/, '-0')
            .replace(/\&notebooks/, `+${id}-1&notebooks`);
        } else {
          nextPath = currentPath.replace(/-1/, '-0').concat(`+${id}-1`);
        }
      } else {
        nextPath = currentPath.replace(/\/desk/, `/desk&texts=${id}-1`);
      }
    } else if (action === 'close') {
      console.log(currentPath);
      nextPath = currentPath
        .replace(new RegExp(`${id}-[01]`), '')
        .replace(/=\+/, '=') //clean seperators
        .replace(/\+\+/, '+') //clean seperators
        .replace(/&texts=$/, '') // replace if nothing left
        .replace(/&texts=&notebooks=/, '&notebooks='); // replace if no texts left
      console.log(nextPath);
    }
  } else if (type === 'notebook') {
    console.log('notebook');
    if (action === 'open') {
      console.log('open');
      if (new RegExp(id).test(currentPath)) {
        nextPath = currentPath
          .replace(/-1(?![\s\S]*-1)/, '-0') // replace last occurence of -1 with -0
          .replace(`${id}-0`, `${id}-1`);
      } else if (new RegExp('notebooks=').test(currentPath)) {
        nextPath = currentPath
          .replace(/-1(?![\s\S]*-1)/, '-0')
          .concat(`+${id}-1`);
      } else {
        nextPath = currentPath.concat(`&notebooks=${id}-1`);
      }
    } else if (action === 'close') {
      console.log('close');
      console.log(currentPath);
      nextPath = currentPath
        .replace(new RegExp(`${id}-[01]`), '')
        .replace(/=\+/, '=') //clean seperators
        .replace(/\+\+/, '+') //clean seperators
        .replace(/&notebooks=$/, ''); // remove if nothing is left
    }
    console.log(nextPath);
  }
  if (['open', 'close'].includes(action) && ['text', 'notebook'].includes(type))
    return nextPath;
};
