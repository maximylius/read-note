import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  expandAnnotationsPanel,
  closeSpeedReader
} from '../../../../../store/actions';
import TextMain from './TextMain';
import Sidepanel from './Annotations/Sidepanel';
import { IconContext } from 'react-icons';
import { BsBoxArrowInLeft, BsX } from 'react-icons/bs';
import SpeedReader from './SpeedReader/';

function Textpage({}) {
  const dispatch = useDispatch();
  const ui = useSelector(s => s.ui);
  const speedReader = useSelector(s => s.textsPanel.speedReader);
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);

  const [boundingRect, setBoundingRect] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  });
  const [displayOverlayButtons, setDisplayOverlayButtons] = useState(false);

  const mouseMoveHandler = React.useCallback(
    e => {
      if (e.clientY > boundingRect.bottom) {
        setDisplayOverlayButtons(false);
        return;
      }
      if (e.clientX < boundingRect.left) {
        setDisplayOverlayButtons(false);
        return;
      }
      if (e.clientY < boundingRect.top) {
        setDisplayOverlayButtons(false);
        return;
      }
      if (e.clientX > boundingRect.right) {
        setDisplayOverlayButtons(false);
        return;
      }
      setDisplayOverlayButtons(true);
    },
    [boundingRect]
  );

  const onMouseLeaveHandler = () => setDisplayOverlayButtons(false);
  const toggleAnnotationsPanel = () => dispatch(expandAnnotationsPanel());
  const closeSpeedReaderClickHandler = () =>
    dispatch(closeSpeedReader(activeTextPanel));
  React.useEffect(() => {
    const parentBounds = document
      .getElementById('textContentFlexGrow')
      .getBoundingClientRect();
    setBoundingRect({
      top: parentBounds.top,
      bottom: parentBounds.top + 300,
      left: parentBounds.right - 300,
      right: parentBounds.right
    });
    return () => {};
  }, [ui]);

  return (
    <div
      id='textContentFlexGrow'
      className='row flex-row growContent text-and-side-panel-container'
      {...(ui.mdAnnotationsPanel === 0 && {
        onMouseMove: mouseMoveHandler
      })}
      onMouseLeave={onMouseLeaveHandler}
    >
      <div
        style={{
          zIndex: 10,
          right: '1rem',
          position: 'absolute'
        }}
      >
        <button
          className='btn btn-lg btn-light mt-2'
          onClick={closeSpeedReaderClickHandler}
          style={{
            display: speedReader.isOpenFor.includes(activeTextPanel)
              ? 'block'
              : 'none'
          }}
        >
          <IconContext.Provider value={{ size: '1.5rem' }}>
            <BsX />
          </IconContext.Provider>
        </button>
        <div
          style={{
            display: displayOverlayButtons ? 'block' : 'none'
          }}
        >
          <button
            className='btn btn-lg btn-light mt-2'
            onClick={toggleAnnotationsPanel}
            style={{
              display: ui.mdAnnotationsPanel > 0 ? 'none' : 'block'
            }}
          >
            <IconContext.Provider value={{ size: '1.5rem' }}>
              <BsBoxArrowInLeft />
            </IconContext.Provider>
          </button>
        </div>
      </div>

      <div className={`col-md-${12 - ui.mdAnnotationsPanel} box`}>
        {speedReader.isOpenFor.includes(activeTextPanel) ? (
          // j
          // <></> //
          <SpeedReader key={activeTextPanel} />
        ) : (
          <div id='textMainCard' className='card'>
            <TextMain />
          </div>
        )}
      </div>
      <div
        className={`col-md-${ui.mdAnnotationsPanel} box pl-0 side-panel-container`}
        style={{ display: ui.mdAnnotationsPanel > 0 ? 'flex' : 'none' }}
      >
        <Sidepanel />
      </div>
    </div>
  );
}

export default Textpage;
