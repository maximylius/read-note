import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleDisplayFlowChartNonMatches,
  setFilterAncestorsFlowchart,
  setFilterDescendantsFlowchart,
  toggleTypesFilterFlowchart,
  toggleSearchWithinTextcontentFlowchart
} from '../../../../../store/actions';
import { BsFilter, BsSearch } from 'react-icons/bs';

const SearchOptions = ({ container }) => {
  const dispatch = useDispatch();
  const searchWithinTextcontent = useSelector(
    s => s.inspect.searchWithinTextcontent
  );
  const displayNonMatches = useSelector(s => s.inspect.displayNonMatches);
  const filterTypes = useSelector(s => s.inspect.filterTypes);
  const filterAncestors = useSelector(s => s.inspect.filterAncestors);
  const filterDescendants = useSelector(s => s.inspect.filterDescendants);
  const btnColor = container !== 'fullscreen' ? 'btn-secondary' : 'btn-light';
  return (
    <details
      open={container !== 'fullscreen'}
      className={`search-options-${container}`}
    >
      <summary>
        <strong>
          Search Options <BsFilter />
        </strong>
      </summary>
      {/* search text content */}
      <div>
        Search within text content:{' '}
        <button
          className={`btn btn-sm ${btnColor} ${
            searchWithinTextcontent ? 'active' : ''
          }`}
          onClick={() => dispatch(toggleSearchWithinTextcontentFlowchart())}
        >
          {searchWithinTextcontent ? 'on' : 'off'}
        </button>
      </div>
      {/* non matches */}
      <div>
        Hide non-matches{' '}
        <button
          className={`btn btn-sm ${btnColor} ${
            displayNonMatches ? 'active' : ''
          }`}
          onClick={() => dispatch(toggleDisplayFlowChartNonMatches())}
        >
          {displayNonMatches ? 'off' : 'on'}
        </button>
      </div>
      {/* filter types */}
      <div>
        Show{' '}
        <div className='btn-group'>
          <button
            className={`btn btn-sm ${btnColor} ${
              filterTypes.includes('texts') ? 'active' : ''
            }`}
            onClick={() => dispatch(toggleTypesFilterFlowchart('texts'))}
          >
            texts
          </button>
          <button
            className={`btn btn-sm ${btnColor} ${
              filterTypes.includes('sections') ? 'active' : ''
            }`}
            onClick={() => dispatch(toggleTypesFilterFlowchart('sections'))}
          >
            sections
          </button>
          <button
            className={`btn btn-sm ${btnColor} ${
              filterTypes.includes('annotations') ? 'active' : ''
            }`}
            onClick={() => dispatch(toggleTypesFilterFlowchart('annotations'))}
          >
            annotations
          </button>
          <button
            className={`btn btn-sm ${btnColor} ${
              filterTypes.includes('replies') ? 'active' : ''
            }`}
            onClick={() => dispatch(toggleTypesFilterFlowchart('replies'))}
          >
            replies
          </button>
          <button
            className={`btn btn-sm ${btnColor} ${
              filterTypes.includes('notes') ? 'active' : ''
            }`}
            onClick={() => dispatch(toggleTypesFilterFlowchart('notes'))}
          >
            notes
          </button>
        </div>
      </div>
      {/* <div>
        Ancestors:{' '}
        <div className='btn-group'>
          <button
            className={`btn btn-sm ${btnColor} ${
              filterAncestors === 'all' ? 'active' : ''
            }`}
            onClick={() => dispatch(setFilterAncestorsFlowchart('all'))}
          >
            all
          </button>
          <button
            className={`btn btn-sm ${btnColor} ${
              filterAncestors.startsWith('direct') ? 'active' : ''
            }`}
            onClick={() => dispatch(setFilterAncestorsFlowchart('direct'))}
          >
            only direct
          </button>
          <button
            className={`btn btn-sm ${btnColor} ${
              filterAncestors === 'none' ? 'active' : ''
            }`}
            onClick={() => dispatch(setFilterAncestorsFlowchart('none'))}
          >
            none
          </button>
        </div>
      </div>
      <div>
        Descendants:{' '}
        <div className='btn-group'>
          <button
            className={`btn btn-sm ${btnColor} ${
              filterDescendants === 'all' ? 'active' : ''
            }`}
            onClick={() => dispatch(setFilterDescendantsFlowchart('all'))}
          >
            all
          </button>
          <button
            className={`btn btn-sm ${btnColor} ${
              filterDescendants.startsWith('direct') ? 'active' : ''
            }`}
            onClick={() => dispatch(setFilterDescendantsFlowchart('direct'))}
          >
            only direct
          </button>
          <button
            className={`btn btn-sm ${btnColor} ${
              filterDescendants === 'none' ? 'active' : ''
            }`}
            onClick={() => dispatch(setFilterDescendantsFlowchart('none'))}
          >
            none
          </button>
        </div>
      </div> */}
    </details>
  );
};

export default SearchOptions;
