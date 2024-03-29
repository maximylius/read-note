import axios from 'axios';
import * as types from './types';
import {
  defaultText,
  ObjectRemoveKeys,
  ObjectKeepKeys,
  sortSectionIds,
  regExpHistory
} from '../functions/main';
import _isEqual from 'lodash/isEqual';

/**
 *
 *
 * @ACTION_FUNCTIONS
 */

/**
 *
 *
 * @AUTH
 *
 */
const addToNestedFetch = (doc, r) => {
  ['textIds', 'sectionIds', 'noteIds', 'replies'].forEach(key => {
    if (Array.isArray(doc[key]) && Object.keys(r).includes(key)) {
      console.log('new key', key, doc[key]);
      r[key === 'replies' ? 'noteIds' : key].push(...doc[key]);
    }
  });
};
const nestedFetch = (
  r = { projectIds: [], textIds: [], sectionIds: [], noteIds: [] },
  redux = { dispatch: Function(), getState: Function() },
  options = { openTexts: [], setToActive: null }
) => {
  if (!Array.isArray(r.projectIds)) r.projectIds = [];
  if (!Array.isArray(r.textIds)) r.textIds = [];
  if (!Array.isArray(r.sectionIds)) r.sectionIds = [];
  if (!Array.isArray(r.noteIds)) r.noteIds = [];
  if (!Array.isArray(r.blacklist)) r.blacklist = [];
  console.log('nested fetch r', r);
  const resType =
    r.projectIds.length > 0
      ? 'project'
      : r.textIds.length > 0
      ? 'text'
      : r.sectionIds.length > 0
      ? 'section'
      : r.noteIds.length > 0
      ? 'note'
      : null;
  if (!resType) return console.log('done fetching resources.');

  const promises = [];
  const resState = redux.getState()[`${resType}s`];

  r[`${resType}Ids`].forEach(resId => {
    if (r.blacklist.includes(resId)) return;
    r.blacklist.push(resId);

    const resourceAlreadyLoaded =
      Object.keys(resState).includes(resId) &&
      resState[resId] &&
      resState[resId].delta; //check if it need to be loaded
    if (resourceAlreadyLoaded) return addToNestedFetch(resState[resId], r);

    if (!resourceAlreadyLoaded)
      console.log(`REQUESTING: /api/common/${resType}/${resId}`);
    promises.push(
      axios
        .get(`/api/common/${resType}/${resId}`, tokenConfig(redux.getState))
        .then(res => {
          console.log('nested res.data', res.data);
          const docArray = res.data.docArray;

          docArray.forEach(doc => addToNestedFetch(doc, r));

          const docsById = Object.fromEntries(
            docArray.map(doc => [doc._id, doc])
          );

          console.log('nested docsById', docsById);
          redux.dispatch(
            resType === 'project'
              ? {
                  type: types.LOAD_PROJECTS,
                  payload: {
                    docsById
                  }
                }
              : resType === 'text'
              ? {
                  type: types.LOAD_TEXTS,
                  payload: {
                    docsById,
                    openTexts: options.openTexts || [],
                    setToActive: options.setToActive
                  }
                }
              : resType === 'section'
              ? { type: types.LOAD_SECTIONS, payload: { docsById } }
              : resType === 'note'
              ? { type: types.LOAD_NOTES, payload: { docsById } }
              : null
          );
        })
        .catch(err => {
          console.log('nested fetch error: ', err, err.response);
          dispatchAlert(
            {
              message: `<span>Requested ${resType} cannot be loaded.</span>`,
              type: 'danger'
            },
            4000,
            redux.dispatch,
            redux.getState
          );
          // fetches error on individual resource level: could possibly spam error message.
          // add error that counts how many are not
        })
    );
  });

  Promise.all(promises)
    .then(() => {
      r[`${resType}Ids`] = r[`${resType}Ids`].filter(
        id => !r.blacklist.includes(id)
      );
      nestedFetch(r, redux, options);
    })
    .catch(err => {
      console.log('nested fetch outer error:', err);
      dispatchAlert(
        {
          message: `<span>Oops! Something went wrong.</span>`,
          type: 'danger'
        },
        4000,
        redux.dispatch,
        redux.getState
      );
    });
};

const fetchUserData = async (user, openTexts, dispatch) => {
  if (user.noteIds.length > 0) {
    const notesRes = await axios.get(`/api/notes/${user.noteIds.join('+')}`);

    console.log(notesRes);

    const notesById = {};
    notesRes.data.forEach(note => (notesById[note._id] = note));
    dispatch({
      type: types.GET_NOTES,
      payload: { notesById }
    });
  }
  const textsToGet = user.textIds.filter(id => !openTexts.includes(id));
  if (textsToGet.length > 0) {
    const textsRes = await axios.get(`/api/texts/meta/${textsToGet.join('+')}`);
    const textsMetaById = {};
    textsRes.data.forEach(text => (textsMetaById[text._id] = text));
    dispatch({
      type: types.GET_USER_TEXTS_META,
      payload: { textsMetaById }
    });
  }
};

