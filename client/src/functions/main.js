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
  type = 'text/note'
) => {
  let pathHasText = /texts=/.test(currentPath);
  let pathHasNote = /notes=/.test(currentPath);
  let splitPath = currentPath.split(
    /^\/desk\/texts=|^\/desk\/notes\=|&notes=|^\/desk\//
  );
  const textsArr = pathHasText ? splitPath[1].split('+') : [];
  const notesArr = pathHasNote ? splitPath[pathHasText + 1].split('+') : [];
  const resArr = type === 'text' ? textsArr : notesArr;

  if (action === 'open') {
    let replaceIndex = resArr.findIndex(el => el.endsWith('-1'));
    if (replaceIndex >= 0)
      resArr[replaceIndex] = resArr[replaceIndex].replace(/-1$/, '-0');
    let spliceIndex = resArr.findIndex(el => el.startsWith(id));
    if (spliceIndex >= 0) {
      resArr[spliceIndex] = resArr[spliceIndex].replace(/-0$/, '-1');
    } else {
      resArr.push(`${id}-1`);
    }
  } else {
    //action==="close"
    let spliceIndex = -1;
    resArr.forEach((res, index) => {
      if (res.startsWith(id)) {
        spliceIndex = index;
        if (
          res.endsWith('-1') &&
          resArr.length > 0 &&
          index !== resArr.length - 1
        ) {
          resArr[index === 0 ? 1 : index - 1] = `${res.split('-')[0]}-1`;
        }
      }
    });
    if (spliceIndex >= 0) resArr.splice(spliceIndex, 1);
  }

  let textsString = textsArr
    .map((text, index) => `${index === 0 ? 'texts=' : ''}${text}`)
    .join('+');
  let seperator = textsArr.length > 0 && notesArr.length > 0 ? '&' : '';
  let notesString = notesArr
    .map((note, index) => `${index === 0 ? 'notes=' : ''}${note}`)
    .join('+');

  let nextPath = '/desk/' + textsString + seperator + notesString;
  return nextPath;
};

export const regExpOpenTexts = url =>
  url
    .match(/texts=(.*)&notes=|texts=(.*)$/)
    .pop()
    .split('+');

