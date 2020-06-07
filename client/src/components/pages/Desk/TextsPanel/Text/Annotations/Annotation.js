import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import annotationTypes from '../../../../../Metapanel/annotationTypes';
import ReactQuill from 'react-quill';
import { BsPencil, BsCheck, BsX } from 'react-icons/bs';
import {
  deleteAnnotation,
  setAnnotationEditState,
  updateAnnotation
} from '../../../../../../store/actions';
import { extractNumber } from '../../../../../../functions/main';

const Annotation = ({ annotationId, quillNotebookRef, addAnnotationsTo }) => {
  const dispatch = useDispatch();
  const quillAnnotationRef = React.useRef(null);
  const {
    notebooks,
    notebooksPanel: { activeNotebook },
    annotations,
    textsPanel: { editAnnotationId }
  } = useSelector(state => state);
  const annotation = annotations.byId[annotationId];

  const [annotationInnerHTML, setAnnotationInnerHTML] = useState(
    annotation.html
  );
  const [annotationDeltas, setAnnotationDeltas] = useState([]);
  const [annotationPlainText, setAnnotationPlainText] = useState(
    annotation.plainText
  );

  const [annotationType, _setAnnotationType] = useState(annotation.type);
  const [lastEditAnnotationId, setLastEditAnnotationId] = useState('initial');
  const [editingThisAnnotation, setEditingThisAnnotation] = useState(
    editAnnotationId === annotationId
  );
  const annotationTypeRef = React.useRef(annotationType);
  const setAnnotationType = value => {
    _setAnnotationType(value);
    annotationTypeRef.current = value;
  };
  const [mouseoverAnnotation, setMouseoverAnnotation] = useState(false);
  const deleteClickHandler = () => dispatch(deleteAnnotation(annotationId));

  const mouseEnterHandler = () => setMouseoverAnnotation(true);
  const mouseLeaveHandler = () => setMouseoverAnnotation(false);
  const onNotEditableClickHandler = e => {
    if (!window.getSelection().isCollapsed) return;
    e.stopPropagation();
    dispatch(setAnnotationEditState(annotationId));
  };
  const editClickHandler = e => {
    e.stopPropagation();
    dispatch(setAnnotationEditState(annotationId));
  };
  const checkClickHandler = e => dispatch(setAnnotationEditState(null));

  const quillChangeHandler = useCallback(() => {
    if (!quillAnnotationRef.current) return;
    setAnnotationInnerHTML(quillAnnotationRef.current.editor.root.innerHTML);
    setAnnotationDeltas(quillAnnotationRef.current.editor.getContents());
    setAnnotationPlainText(quillAnnotationRef.current.editor.getText());
  }, [quillAnnotationRef]);

  const onAnnotationTypeChangeHandler = e => setAnnotationType(e.target.value);

  React.useEffect(() => {
    console.log('editingThisAnnotation?', editingThisAnnotation);
    console.log(annotationInnerHTML, annotationDeltas);

    if (editingThisAnnotation) {
      // if start editing
      if (!quillAnnotationRef.current) return;
      quillAnnotationRef.current.editor.setSelection(
        quillAnnotationRef.current.editor.getLength(),
        0 // 2do maybe improve and set to where click was made.
      );
      quillChangeHandler(); // set html, deltas + plainText
      console.log('setLastEditAnnotationId to', annotationId);
      setLastEditAnnotationId(annotationId);
      return;
    }

    if (lastEditAnnotationId !== annotationId) return;
    console.log('--------start saving previous edit ---------');
    if (
      !annotationInnerHTML ||
      annotationInnerHTML === '<p><br></p>' ||
      annotationDeltas.length === 0
    ) {
      dispatch(deleteAnnotation(annotationId));
      setLastEditAnnotationId(null);
      return;
    }

    console.log('adding');
    let indexInNotebookAnnotations = null;
    // if something then add to notebook
    if (addAnnotationsTo && addAnnotationsTo !== 'none') {
      console.log('addAnnotationsTo', addAnnotationsTo);
      const currentNotebookDeltas = quillNotebookRef.current.editor.getContents();

      let newAnnotationInstance = true,
        retainNumber = 0,
        deleteNumber = 0;
      const notebook = notebooks.byId[addAnnotationsTo];

      const previousInstanceOfAnnotation = notebook.annotations.filter(
        annotation => {
          if (annotation.annotationId !== annotationId) return false;
          console.log(currentNotebookDeltas.ops);
          const relevantDeltas = currentNotebookDeltas.ops.filter(op => {
            if (!op.attributes || !op.attributes.annotation) return false;
            return op.attributes.annotation.version === annotation.version;
          });
          const annotationInstancePlainText = relevantDeltas
            .map(op => (op.insert ? op.insert : ''))
            .join('');
          console.log(relevantDeltas);
          if (
            annotationInstancePlainText
              .replace(/\s+/g, '')
              .includes(annotation.plainText.replace(/\s+/g, ''))
          ) {
            return true;
          }
          return false;
        }
      )[0];

      if (previousInstanceOfAnnotation) {
        indexInNotebookAnnotations = notebook.annotations.findIndex(
          annotation =>
            annotation.annotationId === annotationId &&
            annotation.version === previousInstanceOfAnnotation.version
        );
        const firstAnnotationDeltaIndex = currentNotebookDeltas.ops.findIndex(
          op => {
            if (!op.attributes || !op.attributes.annotation) return false;
            return (
              op.attributes.annotation.annotationId === annotationId &&
              op.attributes.annotation.version ===
                previousInstanceOfAnnotation.version
            );
          }
        );
        const leadingDeltas = currentNotebookDeltas.ops.slice(
          0,
          firstAnnotationDeltaIndex
        );
        retainNumber = leadingDeltas
          .map(op => (op.insert ? op.insert.length : 0))
          .reduce((c, v) => c + v, 0);
        deleteNumber = previousInstanceOfAnnotation.plainText.length;
        newAnnotationInstance = false;
      }

      const length = quillNotebookRef.current.editor.getLength();
      const updatedContents = {
        ops: [
          ...(newAnnotationInstance
            ? [...(length > 0 ? [{ retain: length }] : []), { insert: '\n' }]
            : [
                ...(retainNumber > 0 ? [{ retain: retainNumber }] : []),
                ...(deleteNumber > 0 ? [{ delete: deleteNumber }] : [])
              ]),
          ...annotationDeltas.ops.map(op => {
            if (!op.attributes) op.attributes = {};
            op.attributes.annotation = {
              annotationId: annotationId,
              sectionId: annotation.sectionId,
              textId: annotation.textId,
              version: `v${extractNumber(annotation.version, 0) + 1}`,
              backgroundColor: `rgba(200,250,242,0.3)`,
              borderColor: `rgb(200,250,242)`
            };
            return op;
          }),
          ...(newAnnotationInstance ? [{ insert: '\n' }] : [])
        ]
      };
      quillNotebookRef.current.editor.updateContents(updatedContents);
    }

    dispatch(
      updateAnnotation({
        annotationId: annotationId,
        type: annotationTypeRef.current,
        plainText: annotationPlainText,
        html: annotationInnerHTML,
        version: `v${extractNumber(annotation.version, 0) + 1}`,
        notebookId: addAnnotationsTo,
        indexInNotebookAnnotations: indexInNotebookAnnotations
      })
    );
    console.log('....adding');
    console.log('setLastEditAnnotationId to', null);
    setLastEditAnnotationId(null);
  }, [editingThisAnnotation]);

  React.useEffect(() => {
    console.log(
      '+++++++++++++++',
      editAnnotationId,
      'from ',
      annotationId,
      editAnnotationId === annotationId
    );
    setEditingThisAnnotation(editAnnotationId === annotationId);
    return () => {};
  }, [editAnnotationId]);

  if (editAnnotationId !== annotationId)
    return (
      <div
        className='d-flex align-items-center SidepanelAnnotation'
        onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
        onClick={onNotEditableClickHandler}
      >
        <div className='flex-shrink-1'>
          {annotationTypes[annotationType].icon}
        </div>
        <div className='flex-grow-1'>
          <p
            className='SidepanelAnnotationWrapper'
            dangerouslySetInnerHTML={{ __html: annotationInnerHTML }}
          ></p>
        </div>
        <div
          className='flex-shrink-1'
          style={{ visibility: mouseoverAnnotation ? 'visible' : 'hidden' }}
        >
          <div onClick={editClickHandler}>
            <BsPencil />
          </div>
          <div onClick={deleteClickHandler}>
            <BsX />
          </div>
        </div>
      </div>
    );

  return (
    <div
      className='d-flex SidepanelAnnotation'
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <div className='flex-shrink-1'>
        <div className='row'>{annotationTypes[annotationType].icon}</div>
        <div className='row'>
          <select
            id={`${annotationId}_selectCategory`}
            style={{ width: '14px', marginLeft: '-14px' }}
            className='custom-select'
            value={annotationType}
            onChange={onAnnotationTypeChangeHandler}
          >
            {Object.keys(annotationTypes).map(type => (
              <option key={type} value={type}>
                {annotationTypes[type].type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='flex-grow-1 SidepanelAnnotation'>
        <div style={{ display: 'block' }}>
          <ReactQuill
            id={`${annotationId}_quill`}
            onChange={quillChangeHandler}
            ref={quillAnnotationRef}
            theme='bubble'
            defaultValue={annotationInnerHTML}
            placeholder={annotationTypes[annotationType].placeholder}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ color: [] }, { background: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ align: [] }]
              ],
              history: {
                delay: 1000,
                maxStack: 20
              }
            }}
          />
        </div>
      </div>
      <div
        className='flex-shrink-1 ml-n2  align-items-center'
        style={{ zIndex: 10, float: 'right' }}
      >
        <div onClick={checkClickHandler}>
          <BsCheck />
        </div>
        <div onClick={deleteClickHandler}>
          <BsX />
        </div>
      </div>
    </div>
  );
};

export default Annotation;
