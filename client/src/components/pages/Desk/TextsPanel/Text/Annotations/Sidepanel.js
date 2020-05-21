import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionItem from './SectionItem';
import {
  setExpandAll,
  collapseAnnotationsPanel
} from '../../../../../../store/actions';
import { IconContext } from 'react-icons';
import {
  BsBoxArrowInLeft,
  BsArrowsCollapse,
  BsArrowsExpand,
  BsInfoCircle
} from 'react-icons/bs';

const Sidepanel = () => {
  const dispatch = useDispatch();
  const {
    sections,
    texts,
    textsPanel: { activeTextPanel, expandAll }
  } = useSelector(state => state);
  const text = texts.byId[activeTextPanel];
  const sectionsToDisplay = text
    ? text.sectionIds.filter(id => Object.keys(sections.byId).includes(id))
    : [];

  const toggleAnnotationsPanel = () => dispatch(collapseAnnotationsPanel());
  const toggleExpandAll = () =>
    dispatch(setExpandAll({ expandAll: !expandAll }));

  return (
    <>
      <button
        className='btn btn-lg btn-light mt-2'
        onClick={toggleAnnotationsPanel}
      >
        <IconContext.Provider value={{ size: '1.5rem' }}>
          <BsBoxArrowInLeft />
        </IconContext.Provider>
      </button>

      <button className='btn btn-lg btn-light mt-2' onClick={toggleExpandAll}>
        <IconContext.Provider value={{ size: '1.5rem' }}>
          {expandAll ? <BsArrowsCollapse /> : <BsArrowsExpand />}
        </IconContext.Provider>
      </button>
      <ul className='list-group pt-4'>
        {/* 2do: sort sections correctly /.reduce can create new sorted object/ */}
        {sectionsToDisplay.length > 0 ? (
          sectionsToDisplay.map(id => <SectionItem key={id} sectionId={id} />)
        ) : (
          <p>
            <small>
              <BsInfoCircle /> Add sections and annotations by selecting text...
            </small>{' '}
          </p>
        )}
      </ul>
    </>
  );
};

export default Sidepanel;
