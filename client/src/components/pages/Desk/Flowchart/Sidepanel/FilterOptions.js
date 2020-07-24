import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleDisplayFlowChartNonMatches,
  setFilterAncestorsFlowchart,
  setFilterDescendantsFlowchart,
  toggleTypesFilterFlowchart
} from '../../../../../store/actions';
import { BsFilter } from 'react-icons/bs';

const FilterOptions = () => {
  const dispatch = useDispatch();
  const displayNonMatches = useSelector(s => s.flowchart.displayNonMatches);
  const filterTypes = useSelector(s => s.flowchart.filterTypes);
  const filterAncestors = useSelector(s => s.flowchart.filterAncestors);
  const filterDescendants = useSelector(s => s.flowchart.filterDescendants);
  return (
    <details>
      <summary>
        <strong>
          Filter <BsFilter />
        </strong>
      </summary>
      {/* non matches */}
      <div>
        Hide non-matches{' '}
        <button
          className={`btn btn-sm btn-secondary ${
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
            className={`btn btn-sm btn-secondary ${
              filterTypes.includes('texts') ? 'active' : ''
            }`}
            onClick={() => dispatch(toggleTypesFilterFlowchart('texts'))}
          >
            texts
          </button>
          <button
            className={`btn btn-sm btn-secondary ${
              filterTypes.includes('sections') ? 'active' : ''
            }`}
            onClick={() => dispatch(toggleTypesFilterFlowchart('sections'))}
          >
            sections
          </button>
          <button
            className={`btn btn-sm btn-secondary ${
              filterTypes.includes('notes') ? 'active' : ''
            }`}
            onClick={() => dispatch(toggleTypesFilterFlowchart('notes'))}
          >
            notes
          </button>
        </div>
      </div>
      <div>
        Ancestors:{' '}
        <div className='btn-group'>
          <button
            className={`btn btn-sm btn-secondary ${
              filterAncestors === 'all' ? 'active' : ''
            }`}
            onClick={() => dispatch(setFilterAncestorsFlowchart('all'))}
          >
            all
          </button>
          <button
            className={`btn btn-sm btn-secondary ${
              filterAncestors.startsWith('direct') ? 'active' : ''
            }`}
            onClick={() => dispatch(setFilterAncestorsFlowchart('direct'))}
          >
            only direct
          </button>
          <button
            className={`btn btn-sm btn-secondary ${
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
            className={`btn btn-sm btn-secondary ${
              filterDescendants === 'all' ? 'active' : ''
            }`}
            onClick={() => dispatch(setFilterDescendantsFlowchart('all'))}
          >
            all
          </button>
          <button
            className={`btn btn-sm btn-secondary ${
              filterDescendants.startsWith('direct') ? 'active' : ''
            }`}
            onClick={() => dispatch(setFilterDescendantsFlowchart('direct'))}
          >
            only direct
          </button>
          <button
            className={`btn btn-sm btn-secondary ${
              filterDescendants === 'none' ? 'active' : ''
            }`}
            onClick={() => dispatch(setFilterDescendantsFlowchart('none'))}
          >
            none
          </button>
        </div>
      </div>
    </details>
  );
};

export default FilterOptions;
