import axios from 'axios';
import * as types from './types';
import {
  defaultText,
  filterObjectByKeys,
  ObjectRemoveKeys,
  ObjectKeepKeys,
  sortSectionIds,
  deepCompare,
  regExpHistory
} from '../functions/main';

/**
 *
 *
 * @AUTH
 */

export const registerUser = ({ username, email, password }) => dispatch => {
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
    .then(res =>
      dispatch({
        type: types.REGISTER_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
      );
      dispatch({
        type: types.REGISTER_FAIL
      });
    });
};

export const loadUser = () => async (dispatch, getState) => {
  const {
    auth: { token },
    texts
  } = getState();
  if (!token || token === 'undefined') {
    console.log('no token, no request. 2do: request session token.');
    return;
  }

  console.log(!token);
  // User loading
  dispatch({ type: types.USER_LOADING });

  try {
    const userRes = await axios.get('/api/auth/user', tokenConfig(getState));
    console.log(userRes.data);
    dispatch({
      type: types.USER_LOADED,
      payload: userRes.data
    });

    const user = userRes.data.user;
    if (user.notebookIds.length > 0) {
      const notebooksRes = await axios.get(
        `/api/notebooks/${user.notebookIds.join('+')}`
      );

      console.log(notebooksRes);

      const notebooksById = {};
      notebooksRes.data.forEach(
        notebook => (notebooksById[notebook._id] = notebook)
      );
      dispatch({
        type: types.GET_NOTEBOOKS,
        payload: { notebooksById }
      });
    }
    const textsToGet = user.textIds.filter(
      id => !Object.keys(texts.byId).includes(id)
    );
    if (textsToGet.length > 0) {
      const textsRes = await axios.get(
        `/api/texts/meta/${textsToGet.join('+')}`
      );
      const textsMetaById = {};
      textsRes.data.forEach(text => (textsMetaById[text._id] = text));
      dispatch({
        type: types.GET_USER_TEXTS_META,
        payload: { textsMetaById }
      });
    }

    if (user.annotationIds.length > 0) {
      const annotationsRes = await axios.get(
        `/api/annotations/${user.annotationIds.join('+')}`
      );
      const annotationsById = {};
      annotationsRes.data.forEach(
        annotation => (annotationsById[annotation._id] = annotation)
      );
      dispatch({
        type: types.GET_ANNOTATIONS,
        payload: { annotationsById }
      });
    }
  } catch (error) {
    console.log(error);
    dispatch(returnErrors(error.response.data, error.response.status));
    dispatch({
      type: types.AUTH_ERROR
    });
  }
};

