import { combineReducers } from 'redux';
import sectionsReducer from './reducers/sectionsReducer';
import textsReducer from './reducers/textsReducer';
import uiReducer from './reducers/uiReducer';
import textsPanelReducer from './reducers/textsPanelReducer';
import annotationsReducer from './reducers/annotationsReducer';
import notebooksReducer from './reducers/notebooksReducer';
import notebooksPanelReducer from './reducers/notebooksPanelReducer';
import spareIdsReducer from './reducers/spareIdsReducer';
import authReducer from './reducers/authReducer';
import errorReducer from './reducers/errorReducer';
import userReducer from './reducers/userReducer';
import categoriesReducer from './reducers/categoriesReducer';
import flowchartReducer from './reducers/flowchartReducer';

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  ui: uiReducer, //join with errorReducer.
  spareIds: spareIdsReducer,
  textsPanel: textsPanelReducer,
  notebooksPanel: notebooksPanelReducer,
  user: userReducer,
  notebooks: notebooksReducer,
  texts: textsReducer,
  sections: sectionsReducer,
  annotations: annotationsReducer,
  flowchart: flowchartReducer,
  categories: categoriesReducer
});
