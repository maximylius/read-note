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
import { strictFlowchartSearchresults } from '../../../../../store/actions';
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
    ...Object.keys(filteredSectionsById).map(id => ({
      resId: id,
      resType: 'section'
    })),
    ...Object.keys(filteredTextsById).map(id => ({
      resId: id,
      resType: 'text'
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
    const caseInsensitive = true;
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
      // if (strictSearchResults.length !== 0) {
      dispatch(
        strictFlowchartSearchresults(
          filterTypes.length < 5
            ? returnSearchResults(
                filteredTextsById,
                filteredSectionsById,
                filteredNotesById
              )
            : []
        )
      );
      // }
      return;
    }
    mentionSearchTerms.forEach(mentionId => {
      const resId = extractAtValueResId(mentionId);
      const mentionType = extractAtValueResType(mentionId);

      filteredTextsById =
        mentionType === 'text' || mentionType === 'section'
          ? ObjectKeepKeys(filteredTextsById, [resId])
          : {};
      filteredSectionsById =
        mentionType === 'section'
          ? ObjectKeepKeys(filteredSectionsById, [resId])
          : {};
      filteredNotesById =
        mentionType === 'note'
          ? ObjectKeepKeys(filteredNotesById, [resId])
          : {};
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
          defaultValue={''}
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
