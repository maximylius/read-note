import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactQuill from 'react-quill';
import Tooltip from './Tooltip';
import {
  setCommittedSections,
  setTentativeSections,
  setSpeedReader
} from '../../../../../store/actions';
import SectionBlot from '../../../../Metapanel/SectionBlot';
import isEqual from 'lodash/isEqual';
import { extractNumber, ObjectKeepKeys } from '../../../../../functions/main';
ReactQuill.Quill.register(SectionBlot);

const TextMain = ({ quillTextRef, quillNotebookRefs }) => {
  const dispatch = useDispatch();
  const {
    textsPanel: {
      activeTextPanel,
      committedSectionIds,
      tentativeSectionIds,
      holdControl
    },
    texts,
    sections,
    categories
  } = useSelector(state => state);
  const text = texts.byId[activeTextPanel];
  const textSectionsCategoryIds = text.sectionIds.flatMap(
    id => sections.byId[id].categoryIds
  );
  const [editorEditState, setEditorEditState] = useState(false);
  const [editorSelection, setEditorSelection] = useState(null);
  const [tentativeSectionIdsState, setTentativeSectionIdsState] = useState(
    tentativeSectionIds
  );
  const [
    textSectionsCategoryIdsState,
    setTextSectionsCategoryIdsState
  ] = useState(
    Object.fromEntries(
      text.sectionIds.map(id => [id, sections.byId[id].categoryIds])
    )
  );
  const [stateSectionsById, setStateSectionsById] = useState([]);
  const [previousTarget, _setPreviousTarget] = useState(null);
  const previousTargetRef = React.useRef(previousTarget);
  const setPreviousTarget = newTarget => {
    previousTargetRef.current = newTarget;
    _setPreviousTarget(newTarget);
  };
  const tentativeSectionIdsRef = React.useRef(tentativeSectionIds);
  const mouseIsDownRef = React.useRef(false);

  // sectionSpanColorGenerator
  const colorGenerator = useCallback((categoryIds, activeIndex) => {
    if (categoryIds.length === 1)
      return categories.byId[categoryIds[0]].rgbColor;

    let r = [],
      g = [],
      b = [];
    categoryIds.forEach(id => {
      const rgb = categories.byId[id].rgbColor;
      r.push(extractNumber(rgb, 0));
      g.push(extractNumber(rgb, 1));
      b.push(extractNumber(rgb, 2));
    });

    return [(r, g, b)]
      .map(el =>
        activeIndex
          ? 0.5 * el[activeIndex] +
            (0.5 * el.reduce((a, b) => a + b)) / el.length
          : el.reduce((a, b) => a + b) / el.length
      )
      .join(',');
  }, []);

  const removeSectionsFromQuill = useCallback(sections => {
    sections.forEach(section => {
      const begin = section.begin;
      const length = section.end - section.begin;
      const updatingContents = quillTextRef.current.editor.getContents(
        begin,
        length
      );
      updatingContents.ops.forEach((op, index) => {
        if (!op.attributes || !op.attributes.section) return;
        console.log(op.attributes.section);
        console.log(op.attributes.section.sectionIds);
        const sectionIds = op.attributes.section.sectionIds.split(',');
        if (sectionIds.length === 1) {
          delete op.attributes.section;
        } else {
          const removeIndex = sectionIds.indexOf(section._id);
          sectionIds.splice(removeIndex, 1);
          const categoryIds = op.attributes.section.categoryIds.split(',');
          categoryIds.splice(removeIndex, 1);

          op.attributes.section = {
            ...op.attributes.section,
            sectionIds,
            categoryIds,
            borderColor: `rgb(${colorGenerator(categoryIds)})`,
            backgroundColor: `rgba(${colorGenerator(categoryIds)},${0.1})`
          };
        }
      });
      quillTextRef.current.editor.deleteText(begin, length);
      const updatedContents = {
        ops: [
          ...(begin > 0 ? [{ retain: begin }] : []),
          ...updatingContents.ops
        ]
      };
      console.log('updatedContents', updatedContents);
      quillTextRef.current.editor.updateContents(updatedContents);
    });
  }, []);

  const paintSections = useCallback((sectionsToUpdate, activeSectionIds) => {
    sectionsToUpdate.forEach(section => {
      const begin = section.begin;
      const length = section.end - section.begin;
      const updatingContents = quillTextRef.current.editor.getContents(
        begin,
        length
      );
      quillTextRef.current.editor.deleteText(begin, length);
      const updatedContents = {
        ops: [
          ...(begin > 0 ? [{ retain: begin }] : []),
          ...updatingContents.ops.map((op, index) => {
            if (!op.attributes) op.attributes = {};
            op.attributes.section = {
              textId: activeTextPanel,
              sectionIds: [section._id],
              categoryIds: section.categoryIds,
              borderColor: `rgb(${colorGenerator(section.categoryIds)})`,
              backgroundColor: `rgba(${colorGenerator(section.categoryIds)},${
                activeSectionIds.includes(section._id) ? 0.8 : 0.1
              })`,
              ...(index === 0 && { first: true }),
              ...(index === updatingContents.ops.length - 1 && { last: true })
            };
            return op;
          })
        ]
      };
      // console.log(updatedContents);
      quillTextRef.current.editor.updateContents(updatedContents);
    });
  }, []);

  const toggleEditorEditState = () => {
    if (!quillTextRef.current) return;
    quillTextRef.current.editor.enable(!editorEditState);
    setEditorEditState(!editorEditState);
  };
  const onChangeSelectionHandler = () => {
    if (!quillTextRef.current) return;
    setEditorSelection(quillTextRef.current.editor.getSelection());
  };

  // add and remove sections // does not yet react to resizing of section.
  React.useEffect(() => {
    if (!quillTextRef.current) return;
    const newSectionIds = text.sectionIds.filter(
      id => !Object.keys(stateSectionsById).includes(id)
    );
    paintSections(
      newSectionIds.map(id => sections.byId[id]),
      tentativeSectionIds
    );
    const sectionIdsToRemove = Object.keys(stateSectionsById).filter(
      id => !text.sectionIds.includes(id)
    );
    removeSectionsFromQuill(
      sectionIdsToRemove.map(id => stateSectionsById[id])
    );
    setStateSectionsById(ObjectKeepKeys(sections.byId, text.sectionIds));
    return () => {};
  }, [text.sectionIds]);

  // re-color sections: changed section category
  React.useEffect(() => {
    if (!quillTextRef.current) return;
    if (
      isEqual(
        textSectionsCategoryIdsState,
        Object.fromEntries(
          text.sectionIds.map(id => [id, sections.byId[id].categoryIds])
        )
      )
    )
      return;
    const sectionsChangedCategory = text.sectionIds.filter(
      id => !isEqual(sections.byId[id], textSectionsCategoryIdsState[id])
    );
    paintSections(
      sectionsChangedCategory.map(id => sections.byId[id]),
      tentativeSectionIds
    );
    setTextSectionsCategoryIdsState(
      Object.fromEntries(
        text.sectionIds.map(id => [id, sections.byId[id].categoryIds])
      )
    );
    return () => {};
  }, [textSectionsCategoryIds]);

  // re-color sections: changed tentative sections
  React.useEffect(() => {
    if (!quillTextRef.current) return;
    const changedTentative = [
      ...tentativeSectionIds.filter(
        id => !tentativeSectionIdsState.includes(id)
      ),
      ...tentativeSectionIdsState.filter(
        id => !tentativeSectionIds.includes(id) && text.sectionIds.includes(id)
      )
    ];
    paintSections(
      changedTentative.map(id => sections.byId[id]),
      tentativeSectionIds
    );
    setTentativeSectionIdsState(tentativeSectionIds);
    tentativeSectionIdsRef.current = tentativeSectionIds;
    return () => {};
  }, [tentativeSectionIds]);

  // addEventlistener click // addEventlistener mousemove
  React.useEffect(() => {
    if (!quillTextRef.current) return;
    quillTextRef.current.editor.enable(false);

    const clickHandler = e => {
      console.log(e, e.target, e.target.className);
      dispatch(
        setCommittedSections(
          typeof e.target.className !== 'string' ||
            !e.target.className.includes('TextPanelSectionBlot')
            ? []
            : e.target.dataset.sectionIds.split(','),
          false
        )
      );
    };

    const mousemoveHandler = e => {
      if (mouseIsDownRef.current) return;
      if (e.target === previousTargetRef) return;
      if (!e.target.className.includes) return;
      if (!e.target.className.includes('TextPanelSectionBlot')) return;
      if (
        e.target.dataset.sectionIds
          .split(',')
          .some(id => !tentativeSectionIdsRef.current.includes(id))
      ) {
        dispatch(
          setTentativeSections(
            e.target.dataset.sectionIds.split(','),
            holdControl
          )
        );
      }
      setPreviousTarget(e.target);
    };

    document
      .getElementById('quillTextPanel')
      .addEventListener('click', clickHandler);
    document
      .getElementById('quillTextPanel')
      .addEventListener('mousemove', mousemoveHandler);

    // parse text for textreader
    if (!quillTextRef.current) return;
    const deltas = quillTextRef.current.editor.getContents();
    const editorLength = quillTextRef.current.editor.getLength();

    let deltaIndex = 0,
      cumulativeLength = 0,
      words = [],
      previousEndsWithWhitespace = true,
      concat = false;

    // if (speedReader.words.length !== 0) dispatch & return;
    while (deltaIndex < deltas.ops.length) {
      let innerText =
        typeof deltas.ops[deltaIndex].insert === 'string'
          ? deltas.ops[deltaIndex].insert
          : ' ';
      if (!previousEndsWithWhitespace) {
        previousEndsWithWhitespace = /^\s+/.test(innerText);
        concat = previousEndsWithWhitespace;
      }

      while (innerText) {
        if (/^\s+/.test(innerText)) {
          const lengthWithWhite = innerText.length;
          innerText = innerText.trimStart();
          cumulativeLength += lengthWithWhite - innerText.length;
          if (!innerText) {
            previousEndsWithWhitespace = true;
            continue;
          }
        }

        const sliceIndex = /\s+/i.exec(innerText)
          ? /\s+/i.exec(innerText).index
          : innerText.length;
        const plainText = innerText.slice(0, sliceIndex);

        if (!concat) {
          words.push({
            index: cumulativeLength,
            plainText: plainText,
            ...(deltas.ops[deltaIndex].attributes && {
              attributes: deltas.ops[deltaIndex].attributes
            })
          });
        } else {
          const lastContent = words.pop();
          words.push({
            index: lastContent.index,
            plainText: lastContent.plainText + plainText,
            ...((deltas.ops[deltaIndex].attributes ||
              lastContent.attributes) && {
              attributes: {
                ...lastContent.attributes,
                ...deltas.ops[deltaIndex].attributes
              }
            })
          });
        }

        innerText = innerText.slice(sliceIndex);
        cumulativeLength += plainText.length;
        if (concat) concat = false;
        if (!innerText) previousEndsWithWhitespace = false;
      }

      deltaIndex += 1;
    }
    console.log(words);
    dispatch(setSpeedReader(activeTextPanel, words));

    if (editorLength !== cumulativeLength)
      throw `Editor length (${editorLength}) is not equal to cumulative length (${cumulativeLength}). Embeded contents possibly will be missing in speedreader.`;

    return () => {};
  }, [quillTextRef, activeTextPanel]);

  return (
    <div
      className='card'
      onMouseDown={() => (mouseIsDownRef.current = true)}
      onMouseUp={() => (mouseIsDownRef.current = false)}
    >
      {!editorEditState && editorSelection && editorSelection.length > 0 && (
        <Tooltip quillTextRef={quillTextRef} selection={editorSelection} />
      )}
      <div className='card-body'>
        <ReactQuill
          id='quillTextPanel'
          ref={quillTextRef}
          theme='bubble'
          defaultValue={
            texts.byId[activeTextPanel].formatDeltas ||
            texts.byId[activeTextPanel].deltas
          }
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, false] }],
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
          {...(editorEditState && {
            onChange: () =>
              console.log(quillTextRef.current.editor.getContents())
          })}
          {...((!editorEditState || editorEditState) && {
            onChangeSelection: onChangeSelectionHandler
          })}
        />
        <button onClick={toggleEditorEditState}>
          {editorEditState ? 'Disbable...' : 'Enable...'}
        </button>
        <button
          onClick={() => {
            if (!quillTextRef.current) return;
            console.log(quillTextRef.current.editor.getContents());
          }}
        >
          get contents
        </button>
      </div>
    </div>
  );
};

export default TextMain;
