import React from 'react';
import { useSelector } from 'react-redux';
import RecursiveDivs from './RecursiveDivs';
const TextMain = () => {
  const {
    textsPanel: { activeTextPanel },
    texts
  } = useSelector(state => state);
  const divsToDisplay = activeTextPanel
    ? texts.byId[activeTextPanel].divs
      ? texts.byId[activeTextPanel].divs
      : []
    : [];

  return (
    <div className='card'>
      <div className='card-body'>
        {divsToDisplay.map((span, index) => (
          <RecursiveDivs key={index} span={span} />
        ))}
      </div>
    </div>
  );
};

export default TextMain;
