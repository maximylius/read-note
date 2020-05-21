import React from 'react';
import { useSelector } from 'react-redux';

const ProgressBar = () => {
  const progress = useSelector(state => state.textsPanel.progress);
  return (
    <div>
      <span id='progressText'>{Math.round(progress)}</span>
      <span>% of text categorized:</span>
      <progress id='progressBar' value={progress} max='100'></progress>
    </div>
  );
};
export default ProgressBar;
