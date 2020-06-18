import React, { useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipBackward,
  BsSkipForward,
  BsDash,
  BsPlus
} from 'react-icons/bs';
import {
  pauseSpeedReader,
  playSpeedReader
} from '../../../../../../store/actions';
const rythms = ['natural', 'stacato', 'mechanical']; //add optimized

const customProgressFunctionPre = (length, index, minIndex, end, exceeded) => {
  let pre = Math.min(minIndex, index) / length;
  return pre * 100;
};
const customProgressFunctionRead = (length, index, minIndex, end, exceeded) => {
  let read = index <= minIndex ? 0 : (index - minIndex) / length;
  return read * 100;
};
const customProgressFunctionUnread = (
  length,
  index,
  minIndex,
  end,
  exceeded
) => {
  let unread = ((exceeded ? length : Math.max(end, index)) - index) / length;
  return unread * 100;
};
function SpeedReader() {
  const dispatch = useDispatch();
  const {
    ui,
    textsPanel: { speedReader, activeTextPanel }
  } = useSelector(state => state);
  const words = speedReader.words;
  const end = speedReader.byId[activeTextPanel].end;
  const endRef = useRef(speedReader.byId[activeTextPanel].end);
  // const [words, setWords] = useState(speedReader.words);
  const [index, _setIndex] = useState(speedReader.byId[activeTextPanel].index);
  const indexRef = useRef(speedReader.byId[activeTextPanel].index);
  const setIndex = to => {
    _setIndex(to);
    indexRef.current = to;
  };
  const [minIndex, setMinIndex] = useState(
    speedReader.byId[activeTextPanel].begin
  );
  const minIndexRef = useRef(speedReader.byId[activeTextPanel].begin);

  // const [pause, setPause] = useState(true);
  const pause = !speedReader.byId[activeTextPanel].play;
  const pausedAtRef = React.useRef(null);
  const reachedEndRef = React.useRef(null);
  const [mouseIsDown, _setMouseIsDown] = useState(false);
  const mouseIsDownRef = React.useRef(false);
  const setMouseIsDown = useCallback(bool => {
    _setMouseIsDown(bool);
    mouseIsDownRef.current = bool;
  }, []);
  const boundsRef = React.useRef();
  const [rythm, setRythm] = useState(2);
  const [speed, setSpeed] = useState(300);

  const mouseUpHandler = useCallback(e => {
    if (mouseIsDownRef.current) {
      progressMoveHandler(e);
      setMouseIsDown(false);
    }
  }, []);

  const calcTimeoutLength = useCallback(
    phrase => {
      // this section shall always be at 400 wpm
      let timeoutMs =
        phrase.plainText.length > 10
          ? [400, 360, 330][rythm]
          : phrase.plainText.length > 5
          ? [350, 340, 330][rythm]
          : phrase.plainText.length > 4
          ? [300, 320, 330][rythm]
          : [220, 250, 330][rythm];
      timeoutMs += /[.?!]$/.test(phrase.plainText)
        ? [200, 50, 0][rythm]
        : /[,:]$/.test(phrase.plainText)
        ? [50, 20, 0][rythm]
        : 0;
      timeoutMs = (timeoutMs * 200) / speed;
      return timeoutMs;
    },
    [rythm, speed]
  );

  const playClickHandler = () => {
    dispatch(playSpeedReader(activeTextPanel));
    if (reachedEndRef.current === true) {
      reachedEndRef.current = 'exceeded';
      endRef.current = words.length - 1;
    }
    setMinIndex(Math.min(minIndex, index));
    minIndexRef.current = Math.min(minIndex, index);
    // setPause(false);
  };
  const pauseClickHandler = useCallback(() => {
    // setPause(true);
    dispatch(
      pauseSpeedReader(
        activeTextPanel,
        minIndexRef.current,
        endRef.current,
        indexRef.current
      )
    );
  }, []);

  const rewindClickHandler = () => {
    setIndex(Math.max(0, index - 4));
    if (pausedAtRef.current) pausedAtRef.current = Math.max(0, index - 4);
  };
  const rewindDblClickHandler = () => {
    setIndex(Math.max(0, index - 12));
    if (pausedAtRef.current) pausedAtRef.current = Math.max(0, index - 12);
  };
  const skipClickHandler = () => {
    setIndex(Math.min(words.length - 1, index + 4));
    if (pausedAtRef.current)
      pausedAtRef.current = Math.min(words.length - 1, index + 4);
  };
  const skipdDblClickHandler = () => {
    setIndex(Math.min(words.length - 1, index + 12));
    if (pausedAtRef.current)
      pausedAtRef.current = Math.min(words.length - 1, index + 12);
  };

  const reduceSpeedClickHandler = useCallback(
    () => setSpeed(prevState => Math.max(25, prevState - 25)),
    []
  );
  const reduceSpeedDblClickHandler = useCallback(
    () => setSpeed(prevState => Math.max(25, prevState - 100)),
    []
  );
  const increaseSpeedClickHandler = useCallback(
    () => setSpeed(prevState => prevState + 25),
    []
  );
  const increaseSpeedDblClickHandler = useCallback(
    () => setSpeed(prevState => prevState + 100),
    []
  );
  const toggleRythm = useCallback(
    () =>
      setRythm(prevState =>
        prevState === rythms.length - 1 ? 0 : prevState + 1
      ),
    []
  );

  const progressMouseDownHandler = useCallback(() => setMouseIsDown(true), []);
  const progressMoveHandler = useCallback(e => {
    const percentageFromLeft =
      (e.clientX - boundsRef.current.left) / boundsRef.current.width;
    const newIndex = Math.max(
      0,
      Math.min(Math.round(percentageFromLeft * words.length), words.length - 1)
    );
    setIndex(newIndex);
    if (pausedAtRef.current) pausedAtRef.current = newIndex;
  }, []);

  React.useEffect(() => {
    if (!mouseIsDown) return;
    document.addEventListener('mousemove', progressMoveHandler);
    return () => {
      document.removeEventListener('mousemove', progressMoveHandler);
    };
  }, [mouseIsDown]);

  React.useEffect(() => {
    if (pause) {
      if (pausedAtRef.current) return;
      pausedAtRef.current = Math.max(minIndex, index - 1);
      setIndex(Math.max(0, index - 1));
      return;
    }
    if (
      index === words.length - 1 ||
      (index === end && reachedEndRef.current !== 'exceeded')
    ) {
      dispatch(
        pauseSpeedReader(
          activeTextPanel,
          minIndexRef.current,
          endRef.current,
          indexRef.current
        )
      );
      // setPause(true);
      if (index === end) {
        reachedEndRef.current = true;
      }
      return;
    }
    if (pausedAtRef.current) pausedAtRef.current = null;
    setTimeout(() => {
      setIndex(index + 1);
    }, calcTimeoutLength(words[index]));
  }, [pause, index]);

  React.useEffect(() => {
    console.log('mounting speedreader:', speedReader.byId[activeTextPanel]);
    document.addEventListener('mouseup', mouseUpHandler);
    return () => {
      document.removeEventListener('mouseup', mouseUpHandler);
      dispatch(
        pauseSpeedReader(
          activeTextPanel,
          minIndexRef.current,
          endRef.current,
          indexRef.current
        )
      );
    };
  }, []);

  React.useEffect(() => {
    boundsRef.current = document
      .querySelector('.row.custom-progress')
      .getBoundingClientRect();
  }, [ui]);

  return (
    <div className='container'>
      <p style={{ fontSize: '500%', marginTop: '5rem', marginBottom: '5rem' }}>
        {words[pausedAtRef.current || index].plainText}
      </p>
      <div className='row'>
        <button
          className='btn btn-light btn-lg'
          onClick={rewindClickHandler}
          onDoubleClick={rewindDblClickHandler}
        >
          <BsSkipBackward />
        </button>
        <button
          className='btn btn-light btn-lg'
          onClick={pause ? playClickHandler : pauseClickHandler}
        >
          {pause ? <BsPlayFill /> : <BsPauseFill />}
        </button>
        <button
          className='btn btn-light btn-lg'
          onClick={skipClickHandler}
          onDoubleClick={skipdDblClickHandler}
        >
          <BsSkipForward />
        </button>
        <button
          className='btn btn-light btn-lg'
          onClick={reduceSpeedClickHandler}
          onDoubleClick={reduceSpeedDblClickHandler}
        >
          <BsDash />
        </button>
        x{(speed / 200).toFixed(2)}
        <button
          className='btn btn-light btn-lg'
          onClick={increaseSpeedClickHandler}
          onDoubleClick={increaseSpeedDblClickHandler}
        >
          <BsPlus />
        </button>
        <button className='btn btn-light btn-lg' onClick={toggleRythm}>
          Rythm: {rythms[rythm]}
        </button>
        <span style={{ display: pause ? 'block' : 'none' }}>
          <span>Words per Minute:</span>
          <span>Time until finished:</span>
        </span>
      </div>
      <div className='pt-3' onMouseDown={progressMouseDownHandler}>
        <div className='row custom-progress'>
          <div
            className='pre-contents'
            style={{
              width: `${customProgressFunctionPre(
                words.length,
                index,
                minIndex,
                end,
                reachedEndRef.current === 'exceeded'
              )}%`
            }}
          ></div>
          <div
            className='read-contents-read'
            style={{
              width: `${customProgressFunctionRead(
                words.length,
                index,
                minIndex,
                end,
                reachedEndRef.current === 'exceeded'
              )}%`
            }}
          ></div>
          <div
            className='read-contents-unread'
            style={{
              width: `${customProgressFunctionUnread(
                words.length,
                index,
                minIndex,
                end,
                reachedEndRef.current === 'exceeded'
              )}%`
            }}
          ></div>
          {/* <div
            className='post-contents'
            style={{
              width: `${0}%`
            }}
          ></div> */}
        </div>
      </div>
    </div>
  );
}

export default SpeedReader;
