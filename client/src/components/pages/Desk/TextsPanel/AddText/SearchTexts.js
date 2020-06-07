import React, { useState } from 'react';
import InputWithPrepend from '../../../../Metapanel/InputWithPrepend';
import { BsSearch } from 'react-icons/bs';

function SearchTexts() {
  const [searchString, setSearchString] = useState('');
  const onChangeHandler = e => {
    console.log(e.target.value);
    setSearchString(e.target.value);
  };
  const onSubmit = () => {};

  return (
    <>
      <InputWithPrepend
        id='searchTextInDatabase'
        type='text'
        ariaLabel='Search'
        prepend={<BsSearch />}
        placeholder={'search @ database'}
        value={searchString}
        onEvent={{ onChange: onChangeHandler }}
      />
      <button
        style={{ display: searchString ? 'block' : 'none' }}
        className='add-btn btn btn-secondary btn-block btn-sm'
        onClick={onSubmit}
      >
        This feature is not yet available...
      </button>
    </>
  );
}

export default SearchTexts;
