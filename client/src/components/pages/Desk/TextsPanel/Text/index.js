import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setValidSelection } from '../../../../../store/actions';

import Tooltip from './Tooltip';
import TextMain from './TextMain';
import Sidepanel from './Annotations/Sidepanel';

function Textpage() {
  const dispatch = useDispatch();
  const {
    ui,
    textsPanel: { validSelection, activeTextPanel },
    texts
  } = useSelector(state => state);
  const text = texts.byId[activeTextPanel];

  const mouseUpHandler = e => {
    const selection = window.getSelection();
    if (selection.toString().replace(/\s+/g, '') !== '') {
      const extractNumber = (string, index) =>
        parseInt(string.match(/^\d+|\d+\b|\d+(?=\w)/g)[index]);
      const anchorNode = selection.anchorNode.parentElement;
      const focusNode = selection.focusNode.parentElement;
      if (
        /^\d{1,}-\d{1,}$/.test(anchorNode.id) &&
        /^\d{1,}-\d{1,}$/.test(focusNode.id)
      ) {
        const beginNode =
          extractNumber(anchorNode.id, 0) <= extractNumber(focusNode.id, 0)
            ? anchorNode
            : focusNode;
        const beginNodeOffest =
          extractNumber(anchorNode.id, 0) <= extractNumber(focusNode.id, 0)
            ? selection.anchorOffset
            : selection.focusOffset;
        const endNode =
          extractNumber(anchorNode.id, 0) <= extractNumber(focusNode.id, 0)
            ? focusNode
            : anchorNode;
        const endNodeOffest =
          extractNumber(anchorNode.id, 0) <= extractNumber(focusNode.id, 0)
            ? selection.focusOffset
            : selection.anchorOffset;
        const begin = extractNumber(beginNode.id, 0) + beginNodeOffest;
        const end = extractNumber(endNode.id, 0) + endNodeOffest - 1;
        const boundingClientRect = selection
          .getRangeAt(0)
          .getBoundingClientRect();

        // dispatch
        dispatch(
          setValidSelection({
            begin,
            end,
            boundingClientRect
          })
        );
        console.log(begin);
        console.log(end);
      } else if (validSelection) dispatch(setValidSelection(null));
    } else if (validSelection) dispatch(setValidSelection(null));
  };

  const timeoutLength = phrase => {
    let pause =
      phrase.length > 10
        ? 500
        : phrase.length > 5
        ? 400
        : phrase.length > 4
        ? 300
        : 200;
    pause += /[.?!]$/.test(phrase) ? 300 : /[,:]$/.test(phrase) ? 100 : 0;
    return pause;
  };

  let stop = false;
  const nextIteration = index => {
    console.log(text.words[index]);
    if (stop) return;
    if (index === text.words.length - 1) return;
    setTimeout(() => {
      nextIteration(index + 1);
    }, timeoutLength(text.words[index]));
  };
  const startLoop = () => {
    // paste in correct start position
    nextIteration(0);
  };
  const stopLoop = () => {
    // save the current index
    // dont show the last word
    stop = true;
    // dispatch(lastIntervalIndex)
  };

  return (
    <div className='row grow  flex-row card' onMouseUp={mouseUpHandler}>
      {validSelection && <Tooltip />}
      <div className={`col-md-${12 - ui.mdAnnotationsPanel} box`}>
        <div className='row growContent'>
          <TextMain />
          {/* <button onClick={startLoop}>Start loop</button>
          <button onClick={stopLoop}>Stop loop</button> */}
        </div>
      </div>

      <div
        className={`col-md-${ui.mdAnnotationsPanel}`}
        style={{ display: ui.mdAnnotationsPanel > 0 ? 'block' : 'none' }}
      >
        <Sidepanel />
      </div>
    </div>
  );
}

export default Textpage;
