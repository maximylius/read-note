import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import ReactQuill from 'react-quill';
import QuillMention from 'quill-mention';
import {
  atValuesCreator,
  mentionModuleCreator,
  extractAtValueResType,
  extractAtValueResId
} from '../../../../Metapanel/mentionModule';
import { ObjectKeepKeys } from '../../../../../functions/main';
import {
  setSearchDelta,
  strictFlowchartSearchresults
} from '../../../../../store/actions';
import ResultsInfo from './ResultsInfo';

const placeholderOptions = [
  'Search...',
  "Hint: use '@' to target a specific resource..."
];
const searchPlaceholder =
  placeholderOptions[Math.floor(Math.random() * placeholderOptions.length)];

const returnSearchResults = (
  filteredTextsById,
  filteredSectionsById,
  filteredNotesById
) => {
  return [
    ...Object.keys(filteredNotesById).map(id => ({
      resId: id,
      resType: 'note'
    })),
    ...Object.keys(filteredTextsById).map(id => ({
      resId: id,
      resType: 'text'
    })),
    ...Object.keys(filteredSectionsById).map(id => ({
      resId: id,
      resType: 'section'
    }))
  ];
};

export const Search = () => {
  const dispatch = useDispatch();
  const searchWithinTextcontent = useSelector(
    s => s.inspect.searchWithinTextcontent
  );

  const notes = useSelector(s => s.notes);
  const texts = useSelector(s => s.texts);
  const sections = useSelector(s => s.sections);
  const categories = useSelector(s => s.categories);
  const filterTypes = useSelector(s => s.inspect.filterTypes);
  const searchDelta = useSelector(s => s.inspect.searchDelta);

  const searchQuillRef = React.useRef();
  const [atValues, setAtValues] = React.useState(
    atValuesCreator(notes, texts, sections)
  );
  const [changeCounter, setChangeCounter] = React.useState(-1);
  const [committedChangeCounter, setCommittedChangeCounter] = React.useState(0);
  const mentionModule = React.useCallback(mentionModuleCreator(atValues, []), [
    atValues
  ]);
  const onChangeHandler = () => {
    setChangeCounter(prevState => prevState + 1);
  };

  useEffect(() => {
    const commitChange = () =>
      setCommittedChangeCounter(prevState => prevState + 1);
    const commitChangeTimer = setTimeout(() => {
      //2do if @ is used more timeout needs to be given.
      commitChange();
    }, 400);

    return () => {
      clearTimeout(commitChangeTimer);
    };
  }, [changeCounter, searchWithinTextcontent, filterTypes]);

  useEffect(() => {
    if (!searchQuillRef.current) return;
    if (committedChangeCounter === 0) return;
    const editor = searchQuillRef.current.editor;
    const delta = editor.getContents();
    dispatch(setSearchDelta(delta));
    const caseInsensitive = true; // 2do allow to set option in ui
    let searchTerms = delta.ops
      .flatMap(op => (typeof op.insert === 'string' ? [op.insert] : []))
      .join(' ')
      .split(/\s+/)
      .filter(searchTerm => searchTerm)
      .map(searchTerm => new RegExp(searchTerm, caseInsensitive ? 'i' : ''));
    let mentionSearchTerms = delta.ops.flatMap(op =>
      op.insert && op.insert.mention ? [op.insert.mention.id] : []
    );

    let filteredTextsById = filterTypes.includes('texts') ? { ...texts } : {};
    let filteredSectionsById = filterTypes.includes('sections')
      ? { ...sections }
      : {};
    let filteredNotesById = Object.fromEntries(
      [
        ...Object.keys(notes).flatMap(key => {
          let keep = notes[key].isAnnotation
            ? filterTypes.includes('annotations')
            : notes[key].isReply
            ? filterTypes.includes('replies')
            : filterTypes.includes('notes');
          if (keep) return [key];
          return [];
        })
      ].map(key => [key, notes[key]])
    );

    if (mentionSearchTerms.length === 0 && !searchTerms.join('')) {
      dispatch(strictFlowchartSearchresults([]));
      return;
    }
    mentionSearchTerms.forEach(mentionId => {
      const resId = extractAtValueResId(mentionId);
      const mentionType = extractAtValueResType(mentionId);

      filteredTextsById =
        // mentionType === 'text' || mentionType === 'section'?
        ObjectKeepKeys(filteredTextsById, [
          resId,
          ...Object.keys(filteredTextsById).flatMap(id =>
            texts[id].sectionIds.includes(resId) ||
            texts[id].directConnections.some(el => el.resId === resId) ||
            texts[id].indirectConnections.some(el => el.resId === resId)
              ? [id]
              : []
          )
        ]);
      filteredSectionsById = ObjectKeepKeys(filteredSectionsById, [
        resId,
        ...Object.keys(filteredSectionsById).flatMap(id =>
          sections[id].textId === resId ||
          sections[id].noteIds.includes(resId) ||
          sections[id].directConnections.some(el => el.resId === resId) ||
          sections[id].indirectConnections.some(el => el.resId === resId)
            ? [id]
            : []
        )
      ]);
      filteredNotesById = ObjectKeepKeys(filteredNotesById, [
        resId,
        ...Object.keys(filteredNotesById).flatMap(id =>
          notes[id].replies.includes(resId) ||
          notes[id].directConnections.some(el => el.resId === resId) ||
          notes[id].indirectConnections.some(el => el.resId === resId)
            ? [id]
            : []
        )
      ]);
    });

    searchTerms.forEach(searchTerm => {
      if (Object.keys(filteredTextsById).length > 0) {
        const keysToKeep = [];
        Object.keys(filteredTextsById).forEach(key =>
          keysToKeep.push(
            ...(searchTerm.test(filteredTextsById[key].title) ||
            (searchWithinTextcontent &&
              searchTerm.test(filteredTextsById[key].textcontent))
              ? [key]
              : [])
          )
        );
        filteredTextsById = ObjectKeepKeys(filteredTextsById, keysToKeep);
      }
      if (Object.keys(filteredSectionsById).length > 0) {
        const keysToKeep = [];
        Object.keys(filteredSectionsById).forEach(key =>
          keysToKeep.push(
            ...(searchTerm.test(filteredSectionsById[key].title) ||
            filteredSectionsById[key].categoryIds.some(catId =>
              searchTerm.test(categories.byId[catId].title)
            ) ||
            (searchWithinTextcontent &&
              searchTerm.test(filteredSectionsById[key].fullWords))
              ? [key]
              : [])
          )
        );
        filteredSectionsById = ObjectKeepKeys(filteredSectionsById, keysToKeep);
      }
      if (Object.keys(filteredNotesById).length > 0) {
        const keysToKeep = [];
        Object.keys(filteredNotesById).forEach(key => {
          let note = filteredNotesById[key];
          let keep =
            searchTerm.test(note.title) || searchTerm.test(note.plainText);
          if (keep) keysToKeep.push(key);
        });
        filteredNotesById = ObjectKeepKeys(filteredNotesById, keysToKeep);
      }
    });
    dispatch(
      strictFlowchartSearchresults(
        returnSearchResults(
          filteredTextsById,
          filteredSectionsById,
          filteredNotesById
        )
      )
    );
    return () => {};
  }, [committedChangeCounter]);
  const searchEntered =
    searchQuillRef.current &&
    !!searchQuillRef.current.editor
      .getContents()
      .ops.some(op =>
        typeof op.insert === 'string'
          ? !!op.insert.trim().length
          : !!op.insert.mention
      );
  return (
    <>
      <div className='flowchart-search-container'>
        <ReactQuill
          ref={searchQuillRef}
          onChange={onChangeHandler}
          defaultValue={searchDelta}
          theme='bubble'
          modules={{
            toolbar: null,
            history: {
              delay: 1000,
              maxStack: 100
            },
            mention: mentionModule
          }}
          formats={['mention']}
          placeholder={searchPlaceholder}
        />
      </div>
      <ResultsInfo searchEntered={searchEntered} />
    </>
  );
};
