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
        .replace(/=\+/g, '=') //clean seperators
        .replace(/\+\+/g, '+') //clean seperators
        .replace(/\+$/g, '') //clean seperators
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
        .replace(/=\+/g, '=') //clean seperators
        .replace(/\+\+/g, '+') //clean seperators
        .replace(/\+$/g, '') //clean seperators
        .replace(/&notebooks=$/, ''); // remove if nothing is left
    }
    console.log(nextPath);
  }
  if (['open', 'close'].includes(action) && ['text', 'notebook'].includes(type))
    return nextPath;
};

export const committChangesToAnnotation = (
  annotation,
  quillAnnotationRef,
  quillNotebookRefs,
  notebooks,
  syncWith,
  dispatch,
  updateAnnotation,
  deleteAnnotation,
  forceUpdate
) => {
  console.log(quillAnnotationRef);
  const annotationId = annotation._id;
  const annotationInnerHTML = quillAnnotationRef.current.editor.root.innerHTML;
  const annotationDeltas = quillAnnotationRef.current.editor.getContents();
  console.log('annotationDeltas', annotationDeltas);
  const annotationPlainText = quillAnnotationRef.current.editor.getText();

  if (
    !annotationInnerHTML ||
    annotationInnerHTML === '<p><br></p>' ||
    annotationDeltas.length === 0
  ) {
    // dispatch(deleteAnnotation(annotationId)); // 2do? // shall also delete from notebook?
    return;
  }

  console.log(forceUpdate);
  if (!forceUpdate && annotationInnerHTML === annotation.html) {
    console.log('no change in annotation');
    return;
  }

  const notebookUpdates = [];

  syncWith.forEach(notebookId => {
    let indexInNotebookAnnotations = null;
    console.log(quillNotebookRefs);
    const currentNotebookDeltas = quillNotebookRefs.current[
      notebookId
    ].editor.getContents();

    const notebook = notebooks.byId[notebookId];

    console.log('adding note to', notebook.title);

    let notebookAnnotations = [],
      retainIndex = 0,
      annotationVersions = {
        [annotationId]: {
          ['v'.concat(
            extractNumber(annotation.version, 0) + 1
          )]: annotationPlainText
        }
      };

    let deltaIndexOverview = [],
      lastWasAnnotationDelta = false;
    // 2do:  problemm within that loop: if there are multiple instance of an annotation with same annotation version-x (due to copy paste or something else) they will be understand as one large instance (swallowing everything in between).
    // how to check whether they do belong to same instance or whether they are seperate?
    // if dividing ops only insert whitespaces than its okay
    // if anything else is inserted then split.
    // 2do severe problems when multiple instances are in place. solution needed.
    // updating a ref makes it disappear -why?
    // when no text follow then it seem to start bugging
    currentNotebookDeltas.ops.forEach((op, deltaIndex) => {
      if (
        lastWasAnnotationDelta &&
        typeof op.insert === 'string' &&
        op.insert.replace(/\s+/g, '').length === 0
      ) {
        let currentGroup = notebookAnnotations.pop();
        currentGroup.end = deltaIndex;
        let deltaLength = op.insert.length || 1;
        currentGroup.length += deltaLength;
        deltaIndexOverview.push(retainIndex);
        notebookAnnotations.push(currentGroup);
        retainIndex += deltaLength;
        lastWasAnnotationDelta = false;
        return;
      }
      if (
        !op.attributes ||
        !op.attributes.annotation ||
        op.attributes.annotation.annotationId !== annotationId ||
        !op.attributes.annotation.version
      ) {
        let deltaLength = op.insert.length || 1;
        deltaIndexOverview.push(retainIndex);
        retainIndex += deltaLength;
        lastWasAnnotationDelta = false;
        if (
          op.attributes &&
          op.attributes.annotation &&
          op.attributes.annotation.annotationId &&
          op.attributes.annotation.version &&
          notebook.annotationVersions[op.attributes.annotation.annotationId] &&
          notebook.annotationVersions[op.attributes.annotation.annotationId][
            op.attributes.annotation.version.split('-')[0]
          ]
        ) {
          annotationVersions[op.attributes.annotation.annotationId] = {
            ...annotationVersions[op.attributes.annotation.annotationId],
            [op.attributes.annotation.version.split('-')[0]]:
              notebook.annotationVersions[
                op.attributes.annotation.annotationId
              ][op.attributes.annotation.version.split('-')[0]]
          };
        }
        return;
      }
      let currentGroup =
        notebookAnnotations.length > 0 &&
        notebookAnnotations[notebookAnnotations.length - 1].version ===
          op.attributes.annotation.version
          ? notebookAnnotations.pop()
          : {
              begin: deltaIndex,
              version: op.attributes.annotation.version,
              retainIndex: retainIndex,
              length: 0,
              startOffsetIndex: 0,
              endOffsetIndex: 0
            };

      currentGroup.end = deltaIndex;
      let deltaLength = op.insert.length || 1;
      currentGroup.length += deltaLength;
      deltaIndexOverview.push(retainIndex);
      notebookAnnotations.push(currentGroup);
      retainIndex += deltaLength;
      lastWasAnnotationDelta = true;
    });
    console.log('notebookAnnotations', notebookAnnotations);

    notebookAnnotations.forEach((notebookAnnotation, index) => {
      notebookAnnotations[index].plainText = currentNotebookDeltas.ops
        .slice(notebookAnnotation.begin, notebookAnnotation.end + 1)
        .map(op => op.insert)
        .join('');
      let version = notebookAnnotation.version.split('-')[0],
        currentContainsSaved,
        savedContainsCurrent,
        savedString = notebook.annotationVersions[annotationId][version],
        escapedSavedString;
      if (!savedString) {
        notebookAnnotations[index].update = false;
      } else {
        escapedSavedString = savedString.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        console.log('savedString', savedString);
        savedContainsCurrent = !!savedString
          .replace(/\s+/g, '')
          .match(
            notebookAnnotation.plainText
              .replace(/\s+/g, '')
              .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
          );

        currentContainsSaved = !!notebookAnnotation.plainText
          .replace(/\s+/g, '')
          .match(escapedSavedString.replace(/\s+/g, ''));

        notebookAnnotations[index].update =
          currentContainsSaved || savedContainsCurrent;
        console.log(
          'notebookAnnotations[index].update',
          currentContainsSaved,
          savedContainsCurrent
        );
      }
      if (notebookAnnotations[index].update) {
        if (currentContainsSaved) {
          // Handle start offsset
          console.log(
            'notebookAnnotation.plainText',
            notebookAnnotation.plainText
          );
          console.log('escapedSavedString', escapedSavedString);
          let whiteSpaceSearchString = savedString.trimEnd(),
            startOffsetMatch,
            endOffsetMatch;
          while (!startOffsetMatch) {
            startOffsetMatch = notebookAnnotation.plainText.match(
              whiteSpaceSearchString.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            );
            // improve (' ') to /\s+/
            if (whiteSpaceSearchString.lastIndexOf(' ') === -1) break;
            whiteSpaceSearchString = whiteSpaceSearchString.slice(
              0,
              whiteSpaceSearchString.lastIndexOf(' ')
            );
          }
          // endOffset
          whiteSpaceSearchString = savedString.trimEnd();
          let endTrimCount = savedString.length - whiteSpaceSearchString.length;
          console.log('whiteSpaceSearchString', whiteSpaceSearchString);
          console.log(
            'notebookAnnotation.plainText',
            notebookAnnotation.plainText
          );

          while (!endOffsetMatch) {
            endOffsetMatch = notebookAnnotation.plainText.match(
              whiteSpaceSearchString.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            );
            if (endOffsetMatch) break;
            if (whiteSpaceSearchString.indexOf(' ') === -1) break;
            whiteSpaceSearchString = whiteSpaceSearchString.slice(
              whiteSpaceSearchString.indexOf(' ') + 1
            );
          }

          console.log('startOffsetMatch', startOffsetMatch);
          console.log('endOffsetMatch', endOffsetMatch);
          let startOffsetIndex = startOffsetMatch.index;
          let endOffsetIndex = //check this //trim end ?
            notebookAnnotation.plainText.trimEnd().length -
            whiteSpaceSearchString.length -
            endOffsetMatch.index -
            endTrimCount +
            1;
          // + endTrimCount;

          console.log(startOffsetIndex, '- + -', endOffsetIndex);
          notebookAnnotations[index].startOffsetIndex = startOffsetIndex;
          notebookAnnotations[index].endOffsetIndex = endOffsetIndex;
        }
        notebookAnnotations[index].deleteNumber =
          notebookAnnotations[index].plainText.length; //what if string is longer? //will be appended.
      } else {
        if (
          notebook.annotationVersions[annotationId][
            notebookAnnotation.version.split('-')[0]
          ]
        ) {
          annotationVersions[annotationId] = {
            ...annotationVersions[annotationId],
            [notebookAnnotation.version.split('-')[0]]:
              notebook.annotationVersions[annotationId][
                notebookAnnotation.version.split('-')[0]
              ]
          };
        }
      }
    });

    let notebookAnnotationsToUpdate = notebookAnnotations.filter(
      el => el.update
    );

    const length = quillNotebookRefs.current[notebookId].editor.getLength();
    console.log('length', length);
    let contentUpdate = { ops: null };
    if (notebookAnnotationsToUpdate.length > 0) {
      notebookAnnotationsToUpdate.sort((a, b) => a.retainIndex - b.retainIndex);
      // if first: retainNumber: retainIndex
      // if xth retainNumber: retainIndex-lastRetainIndex-lastDeleteNumber
      let notebookAnnotationOps = notebookAnnotationsToUpdate.map(
        (notebookAnnotation, index) => ({
          ...notebookAnnotation,
          retainNumber:
            index === 0
              ? notebookAnnotation.retainIndex
              : notebookAnnotation.retainIndex -
                notebookAnnotationsToUpdate[index - 1].retainIndex -
                notebookAnnotationsToUpdate[index - 1].deleteNumber
        })
      );
      console.log('notebookAnnotationOps', notebookAnnotationOps);

      contentUpdate.ops = notebookAnnotationOps.flatMap(
        (notebookAnnotation, index) => {
          console.log('notebookAnnotation', notebookAnnotation);
          let preOps = [],
            postOps = [];
          if (notebookAnnotation.startOffsetIndex > 0) {
            let firstDeltaIndex = deltaIndexOverview.findIndex(
              deltaIndex => deltaIndex === notebookAnnotation.retainIndex
            );
            let lastDeltaIndex =
              deltaIndexOverview.findIndex(
                deltaIndex =>
                  deltaIndex >
                  notebookAnnotation.retainIndex +
                    notebookAnnotation.startOffsetIndex
              ) - 1;
            lastDeltaIndex =
              lastDeltaIndex === -1
                ? currentNotebookDeltas.ops.length - 1
                : lastDeltaIndex;
            console.log(firstDeltaIndex, lastDeltaIndex + 1);
            console.log(
              currentNotebookDeltas.ops.slice(
                firstDeltaIndex,
                lastDeltaIndex + 1
              )
            );

            let preIndex = 0;
            preOps = currentNotebookDeltas.ops
              .slice(firstDeltaIndex, lastDeltaIndex + 1)
              .map((op, index) => {
                preIndex =
                  index === lastDeltaIndex - firstDeltaIndex
                    ? preIndex
                    : preIndex + (op.insert.length || 1);
                return index === lastDeltaIndex - firstDeltaIndex
                  ? {
                      ...op,
                      insert:
                        typeof op.insert === 'string'
                          ? op.insert.slice(
                              0,
                              notebookAnnotation.startOffsetIndex - preIndex
                              // - the length of the previous deltas
                            )
                          : op.insert
                    }
                  : op;
              });
          }
          if (notebookAnnotation.endOffsetIndex > 0) {
            let firstDeltaIndex =
              deltaIndexOverview.findIndex(
                deltaIndex =>
                  deltaIndex >
                  notebookAnnotation.retainIndex +
                    notebookAnnotation.length -
                    notebookAnnotation.endOffsetIndex
              ) - 1;
            let lastDeltaIndex = deltaIndexOverview.findIndex(
              deltaIndex =>
                deltaIndex >
                notebookAnnotation.retainIndex + notebookAnnotation.length
            );
            lastDeltaIndex =
              lastDeltaIndex === -1
                ? currentNotebookDeltas.ops.length - 1
                : lastDeltaIndex;
            console.log(firstDeltaIndex, lastDeltaIndex + 1);
            console.log(
              currentNotebookDeltas.ops
                .slice(firstDeltaIndex, lastDeltaIndex + 1)
                .filter(
                  op =>
                    op.attributes &&
                    op.attributes.annotation &&
                    op.attributes.annotation.annotationId === annotationId &&
                    op.attributes.annotation.version ===
                      notebookAnnotation.version
                )
            );

            postOps = currentNotebookDeltas.ops
              .slice(firstDeltaIndex, lastDeltaIndex + 1)
              .filter(
                op =>
                  op.attributes &&
                  op.attributes.annotation &&
                  op.attributes.annotation.annotationId === annotationId &&
                  op.attributes.annotation.version ===
                    notebookAnnotation.version
              )
              .map((op, index) =>
                index === 0
                  ? {
                      ...op,
                      insert:
                        typeof op.insert === 'string'
                          ? op.insert
                              .slice(
                                op.insert.length -
                                  notebookAnnotation.endOffsetIndex
                              )
                              .trimStart()
                          : op.insert
                    }
                  : index === lastDeltaIndex - firstDeltaIndex
                  ? {
                      ...op,
                      insert:
                        typeof op.insert === 'string'
                          ? op.insert
                              .slice(
                                op.insert.length -
                                  notebookAnnotation.endOffsetIndex
                              )
                              .trimEnd() + '\n'
                          : op.insert
                    }
                  : op
              );
          }
          console.log('preOps', preOps);
          console.log('postOps', postOps);
          return [
            ...(notebookAnnotation.retainNumber > 0
              ? [{ retain: notebookAnnotation.retainNumber }]
              : []),
            ...(notebookAnnotation.deleteNumber > 0
              ? [{ delete: notebookAnnotation.deleteNumber }]
              : []),
            ...[
              ...preOps,
              ...annotationDeltas.ops.map((op, index) =>
                index === annotationDeltas.ops.length - 1
                  ? { ...op, insert: op.insert.trimEnd() }
                  : op
              ),
              ...postOps
            ].map(op => {
              if (!op.attributes) op.attributes = {};
              op.attributes.annotation = {
                annotationId: annotationId,
                sectionId: annotation.sectionId,
                textId: annotation.textId,
                version: `v${
                  extractNumber(annotation.version, 0) + 1
                }-${index}`,
                backgroundColor: `rgba(200,250,242,0.3)`,
                borderColor: `rgb(200,250,242)`
              };
              return op;
            })
          ];
        }
      );
    } else {
      contentUpdate.ops = [
        ...(length > 0 ? [{ retain: length }] : []),
        { insert: '\n' },
        ...annotationDeltas.ops.map(op => {
          if (!op.attributes) op.attributes = {};
          op.attributes.annotation = {
            annotationId: annotationId,
            sectionId: annotation.sectionId,
            textId: annotation.textId,
            version: `v${extractNumber(annotation.version, 0) + 1}-0`,
            backgroundColor: `rgba(200,250,242,0.3)`,
            borderColor: `rgb(200,250,242)`
          };
          return op;
        }),
        { insert: '\n' }
      ];
    }
    console.log(contentUpdate);
    // 2do: improve by merging contents instead of forcing update on top.
    quillNotebookRefs.current[notebookId].editor.updateContents(contentUpdate);
    console.log(quillNotebookRefs.current[notebookId].editor.getContents());
    notebookUpdates.push({
      notebookId: notebookId,
      // add new notebook.annotationVersions state
      annotationVersions: annotationVersions
    }); //2do
  });

  dispatch(
    updateAnnotation({
      annotationId: annotationId,
      type: 'note',
      plainText: annotationPlainText,
      html: annotationInnerHTML,
      version: `v${extractNumber(annotation.version, 0) + 1}`,
      syncWith: syncWith,
      notebookUpdates: notebookUpdates
    })
  );
};

export const getAllKeys = obj => {
  const allKeys = [];
  const keyIterator = obj => {
    Object.keys(obj).forEach(key => {
      allKeys.push(key);
      if (typeof obj[key] === 'object') keyIterator(obj[key]);
    });
  };
  keyIterator(obj);
  return allKeys;
};
