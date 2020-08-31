import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  loadText,
  loadNotes,
  toggleWelcomeModal,
  toggleAboutModal,
  toggleRegisterModal,
  toggleSignInModal,
  toggleLogoutModal,
  closeAllModals,
  setCurrentPathname
} from '../../store/actions';
import MainPage from '.';

const RouteWrapper = () => {
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const pathname = history.location.pathname;
  const currentPathname = useSelector(s => s.notesPanel.currentPathname);

  const openTextPanels = useSelector(s => s.textsPanel.openTextPanels);
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const openNotes = useSelector(s => s.notesPanel.openNotes);
  const activeNote = useSelector(s => s.notesPanel.activeNote);

  const welcomeOpen = useSelector(s => s.ui.welcomeOpen);
  const aboutOpen = useSelector(s => s.ui.aboutOpen);
  const registerOpen = useSelector(s => s.ui.registerOpen);
  const signInOpen = useSelector(s => s.ui.signInOpen);
  const logoutOpen = useSelector(s => s.ui.logoutOpen);

  useEffect(() => {
    if (currentPathname !== pathname) dispatch(setCurrentPathname(pathname));
    return () => {};
  }, [currentPathname === pathname]);

  useEffect(() => {
    console.log('pathname', pathname);
    console.log('history', history);
    if (pathname.startsWith('/welcome') && !welcomeOpen) {
      dispatch(toggleWelcomeModal(history));
    }
    if (pathname.startsWith('/about') && !aboutOpen) {
      dispatch(toggleAboutModal(history));
    }
    if (pathname.startsWith('/signup') && !registerOpen) {
      dispatch(toggleRegisterModal(history));
    }
    if (pathname.startsWith('/signin') && !signInOpen) {
      dispatch(toggleSignInModal(history));
    }
    if (pathname.startsWith('/logout') && !logoutOpen) {
      dispatch(toggleLogoutModal(history));
    }
    if (pathname.startsWith('/desk') && !logoutOpen) {
      dispatch(closeAllModals(history));
    }

    return () => {};
  }, [pathname]);

  useEffect(() => {
    console.log('paramsRouteWrapper', params);
    if (params.textIds) {
      const textParams = params.textIds.split('+');
      const textsParamsToLoad = textParams.filter(
        param =>
          !openTextPanels.includes(param.split('-')[0]) ||
          (param.split('-')[1] == '1' &&
            param.split('-')[0] !== activeTextPanel)
      );
      let nextActiveText = false;
      const textsToLoad = textsParamsToLoad.map(param => {
        if (param.split('-')[1] === '1') nextActiveText = param.split('-')[0];
        return param.split('-')[0];
      });
      textsToLoad.forEach(textId => {
        dispatch(
          loadText({
            textId: textId,
            openText: true,
            setToActive: textId === nextActiveText,
            history: null
          })
        );
      });
    }
    if (params.noteIds) {
      const noteParams = params.noteIds.split('+');
      const notesParamsToLoad = noteParams.filter(
        param =>
          !openNotes.includes(param.split('-')[0]) ||
          (param.split('-')[1] == '1' && param.split('-')[0] !== activeNote)
      );
      let nextActiveNote = false;
      const notesToLoad = notesParamsToLoad.map(param => {
        if (param.split('-')[1] === '1') nextActiveNote = param.split('-')[0];
        return param.split('-')[0];
      });

      notesToLoad.forEach(noteId => {
        dispatch(
          loadNotes({
            noteIds: [noteId],
            open: true,
            setToActive: noteId === nextActiveNote ? noteId : false,
            history: null
          })
        );
      });
    }
    return () => {};
    // eslint-disable-next-line
  }, [params]);

  return <MainPage />;
};

export default RouteWrapper;
