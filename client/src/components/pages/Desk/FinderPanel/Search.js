import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BsSearch } from 'react-icons/bs';

const FinderSearch = () => {
  const notes = useSelector(s => s.notes);
  const [searchString, setSearchString] = useState('');
  return (
    <div className='row static'>
      <form className='form-inline form-lg' style={{ display: 'block' }}>
        <div className='input-group mb-2'>
          <div className='input-group-prepend' id='note-search'>
            <span className='input-group-text'>
              <BsSearch />
            </span>
          </div>
          <input
            type='text'
            className='form-control'
            aria-label='Search notes'
            aria-describedby='note-search'
            placeholder='Search...'
            value={searchString}
            onChange={e => setSearchString(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default FinderSearch;
