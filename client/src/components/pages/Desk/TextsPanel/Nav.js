import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  closeTextPanel,
  switchToOpenTextPanel
  // updateText
} from '../../../../store/actions';
import NavTab from '../../../Metapanel/NavTab';
import { BsBook, BsPlus } from 'react-icons/bs';

function Nav() {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    texts,
    textsPanel: { openTextPanels, activeTextPanel }
  } = useSelector(state => state);

  const textsToDisplay = openTextPanels.filter(
    id => Object.keys(texts.byId).includes(id) || id === 'addTextPanel'
  );

  return (
    <nav className='row static navbar sticky-top navbar-expand-sm navbar-dark bg-light mx-0 px-0 pb-0'>
      <div className='container px-0'>
        <BsBook />
        <ul className='nav nav-tabs mr-auto ml-1'>
          {textsToDisplay.map(id => (
            <NavTab
              key={id}
              id={id}
              isActive={id === activeTextPanel}
              currentTitle={
                id === 'addTextPanel' ? (
                  <>
                    <BsPlus /> add text
                  </>
                ) : (
                  texts.byId[id].title
                )
              }
              openAction={() =>
                dispatch(
                  switchToOpenTextPanel({ textPanelId: id, history: history })
                )
              }
              closeAction={() =>
                dispatch(closeTextPanel({ textPanelId: id, history: history }))
              }
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
