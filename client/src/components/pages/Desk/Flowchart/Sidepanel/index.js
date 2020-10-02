import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconContext } from 'react-icons';
import { BsBoxArrowInRight, BsX } from 'react-icons/bs';
import {
  toggleFlowchart,
  closeFlowchartSidepanel
} from '../../../../../store/actions';
import InspectText from './InspectText';
import InspectSection from './InspectSection';
import InspectNote from './InspectNote';
import { Search } from './Search';
import SearchOptions from './SearchOptions';

const FlowchartSidepanel = ({}) => {
  const dispatch = useDispatch();
  const inspectElements = useSelector(s => s.inspect.inspectElements);
  const closeSidepanel = () => {
    dispatch(closeFlowchartSidepanel());
  };
  console.log(inspectElements);
  return (
    <div className='col-4 flowchart-sidepanel'>
      <span>
        <button className='btn btn-lg btn-light mt-1' onClick={closeSidepanel}>
          <IconContext.Provider value={{ size: '1.5rem' }}>
            <BsBoxArrowInRight />
          </IconContext.Provider>
        </button>
      </span>
      <Search />
      <SearchOptions />
      {inspectElements.map(el => (
        <div key={el.id} className={`inspect-container inspect-${el.type}`}>
          {el.type === 'text' ? (
            <InspectText id={el.id} />
          ) : el.type === 'section' ? (
            <InspectSection id={el.id} />
          ) : el.type === 'note' ? (
            <InspectNote id={el.id} />
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};

export default FlowchartSidepanel;