export const registerUser = ({ username, email, password }) => (
  dispatch,
  getState
) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  // Request body
  const body = JSON.stringify({ username, email, password });

  axios
    .post('/api/users/register', body, config)
    .then(res => {
      dispatchAlert(
        {
          message: '<span>Successfully registered</span>',
          type: 'success'
        },
        4000,
        dispatch,
        getState
      );
      dispatch({
        type: types.REGISTER_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatchAlert(
        {
          message: '<span>E-Mail address is already in use.</span>',
          type: 'info'
        },
        4000,
        dispatch,
        getState
      );
      dispatch({
        type: types.REGISTER_FAIL
      });
    });
};

export const loadUser = () => async (dispatch, getState) => {
  const {
    auth: { token },
    texts,
    textsPanel: { openTexts }
  } = getState();
  if (!token || token === 'undefined') {
    console.log('no token, no request. 2do: request session token.');
    return;
  }

  // User loading
  dispatch({ type: types.USER_LOADING });

  try {
    const userRes = await axios.get('/api/auth/user', tokenConfig(getState));
    console.log(userRes.data);
    dispatch({
      type: types.USER_LOADED,
      payload: userRes.data // contains {user, token, projects}
    });

    const user = userRes.data.user;
    console.log('nestedFetch of user', user);
    nestedFetch(
      {
        projectIds: user.projectIds,
        textIds: user.textIds,
        sectionIds: user.sectionIds,
        noteIds: user.noteIds
      },
      { dispatch, getState }
    );
  } catch (error) {
    console.log(error);
    dispatch(returnErrors(error, error));
    dispatch({
      type: types.AUTH_ERROR
    });
  }
};

export const loginUser = ({ email, password, history }) => async (
  dispatch,
  getState
) => {
  const {
    ui: { lastDeskPathname },
    textsPanel: { openTexts }
  } = getState();
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ email, password });
  console.log(body, config);

  axios
    .post('/api/auth/login', body, config)
    .then(userRes => {
      console.log('userRes', userRes);
      dispatch({
        type: types.LOGIN_SUCCESS,
        payload: userRes.data // contains {user, token, projects}
      });
      dispatchAlert(
        {
          message: '<span>Successfully logged in.</span>',
          type: 'success'
        },
        4000,
        dispatch,
        getState
      );
      history.push(lastDeskPathname);
      const user = userRes.data.user;
      console.log('nestedFetch of user', user);
      nestedFetch(
        {
          projectIds: user.projectIds,
          textIds: user.textIds,
          sectionIds: user.sectionIds,
          noteIds: user.noteIds
        },
        { dispatch, getState }
      );
    })
    .catch(err => {
      console.log('login err', err, err.response, Object.keys(err));
      dispatch({
        type: types.LOGIN_FAIL
      });
      dispatchAlert(
        {
          message: `<span>${err.response.data.msg}.</span>`,
          type: 'info'
        },
        4000,
        dispatch,
        getState
      );
    });
};

export const logoutUser = () => {
  return {
    type: types.LOGOUT_SUCCESS
  };
};

export const tokenConfig = getState => {
  // Get token from localstorage
  const token = getState().auth.token;
  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };
  // If token, add to headers
  if (token) config.headers['x-auth-token'] = token;
  console.log(config);
  return config;
};

/**
 *
 *
 * @ERROR
 */
export const returnErrors = (msg, status, id = null) => {
  return {
    type: types.GET_ERRORS,
    payload: { msg, status, id }
  };
};

export const clearErrors = () => {
  return {
    type: types.CLEAR_ERRORS
  };
};

/**
 *
 *
 * @UI
 */
const dispatchAlert = (
  alertObj = { message: '<span>Alert message.</span>', type: 'info' },
  timeout = 3000,
  dispatch,
  getState
) => {
  const {
    ui: { alertId }
  } = getState();
  dispatch({
    type: types.ADD_ALERT,
    payload: {
      alertObj: { id: alertId + 1, ...alertObj }
    }
  });
  setTimeout(() => {
    dispatch({
      type: types.CLEAR_ALERT,
      payload: {
        id: alertId + 1
      }
    });
  }, timeout);
};

export const addAlert = (
  alertObj = { message: '<span>Alert message.</span>', type: 'info' },
  timeout = 3000
) => (dispatch, getState) => {
  dispatchAlert(alertObj, timeout, dispatch, getState);
};

export const removeAlert = id => dispatch => {
  dispatch({
    type: types.CLEAR_ALERT,
    payload: { id }
  });
};

export const expandFinderPanel = () => dispatch =>
  dispatch({ type: types.EXPAND_FINDER_PANEL });

export const collapseFinderPanel = () => dispatch =>
  dispatch({ type: types.COLLAPSE_FINDER_PANEL });

export const expandAnnotationsPanel = () => dispatch =>
  dispatch({ type: types.EXPAND_ANNOTATIONS_PANEL });

export const collapseAnnotationsPanel = () => dispatch =>
  dispatch({ type: types.COLLAPSE_ANNOTATIONS_PANEL });

export const expandNotesPanel = () => dispatch =>
  dispatch({ type: types.EXPAND_NOTES_PANEL });

export const collapseNotesPanel = () => dispatch =>
  dispatch({
    type: types.COLLAPSE_NOTES_PANEL
  });

export const expandTextsPanel = () => dispatch =>
  dispatch({ type: types.EXPAND_TEXTS_PANEL });

export const collapseTextsPanel = () => dispatch =>
  dispatch({ type: types.COLLAPSE_TEXTS_PANEL });

export const toggleKeepFinderOpen = () => dispatch => {
  dispatch({
    type: types.TOGGLE_KEEP_FINDER_OPEN
  });
};

export const setCurrentPathname = pathname => (dispatch, getState) => {
  if (getState().modal.currentPahtname === 'pathname') return;
  dispatch({
    type: types.SET_CURRENT_PATHNAME,
    payload: { pathname }
  });
};

