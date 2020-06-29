export const mentionModuleCreator = (atValues, hashValues) => {
  const mentionModule = {
    allowedChars: /^[A-Za-z\s]*$/,
    mentionDenotationChars: ['@', '#'],
    source: function (searchTerm, renderList, mentionChar) {
      let values;

      if (mentionChar === '@') {
        values = atValues;
      } else {
        values = hashValues;
      }

      if (searchTerm.length === 0) {
        renderList(values, searchTerm);
      } else {
        const matches = [];
        for (let i = 0; i < values.length; i++)
          if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase()))
            matches.push(values[i]);
        renderList(matches, searchTerm);
      }
    }
  };
  return mentionModule;
};

export const atValuesCreator = (textsById, notebooksById, sectionsById) => {
  const atValues = Object.keys(textsById)
    .map(id => {
      return {
        id: `text=${id}`,
        value: textsById[id].title
      };
    })
    .concat(
      Object.keys(notebooksById).map(id => {
        return {
          id: `note=${id}`,
          value: notebooksById[id].title
        };
      })
    )
    .concat(
      Object.keys(sectionsById).map(id => {
        const textId = sectionsById[id].textId;
        const textTitle = textsById[textId].title;
        const sectionTitle = sectionsById[id].title;

        let value =
          textTitle +
          // .slice(0, Math.max(6, 24 - sectionTitle.length))
          ' - ' +
          sectionTitle;
        return {
          id: `section=${id}_text=${textId}`,
          value
        };
      })
    );

  return atValues;
};

export const extractAtValueResType = mentionId => {
  const resType = /^note=/.test(mentionId)
    ? 'note'
    : /^text=/.test(mentionId)
    ? 'text'
    : /^section=/.test(mentionId)
    ? 'section'
    : undefined;
  return resType;
};

export const extractAtValueResId = mentionId => {
  if (/^note\=/.test(mentionId)) {
    return mentionId.match(/^note\=(.*)$/).pop();
  } else if (/^text=/.test(mentionId)) {
    return mentionId.match(/^text\=(.*)$/).pop();
  } else if (/^section=/.test(mentionId)) {
    return mentionId.match(/^note\=(.*)_/).pop();
  }
};

export const atValuesCreator2 = (
  pathIdentifier,
  textsById,
  notebooksById,
  sectionsById
) => {
  const atValues = Object.keys(textsById)
    .map(id => {
      let nr = 0; // 2do check with while loop through notebook state
      return {
        id: `text=${id}`,
        value: textsById[id].title
      };
    })
    .concat(
      Object.keys(notebooksById).map(id => {
        let nr = 0; // 2do check with while loop through notebook state
        return {
          id: `notebook=${id}`,
          value: notebooksById[id].title
        };
      })
    )
    .concat(
      Object.keys(sectionsById).map(id => {
        const textTitle = textsById[sectionsById[id].textId].title;
        const sectionTitle = sectionsById[id].title;

        let value =
          textTitle +
          // .slice(0, Math.max(6, 24 - sectionTitle.length))
          ' - ' +
          sectionTitle;
        let nr = 0; // 2do check with while loop through notebook state
        return {
          id: `section=${id}_text=${sectionsById[id].textId}`,
          value
        };
      })
    );

  return atValues;
};
