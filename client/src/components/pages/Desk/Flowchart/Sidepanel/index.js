import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconContext } from 'react-icons';
import { BsBoxArrowInRight } from 'react-icons/bs';
import { closeFlowchartSidepanel } from '../../../../../store/actions';
import InspectText from './InspectText';
import InspectSection from './InspectSection';
import InspectNote from './InspectNote';
import { Search } from './Search';
import SearchOptions from './SearchOptions';

const FlowchartSidepanel = ({}) => {
  const dispatch = useDispatch();
  const inspectElements = useSelector(s => s.inspect.inspectElements);
  const notes = useSelector(s => s.notes);
  const closeSidepanel = () => {
    dispatch(closeFlowchartSidepanel());
  };

  return (
    <div className='col-4 flowchart-sidepanel'>
      <button className='btn btn-lg btn-light mt-1' onClick={closeSidepanel}>
        <IconContext.Provider value={{ size: '1.5rem' }}>
          <BsBoxArrowInRight />
        </IconContext.Provider>
      </button>
      <Search />
      <SearchOptions container='sidepanel' />
      {inspectElements.map(el => (
        <div
          key={el.resId}
          className={`inspect-container inspect-${
            el.resType === 'note'
              ? notes[el.resId].isAnnotation
                ? 'annotation'
                : notes[el.resId].isReply
                ? 'reply'
                : el.resType
              : el.resType
          }`}
        >
          {el.resType === 'text' ? (
            <InspectText id={el.resId} />
          ) : el.resType === 'section' ? (
            <InspectSection id={el.resId} />
          ) : el.resType === 'note' ? (
            <InspectNote id={el.resId} />
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};

export default FlowchartSidepanel;
