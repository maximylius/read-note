import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import FinderPanel from './FinderPanel/';
import Notes from './NotesPanel/';
import TextsPanel from './TextsPanel';
import Placeholder from './Placeholder';
import isEqual from 'lodash/isEqual';
import Flowchart from './Flowchart';

const Desk = () => {
  const openNotes = useSelector(s => s.notesPanel.openNotes);
  const addNotesTo = useSelector(s => s.notesPanel.addNotesTo);
  const mdFinderPanel = useSelector(s => s.panel.mdFinderPanel);
  const mdTextsPanel = useSelector(s => s.panel.mdTextsPanel);
  const mdNotesPanel = useSelector(s => s.panel.mdNotesPanel);
  const mdFlowchartPanel = useSelector(s => s.panel.mdFlowchartPanel);
  const mdInspectPanel = useSelector(s => s.panel.mdInspectPanel);
  const flowChartOpen = useSelector(s => s.modal.flowChartOpen);

  const [refRenderTrigger, setRefRenderTrigger] = React.useState(null);
  const testRef = React.useRef();
  const quillNoteRefs = React.useRef(
    Object.fromEntries(
      [new Set([...openNotes, addNotesTo])].map(id => ({ [id]: null }))
    )
  );

  const createSetNoteRef = id => ref => {
    quillNoteRefs.current[id] = ref;
  };

  useEffect(() => {
    setRefRenderTrigger(quillNoteRefs);
    return () => {};
  }, [isEqual(quillNoteRefs, refRenderTrigger)]);

  return (
    <>
      <div className='row grow flex-row mx-0 px-0' ref={testRef}>
        {flowChartOpen ? (
          <>
            <div
              className={`col-md-${mdFlowchartPanel} px-0 mx-0 box `}
              style={{
                display: mdFlowchartPanel > 0 ? 'flex' : 'none'
              }}
            >
              <Flowchart />
            </div>
          </>
        ) : (
          <>
            <div
              className={`col-md-${mdFinderPanel} px-0 mt-0 pt-0 box`}
              style={{
                display: mdFinderPanel > 0 ? 'flex' : 'none'
              }}
            >
              <FinderPanel />
            </div>
            <div
              className={`col-md-${mdTextsPanel} px-0 mx-0 box`}
              style={{
                display: mdTextsPanel > 0 ? 'flex' : 'none'
              }}
            >
              <TextsPanel quillNoteRefs={quillNoteRefs} />
            </div>
            <div
              className={`col-md-${mdNotesPanel} px-0 mx-0 box `}
              style={{
                display: mdNotesPanel > 0 ? 'flex' : 'none'
              }}
            >
              <Notes
                createSetNoteRef={createSetNoteRef}
                quillNoteRefs={quillNoteRefs}
              />
            </div>
            <div
              className={`col-md-${12 - mdFinderPanel} px-0 mx-0 box `}
              style={{
                display:
                  mdTextsPanel === 0 && mdNotesPanel === 0 ? 'flex' : 'none'
              }}
            >
              <Placeholder />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Desk;
