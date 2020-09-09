import { combineReducers } from 'redux';
import projectsReducer from './reducers/projectsReducer';
import textsReducer from './reducers/textsReducer';
import sectionsReducer from './reducers/sectionsReducer';
import notesReducer from './reducers/notesReducer';
import uiReducer from './reducers/uiReducer';
import textsPanelReducer from './reducers/textsPanelReducer';
import notesPanelReducer from './reducers/notesPanelReducer';
import spareIdsReducer from './reducers/spareIdsReducer';
import authReducer from './reducers/authReducer';
import userReducer from './reducers/userReducer';
import categoriesReducer from './reducers/categoriesReducer';
import inspectReducer from './reducers/inspectReducer';
import panelReducer from './reducers/panelReducer';
import modalReducer from './reducers/modalReducer';

export default combineReducers({
  auth: authReducer,
  ui: uiReducer,
  panel: panelReducer,
  modal: modalReducer,
  spareIds: spareIdsReducer,
  textsPanel: textsPanelReducer,
  notesPanel: notesPanelReducer,
  user: userReducer,
  projects: projectsReducer,
  texts: textsReducer,
  sections: sectionsReducer,
  notes: notesReducer,
  inspect: inspectReducer,
  categories: categoriesReducer
});