export const toggleWelcomeModal = history => (dispatch, getState) => {
  dispatch({
    type: types.OPEN_WELCOME_MODAL,
    payload: {
      pathname: history.location.pathname.startsWith('/desk')
        ? history.location.pathname
        : null
    }
  });
};
export const toggleAboutModal = history => (dispatch, getState) => {
  dispatch({
    type: types.OPEN_ABOUT_MODAL,
    payload: {
      pathname: history.location.pathname.startsWith('/desk')
        ? history.location.pathname
        : null
    }
  });
};
export const toggleRegisterModal = history => (dispatch, getState) => {
  dispatch({
    type: types.OPEN_REGISTER_MODAL,
    payload: {
      pathname: history.location.pathname.startsWith('/desk')
        ? history.location.pathname
        : null
    }
  });
};
export const toggleSignInModal = history => (dispatch, getState) => {
  const {
    user: { username },
    ui: { lastDeskPathname }
  } = getState();
  if (username) history.push(lastDeskPathname); //dont open if signed in

  dispatch({
    type: types.OPEN_SIGNIN_MODAL,
    payload: {
      pathname: history.location.pathname.startsWith('/desk')
        ? history.location.pathname
        : null
    }
  });
};
export const toggleLogoutModal = history => (dispatch, getState) => {
  const {
    user: { username },
    ui: { lastDeskPathname }
  } = getState();
  if (username) history.push(lastDeskPathname); //dont open if signed in

  dispatch({
    type: types.OPEN_LOGOUT_MODAL,
    payload: {
      pathname: '/desk'
    }
  });
};
export const closeAllModals = history => (dispatch, getState) => {
  const {
    ui: { lastDeskPathname }
  } = getState();
  if (!history.location.pathname.startsWith('/desk'))
    history.push(lastDeskPathname);
  dispatch({ type: types.CLOSE_ALL_MODALS });
};

/**
 *
 *
 * @SPARE_IDS
 */
const fetchSpareIds = (prefix, number, dispatch) => {
  axios.post(`/api/common/spareIds/${prefix}/${number}`).then(res => {
    dispatch({
      type: types.PUSH_SPARE_IDS,
      payload: { prefix, spareIds: res.data.spareIds }
    });
  });
};
const fillDefinedSpareIds = (spareIds, dispatch) => {
  Object.keys(spareIds).forEach(prefix => {
    if (spareIds[prefix].length < 3) {
      fetchSpareIds(prefix, 3 - spareIds[prefix].length, dispatch);
    }
  });
};

export const fillSpareIds = () => (dispatch, getState) => {
  const { spareIds } = getState();
  fillDefinedSpareIds(spareIds, dispatch);
};

export const getNewSpareIds = (prefix, numberOfSpareIds) =>
  axios.post(`/api/common/spareIds/${prefix}/${numberOfSpareIds}`).then(res => {
    return {
      type: types.PUSH_SPARE_IDS,
      payload: { prefix, spareIds: res.data.spareIds }
    };
  });

export const deleteSpareIds = () => (dispatch, getState) => {
  const { spareIds } = getState();
  Object.keys(spareIds).forEach(prefix => {
    spareIds[prefix].forEach(spareId =>
      axios.delete(`/api/${prefix}/${spareId}`)
    );
  });
  dispatch({
    type: types.DELETE_ALL_SPARE_IDS
  });
};

export const deleteAllSpareIds = (minutesToExpire = 2400) => {
  console.log('delAllSpareIds');
  ['notes', 'texts', 'sections'].forEach(prefix =>
    axios
      .delete(`/api/${prefix}/spareIds/${minutesToExpire}`)
      .then(() => console.log('response received', prefix))
  );
};

export const returnUseSpareIds = spareId => {
  return {
    type: types.USE_SPARE_ID,
    payload: { spareId }
  };
};

/**
 *
 *
 * @TEXT_PAGE
 */
export const setValidSelection = setValidSelectionTo => {
  return {
    type: types.SET_VALID_SELECTION,
    payload: { setValidSelectionTo }
  };
};

export const setExpandAll = ({ expandAll }) => dispatch => {
  dispatch({
    type: types.SET_EXPAND_ALL,
    payload: { expandAll }
  });
};

export const setCommittedSections = (sectionIds, add) => dispatch =>
  dispatch({
    type: types.SET_COMMITTED_SECTIONS,
    payload: { sectionIds, add }
  });

export const uncommitFromSection = sectionIds => dispatch =>
  dispatch({
    type: types.UNCOMMIT_FROM_SECTION,
    payload: { sectionIds }
  });

export const clearCommittedSections = () => dispatch =>
  dispatch({
    type: types.CLEAR_COMMITTED_SECTIONS
  });

export const setAllCommittedSections = () => (dispatch, getState) => {
  const {
    textsPanel: { activeTextPanel },
    texts
  } = getState();

  dispatch({
    type: types.SET_ALL_COMMITTED_SECTIONS,
    payload: { sectionIds: texts[activeTextPanel].sectionIds }
  });
};

export const setTentativeSections = (sectionIds = [], add) => (
  dispatch,
  getState
) => {
  if (!add) {
    const {
      textsPanel: { tentativeSectionIds }
    } = getState();
    if (
      !tentativeSectionIds.some(id => !sectionIds.includes(id)) &&
      !sectionIds.some(id => !tentativeSectionIds.includes(id))
    )
      return;
  }
  dispatch({
    type: types.SET_TENTATIVE_SECTIONS,
    payload: { sectionIds, add }
  });
};
export const changeSectionEditState = (changeTo, id) => dispatch => {
  if (changeTo === 'edit') {
    dispatch({
      type: types.START_EDIT_SECTION,
      payload: id
    });
  } else {
    dispatch({
      type: types.STOP_EDIT_SECTION,
      payload: id
    });
  }
};

export const updateProgress = () => (dispatch, getState) => {
  const { text } = getState();
  dispatch({
    type: types.UPDATE_PROGRESS,
    payload: { text }
  });
};

