import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import { BsSearch } from 'react-icons/bs';
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
  strictFlowchartSearchresults,
  toggleSearchWithinTextcontentFlowchart
} from '../../../../../store/actions';

const placeholderOptions = [
  'Search...',
  "Hint: use '@' to target a specific resource..."
];
const searchPlaceholder =
  placeholderOptions[Math.floor(Math.random() * placeholderOptions.length)];

export const Search = () => {
  const dispatch = useDispatch();
  const searchWithinTextcontent = useSelector(
    s => s.inspect.searchWithinTextcontent
  );
  const strictSearchResults = useSelector(s => s.inspect.strictSearchResults);
  const notes = useSelector(s => s.notes);
  const texts = useSelector(s => s.texts);
  const sections = useSelector(s => s.sections);

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
    console.log('startchangetimer');
    const commitChange = () =>
      setCommittedChangeCounter(prevState => prevState + 1);
    const commitChangeTimer = setTimeout(() => {
      //2do if @ is used more timeout needs to be given.
      commitChange();
    }, 1000);

    return () => {
      clearTimeout(commitChangeTimer);
    };
  }, [changeCounter, searchWithinTextcontent]);

  useEffect(() => {
    if (!searchQuillRef.current) return;
    if (committedChangeCounter === 0) return;
    console.log('SEARCH_SEARCH_SEARCH_SEARCH_');
    const editor = searchQuillRef.current.editor;
    const delta = editor.getContents();
    console.log(delta);
    let searchTerms = delta.ops
      .flatMap(op => (typeof op.insert === 'string' ? [op.insert] : []))
      .join(' ')
      .split(/\s+/);
    let mentionSearchTerms = delta.ops.flatMap(op =>
      op.insert && op.insert.mention ? [op.insert.mention.id] : []
    );
    if (mentionSearchTerms.length === 0 && !searchTerms.join('')) {
      if (strictSearchResults.length !== 0) {
        dispatch(strictFlowchartSearchresults([]));
      }
      console.log('NO_SEARCH_NO_SEARCH_NO_SEARCH_');
      return;
    }
    // how does the search work?
    // first search and get results and then regain relative that shall be displayed.
    // shall words be looked for individually? yes.
    // do all words have to match? For now yes.
    console.log(
      'mentionSearchTerms',
      mentionSearchTerms,
      'searchTerms',
      searchTerms
    );
    let filteredTextsById = { ...texts };
    let filteredSectionsById = { ...sections };
    let filteredNotesById = { ...notes };
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
      if (!searchTerm) {
        console.log('nonSearchterm:_', searchTerm);
        return;
      }
      if (Object.keys(filteredTextsById).length > 0) {
        const keysToKeep = [];
        Object.keys(filteredTextsById).forEach(key =>
          keysToKeep.push(
            ...(filteredTextsById[key].title.includes(searchTerm) ||
            (searchWithinTextcontent &&
              filteredTextsById[key].textcontent.includes(searchTerm))
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
            ...(filteredSectionsById[key].title.includes(searchTerm) ||
            (searchWithinTextcontent &&
              filteredSectionsById[key].fullWords.includes(searchTerm))
              ? [key]
              : [])
          )
        );
        filteredSectionsById = ObjectKeepKeys(filteredSectionsById, keysToKeep);
      }
      if (Object.keys(filteredNotesById).length > 0) {
        const keysToKeep = [];
        Object.keys(filteredNotesById).forEach(key =>
          keysToKeep.push(
            ...(filteredNotesById[key].title.includes(searchTerm) ||
            filteredNotesById[key].plainText.includes(searchTerm)
              ? [key]
              : [])
          )
        );
        filteredNotesById = ObjectKeepKeys(filteredNotesById, keysToKeep);
      }
    });
    dispatch(
      strictFlowchartSearchresults([
        ...Object.keys(filteredTextsById),
        ...Object.keys(filteredSectionsById),
        ...Object.keys(filteredNotesById)
      ])
    );
    return () => {};
  }, [committedChangeCounter]);

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
      <div>
        Search within text content:{' '}
        <button
          className={`btn btn-sm btn-secondary ${
            searchWithinTextcontent ? 'active' : ''
          }`}
          onClick={() => dispatch(toggleSearchWithinTextcontentFlowchart())}
        >
          {searchWithinTextcontent ? 'on' : 'off'}
        </button>
      </div>
    </>
  );
};
