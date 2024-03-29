import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSection, openSpeedReader } from '../../../../../store/actions';
import { BsPlus, BsChatSquareQuote, BsPlay } from 'react-icons/bs';

const Tooltip = ({ quillTextRef, selection }) => {
  const dispatch = useDispatch();
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const speedReader = useSelector(s => s.textsPanel.speedReader);

  console.log(
    'selection.index',
    selection.index,
    selection.index,
    'selection.length',
    selection.length
  );

  const addSectionClickHandler = () => {
    dispatch(
      addSection({
        categoryId: null,
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
    const begin =
      quillRange.index > 50
        ? Math.max(
            0,
            speedReader.words.findIndex(word => word.index > quillRange.index) -
              1
          )
        : 0;
    const end =
      quillRange.length > 50
        ? speedReader.words.findIndex(
            word => word.index >= quillRange.length + quillRange.index
          )
        : speedReader.words.length - 1;
    dispatch(openSpeedReader(activeTextPanel, begin, end, begin));
  };

  if (window.getSelection().isCollapsed) return <></>;
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
        <button
          className='btn btn-secondary  string-tooltip string-tooltip-bottom'
          onClick={addSectionClickHandler}
          data-string-tooltip='mark selection'
        >
          <BsPlus />
          <BsChatSquareQuote />
        </button>
        {/* <button
          className='btn btn-secondary draggable'
          draggable='true'
          onDrop={onDropHandler}
          onDragStart={onDragStartHandler}
          onDragEnd={onDragEndHandler}
        >
          <BsChatSquareQuote />
        </button> */}
        <button
          className='btn btn-secondary  string-tooltip string-tooltip-bottom'
          onClick={playClickHandler}
          data-string-tooltip='start speed reader at selection'
        >
          <BsPlay />
        </button>
      </div>
      {/* </div> */}
    </div>
    // </div>
  );
};

export default Tooltip;
