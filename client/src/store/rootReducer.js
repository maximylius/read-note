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
import flowchartReducer from './reducers/flowchartReducer';

export default combineReducers({
  auth: authReducer,
  ui: uiReducer,
  spareIds: spareIdsReducer,
  textsPanel: textsPanelReducer,
  notesPanel: notesPanelReducer,
  user: userReducer,
  projects: projectsReducer,
  texts: textsReducer,
  sections: sectionsReducer,
  notes: notesReducer,
  flowchart: flowchartReducer,
  categories: categoriesReducer
});