export const setHoldControl = controllIsPressed => (dispatch, getState) =>
  dispatch({
    type: types.SET_HOLDCONTROL,
    payload: controllIsPressed
  });

export const openSpeedReader = (textId, begin, end, index) => dispatch => {
  console.log('openSpeedReader', { begin, end, index });
  dispatch({
    type: types.OPEN_SPEED_READER,
    payload: { textId, begin, end, index }
  });
};

export const setSpeedReader = (textId, words) => dispatch => {
  dispatch({
    type: types.SET_SPEED_READER,
    payload: { textId, words }
  });
};

export const playSpeedReader = textId => dispatch =>
  dispatch({
    type: types.PLAY_SPEED_READER,
    payload: { textId }
  });

export const pauseSpeedReader = (textId, begin, end, index) => dispatch =>
  dispatch({
    type: types.PAUSE_SPEED_READER,
    payload: { textId, begin, end, index }
  });

export const closeSpeedReader = textId => dispatch =>
  dispatch({
    type: types.CLOSE_SPEED_READER,
    payload: { textId }
  });

export const setDisplayTextMeta = display => dispatch => {
  dispatch({
    type: types.SET_DISPLAY_TEXT_META,
    payload: { display }
  });
};

/**
 *
 *
 * @TEXT_UPLOAD_PAGE
 */
export const uploadTextcontent = ({ textcontent, delta }, isPublic = true) => (
  dispatch,
  getState
) => {
  const { user, texts, spareIds } = getState();
  const text = defaultText();
  text._id = spareIds['texts'][0];
  text.textcontent = textcontent;
  text.delta = delta;
  text.projectIds = user.projectIds[0] ? [user.projectIds[0]] : [];
  text.formatDelta = delta;
  text.editedBy = user._id ? [user._id] : [];
  text.accessFor = user._id ? [user._id] : []; //2do add sessionId / could be a spareId for user
  text.isPublic = !!isPublic;

  // add a placeholder title
  const allTextTitles = [...Object.keys(texts).map(id => texts[id].title)];
  let i = 0;
  do {
    i++;
    text.title = `Text ${i}`;
  } while (allTextTitles.includes(`Text ${i}`));

  console.log(text);

  dispatch({
    type: types.UPLOADED_TEXT,
    payload: { text }
  });

  if (!user._id)
    dispatchAlert(
      {
        message:
          'Text will not be saved to your profile. Login and re-upload text!',
        type: 'danger'
      },
      12000,
      dispatch,
      getState
    );

  axios.put(
    `/api/common/text/${text._id}`,
    { doc: text },
    tokenConfig(getState)
  );

  fetchSpareIds('texts', 1, dispatch);
};

export const updateText = (textId, textUpdate) => (dispatch, getState) => {
  console.log(textUpdate);
  const { texts } = getState();
  const text = { ...texts[textId], ...textUpdate };

  dispatch({
    type: types.UPDATE_TEXT,
    payload: { text }
  });

  axios.put(
    `/api/common/text/${textId}`,
    { doc: textUpdate },
    tokenConfig(getState)
  );
};

export const clearAddTextPanel = () => dispatch => {
  dispatch({
    type: types.CLEAR_ADDTEXTPANEL
  });
};

export const openAddTextPanel = () => dispatch => {
  dispatch({
    type: types.OPEN_ADDTEXTPANEL
  });
};

/**
 *
 *
 * @TEXT_SEARCH_PAGE
 */
export const searchTextsInDatabase = (searchString, searchFields = 'all') => (
  dispatch,
  getState
) => {
  axios
    .get(
      `/api/texts/search/${searchFields}&${searchString}`,
      tokenConfig(getState)
    )
    .then(res => {
      console.log(res.data);
      dispatch({
        type: types.SET_TEXT_SEARCH_RESULTS,
        payload: { searchResults: res.data }
      });
    });
};

export const deleteText = (textId, history) => (dispatch, getState) => {
  const {
    texts,
    sections,
    textsPanel: { openTextPanels }
  } = getState();
  const text = texts[textId];
  dispatch({
    type: types.DELETE_TEXT,
    payload: { text: text, textId }
  });
  texts[textId].sectionIds.forEach(sectionId => {
    const section = sections[sectionId];
    if (!section) return;
    deleteNestedNotes(section.noteIds);
    dispatch({
      type: types.DELETE_SECTION,
      payload: {
        sectionId,
        textId: textId
      }
    });
  });
  dispatchAlert(
    {
      message: `Sucessfully deleted text '<strong>${text.title}</strong>'.`,
      type: 'info'
    },
    4000,
    dispatch,
    getState
  );

  if (openTextPanels.includes(textId))
    history.push(
      regExpHistory(history.location.pathname, textId, 'close', 'text')
    );

  axios.delete(`/api/common/text/${textId}`, {
    data: {
      shouldDeleteTypes: ['section', 'note']
    },
    ...tokenConfig(getState)
  });
};

/**
 *
 *
 * @NOTE_PAGE
 */
