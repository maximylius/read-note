import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ContentItem from './ContentItem';
import { BsPlus } from 'react-icons/bs';
import {
  addNote,
  openNote,
  openAddTextPanel,
  loadText,
  toggleKeepFinderOpen
} from '../../../../store/actions';

function MyContents() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, notes, texts, projects, ui } = useSelector(s => s);
  const currentProject = projects[user.projectIds[0]];

  const textsToDisplay = currentProject
    ? currentProject.textIds.filter(id => Object.keys(texts).includes(id))
    : [];
  const notesToDisplay = currentProject
    ? currentProject.noteIds.filter(id => Object.keys(notes).includes(id))
    : [];
  const addNoteClickHandler = () => dispatch(addNote({ history }));
  const addTextClickHandler = () => dispatch(openAddTextPanel());
  const keepFinderOpenClickHandler = () => dispatch(toggleKeepFinderOpen());

  return (
    <div className='row growContent'>
      <ul className='nav flex-column pl-4'>
        <div>
          <p className='lead'>My Notes</p>
          {notesToDisplay.map(id => (
            <ContentItem
              key={'noteitem' + id}
              title={notes[id].title}
              onClickAction={() => dispatch(openNote({ noteId: id, history }))}
            />
          ))}
          <button
            className='btn btn-secondary btn-block'
            onClick={addNoteClickHandler}
          >
            <BsPlus /> new note
          </button>
          <hr style={{ backgroundColor: 'white' }} />
        </div>

        <div>
          <p className='lead'>My Texts</p>
          {textsToDisplay.map(id => (
            <ContentItem
              key={'textitem' + id}
              title={texts[id].title}
              onClickAction={() =>
                dispatch(loadText({ textId: id, openText: true, history }))
              }
            />
          ))}
          <button
            className='btn btn-secondary btn-block'
            onClick={addTextClickHandler}
          >
            <BsPlus /> add text
          </button>
          <hr style={{ backgroundColor: 'white' }} />
        </div>

        <div>
          <div className='input-group mb-3'>
            <div className='input-group-prepend'>
              <span className='input-group-text'>
                <small>Keep Finder open</small>
              </span>
            </div>
            <div className='input-group-prepend'>
              <span className='input-group-text'>
                <input
                  type='checkbox'
                  aria-label='keep finder open'
                  checked={ui.keepFinderOpen}
                  onChange={keepFinderOpenClickHandler}
                ></input>
              </span>
            </div>
          </div>
        </div>
      </ul>
    </div>
  );
}

export default MyContents;
