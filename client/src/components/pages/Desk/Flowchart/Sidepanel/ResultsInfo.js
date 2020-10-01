import React from 'react';
import { useSelector } from 'react-redux';

const ResultsInfo = ({ searchEntered }) => {
  const strictSearchResults = useSelector(s => s.inspect.strictSearchResults);
  let message = <></>;
  let addClass = '';
  if (!searchEntered) {
    addClass += 'no-search';
  } else {
    if (strictSearchResults && strictSearchResults.length) {
      message = <span>{`${strictSearchResults.length} results.`}</span>;
      addClass += 'search-results';
    } else {
      message = <span>No search results.</span>;
      addClass += 'no-results';
    }
  }
  return <div className={`search-results-info ${addClass}`}>{message}</div>;
};

export default ResultsInfo;