export const loadNotes = ({ noteIds, open, setToActive, history }) => async (
  dispatch,
  getState
) => {
  const {
    notes,
    notesPanel: { openNotes },
    textsPanel: { openTexts }
  } = getState();

  const notesToGet = noteIds.flatMap(noteId =>
      notes[noteId] && notes[noteId].title ? [] : [noteId]
    ),
    notesAlreadyLoaded = noteIds.flatMap(noteId =>
      notes[noteId] && notes[noteId].title ? [noteId] : []
    ),
    notesById = {};

  if (notesToGet.length > 0) {
    const notesRes = await axios.get(
      `/api/notes/${noteIds.join('+')}`,
      tokenConfig(getState)
    );
    console.log(notesRes);

    notesRes.data.forEach(note => (notesById[note._id] = note));
  }

  console.log(
    'loadNotes',
    'noteIds',
    noteIds,
    'notesById',
    notesById,
    'open',
    open,
    'setToActive',
    setToActive,
    'notesAlreadyLoaded',
    notesAlreadyLoaded
  );

  dispatch({
    type: types.GET_NOTES,
    payload: { notesById, open, setToActive, notesAlreadyLoaded }
  });
  if (history)
    noteIds.forEach(noteId =>
      history.push(
        regExpHistory(history.location.pathname, noteId, 'open', 'note')
      )
    );

  console.log('done fetching note, returning promise of:', notesById);
  return Promise.resolve(notesById);
};

export const closeNote = ({ noteId, history }) => (dispatch, getState) => {
  const {
    notesPanel: { openNotes }
  } = getState();
  dispatch({
    type: types.CLOSE_NOTE,
    payload: { noteId, last: openNotes.length === 1 }
  });
  history.push(
    regExpHistory(history.location.pathname, noteId, 'close', 'note')
  );
};

export const openNote = ({ noteId, history }) => dispatch => {
  dispatch({
    type: types.OPEN_NOTE,
    payload: { noteId }
  });
  console.log('open note', noteId);
  history.push(
    regExpHistory(history.location.pathname, noteId, 'open', 'note')
  );
};

/**
 *
 *
 * @TEXT
 */
export const loadText = ({ textId, openText, setToActive, history }) => async (
  dispatch,
  getState
) => {
  const {
    texts,
    textsPanel: { activeTextPanel },
    panel: { flowchartIsOpen }
  } = getState();
  const loaded = texts[textId]
    ? texts[textId].textcontent
      ? true
      : false
    : false;

  if (loaded && activeTextPanel === textId) {
    if (flowchartIsOpen)
      dispatch({
        type: types.RETURN_TO_TEXT
      });

    return;
  }
  if (history)
    history.push(
      regExpHistory(history.location.pathname, textId, 'open', 'text')
    );
  let text;
  if (!loaded) {
    console.log('start loading text...', textId);
    nestedFetch(
      { textIds: [textId] },
      { dispatch, getState },
      {
        ...(openText && { openTexts: [textId] }),
        ...(setToActive && { setToActive: textId })
      }
    ); // shall also tell whether text has to be opened

    console.log('openText?', openText);
    // if (!openText) {
    //   dispatch({
    //     type: types.ADD_TEXT,
    //     payload: {
    //       sectionsById,
    //       notesById,
    //       text
    //     }
    //   });
    // } else if (openText) {
    //   text.words = text.textcontent.split(/\s+/);
    //   dispatch({
    //     type: types.ADD_AND_OPEN_TEXT,
    //     payload: {
    //       sectionsById,
    //       notesById,
    //       text,
    //       textId: text._id,
    //       setToActive: setToActive
    //     }
    //   });
    // }
  } else if (loaded) {
    if (!openText) {
      console.log('text already loaded, and doesnt need to be openend.');
      return;
    }
    text = texts[textId];
    if (openText) {
      dispatch({
        type: types.OPEN_TEXT,
        payload: {
          text
        }
      });
    }
  }
};

export const switchToOpenTextPanel = ({ textPanelId, history }) => dispatch => {
  dispatch({
    type: types.SWITCH_TO_OPEN_TEXTPANEL,
    payload: { textPanelId }
  });
  if (textPanelId !== 'addTextPanel')
    history.push(
      regExpHistory(history.location.pathname, textPanelId, 'open', 'text')
    );
};

export const closeTextPanel = ({ textPanelId, history }) => (
  dispatch,
  getState
) => {
  const {
    textsPanel: { openTextPanels }
  } = getState();
  dispatch({
    type: types.CLOSE_TEXT,
    payload: { textId: textPanelId, last: openTextPanels.length === 1 }
  });
  if (textPanelId !== 'addTextPanel') {
    console.log(
      'close.,.................',
      textPanelId,
      history.location.pathname
    );
    history.push(
      regExpHistory(history.location.pathname, textPanelId, 'close', 'text')
    );
  }
};

/**
 *
 *
 * @SECTIONS
 */
export const addSection = ({ categoryId, begin, end }) => (
  dispatch,
  getState
) => {
  const {
    texts,
    sections,
    spareIds,
    user,
    categories,
    textsPanel: { validSelection, activeTextPanel }
  } = getState();
  const text = texts[activeTextPanel];

  const section = {
    _id: spareIds['sections'][0],

    title: null,
    categoryIds: categoryId ? [categoryId] : [],
    begin: begin,
    end: end,
    importance: [],

    fullWords: text.textcontent.slice(begin, end + 1),
    delta: null, //2do

    textId: activeTextPanel,
    projectIds: user.projectIds[0] ? [user.projectIds[0]] : [],

    noteIds: [],

    directConnections: [],
    indirectConnections: [],

    created: Date.now(),
    lastEdited: Date.now(),
    editedBy: user._id ? [user._id] : [],
    accessFor: user._id ? [user._id] : [],
    isPublic: true //2do
  };
  console.log(text.sectionIds);
  console.log(sections);
  console.log(section);
  console.log(categories);

  // add a placeholder title
  const guessTitle = categoryId
    ? categories.byId[section.categoryIds[0]].title
    : 'not categorized';
  const allSectionTitles = [...text.sectionIds.map(id => sections[id].title)];
  let i = 0;
  do {
    i++;
    section.title = `${guessTitle} ${i}`;
  } while (allSectionTitles.includes(`${guessTitle} ${i}`));

  const textSections = {
    ...ObjectKeepKeys(sections, text.sectionIds),
    [section._id]: section
  };
  const textSectionIds = sortSectionIds(textSections);

  dispatch({
    type: types.ADD_NEW_SECTION,
    payload: {
      section,
      textSectionIds: textSectionIds,
      textId: activeTextPanel
    }
  });

  axios
    .put(
      `/api/common/section/${section._id}`,
      {
        doc: ObjectRemoveKeys(section, ['_id']),
        previousTextSectionId: {
          _id: textSectionIds[textSectionIds.indexOf(section._id) - 1]
        }
      },
      tokenConfig(getState)
    )
    .then(res => console.log('section put response', res))
    .catch(err => console.log('section put error', err));

  fetchSpareIds('sections', 1, dispatch);
};

