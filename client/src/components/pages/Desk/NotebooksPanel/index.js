import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NotebookPanel from './NotebookPanel';
import NotebookPlaceholder from './NotebookPlaceholder';
import Nav from './Nav';
import {
  collapseNotebooksPanel,
  expandTextsPanel
} from '../../../../store/actions';
import SliderButton from '../../../Metapanel/SliderButton';

const Notebooks = ({ createSetNotebookRef, quillNotebookRefs }) => {
  const dispatch = useDispatch();
  const {
    annotations,
    sections,
    texts,
    textsPanel: { activeTextPanel, committedSectionIds, expandAll },
    notebooksPanel: { openNotebooks, activeNotebook },
    ui
  } = useSelector(state => state);
  const [notebooksToRender, setNotebooksToRender] = useState(openNotebooks);
  const notebooksInSync = (expandAll
    ? texts.byId[activeTextPanel].sectionIds
    : committedSectionIds
  )
    .flatMap(sectionId => sections.byId[sectionId].annotationIds)
    .flatMap(annotationId => annotations.byId[annotationId].syncWith);
  const syncNotebooksToRender = [...new Set([...notebooksInSync])].filter(
    notebookId => notebookId !== activeNotebook
  );
  const changeInNotebooksToRender =
    [...openNotebooks, ...syncNotebooksToRender].some(
      id => !notebooksToRender.includes(id)
    ) ||
    notebooksToRender.some(
      id =>
        !notebooksToRender.includes([
          ...openNotebooks,
          ...syncNotebooksToRender
        ])
    );

  const onClickHandler = () => {
    if (ui.mdTextsPanel === 0) {
      dispatch(expandTextsPanel());
    } else {
      dispatch(collapseNotebooksPanel());
    }
  };

  React.useEffect(() => {
    setNotebooksToRender([
      ...new Set([...openNotebooks, ...syncNotebooksToRender])
    ]);
    return () => {};
  }, [changeInNotebooksToRender, activeNotebook]);

  return (
    <div className='row grow  flex-row'>
      <SliderButton
        onClickHandler={onClickHandler}
        direction='right'
        addClasses='btn-light'
        display='block'
      />

      <div className='col px-0 box pr-4'>
        <Nav />
        <div className='row growContent card mx-0'>
          {notebooksToRender.map(notebookId => (
            <div
              style={{
                display: notebookId === activeNotebook ? 'block' : 'none'
              }}
              key={notebookId}
            >
              <NotebookPanel
                quillNotebookRefs={quillNotebookRefs}
                setNotebookRef={createSetNotebookRef(notebookId)}
                notebookId={notebookId}
              />
            </div>
          ))}
          {openNotebooks.length === 0 && <NotebookPlaceholder />}
        </div>
      </div>
    </div>
  );
};

export default Notebooks;
