import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSection, openSpeedReader } from '../../../../../store/actions';
import {
  BsBookmark,
  BsChat,
  BsDash,
  BsPlus,
  BsChatSquareQuoteFill,
  BsChatSquareQuote,
  BsPlay
} from 'react-icons/bs';

const Tooltip = ({ quillTextRef, selection }) => {
  const dispatch = useDispatch();
  const {
    categories,
    spareIds,
    textsPanel: { activeTextPanel, speedReader }
  } = useSelector(state => state);

  // const bounds = quillTextRef.current.editor.getBounds();
  // console.log(bounds);
  const styleDiv = {
    position: 'fixed',
    zIndex: 1000,
    left: `100px`
    // left: `${validSelection.boundingClientRect.right + 10}px`,
    // top: `${
    //   validSelection.boundingClientRect.top * 0.6 +
    //   validSelection.boundingClientRect.bottom * 0.4
    // }px`
  };
  const onClickHandler = () => {
    dispatch(
      addSection({
        categoryId: 'none',
        begin: selection.index,
        end: selection.index + selection.length
      })
    );
    window.getSelection().removeAllRanges();
  };
  const onDragStartHandler = e => {
    console.log('dragStart--------------------', e.target);
    console.log(e.target.style);
    e.target.style.opacity = '0';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(
      'text/html',
      <span>
        Test <strong>this</strong>
      </span>
    );
    console.log(e.dataTransfer);
  };
  const onDragEndHandler = e => {
    console.log('dragEnd--------------------', e.target);
    e.target.style.opacity = '1';
    // e.target.style.visibility = 'visible';
  };
  const onDropHandler = e => {
    console.log('drop--------------------');
    e.stopPropagation();

    console.log('e.target :>> ', e.target);
    console.log('e.currentTarget :>> ', e.currentTarget);
  };

  const playClickHandler = () => {
    if (!quillTextRef.current) return;
    const quillRange = quillTextRef.current.editor.getSelection();
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
        if (deltaIndex === 0)
          console.log(innerText, previousEndsWithWhitespace);
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

    const begin =
      quillRange.index > 50
        ? Math.max(
            0,
            words.findIndex(word => word.index > quillRange.index) - 1
          )
        : 0;
    const end =
      quillRange.length > 50
        ? words.findIndex(
            word => word.index >= quillRange.length + quillRange.index
          )
        : words.length - 1;
    console.log(words);
    dispatch(openSpeedReader(words, begin, end));
    if (editorLength !== cumulativeLength)
      throw `Editor length (${editorLength}) is not equal to cumulative length (${cumulativeLength}). Embeded contents possibly will be missing in speedreader.`;
  };

  if (window.getSelection().anchorNode === null) return <></>;
  return (
    <div
      className='ql-bubble'
      style={{
        zIndex: 100,
        top: `${
          window.getSelection().getRangeAt(0).getBoundingClientRect().bottom +
          10
        }px`,
        left: `${
          window.getSelection().getRangeAt(0).getBoundingClientRect().left +
          window.getSelection().getRangeAt(0).getBoundingClientRect().width *
            0.3
        }px`,
        position: 'fixed'
      }}
    >
      {/* <div className='ql-tooltip'>
        <span className='ql-tooltip-arrow'></span>
        <div className='ql-toolbar'> */}
      <div>
        <button className='btn btn-secondary' onClick={onClickHandler}>
          <BsPlus /> section
        </button>
        <button
          className='btn btn-secondary draggable'
          draggable='true'
          onDrop={onDropHandler}
          onDragStart={onDragStartHandler}
          onDragEnd={onDragEndHandler}
        >
          <BsChatSquareQuote />
        </button>
        <button className='btn btn-secondary' onClick={playClickHandler}>
          <BsPlay />
        </button>
      </div>
      {/* </div> */}
      //{' '}
    </div>
    // </div>
  );
};

export default Tooltip;
