import React, { useState } from 'react';
import InputWithPrepend from '../../../../Metapanel/InputWithPrepend';
import { BsLink } from 'react-icons/bs';

function ScrapeLink() {
  const [url, setUrl] = useState('');
  const onChangeHandler = e => {
    console.log(e.target.value);
    setUrl(e.target.value);
  };
  const onSubmit = () => {};

  return (
    <div className='container'>
      <InputWithPrepend
        id='scrapeLink'
        type='text'
        ariaLabel='Link'
        prepend={<BsLink />}
        placeholder={'Paste in link...'}
        value={url}
        onEvent={{ onChange: onChangeHandler }}
      />
      <button
        style={{ display: url ? 'block' : 'none' }}
        className='add-btn btn btn-secondary btn-block btn-sm'
        onClick={onSubmit}
      >
        This feature is not yet available...
      </button>
    </div>
  );
}

export default ScrapeLink;
