import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, ReactReduxContext } from 'react-redux';
import ReactQuill from 'react-quill';
import QuillMention from 'quill-mention';
import _isEqual from 'lodash/isEqual';
import AnnotationBlot from '../../../Metapanel/AnnotationBlot';
import {
  loadText,
  setCommittedSections,
  setTentativeSections,
  updateNotebook,
  loadNotebooks
} from '../../../../store/actions';
ReactQuill.Quill.register(AnnotationBlot);
const initialDelta = [
  { insert: 'Heading for section' },
  { attributes: { header: 1 }, insert: '\n' },
  {
    insert:
      'These possible effect of spatial relocation of economic activity should also be considered when assessing the economic impact of specific transport improvements. '
  },
  {
    attributes: {
      bold: true
    },
    insert:
      'Additional to the effects of economic relocation, changes in residential choices also have to be considered, to better predict changes in agglomeration levels. '
  },
  {
    insert:
      'Our measure of effective density could be further improved. To better estimate cost of traveling between two locations, distance should be included in terms of fuel cost. As we have not included the cost of distance we did slightly underestimate the accessibility of regions at far distances.'
  }
];
// const atValues = [
//   { id: 1, value: 'Fredrik Sundqvist' },
//   { id: 2, value: 'Patrik Sjölin' }
// ];
const hashValues = [
  { id: 3, value: 'Fredrik Sundqvist 2' },
  { id: 4, value: 'Patrik Sjölin 2' }
];

const NotebookPanel = ({ setNotebookRef, quillNotebookRefs, notebookId }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    notebooks,
    texts,
    sections,
    user,
    textsPanel: { activeTextPanel }
  } = useSelector(state => state);
  const notebook = notebooks.byId[notebookId];
  const [changedEditorCounter, setChangedEditorCounter] = useState(-1);

  const atValues = Object.keys(texts.byId)
    .map(id => ({
      id,
      value: texts.byId[id].title
    }))
    .concat(
      Object.keys(notebooks.byId).map(id => ({
        id,
        value: notebooks.byId[id].title
      }))
    )
    .concat(
      Object.keys(sections.byId).map(id => {
        const textTitle = texts.byId[sections.byId[id].textId].title;
        const sectionTitle = sections.byId[id].title;

        let value =
          textTitle +
          // .slice(0, Math.max(6, 24 - sectionTitle.length))
          ' - ' +
          sectionTitle;
        // .slice(0, Math.max(19, 24 - textTitle.length));
        return {
          id,
          value
        };
      })
    );

  const mentionModule = React.useCallback(
    {
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
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      }
    },
    [user.textIds, user.notebookIds]
  );

  const onChangeHandler = () => {
    if (!quillNotebookRefs.current[notebookId]) return;
    setChangedEditorCounter(prevState => prevState + 1);
  };

  const handleEditorChange = () => {
    if (!quillNotebookRefs.current[notebookId]) return;
    const editor = quillNotebookRefs.current[notebookId].editor;
    const currentDeltas = editor.getContents();
    const currentText = editor.getText();
    const innerHTML = editor.root.innerHTML;
    if (_isEqual(currentDeltas, notebook.deltas)) return;
    dispatch(
      updateNotebook({
        _id: notebookId,
        deltas: currentDeltas,
        html: innerHTML,
        plainText: currentText
      })
    );
  };

  React.useEffect(() => {
    if (changedEditorCounter < 0) return;
    if (!quillNotebookRefs.current[notebookId]) return;
    const commitChangeTimer = setTimeout(() => {
      handleEditorChange();
    }, 5000);

    return () => {
      clearTimeout(commitChangeTimer);
    };
  }, [changedEditorCounter]);

  React.useEffect(() => {
    return () => {
      handleEditorChange();
    };
  }, []);

  // 2do improve
  const clickHandler = e => {
    console.log(e.target, e.target.className);
    if (typeof e.target.className !== 'string') return;
    if (
      e.target.className.includes('mention') ||
      e.target.parentElement.className.includes('mention')
    ) {
      const mentionId =
        e.target.dataset.id || e.target.parentElement.dataset.id;
      console.log(mentionId);
      if (user.textIds.includes(mentionId)) {
        console.log('loadtext');
        dispatch(
          loadText({
            textId: mentionId,
            openText: true,
            setToActive: true,
            history: history
          })
        );
      } else if (user.notebookIds.includes(mentionId)) {
        console.log('load notebokk');
        dispatch(
          loadNotebooks({
            notebookIds: [mentionId],
            open: true,
            setToActive: mentionId,
            history: history
          })
        );
      } else if (Object.keys(sections.byId).includes(mentionId)) {
        console.log('load text section');
        dispatch(
          loadText({
            textId: sections.byId[mentionId].textId,
            openText: true,
            setToActive: true,
            history: history
          })
        );
        dispatch(setCommittedSections([mentionId], false));
        dispatch(setTentativeSections([mentionId], false));
      }
    }
    if (!e.target.className.includes('QuillEditorAnnotation')) return;
    dispatch(
      loadText({
        textId: e.target.dataset.textId,
        openText: true,
        setToActive: true,
        history: history
      })
    );
    // console.log('about ot set committed.....', e.target.dataset);
    dispatch(setCommittedSections([e.target.dataset.sectionId], false));
    dispatch(setTentativeSections([e.target.dataset.sectionId], false));
  };
  // clickhandler for section blots
  React.useEffect(() => {
    document
      .getElementById(`notebookCardBody${notebookId}`)
      .addEventListener('click', clickHandler);

    return () => {
      document
        .getElementById(`notebookCardBody${notebookId}`)
        .removeEventListener('click', clickHandler);
    };
  }, [notebookId, user.textIds, user.notebookIds]);

  if (!notebook) return <></>;
  return (
    <div className='card-body'>
      <div id={`notebookCardBody${notebookId}`} style={{ height: '100%' }}>
        {/* <NotebooksToolbar /> */}
        <ReactQuill
          ref={setNotebookRef}
          onChange={onChangeHandler}
          defaultValue={notebook.html || ''}
          theme='bubble'
          modules={{
            //'#notebooksToolbar'
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              // [{ size: ['small', false, 'large'] }],
              ['bold', 'italic', 'underline', 'annotation'],
              [{ color: [] }, { background: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ align: [] }]
            ],
            history: {
              delay: 1000,
              maxStack: 100
            },
            mention: mentionModule
          }}
          placeholder='Add your notes...'
          sanitize='true'
          // bounds={quillNotebookRefs.current[notebookId]}
          // bounds={document.getElementById(`notebookCardBody${notebookId}`)}
          // bounds={`#notebookCardBody${notebookId}`}
        />
      </div>
      {/* <span>Last saved: </span> */}
    </div>
  );
};

export default NotebookPanel;
