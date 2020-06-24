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
import Search from '../../FinderPanel/Search';

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
    <div className='col-3 bg-secondary'>
      <div className='row '>
        <span>
          <button
            className='btn btn-lg btn-light mt-1'
            onClick={closeSidepanel}
          >
            <IconContext.Provider value={{ size: '1.5rem' }}>
              <BsBoxArrowInRight />
            </IconContext.Provider>
          </button>
          <button
            className='btn btn-lg btn-light mt-1'
            onClick={closeFlowchart}
          >
            <IconContext.Provider value={{ size: '1.5rem' }}>
              <BsX />
            </IconContext.Provider>
          </button>
        </span>
        <h5>Search</h5>
        <Search />
        {/* use text editor instead of input field. disallow all formats expect mentions. filter by words search, # and @. varying placeholder can show examples. #topic to see only main notes. */}
        <h5>Filter</h5>
        <p>Ancestors: all | only | direct | none </p>
        <p>Descendants: all | only | direct | none </p>
        {inspectElements.map(el => {
          if (el.type === 'text')
            return (
              <InspectText
                key={el.id}
                id={el.id}
                flowchartInstance={flowchartInstance}
              />
            );
          if (el.type === 'section')
            return (
              <InspectSection
                key={el.id}
                id={el.id}
                flowchartInstance={flowchartInstance}
              />
            );
          if (el.type === 'annotation')
            return (
              <InspectAnnotation
                key={el.id}
                id={el.id}
                flowchartInstance={flowchartInstance}
              />
            );
          if (el.type === 'notebook')
            return (
              <InspectNotebook
                key={el.id}
                id={el.id}
                flowchartInstance={flowchartInstance}
              />
            );
          throw 'undefined element type to inspect in flowchart';
        })}
      </div>
    </div>
  );
};

export default FlowchartSidepanel;
