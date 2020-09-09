import React, { useState } from 'react';
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
import { ObjectKeepKeys, colorGenerator } from '../../../../../functions/main';
ReactQuill.Quill.register(SectionBlot);

// it does not push section updates into view.
// 2do: TextSectionsBlots get somehow wrapped by another span holding the backgroundcolor. Problematic in case of mixed (multiple sectionIds) Blots, as the latest seems to set the backgroundcolor for both/all sections. Also weird behaviour when hovering overlapping sections.
const TextMain = ({}) => {
  const dispatch = useDispatch();
  const quillTextRef = React.useRef();
  const texts = useSelector(s => s.texts);
  const sections = useSelector(s => s.sections);
  const categories = useSelector(s => s.categories);
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const committedSectionIds = useSelector(
    s => s.textsPanel.committedSectionIds
  );
  const tentativeSectionIds = useSelector(
    s => s.textsPanel.tentativeSectionIds
  );
  const holdControl = useSelector(s => s.textsPanel.holdControl);

  const text = texts[activeTextPanel];
  const textSectionsCategoryIds = text.sectionIds
    .map(id => (sections[id] ? [sections[id].categoryIds] : []))
    .flat(2);
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
      text.sectionIds
        .map(id => (sections[id] ? [[id, sections[id].categoryIds]] : []))
        .flat(1)
    )
  );
  const [stateSectionsById, setStateSectionsById] = useState({}); // shall this be an object or an array?
  const [previousTarget, _setPreviousTarget] = useState(null);
  const previousTargetRef = React.useRef(previousTarget);
  const setPreviousTarget = newTarget => {
    previousTargetRef.current = newTarget;
    _setPreviousTarget(newTarget);
  };
  const tentativeSectionIdsRef = React.useRef(tentativeSectionIds);
  const mouseIsDownRef = React.useRef(false);

  //useCallback(
  const removeSectionsFromQuill = sections => {
    sections.forEach(section => {
      const begin = section.begin;
      const length = section.end - section.begin;
      const updatingContents = quillTextRef.current.editor.getContents(
        begin,
        length
      );
      updatingContents.ops.forEach((op, index) => {
        if (!op.attributes || !op.attributes.section) return;
        const sectionIds = op.attributes.section.sectionIds.split(',');
        if (sectionIds.length === 1) {
          delete op.attributes.section;
        } else {
          const removeIndex = sectionIds.indexOf(section._id);
          sectionIds.splice(removeIndex, 1);
          const categoryIds = op.attributes.section.categoryIds.split(',');
          categoryIds.splice(removeIndex, 1);
          const colorObject = Object.fromEntries(
            sectionIds.map(id => [id, sections[id].categoryIds])
          );
          const rgbValue = colorGenerator(
            colorObject,
            [...committedSectionIds, ...tentativeSectionIds],
            categories
          );
          op.attributes.section = {
            ...op.attributes.section,
            sectionIds, //2do
            categoryIds,
            borderColor: `rgb(${rgbValue})`,
            backgroundColor: `rgba(${rgbValue},${0.1})`
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
      quillTextRef.current.editor.updateContents(updatedContents);
    });
  };
  //   ,[sections]
  // );

  // useCallback(
  const paintSections = (sectionsToUpdate, activeSectionIds) => {
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
            const sectionIds =
              op.attributes.section && op.attributes.section.sectionIds
                ? [
                    ...new Set([
                      ...op.attributes.section.sectionIds.split(','),
                      section._id
                    ])
                  ]
                : [section._id];
            const categoryIds = sectionIds
              .filter(id => sections[id])
              .flatMap(id => sections[id].categoryIds);
            const colorObject = Object.fromEntries(
              sectionIds
                .filter(id => sections[id])
                .map(id => [id, sections[id].categoryIds])
            ); // PROBLEM only one section is updated at the time! //2do important
            const rgbValue = colorGenerator(
              colorObject,
              [...committedSectionIds, ...tentativeSectionIds],
              categories
            );
            op.attributes.section = {
              textId: activeTextPanel,
              sectionIds: sectionIds,
              categoryIds: categoryIds,
              borderColor: `rgb(${rgbValue})`,
              backgroundColor: `rgba(${rgbValue},${
                activeSectionIds.includes(section._id) ? 0.8 : 0.1
              })`,
              ...(index === 0 && { first: true }),
              ...(index === updatingContents.ops.length - 1 && { last: true })
            };
            return op;
          })
        ]
      };
      quillTextRef.current.editor.updateContents(updatedContents);
    });
  };
  // , []);

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
      id =>
        !Object.keys(stateSectionsById).includes(id) &&
        Object.keys(sections).includes(id)
    );
    console.log('newSectionIds', newSectionIds);
    paintSections(
      newSectionIds.map(id => sections[id]),
      tentativeSectionIds
    );
    const sectionIdsToRemove = Object.keys(stateSectionsById).filter(
      id => !text.sectionIds.includes(id)
    );
    removeSectionsFromQuill(
      sectionIdsToRemove.map(id => stateSectionsById[id])
    );
    setStateSectionsById(ObjectKeepKeys(sections, text.sectionIds));
    return () => {};
  }, [text.sectionIds]);

  // re-color sections: changed section category
  React.useEffect(() => {
    if (!quillTextRef.current) return;
    if (
      isEqual(
        textSectionsCategoryIdsState,
        Object.fromEntries(
          text.sectionIds.flatMap(id =>
            sections[id] ? [[id, sections[id].categoryIds]] : []
          )
        )
      )
    )
      return;
    const sectionsChangedCategory = text.sectionIds.filter(
      id => !isEqual(sections[id], textSectionsCategoryIdsState[id])
    );
    paintSections(
      sectionsChangedCategory.map(id => sections[id]),
      tentativeSectionIds
    );
    setTextSectionsCategoryIdsState(
      Object.fromEntries(
        text.sectionIds.flatMap(id =>
          sections[id] ? [[id, sections[id].categoryIds]] : []
        )
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
      changedTentative.map(id => sections[id]),
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
      if (
        typeof e.target.className === 'string' &&
        e.target.className.includes('TextPanelSectionBlot')
      ) {
        dispatch(
          setCommittedSections(e.target.dataset.sectionIds.split(','), false)
        );
      } else {
        dispatch(setTentativeSections([], false));
      }
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
    const delta = quillTextRef.current.editor.getContents();
    const editorLength = quillTextRef.current.editor.getLength();

    let deltaIndex = 0,
      cumulativeLength = 0,
      words = [],
      previousEndsWithWhitespace = true,
      concat = false;

    // if (speedReader.words.length !== 0) dispatch & return;
    while (deltaIndex < delta.ops.length) {
      let innerText =
        typeof delta.ops[deltaIndex].insert === 'string'
          ? delta.ops[deltaIndex].insert
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
            ...(delta.ops[deltaIndex].attributes && {
              attributes: delta.ops[deltaIndex].attributes
            })
          });
        } else {
          const lastContent = words.pop();
          words.push({
            index: lastContent.index,
            plainText: lastContent.plainText + plainText,
            ...((delta.ops[deltaIndex].attributes ||
              lastContent.attributes) && {
              attributes: {
                ...lastContent.attributes,
                ...delta.ops[deltaIndex].attributes
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
    dispatch(setSpeedReader(activeTextPanel, words));

    if (editorLength !== cumulativeLength)
      throw `Editor length (${editorLength}) is not equal to cumulative length (${cumulativeLength}). Embeded contents possibly will be missing in speedreader.`;

    return () => {};
  }, [quillTextRef, activeTextPanel]);

  return (
    <>
      {!editorEditState && editorSelection && editorSelection.length > 0 && (
        <Tooltip quillTextRef={quillTextRef} selection={editorSelection} />
      )}
      <div className='card-body'>
        <ReactQuill
          id='quillTextPanel'
          ref={quillTextRef}
          theme='bubble'
          defaultValue={
            texts[activeTextPanel].formatDelta || texts[activeTextPanel].delta
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
          onMouseDown={() => (mouseIsDownRef.current = true)}
          onMouseUp={() => (mouseIsDownRef.current = false)}
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
    </>
  );
};

export default TextMain;
