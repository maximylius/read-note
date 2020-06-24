import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FinderPanel from './FinderPanel/';
import Notebooks from './NotebooksPanel/';
import TextsPanel from './TextsPanel';
import Placeholder from './Placeholder';
import { loadText, loadNotebooks } from '../../../store/actions';
import isEqual from 'lodash/isEqual';
import Flowchart from './Flowchart';

const Desk = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const {
    ui,
    notebooksPanel: { openNotebooks, addNotesTo }
  } = useSelector(state => state);
  const [refRenderTrigger, setRefRenderTrigger] = React.useState(null);
  const testRef = React.useRef();
  const quillNotebookRefs = React.useRef(
    Object.fromEntries(
      [new Set([...openNotebooks, addNotesTo])].map(id => ({ [id]: null }))
    )
  );

  const createSetNotebookRef = id => ref => {
    quillNotebookRefs.current[id] = ref;
  };

  useEffect(() => {
    console.log(
      '=======',
      isEqual(quillNotebookRefs, refRenderTrigger),
      quillNotebookRefs
    );
    setRefRenderTrigger(quillNotebookRefs);
    return () => {};
  }, [isEqual(quillNotebookRefs, refRenderTrigger)]);

  useEffect(() => {
    if (params.textIds) {
      const textParams = params.textIds.split('+');
      textParams.forEach(param => {
        dispatch(
          loadText({
            textId: param.split('-')[0],
            openText: true,
            setToActive: Boolean(param.split('-')[1]),
            history: null
          })
        );
      });
      console.log(textParams);
    }
    if (params.notebookIds) {
      const notebookParams = params.notebookIds.split('+');
      console.log(notebookParams);
      notebookParams.forEach(param => {
        dispatch(
          loadNotebooks({
            notebookIds: [param.split('-')[0]],
            open: true,
            setToActive: Boolean(param.split('-')[1])
              ? param.split('-')[0]
              : false,
            history: null
          })
        );
      });
    }
    return () => {};
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {/* <Flowchart /> */}
      <div className='row grow flex-row mx-0 px-0' ref={testRef}>
        <div
          className={`col-md-${ui.mdFinderPanel} px-0 mt-0 pt-0 box`}
          style={{
            display: ui.mdFinderPanel > 0 ? 'flex' : 'none'
          }}
        >
          <FinderPanel />
        </div>
        <div
          className={`col-md-${ui.mdTextsPanel} px-0 mx-0 box`}
          style={{
            display: ui.mdTextsPanel > 0 ? 'flex' : 'none'
          }}
        >
          <TextsPanel quillNotebookRefs={quillNotebookRefs} />
        </div>
        <div
          className={`col-md-${ui.mdNotebooksPanel} px-0 mx-0 box `}
          style={{
            display: ui.mdNotebooksPanel > 0 ? 'flex' : 'none'
          }}
        >
          <Notebooks
            createSetNotebookRef={createSetNotebookRef}
            quillNotebookRefs={quillNotebookRefs}
          />
        </div>
        <div
          className={`col-md-${12 - ui.mdFinderPanel} px-0 mx-0 box `}
          style={{
            display:
              ui.mdTextsPanel === 0 && ui.mdNotebooksPanel === 0
                ? 'flex'
                : 'none'
          }}
        >
          <Placeholder />
        </div>
      </div>
    </>
  );
};

export default Desk;
