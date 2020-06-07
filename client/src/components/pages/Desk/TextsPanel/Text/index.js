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

function Textpage({ quillNotebookRef }) {
  const dispatch = useDispatch();
  const quillTextRef = React.useRef(null);
  const [boundingRect, setBoundingRect] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  });
  const [displayOverlayButtons, setDisplayOverlayButtons] = useState(false);
  const {
    ui,
    textsPanel: { speedReader, speedReaderIsOpen }
  } = useSelector(state => state);
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
  const closeSpeedReaderClickHandler = () => dispatch(closeSpeedReader());
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
      className='row grow  flex-row card mx-0'
      onMouseLeave={onMouseLeaveHandler}
    >
      <div className={`col-md-${12 - ui.mdAnnotationsPanel} box`}>
        <div
          className='row growContent'
          {...(ui.mdAnnotationsPanel === 0 && {
            onMouseMove: mouseMoveHandler
          })}
        >
          <div
            style={{
              zIndex: 10,
              right: '1rem',
              position: 'absolute',
              display: displayOverlayButtons ? 'block' : 'none'
            }}
          >
            <button
              className='btn btn-lg btn-light mt-2'
              onClick={closeSpeedReaderClickHandler}
              style={{
                display: speedReader.isOpen ? 'block' : 'none'
              }}
            >
              <IconContext.Provider value={{ size: '1.5rem' }}>
                <BsX />
              </IconContext.Provider>
            </button>

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

          {speedReader.isOpen && <SpeedReader />}

          <div style={{ display: speedReader.isOpen ? 'none' : 'block' }}>
            <TextMain
              quillTextRef={quillTextRef}
              quillNotebookRef={quillNotebookRef}
            />
          </div>
        </div>
      </div>

      <div
        className={`col-md-${ui.mdAnnotationsPanel}`}
        style={{ display: ui.mdAnnotationsPanel > 0 ? 'block' : 'none' }}
      >
        <Sidepanel
          quillTextRef={quillTextRef}
          quillNotebookRef={quillNotebookRef}
        />
      </div>
    </div>
  );
}

export default Textpage;
