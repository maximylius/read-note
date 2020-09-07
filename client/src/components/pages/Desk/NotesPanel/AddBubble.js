import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsPlus } from 'react-icons/bs';
import { addNote } from '../../../../store/actions';
import embedSeperatorCreator from './noteFunctions/embedSeperatorCreator';
import mentionCreator from './noteFunctions/mentionCreator';

export const AddBubble = ({
  addBubble: { range, boundingClientRect, allow, parentNoteId, delta },
  setAddBubble,
  cardBodyRef,
  noteRef
}) => {
  const dispatch = useDispatch();
  const spareIds = useSelector(s => s.spareIds);
  const editor = noteRef.current.editor;
  const cardBodyRect = cardBodyRef.current.getBoundingClientRect();
  const addClickHandler = () => {
    console.log('update contents of this editor', editor);
    const retain = { retain: range.index };
    const mentionOp = mentionCreator(
      'note',
      spareIds['notes'][0],
      null,
      'color_class-2-2'
    );
    const embedSeperatorBegin = embedSeperatorCreator(
      'note',
      spareIds['notes'][0],
      `note=${spareIds['notes'][0]}_isOpen=color_class-2-2`,
      'begin',
      'color_class-2-2'
    );
    const embedSeperatorEnd = embedSeperatorCreator(
      'note',
      spareIds['notes'][0],
      `note=${spareIds['notes'][0]}_isOpen=color_class-2-2`,
      'end',
      'color_class-2-2'
    );
    console.log('retain', retain, 'mentionOp', mentionOp);
    const newDelta = {
      ops: [
        retain,
        // { delete: range.length },
        mentionOp,
        embedSeperatorBegin,
        ...((delta && delta.ops) || [{ insert: '\n' }]),
        embedSeperatorEnd
      ]
    };

    console.log(newDelta);
    editor.updateContents(newDelta);

    editor.setSelection(range.index + 3);

    dispatch(
      addNote({
        history: null,
        parentNoteId,
        guessTitle: (delta && 'Some title') || null,
        isAnnotation: null,
        delta: delta
      })
    );
    setAddBubble(null);
  };

  const isSideNote = [...(cardBodyRef.current.classList || [])].includes(
    'side-note'
  );
  const adjustTop = cardBodyRect.top + 16;
  let top =
    boundingClientRect.top +
    (boundingClientRect.bottom - boundingClientRect.top) / 2 -
    adjustTop; //+
  // 16 * 2 +
  // sideNoteAdjust;
  console.log('addBubble', top);
  return (
    <div
      className='add-bubble fade-in'
      style={{
        top: top,
        ...(isSideNote && { left: '-8px' })
      }}
      onClick={addClickHandler}
      // onMouseDown={addClickHandler}
    >
      <div className='add-bubble-line'></div>
      <div className='add-bubble-svg'>
        <BsPlus />
      </div>
    </div>
  );
};
