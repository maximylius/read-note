import React from 'react';
import NoteInfoConnection from './NoteInfoConnection';

const NoteInfoConnections = ({ direction, connections }) => {
  return (
    <div>
      <p className='note-info-subheading'>{direction} connections</p>
      {connections.length === 0 ? (
        <span className='note-info-no-connections'>None</span>
      ) : (
        connections.map(el => (
          <NoteInfoConnection
            key={el.resId}
            resId={el.resId}
            resType={el.resType}
            direction={direction}
          />
        ))
      )}
    </div>
  );
};

export default NoteInfoConnections;
