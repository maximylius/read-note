import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  addNote,
  closeNote,
  openNote,
  updateNote
} from '../../../../store/actions';
import NavTab from '../../../Metapanel/NavTab';
import NavTabAdd from '../../../Metapanel/NavTabAdd';

function Nav() {
  const dispatch = useDispatch();
  const history = useHistory();
  const openNotes = useSelector(s => s.notesPanel.openNotes);
  const activeNote = useSelector(s => s.notesPanel.activeNote);
  const notes = useSelector(s => s.notes);

  const notesToDisplay = openNotes
    .filter(id => Object.keys(notes).includes(id))
    .concat('addNote');

  return (
    <nav className='navbar sticky-top navbar-expand-sm navbar-dark bg-light ml-0 pl-0 pb-0 notepanel-nav-container'>
      <div className='container pl-0'>
        <ul className='nav nav-tabs mr-auto ml-1'>
          {notesToDisplay.map(id =>
            id === 'addNote' ? (
              <NavTabAdd
                key={id}
                tooltip='create new note (unrelated to text)'
                isActive={notesToDisplay.length === 1}
                openAction={() => dispatch(addNote({ history }))}
              />
            ) : (
              <NavTab
                key={id}
                id={id}
                isActive={id === activeNote}
                titleEditAction={newTitle =>
                  dispatch(updateNote({ _id: id, title: newTitle }))
                }
                currentTitle={notes[id].title}
                maxTitleLength={20}
                openAction={() =>
                  dispatch(openNote({ noteId: id, history: history }))
                }
                closeAction={() =>
                  dispatch(closeNote({ noteId: id, history: history }))
                }
              />
            )
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
