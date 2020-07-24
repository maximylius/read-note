import React, { useState } from 'react';
import { BsInfoCircle, BsDashCircle } from 'react-icons/bs';
import NoteInfo from './NoteInfo';
import _isEqual from 'lodash/isEqual';
import { extractAtValueResId } from '../../../Metapanel/mentionModule';

const parentPadding = 16 * 1.25,
  extendTop = 14,
  extendBottom = 14,
  adjustToTop = 16;

const Navline = ({ noteId, cardBodyRef, mdNotesPanel }) => {
  const mdNotesPanelRef = React.useRef(mdNotesPanel);
  const [noteInfo, setNoteInfo] = useState(null);
  const [_, setForceRenderCounter] = useState(0);
  const cardBody = cardBodyRef.current;
  const cardBodyRect = cardBody.getBoundingClientRect();
  let maxIndentLevel = 4;
  const [hoveredResInfo, setHoveredResInfo] = useState([]);
  if (mdNotesPanel !== mdNotesPanelRef.current)
    setTimeout(() => setForceRenderCounter(prevS => prevS + 1), 30);

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
    const indentLevel = color_class ? color_class.split('-').length : 0;
    if (indentLevel === 0) console.log('sep WITHOUT COLOR_CLASS?', sep);
    maxIndentLevel = Math.max(maxIndentLevel, indentLevel);
    const pixelIndent = (indentLevel / maxIndentLevel) * 40; //css
    const bgWidth = cardBodyRect.width - pixelIndent - 20; //css
    lines.push({
      top: top - cardBodyRect.top - adjustToTop,
      height: bottom - top + adjustToTop,
      color_class,
      indentLevel,
      pixelIndent,
      bgWidth,
      resInfo: sep.dataset.resInfo,
      id: extractAtValueResId(sep.dataset.resInfo)
    });
  });
  return (
    <>
      {noteInfo && <NoteInfo noteInfo={noteInfo} setNoteInfo={setNoteInfo} />}
      <div className='mainNavline' style={{ heigth: cardBodyRect.height }}>
        <div className='main-navline-button-container'>
          <button
            className='navline-button'
            onClick={() =>
              setNoteInfo(
                noteInfo && noteInfo.id === noteId
                  ? null
                  : {
                      id: noteId,
                      top: '40px'
                    }
              )
            }
          >
            <BsInfoCircle />
          </button>
        </div>

        {lines.map(el => (
          <div
            key={el.resInfo}
            data-res-info={el.resInfo}
            className={`navline fade-in navline-${el.color_class}`}
            style={{
              top: el.top - extendTop + 'px',
              height: el.height + extendTop + extendBottom + 'px'
            }}
            onMouseEnter={() =>
              setHoveredResInfo(prevState => [el.resInfo, ...prevState])
            }
            onMouseLeave={() =>
              setHoveredResInfo(prevState =>
                prevState.filter(hooveredInfo => hooveredInfo !== el.resInfo)
              )
            }
          >
            <div
              className={`navline-button-container ${
                hoveredResInfo[0] === el.resInfo ? 'visible' : ''
              }`}
            >
              <button
                className='navline-button'
                onClick={() => setNoteInfo(_isEqual(el, noteInfo) ? null : el)}
              >
                <BsInfoCircle />
              </button>
              {/* <button className='navline-button'>
                <BsDashCircle />
              </button> */}
            </div>
          </div>
        ))}
      </div>
      <div className='note-bg-container'>
        {lines.map(el => (
          <div
            key={'bg' + el.resInfo}
            className={`note-bg-outer fade-in fade-out navline-${el.color_class}`}
            style={{
              top: el.top + 'px',
              height: el.height + 'px',
              left: el.pixelIndent,
              width: el.bgWidth
            }}
          >
            <div className={`note-bg-inner`}></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Navline;