export const loginUser = ({ email, password }) => async (
  dispatch,
  getState
) => {
  const {
    textsPanel: { openTexts }
  } = getState();
  try {
    // Headers
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Request body
    const body = JSON.stringify({ email, password });
    console.log(body, config);

    const userRes = await axios.post('/api/auth/login', body, config);
    dispatch({
      type: types.LOGIN_SUCCESS,
      payload: userRes.data
    });
    // duplicacted code:
    const user = userRes.data.user;
    if (user.notebookIds.length > 0) {
      const notebooksRes = await axios.get(
        `/api/notebooks/${user.notebookIds.join('+')}`
      );

      console.log(notebooksRes);

      const notebooksById = {};
      notebooksRes.data.forEach(
        notebook => (notebooksById[notebook._id] = notebook)
      );
      dispatch({
        type: types.GET_NOTEBOOKS,
        payload: { notebooksById }
      });
    }
    const textsToGet = user.textIds.filter(id => !openTexts.includes(id));
    if (textsToGet.length > 0) {
      const textsRes = await axios.get(
        `/api/texts/meta/${textsToGet.join('+')}`
      );
      const textsMetaById = {};
      textsRes.data.forEach(text => (textsMetaById[text._id] = text));
      dispatch({
        type: types.GET_USER_TEXTS_META,
        payload: { textsMetaById }
      });
    }

    if (user.annotationIds.length > 0) {
      const annotationsRes = await axios.get(
        `/api/annotations/${user.annotationIds.join('+')}`
      );
      const annotationsById = {};
      annotationsRes.data.forEach(
        annotation => (annotationsById[annotation._id] = annotation)
      );
      dispatch({
        type: types.GET_ANNOTATIONS,
        payload: { annotationsById }
      });
    }
  } catch (err) {
    console.log(err);
    dispatch(
      returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
    );
    dispatch({
      type: types.LOGIN_FAIL
    });
  }
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
export const setAlert = warningObj => dispatch =>
  dispatch({
    type: types.SET_ALERT,
    payload: warningObj
      ? {
          message: warningObj.message,
          type: warningObj.type
        }
      : null
  });

export const expandFinderPanel = () => dispatch =>
  dispatch({ type: types.EXPAND_FINDER_PANEL });

export const collapseFinderPanel = () => dispatch =>
  dispatch({ type: types.COLLAPSE_FINDER_PANEL });

export const expandAnnotationsPanel = () => dispatch =>
  dispatch({ type: types.EXPAND_ANNOTATIONS_PANEL });

export const collapseAnnotationsPanel = () => dispatch =>
  dispatch({ type: types.COLLAPSE_ANNOTATIONS_PANEL });

export const expandNotebooksPanel = () => dispatch =>
  dispatch({ type: types.EXPAND_NOTEBOOKS_PANEL });

export const collapseNotebooksPanel = () => dispatch =>
  dispatch({ type: types.COLLAPSE_NOTEBOOKS_PANEL });

export const expandTextsPanel = () => dispatch =>
  dispatch({ type: types.EXPAND_TEXTS_PANEL });

export const collapseTextsPanel = () => dispatch =>
  dispatch({ type: types.COLLAPSE_TEXTS_PANEL });

export const toggleKeepFinderOpen = () => dispatch => {
  dispatch({
    type: types.TOGGLE_KEEP_FINDER_OPEN
  });
};

/**
 *
 *
 * @SPARE_IDS
 */
export const fillSpareIds = () => (dispatch, getState) => {
  const { spareIds } = getState();
  Object.keys(spareIds).forEach(prefix => {
    if (spareIds[prefix].length < 3) {
      axios
        .post(`/api/${prefix}/spareIds/${3 - spareIds[prefix].length}`)
        .then(res => {
          dispatch({
            type: types.PUSH_SPARE_IDS,
            payload: { prefix, spareIds: res.data.spareIds }
          });
        });
    }
  });
};

export const getNewSpareIds = (prefix, numberOfSpareIds) =>
  axios.post(`/api/${prefix}/spareIds/${numberOfSpareIds}`).then(res => {
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
  ['notebooks', 'texts', 'sections', 'annotations'].forEach(prefix =>
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
    payload: { sectionIds: texts.byId[activeTextPanel].sectionIds }
  });
};

export const setTentativeSections = (sectionIds, add) => dispatch =>
  dispatch({
    type: types.SET_TENTATIVE_SECTIONS,
    payload: { sectionIds, add }
  });

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

export const openSpeedReader = (words, begin, end) => dispatch => {
  dispatch({
    type: types.OPEN_SPEED_READER,
    payload: { words, begin, end }
  });
};

export const playSpeedReader = () => dispatch =>
  dispatch({
    type: types.PLAY_SPEED_READER
  });

export const pauseSpeedReader = () => dispatch =>
  dispatch({
    type: types.PAUSE_SPEED_READER
  });

export const closeSpeedReader = () => dispatch =>
  dispatch({
    type: types.CLOSE_SPEED_READER
  });

/**
 *
 *
 * @TEXT_UPLOAD_PAGE
 */
export const uploadTextcontent = (
  { textcontent, deltas },
  publicAccess = true
) => (dispatch, getState) => {
  const {
    user,
    texts,
    spareIds,
    auth: { isAuthenticated }
  } = getState();
  const text = defaultText();
  text._id = spareIds['texts'][0];
  text.textcontent = textcontent;
  text.deltas = deltas;
  text.formatDeltas = deltas;
  text.editedBy = user._id ? [user._id] : [];
  text.accessFor = publicAccess
    ? []
    : user._id
    ? [user._id]
    : ['2do:session.id'];
  // add a placeholder title
  const allTextTitles = [
    ...Object.keys(texts.byId).map(id => texts.byId[id].title)
  ];
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

  axios.put(
    `/api/texts/${text._id}`,
    ObjectKeepKeys(text, [
      '_id',
      'textcontent',
      'deltas',
      'editedBy',
      'accessFor'
    ])
  );

  if (isAuthenticated) {
    axios.put(
      `/api/users/update`,
      { textIds: [...user.textIds, text._id] },
      tokenConfig(getState)
    ); // 2do: add auth only...
  }

  const prefix = 'texts';
  axios.post(`/api/${prefix}/spareIds/1`).then(res => {
    dispatch({
      type: types.PUSH_SPARE_IDS,
      payload: { prefix, spareIds: res.data.spareIds }
    });
  });
};

export const updateText = (textId, textUpdate) => (dispatch, getState) => {
  console.log(textUpdate);
  const { texts } = getState();
  const text = { ...texts.byId[textId], ...textUpdate };

  dispatch({
    type: types.UPDATE_TEXT,
    payload: { text }
  });

  axios.put(`/api/texts/${textId}`, textUpdate);
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
export const searchTextsInDatabase = (
  searchString,
  searchFields = 'all'
) => dispatch => {
  axios.get(`/api/texts/search/${searchFields}&${searchString}`).then(res => {
    console.log(res.data);
    dispatch({
      type: types.SET_TEXT_SEARCH_RESULTS,
      payload: { searchResults: res.data }
    });
  });
};

export const deleteText = id => (dispatch, getState) => {
  const {
    auth: { isAuthenticated },
    user
  } = getState();
  // and its sections...
  // make private later on...
  axios.get(`/api/texts/${id}`).then(res => {
    if (res.data.sectionIds.length > 0) {
      axios.delete(`/api/sections/${res.data.sectionIds.join('+')}`);
    }
  });
  axios.delete(`/api/texts/${id}`);
  if (isAuthenticated) {
    axios.put(
      `/api/users/update`,
      {
        textIds: user.textIds.filter(textId => textId !== id)
      },
      tokenConfig(getState)
    ); // 2do: add auth only...
  }
  console.log('delete attempted, refresh page...');
};

export const deleteAllTexts = () => {
  // DEV only...
  axios.get(`/api/texts/`).then(res => {
    res.data.forEach(text => {
      axios.get(`/api/texts/${text._id}`).then(res => {
        if (res.data.sectionIds.length > 0) {
          axios.delete(`/api/sections/${res.data.sectionIds.join('+')}`);
        }
      });
      axios.delete(`/api/texts/${text._id}`);
    });
  });
};

/**
 *
 *
 * @NOTEBOOK_PAGE
 */
export const loadNotebooks = ({
  notebookIds,
  open,
  setToActive,
  history
}) => async (dispatch, getState) => {
  const { notebooks } = getState();

  if (notebookIds.length === 0) {
    console.log('not logged in or no notebooks...');
    return;
  }
  if (
    Object.keys(notebooks.byId).length === notebookIds.length &&
    !Object.keys(notebooks.byId).some(id => !notebookIds.includes(id))
  ) {
    console.log('notebooks already fetched');
    return;
  }
  const notebooksRes = await axios.get(
    `/api/notebooks/${notebookIds.join('+')}`
  ); // add auth
  console.log(notebooksRes);

  const notebooksById = {};
  notebooksRes.data.forEach(
    notebook => (notebooksById[notebook._id] = notebook)
  );
  dispatch({
    type: types.GET_NOTEBOOKS,
    payload: { notebooksById, open, setToActive }
  });
};

export const closeNotebook = ({ notebookId, history }) => (
  dispatch,
  getState
) => {
  const {
    notebooksPanel: { openNotebooks }
  } = getState();
  dispatch({
    type: types.CLOSE_NOTEBOOK,
    payload: { notebookId, last: openNotebooks.length === 1 }
  });
  history.push(
    regExpHistory(history.location.pathname, notebookId, 'close', 'notebook')
  );
};

export const openNotebook = ({ notebookId, history }) => dispatch => {
  dispatch({
    type: types.OPEN_NOTEBOOK,
    payload: { notebookId }
  });
  history.push(
    regExpHistory(history.location.pathname, notebookId, 'open', 'notebook')
  );
};

/**
 *
 *
 * @NOTEBOOK
 */
export const addNotebook = ({ history }) => (dispatch, getState) => {
  const {
    auth: { isAuthenticated },
    notebooks,
    spareIds,
    user
  } = getState();

  const notebook = {
    _id: spareIds['notebooks'][0],
    title: '',
    deltas: [],
    annotations: [],
    keywords: [],
    created: Date.now(),
    lastEdited: Date.now(),
    editedBy: user._id ? [user._id] : [],
    accessFor: user._id ? [user._id] : []
  };

  console.log('addNotebook');
  // add a placeholder title
  const allNotebookTitles = [
    ...Object.keys(notebooks.byId).map(id => notebooks.byId[id].title)
  ];
  let i = 0;
  do {
    i++;
    notebook.title = `Notebook ${i}`;
  } while (allNotebookTitles.includes(`Notebook ${i}`));
  console.log(notebook);
  dispatch({
    type: types.ADD_NOTEBOOK,
    payload: { notebook }
  });

  axios.put(
    `/api/notebooks/${notebook._id}`,
    filterObjectByKeys(notebook, ['_id'], null)
  );

  const prefix = 'notebooks';
  axios.post(`/api/${prefix}/spareIds/1`).then(res => {
    dispatch({
      type: types.PUSH_SPARE_IDS,
      payload: { prefix, spareIds: res.data.spareIds }
    });
  });
  // save to server if authenticated
  if (isAuthenticated) {
    console.log('put to server.');
    axios.put(
      `/api/users/update`,
      {
        notebookIds: [...user.notebookIds, notebook._id]
      },
      tokenConfig(getState)
      //
    );
  }
  history.push(
    regExpHistory(
      history.location.pathname,
      spareIds['notebooks'][0],
      'open',
      'notebook'
    )
  );
};

export const updateNotebook = notebookUpdate => (dispatch, getState) => {
  const { notebooks } = getState();
  const notebookToUpdate = { ...notebooks.byId[notebookUpdate._id] };
  Object.keys(notebookUpdate).forEach(updateKey => {
    if (Object.keys(notebookToUpdate).includes(updateKey)) {
      notebookToUpdate[updateKey] = notebookUpdate[updateKey];
    }
  });

  dispatch({
    type: types.UPDATE_NOTEBOOK,
    payload: { notebook: notebookToUpdate }
  });

  axios.put(
    `/api/notebooks/${notebookUpdate._id}`,
    filterObjectByKeys(notebookUpdate, ['_id'], null)
  );
};

export const deleteNotebook = notebookId => (getState, dispatch) => {
  const {
    user,
    notebooks,
    auth: { isAuthenticated }
  } = getState();
  const notebook = notebooks.byId[notebookId];
  const notebookAnnotations = notebook.annotations;
  dispatch({
    type: types.DELETE_NOTEBOOK,
    payload: { notebookId }
  });

  // update server
  axios.delete(`/api/notebooks/${notebookId}`);
  notebookAnnotations.forEach(annotation => {
    axios.put(
      `/api/annotations/${annotation.annotationId}/deletednotebook/${notebookId}`
    );
  });
  if (isAuthenticated) {
    axios.put(
      `/api/users/update`,
      {
        notebookIds: user.notebookIds.filter(id => id !== notebookId)
      },
      tokenConfig(getState)
    );
  }
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
    textsPanel: { activeTextPanel }
  } = getState();
  const loaded = texts.byId[textId]
    ? texts.byId[textId].textcontent
      ? true
      : false
    : false;
  console.log('loaded? ', loaded);
  console.log(texts);
  console.log(textId);
  console.log(texts.byId[textId]);

  if (loaded && activeTextPanel === textId) {
    console.log('text already open.');
    return;
  }
  if (history)
    history.push(
      regExpHistory(history.location.pathname, textId, 'open', 'text')
    );
  let text;
  if (!loaded) {
    console.log('start loading text...', textId);
    const textres = await axios.get(`/api/texts/id/${textId}`);
    const text = textres.data;
    if (!text) {
      console.log('text doesnt exist.');
      return;
    }
    const sectionsById = {};
    const annotationsById = {};
    if (text.sectionIds.length > 0) {
      const sectionsRes = await axios.get(
        `/api/sections/${text.sectionIds.join('+')}`
      );
      console.log(sectionsRes);
      sectionsRes.data.forEach(
        section => (sectionsById[section._id] = section)
      );

      const getAnnotations = [];
      sectionsRes.data.forEach(section =>
        getAnnotations.push(...section.annotationIds)
      );
      console.log(getAnnotations);
      if (getAnnotations.length > 0) {
        const annotationsRes = await axios.get(
          `/api/annotations/${getAnnotations.join('+')}`
        );
        console.log(annotationsRes);
        annotationsRes.data.forEach(
          annotation => (annotationsById[annotation._id] = annotation)
        );
      }
    }
    console.log('openText?', openText);
    if (!openText) {
      dispatch({
        type: types.ADD_TEXT,
        payload: {
          sectionsById,
          text,
          annotationsById
        }
      });
    } else if (openText) {
      text.words = text.textcontent.split(/\s+/);
      dispatch({
        type: types.ADD_AND_OPEN_TEXT,
        payload: {
          sectionsById,
          text,
          annotationsById,
          textId: text._id,
          setToActive: setToActive
        }
      });
    }
  } else if (loaded) {
    if (!openText) {
      console.log('text already loaded, and doesnt need to be openend.');
      return;
    }
    text = texts.byId[textId];
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
    payload: { textPanelId: textPanelId, last: openTextPanels.length === 1 }
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
    auth: { isAuthenticated },
    texts,
    sections,
    spareIds,
    user,
    categories,
    textsPanel: { validSelection, activeTextPanel }
  } = getState();
  const text = texts.byId[activeTextPanel];

  const section = {
    _id: spareIds['sections'][0],
    title: null,
    begin: begin,
    end: end,
    categoryIds: [categoryId],
    annotationIds: [],
    fullWords: text.textcontent.slice(begin, end + 1),
    textId: activeTextPanel,
    editedBy: user._id ? [user._id] : []
  };
  console.log(text.sectionIds);
  console.log(sections);
  console.log(section);
  console.log(categories);

  // add a placeholder title
  const allSectionTitles = [
    ...text.sectionIds.map(id => sections.byId[id].title)
  ];
  let i = 0;
  do {
    i++;
    section.title = `${categories.byId[section.categoryIds[0]].title} ${i}`;
  } while (
    allSectionTitles.includes(
      `${categories.byId[section.categoryIds[0]].title} ${i}`
    )
  );

  const textSections = {
    ...filterObjectByKeys(sections.byId, null, text.sectionIds),
    [section._id]: section
  };
  console.log(textSections);
  const textSectionIds = sortSectionIds(textSections);
  console.log(textSectionIds);
  // const ranges = [
  //   ...text.formatDivs,
  //   ...text.sectionIds.map(id => sections.byId[id]),
  //   { ...section }
  // ];
  // console.log(ranges);
  dispatch({
    type: types.ADD_SECTION,
    payload: {
      section,
      textSectionIds: textSectionIds,
      textId: activeTextPanel
      // divs: divsParser(text.textcontent, ranges)
    }
  });

  axios.put(
    `/api/sections/${section._id}`,
    filterObjectByKeys(section, ['_id'], null)
  );

  axios
    .put(`/api/texts/${activeTextPanel}`, {
      sectionIds: textSectionIds
    })
    .catch(err => console.error(err, 'err.response.data, err.response.status'));
  if (isAuthenticated) {
    axios.put(
      `/api/users/update`,
      {
        sectionIds: user.sectionIds.concat(section._id)
      },
      tokenConfig(getState)
    ); //2do auth only.
  }

  const prefix = 'sections';
  axios.post(`/api/${prefix}/spareIds/1`).then(res => {
    dispatch({
      type: types.PUSH_SPARE_IDS,
      payload: { prefix, spareIds: res.data.spareIds }
    });
  });
};

export const updateSection = update => (dispatch, getState) => {
  const {
    sections,
    categories,
    texts,
    textsPanel: { activeTextPanel }
  } = getState();
  const section = { ...sections.byId[update._id] };
  const text = texts.byId[activeTextPanel];
  const request = {};

  if (
    update.categoryIds &&
    !update.title &&
    Object.keys(categories.byId)
      .map(id => categories.byId[id].title)
      .some(title => {
        const titleRegExp = new RegExp(`${title} \\d+$`);
        if (titleRegExp.test(section.title)) return true;
      })
  ) {
    const allSectionTitles = [
      ...text.sectionIds.map(id => sections.byId[id].title)
    ];
    let i = 0;
    do {
      i++;
      section.title = `${categories.byId[update.categoryIds[0]].title} ${i}`;
    } while (
      allSectionTitles.includes(
        `${categories.byId[update.categoryIds[0]].title} ${i}`
      )
    );
    request.title = section.title;
  }
  // only send changed parts to server // 2do include Array & Obj compare
  Object.keys(update).forEach(updateKey => {
    if (Object.keys(section).includes(updateKey)) {
      if (update[updateKey] !== section[updateKey]) {
        request[updateKey] = update[updateKey];
        section[updateKey] = update[updateKey];
      }
    }
  });

  dispatch({
    type: types.UPDATE_SECTION,
    payload: { section, textId: text._id, sections }
  });

  axios.put(`/api/sections/${update._id}`, request);
};

export const deleteSection = sectionId => (dispatch, getState) => {
  const {
    auth: { isAuthenticated },
    user,
    texts,
    sections,
    textsPanel: { activeTextPanel }
  } = getState();

  axios.delete(`/api/sections/${sectionId}`);
  axios.put(`/api/texts/${activeTextPanel}`, {
    sectionIds: texts.byId[activeTextPanel].sectionIds.filter(
      id => id !== sectionId
    )
  });
  if (isAuthenticated) {
    axios.put(
      `/api/users/update}`,
      {
        sectionIds: user.sectionIds.filter(id => id !== sectionId)
      },
      tokenConfig(getState)
    ); //2do auth only.
  }
  const sectionIds = texts.byId[activeTextPanel].sectionIds.filter(
    id => id !== sectionId
  );

  // const ranges = [
  //   ...texts.byId[activeTextPanel].formatDivs,
  //   ...sectionIds.map(id => sections.byId[id])
  // ];

  dispatch({
    type: types.DELETE_SECTION,
    payload: {
      sectionId,
      sections,
      textId: activeTextPanel
      // divs: divsParser(texts.byId[activeTextPanel].textcontent, ranges)
    }
  });
};

export const deleteAllSections = () => (dispatch, getState) => {
  const {
    auth: { isAuthenticated },
    user,
    sections,
    texts,
    textsPanel: { activeTextPanel }
  } = getState();
  const sectionIdsToDelete = texts.byId[activeTextPanel].sectionIds;

  if (sectionIdsToDelete.length > 0) {
    axios.delete(`/api/sections/${sectionIdsToDelete.join('+')}`);
    axios.put(`/api/texts/${texts._id}`, {
      sectionIds: [] //2do handle if sections are created by multiple users
    });

    sections.byId = {}; // reset to empty object
    dispatch({
      type: types.DELETE_ALL_SECTIONS,
      payload: {
        textId: activeTextPanel,
        sectionIds: sectionIdsToDelete
      }
    });
    if (isAuthenticated) {
      axios.put(
        `/api/users/update`,
        {
          sectionIds: user.sectionIds.filter(
            id => !sectionIdsToDelete.includes(id)
          )
        },
        tokenConfig(getState)
      ); //2do auth only.
    }
  }
};

/**
 *
 *
 * @Annotations
 */
export const addAnnotation = ({ type, sectionId }) => (dispatch, getState) => {
  const {
    auth: { isAuthenticated },
    textsPanel: { activeTextPanel },
    sections,
    spareIds,
    user
  } = getState();
  const annotation = {
    _id: spareIds['annotations'][0],
    type,
    html: '',
    plainText: '',
    sectionId,
    textId: activeTextPanel,
    connectedWith: [],
    version: 'v0',
    created: Date.now(),
    lastEdited: Date.now(),
    editedBy: user._id ? [user._id] : [],
    accessFor: [] // if [] => public
  };
  dispatch({
    type: types.ADD_ANNOTATION,
    payload: { annotation, sectionId: sectionId }
  });

  axios.put(
    `/api/annotations/${annotation._id}`,
    ObjectRemoveKeys(annotation, ['_id'])
  );

  axios.put(`/api/sections/${sectionId}`, {
    annotationIds: [...sections.byId[sectionId].annotationIds, annotation._id]
  });
  if (isAuthenticated) {
    axios.put(
      `/api/users/update`,
      {
        annotationIds: [...user.annotationIds, annotation._id]
      },
      tokenConfig(getState)
    ); //2do auth only.
  }

  const prefix = 'annotations';
  axios.post(`/api/${prefix}/spareIds/1`).then(res => {
    dispatch({
      type: types.PUSH_SPARE_IDS,
      payload: { prefix, spareIds: res.data.spareIds }
    });
  });
};

export const setAnnotationEditState = annotationIdOrNull => dispatch => {
  dispatch({
    type: types.SET_ANNOTATION_EDIT_STATE,
    payload: { annotationIdOrNull }
  });
};

export const updateAnnotation = ({
  annotationId,
  type,
  html,
  plainText,
  version,
  notebookId,
  indexInNotebookAnnotations
}) => (dispatch, getState) => {
  if ([annotationId, type, html, plainText, version].includes(undefined))
    throw `undefined props in updateAnnotation: ${[
      annotationId,
      type,
      html,
      plainText,
      version
    ]}`;
  const { annotations } = getState();
  const annotation = {
    ...annotations.byId[annotationId],
    type,
    html,
    plainText,
    version,
    ...(notebookId && {
      connectedWith: [
        ...new Set([
          ...annotations.byId[annotationId].connectedWith,
          notebookId
        ])
      ]
    })
  };
  dispatch({
    type: types.UPDATE_ANNOTATION,
    payload: { annotation }
  });
  axios.put(
    `/api/annotations/${annotation._id}`,
    ObjectRemoveKeys(annotation, ['_id'])
  );
  if (!notebookId) return;
  dispatch({
    type: types.ATTACH_ANNOTATION_TO_NOTEBOOK,
    payload: {
      annotationId,
      plainText,
      version,
      notebookId,
      indexInNotebookAnnotations
    }
  });
};

export const deleteAnnotation = annotationId => (dispatch, getState) => {
  const {
    auth: { isAuthenticated },
    annotations,
    user
  } = getState();
  console.log(annotationId);
  const sectionId = annotations.byId[annotationId].sectionId;
  dispatch({
    type: types.DELETE_ANNOTATION,
    payload: {
      annotationId,
      sectionId
    }
  });

  axios.delete(`/api/annotations/${annotationId}`);
  axios.put(`/api/sections/${sectionId}`, {
    annotationIds: Object.keys(annotations.byId).filter(
      id => id !== annotationId
    )
  });
  if (isAuthenticated) {
    axios.put(
      `/api/users/update`,
      {
        annotationIds: user.annotationIds.filter(id => id !== annotationId)
      },
      tokenConfig(getState)
    ); //2do auth only.
  }
};
