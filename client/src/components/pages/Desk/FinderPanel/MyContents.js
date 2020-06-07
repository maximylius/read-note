import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ContentItem from './ContentItem';
import { BsPlus } from 'react-icons/bs';
import {
  addNotebook,
  openNotebook,
  openAddTextPanel,
  loadText,
  toggleKeepFinderOpen
} from '../../../../store/actions';

function MyContents() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, notebooks, texts, annotations, ui } = useSelector(
    state => state
  );
  const textsToDisplay = user.textIds.filter(id =>
    Object.keys(texts.byId).includes(id)
  );
  const notebooksToDisplay = user.notebookIds.filter(id =>
    Object.keys(notebooks.byId).includes(id)
  );
  const addNotebookClickHandler = () => dispatch(addNotebook({ history }));
  const addTextClickHandler = () => dispatch(openAddTextPanel());
  const keepFinderOpenClickHandler = () => dispatch(toggleKeepFinderOpen());

  return (
    <div className='row growContent'>
      <ul className='nav flex-column pl-4'>
        <div>
          <p className='lead'>My Notebooks</p>
          {notebooksToDisplay.map(id => (
            <ContentItem
              key={id}
              title={notebooks.byId[id].title}
              onClickAction={() =>
                dispatch(openNotebook({ notebookId: id, history }))
              }
            />
          ))}
          <button
            className='btn btn-secondary btn-block'
            onClick={addNotebookClickHandler}
          >
            <BsPlus /> new notebook
          </button>
          <hr style={{ backgroundColor: 'white' }} />
        </div>

        <div>
          <p className='lead'>My Texts</p>
          {textsToDisplay.map(id => (
            <ContentItem
              key={id}
              title={texts.byId[id].title}
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
          <p className='lead'>My Annotations</p>

          {user.annotationIds.map(
            id =>
              annotations.byId[id] &&
              annotations.byId[id].textcontent && (
                <ContentItem
                  key={id}
                  id={id}
                  title={annotations.byId[id].textcontent}
                  contentType='annotation'
                />
              )
          )}
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
