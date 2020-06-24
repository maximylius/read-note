import React from 'react';
import Flowchart from '../Desk/Flowchart/';

function Welcome() {
  return (
    <div className='row growContent w-100'>
      <div className='container mt-3'>
        <h1 className='display-4'>Welcome.</h1>
        <p className='lead'>It's free.</p>
        <p className='lead'>Wow. Nice Design.</p>
        <p className='lead'>
          Upload your text to start reading and annotating.
        </p>
        <Flowchart />

        <p className='lead'>
          Showcase what this site can do: Speedread, organize, keep track.
        </p>
      </div>
    </div>
  );
}

export default Welcome;
