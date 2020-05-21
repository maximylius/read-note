import React from 'react';
import { useSelector } from 'react-redux';

import NoteElement from './NoteElement';

const NotebookPanel = () => {
  const { activeNotebook } = useSelector(state => state.notebooksPanel);
  const notebooks = useSelector(state => state.notebooks);
  const notebook = notebooks.byId[activeNotebook];
  const notes = useSelector(state => state.notes);
  const notesToDisplay = notebook.contentIds.filter(id =>
    Object.keys(notes.byId).includes(id)
  );

  return (
    <div className='card-body '>
      {notesToDisplay.map((id, index) => {
        switch (notes.byId[id].type) {
          case 'note':
          case 'placeholder':
          case 'SPARE':
            return (
              <NoteElement
                key={`ne_${id}`}
                id={id}
                placeholder='Add a note...'
                index={index}
                notebookId={notebook._id}
                contentIdsLength={notebook.contentIds.length}
              />
            );
          default:
            return <p>Undetected type...</p>;
        }
      })}
    </div>
  );
};

export default NotebookPanel;