const addPlaceholderTitle = (guessTitle, takenTitles = []) => {
  let outputTitle;
  let i = 0;
  do {
    i++;
    outputTitle = `${guessTitle} ${i}`;
  } while (takenTitles.includes(`${guessTitle} ${i}`));
  return outputTitle;
};

export const updateSection = update => (dispatch, getState) => {
  const {
    sections,
    categories,
    texts,
    textsPanel: { activeTextPanel }
  } = getState();
  const section = { ...sections[update._id] };
  const text = texts[activeTextPanel];
  const request = {};

  if (
    update.categoryIds &&
    !update.title &&
    Object.keys(categories.byId)
      .map(id => categories.byId[id].title)
      .concat('not categorized')
      .some(title => {
        const titleRegExp = new RegExp(`${title} \\d+$`);
        if (titleRegExp.test(section.title)) return true;
      })
  ) {
    section.title = addPlaceholderTitle(
      update.categoryIds[0]
        ? categories.byId[update.categoryIds[0]].title
        : 'not categorized',
      [...text.sectionIds.map(id => sections[id].title)]
    );
    request.title = section.title;
  }
  // only send changed parts to server
  Object.keys(update).forEach(updateKey => {
    if (Object.keys(section).includes(updateKey)) {
      if (!_isEqual(update[updateKey], section[updateKey])) {
        request[updateKey] = update[updateKey];
        section[updateKey] = update[updateKey];
      }
    }
  });

  let textSectionIds, previousTextSectionId;
  if (request.begin || request.end) {
    // why is this updated? maybe that the range has changed.
    let prevIndex = text.sectionIds.indexOf(update._id);
    const textSections = {
      ...ObjectKeepKeys(sections, text.sectionIds)
    };
    textSectionIds = sortSectionIds(textSections);
    let newIndex = textSectionIds.indexOf(update._id);
    if (newIndex !== prevIndex) {
      previousTextSectionId = { _id: textSectionIds[newIndex - 1] };
    }
  }

  dispatch({
    type: types.UPDATE_SECTION,
    payload: {
      section,
      textId: text._id,
      ...(previousTextSectionId && { textSectionIds })
    }
  });

  axios
    .put(
      `/api/common/section/${update._id}`,
      {
        doc: request,
        ...(previousTextSectionId && { previousTextSectionId })
      },
      tokenConfig(getState)
    )
    .then(res => console.log('section put response', res));
};

export const addSectionConnection = (
  sectionId,
  connectionId,
  connectionType,
  resType = 'section'
) => (dispatch, getState) => {
  const { sections } = getState();
  const section = sections[sectionId];
  const update = {
    ...(['outgoing', 'two-way'].includes(connectionType) && {
      directConnections: [
        ...section.directConnections,
        { resId: connectionId, resType }
      ]
    }),
    ...(['incoming', 'two-way'].includes(connectionType) && {
      indirectConnections: [
        ...section.indirectConnections,
        { resId: connectionId, resType }
      ]
    })
  };
  console.log('update', update);
  dispatch({
    type: types.ADD_SECTION_CONNECTION,
    payload: { sectionId, connectionId, connectionType }
  });

  axios.put(
    `/api/common/section/${sectionId}`,
    { doc: update },
    tokenConfig(getState)
  );
};

export const changeSectionConnection = () => () => {};

export const removeSectionConnection = (sectionId, connectionId) => (
  dispatch,
  getState
) => {
  const { sections } = getState();
  const section = sections[sectionId];
  const update = {
    ...(section.directConnections.some(c => c.resId === connectionId) && {
      directConnections: section.directConnections.filter(
        c => c.resId !== connectionId
      )
    }),
    ...(section.indirectConnections.some(c => c.resId === connectionId) && {
      indirectConnections: section.indirectConnections.filter(
        c => c.resId !== connectionId
      )
    })
  };
  if (!Object.keys(update).length) return;

  dispatch({
    type: types.REMOVE_SECTION_CONNECTION,
    payload: { sectionId, connectionId }
  });

  axios.put(
    `/api/common/section/${sectionId}`,
    { doc: update },
    tokenConfig(getState)
  );
};

export const addSectionCategory = (sectionId, categoryId) => (
  dispatch,
  getState
) => {
  const { sections, categories, texts } = getState();
  const section = sections[sectionId];
  const categoryIds = section.categoryIds;
  if (categoryIds.includes(categoryId)) return;

  let newTitle;
  if (
    section.categoryIds.length === 0 &&
    new RegExp(`not categorized \\d+$`).test(section.title)
  ) {
    newTitle = addPlaceholderTitle(categories.byId[categoryId].title, [
      ...texts[section.textId].sectionIds.map(id => sections[id].title)
    ]);
  }

  const update = {
    _id: sectionId,
    categoryIds: [...section.categoryIds, categoryId],
    ...(newTitle && { title: newTitle })
  };
  dispatch({
    type: types.UPDATE_SECTION,
    payload: {
      section: update
    }
  });

  axios.put(
    `/api/common/section/${sectionId}`,
    { doc: update },
    tokenConfig(getState)
  );
};

