import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import _isEqual from 'lodash/isEqual';
import AnnotationBlot from '../../../Metapanel/AnnotationBlot';
import {
  loadText,
  setCommittedSections,
  setTentativeSections,
  updateNotebook
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

const NotebookPanel = ({ quillNotebookRef }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    notebooksPanel: { activeNotebook },
    notebooks
  } = useSelector(state => state);
  const notebook = notebooks.byId[activeNotebook];
  console.log(
    '---------------------notebook',
    notebook,
    activeNotebook,
    notebooks
  );
  const [quillValueBeforeSelect, setQuillValueBeforeSelect] = useState(
    notebook.deltas
  );
  const [quillValue, setQuillValue] = useState(notebook.deltas);
  const [editorEditState, setEditorEditState] = useState(true);

  const onChangeHandler = () => {
    if (!quillNotebookRef.current) return;
    setQuillValue(quillNotebookRef.current.editor.getContents());
    console.log(quillNotebookRef.current.editor.getContents());
  };
  const onFocusHandler = () => {
    if (!quillNotebookRef.current) return;
    setQuillValue(quillNotebookRef.current.editor.getContents());
    setQuillValueBeforeSelect(quillNotebookRef.current.editor.getContents());
  };
  const onBlurHandler = () => {
    if (_isEqual(quillValue, quillValueBeforeSelect)) return;
    dispatch(updateNotebook({ _id: activeNotebook, deltas: quillValue }));
  };
  const onChangeSelectionHandler = () => {
    if (!quillNotebookRef.current) return;
    console.log(quillNotebookRef.current.editor.getSelection());
  };
  const toggleEditorEditState = () => {
    console.log('toggle. Ref:', quillNotebookRef);
    if (!quillNotebookRef.current) return;
    quillNotebookRef.current.editor.enable(!editorEditState);
    setEditorEditState(!editorEditState);
  };

  React.useEffect(() => {
    const clickHandler = e => {
      console.log(e, e.target, e.target.className);
      if (
        typeof e.target.className !== 'string' ||
        !e.target.className.includes('QuillEditorAnnotation')
      )
        return;
      dispatch(
        loadText({
          textId: e.target.dataset.textId,
          openText: true,
          setToActive: true,
          history: history
        })
      );
      console.log('about ot set committed.....', e.target.dataset);
      dispatch(setCommittedSections([e.target.dataset.sectionId], false));
      dispatch(setTentativeSections([e.target.dataset.sectionId], false));
    };
    document
      .getElementById(`notebookCardBody${activeNotebook}`)
      .addEventListener('click', clickHandler);

    return () => {};
  }, [activeNotebook]);

  React.useEffect(() => {
    // dont push notebook deltas to quill if
    // editor is focused
    // ppush only when it is loaded or different notebook is opened
  }, [notebook.deltas]);

  console.log('xxxxxxxxxxxxxxxxxxxxxx');
  if (!notebook) return <></>;
  return (
    <div className='card-body'>
      <div id={`notebookCardBody${activeNotebook}`} style={{ height: '100%' }}>
        {/* <NotebooksToolbar /> */}
        <ReactQuill
          ref={quillNotebookRef}
          onChange={onChangeHandler}
          theme='bubble'
          defaultalue={quillValue || []}
          onBlur={onBlurHandler}
          onFocus={onFocusHandler}
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
            }
          }}
          placeholder='Add your notes...'
          sanitize='true'
          // bounds={quillNotebookRef.current}
          // bounds={document.getElementById(`notebookCardBody${activeNotebook}`)}
          // bounds={`#notebookCardBody${activeNotebook}`}
          onChangeSelection={onChangeSelectionHandler}
        />
        <button onClick={toggleEditorEditState}>
          {editorEditState ? 'Disbable...' : 'Enable...'}
        </button>
      </div>
    </div>
  );
};

export default NotebookPanel;