export const committChangesToAnnotation = (
  annotation,
  quillAnnotationRef,
  quillNoteRefs,
  notes,
  syncWith,
  dispatch,
  updateAnnotation,
  deleteAnnotation,
  forceUpdate
) => {
  console.log(quillAnnotationRef);
  const annotationId = annotation._id;
  const annotationInnerHTML = quillAnnotationRef.current.editor.root.innerHTML;
  const annotationDelta = quillAnnotationRef.current.editor.getContents();
  console.log('annotationDelta', annotationDelta);
  const annotationPlainText = quillAnnotationRef.current.editor.getText();

  if (
    !annotationInnerHTML ||
    annotationInnerHTML === '<p><br></p>' ||
    annotationDelta.length === 0
  ) {
    // dispatch(deleteAnnotation(annotationId)); // 2do? // shall also delete from note?
    return;
  }

  console.log(forceUpdate);
  if (!forceUpdate && annotationInnerHTML === annotation.html) {
    console.log('no change in annotation');
    return;
  }

  const noteUpdates = [];

  syncWith.forEach(noteId => {
    let indexInNoteAnnotations = null;
    console.log(quillNoteRefs);
    const currentNoteDelta = quillNoteRefs.current[noteId].editor.getContents();

    const note = notes[noteId];

    console.log('adding note to', note.title);

    let noteAnnotations = [],
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
    currentNoteDelta.ops.forEach((op, deltaIndex) => {
      if (
        lastWasAnnotationDelta &&
        typeof op.insert === 'string' &&
        op.insert.replace(/\s+/g, '').length === 0
      ) {
        let currentGroup = noteAnnotations.pop();
        currentGroup.end = deltaIndex;
        let deltaLength = op.insert.length || 1;
        currentGroup.length += deltaLength;
        deltaIndexOverview.push(retainIndex);
        noteAnnotations.push(currentGroup);
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
          note.annotationVersions[op.attributes.annotation.annotationId] &&
          note.annotationVersions[op.attributes.annotation.annotationId][
            op.attributes.annotation.version.split('-')[0]
          ]
        ) {
          annotationVersions[op.attributes.annotation.annotationId] = {
            ...annotationVersions[op.attributes.annotation.annotationId],
            [op.attributes.annotation.version.split('-')[0]]:
              note.annotationVersions[op.attributes.annotation.annotationId][
                op.attributes.annotation.version.split('-')[0]
              ]
          };
        }
        return;
      }
      let currentGroup =
        noteAnnotations.length > 0 &&
        noteAnnotations[noteAnnotations.length - 1].version ===
          op.attributes.annotation.version
          ? noteAnnotations.pop()
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
      noteAnnotations.push(currentGroup);
      retainIndex += deltaLength;
      lastWasAnnotationDelta = true;
    });
    console.log('noteAnnotations', noteAnnotations);

    noteAnnotations.forEach((noteAnnotation, index) => {
      noteAnnotations[index].plainText = currentNoteDelta.ops
        .slice(noteAnnotation.begin, noteAnnotation.end + 1)
        .map(op => op.insert)
        .join('');
      let version = noteAnnotation.version.split('-')[0],
        currentContainsSaved,
        savedContainsCurrent,
        savedString = note.annotationVersions[annotationId][version],
        escapedSavedString;
      if (!savedString) {
        noteAnnotations[index].update = false;
      } else {
        escapedSavedString = savedString.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        console.log('savedString', savedString);
        savedContainsCurrent = !!savedString
          .replace(/\s+/g, '')
          .match(
            noteAnnotation.plainText
              .replace(/\s+/g, '')
              .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
          );

        currentContainsSaved = !!noteAnnotation.plainText
          .replace(/\s+/g, '')
          .match(escapedSavedString.replace(/\s+/g, ''));

        noteAnnotations[index].update =
          currentContainsSaved || savedContainsCurrent;
        console.log(
          'noteAnnotations[index].update',
          currentContainsSaved,
          savedContainsCurrent
        );
      }
      if (noteAnnotations[index].update) {
        if (currentContainsSaved) {
          // Handle start offsset
          console.log('noteAnnotation.plainText', noteAnnotation.plainText);
          console.log('escapedSavedString', escapedSavedString);
          let whiteSpaceSearchString = savedString.trimEnd(),
            startOffsetMatch,
            endOffsetMatch;
          while (!startOffsetMatch) {
            startOffsetMatch = noteAnnotation.plainText.match(
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
          console.log('noteAnnotation.plainText', noteAnnotation.plainText);

          while (!endOffsetMatch) {
            endOffsetMatch = noteAnnotation.plainText.match(
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
            noteAnnotation.plainText.trimEnd().length -
            whiteSpaceSearchString.length -
            endOffsetMatch.index -
            endTrimCount +
            1;
          // + endTrimCount;

          console.log(startOffsetIndex, '- + -', endOffsetIndex);
          noteAnnotations[index].startOffsetIndex = startOffsetIndex;
          noteAnnotations[index].endOffsetIndex = endOffsetIndex;
        }
        noteAnnotations[index].deleteNumber =
          noteAnnotations[index].plainText.length; //what if string is longer? //will be appended.
      } else {
        if (
          note.annotationVersions[annotationId][
            noteAnnotation.version.split('-')[0]
          ]
        ) {
          annotationVersions[annotationId] = {
            ...annotationVersions[annotationId],
            [noteAnnotation.version.split('-')[0]]:
              note.annotationVersions[annotationId][
                noteAnnotation.version.split('-')[0]
              ]
          };
        }
      }
    });

    let noteAnnotationsToUpdate = noteAnnotations.filter(el => el.update);

    const length = quillNoteRefs.current[noteId].editor.getLength();
    console.log('length', length);
    let contentUpdate = { ops: null };
    if (noteAnnotationsToUpdate.length > 0) {
      noteAnnotationsToUpdate.sort((a, b) => a.retainIndex - b.retainIndex);
      // if first: retainNumber: retainIndex
      // if xth retainNumber: retainIndex-lastRetainIndex-lastDeleteNumber
      let noteAnnotationOps = noteAnnotationsToUpdate.map(
        (noteAnnotation, index) => ({
          ...noteAnnotation,
          retainNumber:
            index === 0
              ? noteAnnotation.retainIndex
              : noteAnnotation.retainIndex -
                noteAnnotationsToUpdate[index - 1].retainIndex -
                noteAnnotationsToUpdate[index - 1].deleteNumber
        })
      );
      console.log('noteAnnotationOps', noteAnnotationOps);

      contentUpdate.ops = noteAnnotationOps.flatMap((noteAnnotation, index) => {
        console.log('noteAnnotation', noteAnnotation);
        let preOps = [],
          postOps = [];
        if (noteAnnotation.startOffsetIndex > 0) {
          let firstDeltaIndex = deltaIndexOverview.findIndex(
            deltaIndex => deltaIndex === noteAnnotation.retainIndex
          );
          let lastDeltaIndex =
            deltaIndexOverview.findIndex(
              deltaIndex =>
                deltaIndex >
                noteAnnotation.retainIndex + noteAnnotation.startOffsetIndex
            ) - 1;
          lastDeltaIndex =
            lastDeltaIndex === -1
              ? currentNoteDelta.ops.length - 1
              : lastDeltaIndex;
          console.log(firstDeltaIndex, lastDeltaIndex + 1);
          console.log(
            currentNoteDelta.ops.slice(firstDeltaIndex, lastDeltaIndex + 1)
          );

          let preIndex = 0;
          preOps = currentNoteDelta.ops
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
                            noteAnnotation.startOffsetIndex - preIndex
                            // - the length of the previous delta
                          )
                        : op.insert
                  }
                : op;
            });
        }
        if (noteAnnotation.endOffsetIndex > 0) {
          let firstDeltaIndex =
            deltaIndexOverview.findIndex(
              deltaIndex =>
                deltaIndex >
                noteAnnotation.retainIndex +
                  noteAnnotation.length -
                  noteAnnotation.endOffsetIndex
            ) - 1;
          let lastDeltaIndex = deltaIndexOverview.findIndex(
            deltaIndex =>
              deltaIndex > noteAnnotation.retainIndex + noteAnnotation.length
          );
          lastDeltaIndex =
            lastDeltaIndex === -1
              ? currentNoteDelta.ops.length - 1
              : lastDeltaIndex;
          console.log(firstDeltaIndex, lastDeltaIndex + 1);
          console.log(
            currentNoteDelta.ops
              .slice(firstDeltaIndex, lastDeltaIndex + 1)
              .filter(
                op =>
                  op.attributes &&
                  op.attributes.annotation &&
                  op.attributes.annotation.annotationId === annotationId &&
                  op.attributes.annotation.version === noteAnnotation.version
              )
          );

          postOps = currentNoteDelta.ops
            .slice(firstDeltaIndex, lastDeltaIndex + 1)
            .filter(
              op =>
                op.attributes &&
                op.attributes.annotation &&
                op.attributes.annotation.annotationId === annotationId &&
                op.attributes.annotation.version === noteAnnotation.version
            )
            .map((op, index) =>
              index === 0
                ? {
                    ...op,
                    insert:
                      typeof op.insert === 'string'
                        ? op.insert
                            .slice(
                              op.insert.length - noteAnnotation.endOffsetIndex
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
                              op.insert.length - noteAnnotation.endOffsetIndex
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
          ...(noteAnnotation.retainNumber > 0
            ? [{ retain: noteAnnotation.retainNumber }]
            : []),
          ...(noteAnnotation.deleteNumber > 0
            ? [{ delete: noteAnnotation.deleteNumber }]
            : []),
          ...[
            ...preOps,
            ...annotationDelta.ops.map((op, index) =>
              index === annotationDelta.ops.length - 1
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
              version: `v${extractNumber(annotation.version, 0) + 1}-${index}`,
              backgroundColor: `rgba(200,250,242,0.3)`,
              borderColor: `rgb(200,250,242)`
            };
            return op;
          })
        ];
      });
    } else {
      contentUpdate.ops = [
        ...(length > 0 ? [{ retain: length }] : []),
        { insert: '\n' },
        ...annotationDelta.ops.map(op => {
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
    quillNoteRefs.current[noteId].editor.updateContents(contentUpdate);
    console.log(quillNoteRefs.current[noteId].editor.getContents());
    noteUpdates.push({
      noteId: noteId,
      // add new note.annotationVersions state
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
      noteUpdates: noteUpdates
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
