import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FinderPanel from './FinderPanel/';
import Notes from './NotesPanel/';
import TextsPanel from './TextsPanel';
import Placeholder from './Placeholder';
import { loadText, loadNotes } from '../../../store/actions';
import isEqual from 'lodash/isEqual';
import Flowchart from './Flowchart';
import { regExpOpenTexts } from '../../../functions/main';

const Desk = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const openTextPanels = useSelector(s => s.textsPanel.openTextPanels);
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const openNotes = useSelector(s => s.notesPanel.openNotes);
  const activeNote = useSelector(s => s.notesPanel.activeNote);
  const addNotesTo = useSelector(s => s.notesPanel.addNotesTo);
  const mdFinderPanel = useSelector(s => s.ui.mdFinderPanel);
  const mdTextsPanel = useSelector(s => s.ui.mdTextsPanel);
  const mdNotesPanel = useSelector(s => s.ui.mdNotesPanel);
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

  useEffect(() => {
    if (params.textIds) {
      const textParams = params.textIds.split('+');
      const textsParamsToLoad = textParams.filter(
        param =>
          !openTextPanels.includes(param.split('-')[0]) ||
          (param.split('-')[1] == '1' &&
            param.split('-')[0] !== activeTextPanel)
      );
      let nextActiveText = false;
      const textsToLoad = textsParamsToLoad.map(param => {
        if (param.split('-')[1] === '1') nextActiveText = param.split('-')[0];
        return param.split('-')[0];
      });
      textsToLoad.forEach(textId => {
        dispatch(
          loadText({
            textId: textId,
            openText: true,
            setToActive: textId === nextActiveText,
            history: null
          })
        );
      });
    }
    if (params.noteIds) {
      const noteParams = params.noteIds.split('+');
      const notesParamsToLoad = noteParams.filter(
        param =>
          !openNotes.includes(param.split('-')[0]) ||
          (param.split('-')[1] == '1' && param.split('-')[0] !== activeNote)
      );
      let nextActiveNote = false;
      const notesToLoad = notesParamsToLoad.map(param => {
        if (param.split('-')[1] === '1') nextActiveNote = param.split('-')[0];
        return param.split('-')[0];
      });

      notesToLoad.forEach(noteId => {
        dispatch(
          loadNotes({
            noteIds: [noteId],
            open: true,
            setToActive: noteId === nextActiveNote ? noteId : false,
            history: null
          })
        );
      });
    }
    return () => {};
    // eslint-disable-next-line
  }, [params]);

  return (
    <>
      {/* <Flowchart /> */}
      <div className='row grow flex-row mx-0 px-0' ref={testRef}>
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
            display: mdTextsPanel === 0 && mdNotesPanel === 0 ? 'flex' : 'none'
          }}
        >
          <Placeholder />
        </div>
      </div>
    </>
  );
};

export default Desk;