export const removeSectionCategory = (sectionId, categoryId) => (
  dispatch,
  getState
) => {
  const { sections, categories, texts } = getState();
  const section = sections[sectionId];
  const categoryIds = section.categoryIds;

  if (!categoryIds.includes(categoryId)) return;

  let newTitle;
  if (
    new RegExp(`${categories.byId[categoryId].title} \\d+$`).test(section.title)
  ) {
    newTitle = addPlaceholderTitle(
      section.categoryIds.find(id => id !== categoryId)
        ? categories.byId[section.categoryIds.find(id => id !== categoryId)]
            .title
        : 'not categorized',
      [...texts[section.textId].sectionIds.map(id => sections[id].title)]
    );
  }

  const update = {
    _id: sectionId,
    categoryIds: section.categoryIds.filter(id => id !== categoryId),
    ...(newTitle && { title: newTitle })
  };
  dispatch({
    type: types.UPDATE_SECTION,
    payload: {
      section: update
    }
  });

  axios.put(
    `/api/common/section/${sectionId}`,
    { doc: update },
    tokenConfig(getState)
  );
};

export const setSectionWeight = (sectionId, score) => (dispatch, getState) => {
  const { sections, user } = getState();
  const section = sections[sectionId];
  const importance = section.importance
    .filter(el => el.userId !== user._id)
    .concat({ userId: user._id, score: score });

  dispatch({
    type: types.UPDATE_SECTION,
    payload: { section: { _id: sectionId, importance } }
  });
  axios.put(
    `/api/common/section/${sectionId}`,
    { doc: { importance } },
    tokenConfig(getState)
  );
};

export const deleteSection = sectionId => (dispatch, getState) => {
  const {
    sections,
    textsPanel: { activeTextPanel }
  } = getState();

  dispatch({
    type: types.DELETE_SECTION,
    payload: {
      sectionId,
      textId: activeTextPanel
    }
  });

  axios.delete(`/api/common/section/${sectionId}`, {
    data: {
      shouldDeleteTypes: ['note']
    },
    ...tokenConfig(getState)
  });

  deleteNestedNotes(
    sections[sectionId].directConnections.filter(c => c.resType === 'note'),
    dispatch,
    getState
  ); // deletes nested notes
};

// FLOWCHART
export const toggleFlowchart = () => (dispatch, getState) => {
  const {
    panel: { flowchartIsOpen }
  } = getState();
  console.log('flowchartIsOpen', flowchartIsOpen);
  dispatch({
    type: flowchartIsOpen ? types.CLOSE_FLOWCHART : types.OPEN_FLOWCHART
  });
};
export const openFlowchartSidepanel = () => dispatch => {
  dispatch({
    type: types.OPEN_FLOWCHART_SIDEPANEL
  });
};
export const closeFlowchartSidepanel = () => dispatch => {
  dispatch({
    type: types.CLOSE_FLOWCHART_SIDEPANEL
  });
};
export const setNonLayoutedFlowchartElements = elements => dispatch => {
  dispatch({
    type: types.SET_NONLAYOUTED_FLOWCHART_ELEMENTS,
    payload: { elements }
  });
};
export const setFlowchartElements = elements => dispatch => {
  dispatch({
    type: types.SET_FLOWCHART_ELEMENTS,
    payload: { elements }
  });
};

export const strictFlowchartSearchresults = strictSearchResults => dispatch => {
  dispatch({
    type: types.SET_FLOWCHART_SEARCHRESULTS,
    payload: { strictSearchResults }
  });
};

export const setSearchDelta = searchDelta => dispatch => {
  dispatch({
    type: types.SET_SEARCH_DELTA,
    payload: { searchDelta }
  });
};

export const inspectElementInFlowchart = (resId, resType) => dispatch => {
  if (resType === 'annotation' || resType === 'reply') resType = 'note';
  dispatch({
    type: types.INSPECT_ELEMENT_IN_FLOWCHART,
    payload: { resId, resType }
  });
};

export const setInspectFlowSection = setTo => dispatch => {
  dispatch({
    type: types.SET_INSPECT_FLOW_SECTION,
    payload: { setTo }
  });
};

export const closeFlowchartElement = id => dispatch => {
  dispatch({
    type: types.CLOSE_FLOWCHART_ELEMENT,
    payload: { id }
  });
};

export const toggleDisplayFlowChartNonMatches = () => dispatch => {
  dispatch({
    type: types.TOGGLE_DISPLAY_FLOWCHART_NONMATCHTES
  });
};

export const setFilterAncestorsFlowchart = to => dispatch => {
  dispatch({
    type: types.SET_FILTER_ANCESTORS_FLOWCHART,
    payload: { to }
  });
};

export const setFilterDescendantsFlowchart = to => dispatch => {
  dispatch({
    type: types.SET_FILTER_DESCENDANTS_FLOWCHART,
    payload: { to }
  });
};

export const toggleTypesFilterFlowchart = toggleType => dispatch => {
  dispatch({
    type: types.TOGGLE_TYPES_FILTER_FLOWCHART,
    payload: { toggleType }
  });
};
export const toggleSearchWithinTextcontentFlowchart = () => dispatch => {
  dispatch({
    type: types.TOGGLE_SEARCHWITHIN_TEXTCONTENT_FLOWCHART
  });
};

/**
 *
 * @NOTE
 * @NOTES
 */

