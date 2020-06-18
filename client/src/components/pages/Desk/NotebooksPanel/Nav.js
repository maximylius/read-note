import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  closeNotebook,
  openNotebook,
  updateNotebook
} from '../../../../store/actions';
import NavTab from '../../../Metapanel/NavTab';

function Nav() {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    notebooks,
    notebooksPanel: { openNotebooks, activeNotebook }
  } = useSelector(state => state);

  const notebooksToDisplay = openNotebooks.filter(id =>
    Object.keys(notebooks.byId).includes(id)
  );

  return (
    <nav className='navbar sticky-top navbar-expand-sm navbar-dark bg-light ml-0 pl-2 pb-0'>
      <div className='container pl-0'>
        <ul className='nav nav-tabs mr-auto ml-1'>
          {notebooksToDisplay.map(id => (
            <NavTab
              key={id}
              id={id}
              isActive={id === activeNotebook}
              titleEditAction={newTitle =>
                dispatch(updateNotebook({ _id: id, title: newTitle }))
              }
              currentTitle={notebooks.byId[id].title}
              maxTitleLength={20}
              openAction={() =>
                dispatch(openNotebook({ notebookId: id, history: history }))
              }
              closeAction={() =>
                dispatch(closeNotebook({ notebookId: id, history: history }))
              }
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
