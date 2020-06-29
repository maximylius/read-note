import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconContext } from 'react-icons';
import { BsBoxArrowInRight, BsX } from 'react-icons/bs';
import {
  toggleFlowchart,
  closeFlowchartSidepanel
} from '../../../../../store/actions';
import InspectText from './InspectText';
import InspectAnnotation from './InspectAnnotation';
import InspectSection from './InspectSection';
import InspectNotebook from './InspectNotebook';
import { Search } from './Search';
import FilterOptions from './FilterOptions';

const FlowchartSidepanel = ({ flowchartInstance }) => {
  const dispatch = useDispatch();
  const {
    flowchart: { inspectElements }
  } = useSelector(state => state);
  const closeSidepanel = () => {
    dispatch(closeFlowchartSidepanel());
  };
  const closeFlowchart = () => {
    dispatch(toggleFlowchart());
    setTimeout(() => {
      flowchartInstance.fitView();
    }, 30);
  };
  console.log(inspectElements);
  return (
    <div className='col-3 flowchartSidepanel'>
      <span>
        <button className='btn btn-lg btn-light mt-1' onClick={closeSidepanel}>
          <IconContext.Provider value={{ size: '1.5rem' }}>
            <BsBoxArrowInRight />
          </IconContext.Provider>
        </button>
        <button className='btn btn-lg btn-light mt-1' onClick={closeFlowchart}>
          <IconContext.Provider value={{ size: '1.5rem' }}>
            <BsX />
          </IconContext.Provider>
        </button>
      </span>
      <Search />
      {/* use text editor instead of input field. disallow all formats expect mentions. filter by words search, # and @. varying placeholder can show examples. #topic to see only main notes. */}
      <FilterOptions />
      {inspectElements.map(el => (
        <div key={el.id} className='flowchartInspectElContainer'>
          {el.type === 'text' ? (
            <InspectText id={el.id} flowchartInstance={flowchartInstance} />
          ) : el.type === 'section' ? (
            <InspectSection id={el.id} flowchartInstance={flowchartInstance} />
          ) : el.type === 'annotation' ? (
            <InspectAnnotation
              id={el.id}
              flowchartInstance={flowchartInstance}
            />
          ) : el.type === 'notebook' ? (
            <InspectNotebook id={el.id} flowchartInstance={flowchartInstance} />
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};

export default FlowchartSidepanel;
