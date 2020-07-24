import { combineReducers } from 'redux';
import sectionsReducer from './reducers/sectionsReducer';
import textsReducer from './reducers/textsReducer';
import uiReducer from './reducers/uiReducer';
import textsPanelReducer from './reducers/textsPanelReducer';
import notesPanelReducer from './reducers/notesPanelReducer';
import spareIdsReducer from './reducers/spareIdsReducer';
import authReducer from './reducers/authReducer';
import errorReducer from './reducers/errorReducer';
import userReducer from './reducers/userReducer';
import categoriesReducer from './reducers/categoriesReducer';
import flowchartReducer from './reducers/flowchartReducer';
import notesReducer from './reducers/notesReducer';

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  ui: uiReducer, //join with errorReducer.
  spareIds: spareIdsReducer,
  textsPanel: textsPanelReducer,
  notesPanel: notesPanelReducer,
  user: userReducer,
  notes: notesReducer,
  texts: textsReducer,
  sections: sectionsReducer,
  flowchart: flowchartReducer,
  categories: categoriesReducer
});