export const addNote = ({
  history,
  parentNoteId,
  guessTitle,
  isAnnotation,
  isReply,
  delta
}) => (dispatch, getState) => {
  const { notes, sections, spareIds, user } = getState();
  if (!guessTitle && (isAnnotation || isReply))
    guessTitle = isReply
      ? notes[isReply.noteId].title
      : sections[isAnnotation.sectionId].title;

  const note = {
    _id: spareIds['notes'][0],
    title: isAnnotation || isReply ? `${guessTitle}-1` : guessTitle || 'Note 1',
    delta: delta || { ops: [{ insert: '\n' }] },
    plainText: '',

    isAnnotation: isAnnotation || null,
    isReply: isReply || null,
    projectIds: user.projectIds[0] ? [user.projectIds[0]] : [],

    replies: [],
    directConnections: [],
    indirectConnections: parentNoteId
      ? [{ resId: parentNoteId, resType: 'note' }]
      : [],

    votes: [],

    created: Date.now(),
    lastEdited: Date.now(),
    editedBy: user._id ? [user._id] : [],
    accessFor: user._id ? [user._id] : [],
    isPublic: true //2do
  };

  // add a placeholder title
  const titlePlaceholder = guessTitle || 'Note';
  const allNoteTitles = [
    ...Object.keys(notes).map(id => notes[id].title),
    ...Object.keys(sections).map(id => sections[id].title)
  ];
  let sep = isReply ? '.' : isAnnotation ? '-' : ' ';
  let i = 2;
  while (allNoteTitles.includes(note.title)) {
    note.title = `${titlePlaceholder}${sep}${i}`;
    i++;
  }

  console.log('addNote');
  console.log(note);
  dispatch({
    type: types.ADD_NEW_NOTE,
    payload: { note, open: !!history }
  });

  if (!user._id)
    dispatchAlert(
      {
        message:
          'Note will not be saved to your profile. Login and re-create note!',
        type: 'danger'
      },
      10000,
      dispatch,
      getState
    );

  axios.put(
    `/api/common/note/${note._id}`,
    { doc: note },
    tokenConfig(getState)
  );

  fetchSpareIds('notes', 1, dispatch);

  if (history)
    history.push(
      regExpHistory(
        history.location.pathname,
        spareIds['notes'][0],
        'open',
        'note'
      )
    );
};

export const updateNote = noteUpdate => (dispatch, getState) => {
  const { notes } = getState();
  if (!notes[noteUpdate._id]) {
    console.error('trying to update removed note.');
    return;
  }
  const noteToUpdate = { ...notes[noteUpdate._id] };

  // 2do allow for other types of connections than just notes
  const connectionsToAdd = !noteUpdate.directConnections
    ? []
    : noteUpdate.directConnections.filter(
        el => !noteToUpdate.directConnections.includes(el.resId)
      );
  const connectionsToRemove = !noteUpdate.directConnections
    ? []
    : noteToUpdate.directConnections.filter(
        el => !noteUpdate.directConnections.includes(el.resId)
      );
  Object.keys(noteUpdate).forEach(updateKey => {
    if (Object.keys(noteToUpdate).includes(updateKey)) {
      noteToUpdate[updateKey] = noteUpdate[updateKey];
    }
  });

  dispatch({
    type: types.UPDATE_NOTE,
    payload: { note: noteToUpdate, connectionsToAdd, connectionsToRemove }
  });

  axios.put(
    `/api/common/note/${noteUpdate._id}`,
    {
      doc: ObjectRemoveKeys(noteUpdate, ['_id'])
    },
    tokenConfig(getState)
  ); // 2do add route to handle update of added / removed connections in target notes

  console.log({
    note: ObjectRemoveKeys(noteUpdate, ['_id']),
    connectionsToAdd,
    connectionsToRemove
  });
};

const deleteNestedNotes = (noteIds = [], dispatch, getState) => {
  noteIds.forEach(noteId => {
    const note = getState().notes[noteId];
    if (!note) return;
    if (note.replies.length > 0)
      deleteNestedNotes(note.replies, dispatch, getState);
    dispatch({
      type: types.DELETE_NOTE,
      payload: { note }
    });
  });
};

// 2do: add history
export const deleteNote = noteId => (dispatch, getState) => {
  deleteNestedNotes([noteId], dispatch, getState); // will delete notes and their nested replies.

  axios.delete(`/api/common/note/${noteId}`, {
    data: { shouldDeleteTypes: ['note'] },
    ...tokenConfig(getState)
  });
};

export const toggleUserFavourite = (resId, resType) => dispatch => {
  dispatch({ type: types.TOGGLE_USER_FAVOURITE, payload: { resId, resType } });
};

export const submitNoteVote = (noteId, bill) => (dispatch, getState) => {
  const userId = getState().user._id;
  const userReputation = getState().user.reputation;
  const vote = {
    userId,
    userReputation,
    bill
  };
  dispatch({
    type: types.SUBMIT_NOTE_VOTE,
    payload: {
      noteId,
      vote
    }
  });

  axios.put(
    `/api/common/note/${noteId}`,
    { doc: { vote } },
    tokenConfig(getState)
  );
};

export const toggleShowNoteReplies = noteId => (dispatch, getState) => {
  dispatch({
    type: getState().textsPanel.openReplyNotes.includes(noteId)
      ? types.HIDE_SIDENOTE_REPLIES
      : types.SHOW_SIDENOTE_REPLIES,
    payload: { noteId }
  });
};

export const toggleFlowSectionView = () => (dispatch, getState) => {
  const {
    panel: { flowSectionView }
  } = getState();
  dispatch({
    type: flowSectionView
      ? types.CLOSE_FLOW_SECTION_VIEW
      : types.OPEN_FLOW_SECTION_VIEW
  });
};
