import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  closeTextPanel,
  switchToOpenTextPanel
  // updateText
} from '../../../../store/actions';
import NavTab from '../../../Metapanel/NavTab';
import NavTabAdd from '../../../Metapanel/NavTabAdd';
import { BsPlus } from 'react-icons/bs';

function Nav() {
  const dispatch = useDispatch();
  const history = useHistory();
  const texts = useSelector(s => s.texts);
  const openTextPanels = useSelector(s => s.textsPanel.openTextPanels);
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const textsToDisplay = openTextPanels
    .filter(id => Object.keys(texts).includes(id))
    .concat('addTextPanel');

  return (
    <nav className='row static navbar sticky-top navbar-expand-sm navbar-dark bg-light mx-0 px-0 pb-0'>
      <div className='container px-0'>
        <ul className='nav nav-tabs mr-auto ml-1'>
          {textsToDisplay.map(id =>
            id === 'addTextPanel' ? (
              <NavTabAdd
                key={id}
                isActive={id === activeTextPanel}
                openAction={() =>
                  dispatch(
                    switchToOpenTextPanel({ textPanelId: id, history: history })
                  )
                }
              />
            ) : (
              <NavTab
                key={id}
                id={id}
                isActive={id === activeTextPanel}
                currentTitle={texts[id].title}
                maxTitleLength={Math.min(
                  50,
                  Math.round(120 / openTextPanels.length)
                )}
                openAction={() =>
                  dispatch(
                    switchToOpenTextPanel({ textPanelId: id, history: history })
                  )
                }
                closeAction={() =>
                  dispatch(
                    closeTextPanel({ textPanelId: id, history: history })
                  )
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
