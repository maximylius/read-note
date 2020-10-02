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
      message = (
        <span>{`${strictSearchResults.length} results: ${
          strictSearchResults.filter(el => el.resType === 'note').length
        } notes, ${
          strictSearchResults.filter(el => el.resType === 'text').length
        } texts, ${
          strictSearchResults.filter(el => el.resType === 'section').length
        } sections.`}</span>
      );
      addClass += 'search-results';
    } else {
      message = <span>No search results.</span>;
      addClass += 'no-results';
    }
  }
  return <div className={`search-results-info ${addClass}`}>{message}</div>;
};

export default ResultsInfo;
