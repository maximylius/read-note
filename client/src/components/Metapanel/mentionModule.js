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

export const atValuesCreator = (notesById, textsById, sectionsById) => {
  const atValues = Object.keys(textsById)
    .map(id => {
      return {
        id: `text=${id}_isOpen=false`,
        value: textsById[id].title
      };
    })
    .concat(
      Object.keys(notesById).map(id => {
        return {
          id: `note=${id}_isOpen=false`,
          value: notesById[id].title
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
          id: `section=${id}_text=${textId}_isOpen=false`,
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

export const extractAtValueResId = (mentionId, option) => {
  if (/^note=/.test(mentionId)) {
    return mentionId.match(/^note=(.*)_isOpen/).pop();
  } else if (/^text=/.test(mentionId)) {
    return mentionId.match(/^text=(.*)_isOpen/).pop();
  } else if (/^section=/.test(mentionId)) {
    if (option === 'textId') {
      mentionId.match(/_text=(.*)_isOpen/).pop();
    } else {
      return mentionId.match(/^section=(.*)_text/).pop();
    }
  }
};

export const updateMentionIdOpenStatus = (mentionId, newVal) => {
  return mentionId.replace(/_isOpen=(.*)$/i, '_isOpen=' + newVal);
};

export const mentionIdIsOpen = mentionId =>
  /_isOpen=color_class-/.test(mentionId);

export const mentionColorClass = mentionId => {
  if (!/_isOpen=color_class-/.test(mentionId)) return false;
  return mentionId.match(/_isOpen=(.*)$/).pop();
};
