import React, { useState, useEffect } from 'react';
import NoteInfo from './NoteInfo';
import { extractAtValueResId } from '../../../Metapanel/mentionModule';
import NavlineButton from './NavlineButton';

// further cleanup: move [noteInfo, setNoteInfo] to redux. move whole navline not just navlineButton to seperate component that just renders.
const adjust = 18;

const Navlines = ({ noteId, cardBody, mdNotesPanel }) => {
  const mdNotesPanelRef = React.useRef(mdNotesPanel);
  const [noteInfo, setNoteInfo] = useState(null);
  const [_, setForceRenderCounter] = useState(0);
  const cardBodyRect = cardBody.getBoundingClientRect();
  const quillEditor = cardBody.querySelector('.ql-editor');
  const pixelIndentWidth =
    quillEditor.getBoundingClientRect().left - cardBodyRect.left;
  let maxIndentLevel = 4;
  if (mdNotesPanel !== mdNotesPanelRef.current) {
    setTimeout(() => setForceRenderCounter(prevS => prevS + 1), 30);
    mdNotesPanelRef.current = mdNotesPanel;
  }
  const embedSeperatorsDOM = Array.from(
      cardBody.querySelectorAll('.embedSeperator')
    ),
    lines = [];

  embedSeperatorsDOM.forEach(sep => {
    if (sep.dataset.case === 'end') {
      if (['LI'].includes(sep.parentElement.tagName)) {
        if (!sep.parentElement.className.includes('escape-tag')) {
          sep.parentElement.className += ' escape-tag';
        }
      }
      return;
    }
    const endIndex = embedSeperatorsDOM.findIndex(
      el =>
        el.dataset.resInfo === sep.dataset.resInfo && el.dataset.case === 'end'
    );
    if (endIndex < 0) return;
    const color_class_string = sep.dataset.color_class;
    const color_class =
      color_class_string.match(/^color_class-(.*)$/) &&
      color_class_string.match(/^color_class-(.*)$/).pop();

    const top = sep.getBoundingClientRect().bottom;
    const { bottom } = embedSeperatorsDOM[endIndex].getBoundingClientRect();
    const indentLevel = color_class ? Number(color_class) + 1 : 0;
    if (indentLevel === 0) console.log('sep WITHOUT COLOR_CLASS?', sep);
    maxIndentLevel = Math.max(maxIndentLevel, indentLevel);
    lines.push({
      top: top - cardBodyRect.top - adjust,
      height: bottom - top + adjust * 1.5, //
      color_class,
      indentLevel,
      resInfo: sep.dataset.resInfo,
      id: extractAtValueResId(sep.dataset.resInfo)
    });
  });
  console.log('NAVLINE: cardBodyRect.height', cardBodyRect.height);

  useEffect(() => {
    const onResize = () => {
      setForceRenderCounter(prevS => prevS + 1);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return (
    <>
      {noteInfo && <NoteInfo noteInfo={noteInfo} setNoteInfo={setNoteInfo} />}
      <div className='note-bg-container' onResi>
        <div
          className='main-navline'
          style={{ height: `${cardBodyRect.height - 5}px` }}
        >
          <NavlineButton
            noteInfo={noteInfo}
            setNoteInfo={setNoteInfo}
            el={{ id: noteId, top: '40px' }}
          />
        </div>
        {lines.map(el => (
          <div
            key={'bg' + el.resInfo}
            className={`note-bg-outer fade-in fade-out note-bg-color-${el.color_class}`}
            style={{
              top: el.top + 'px',
              height: el.height + 'px',
              left: (el.indentLevel / maxIndentLevel) * pixelIndentWidth,
              width:
                cardBodyRect.width - // problem cardBodyRect.width is a product
                (el.indentLevel / maxIndentLevel) * pixelIndentWidth -
                20
            }}
          >
            <div className={`note-bg-inner`}>
              <div className='navline'>
                <NavlineButton
                  noteInfo={noteInfo}
                  setNoteInfo={setNoteInfo}
                  el={el}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Navlines;
