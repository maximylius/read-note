import React from 'react';
import { useSelector } from 'react-redux';
import { BsCloudUpload } from 'react-icons/bs';
import PasteUpload from './PasteUpload';
import SearchTexts from './SearchTexts';
import ScrapeLink from './ScrapeLink';

function FirstStage() {
  const textIds = useSelector(s => s.user.textIds);
  return (
    <div className='container'>
      <h1 className='display-4'>Open a text:</h1>
      {textIds.length > 0 && (
        <>
          <p className='lead'>from your saved texts,</p>
          <p className='lead'>find in your history</p>
        </>
      )}
      <ScrapeLink />
      <p className='lead'>
        <BsCloudUpload /> upload PDF - not yet available
      </p>
      <SearchTexts />
      <p className='lead'>or</p>
      <PasteUpload />
    </div>
  );
}

export default FirstStage;
