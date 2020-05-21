// auth
export const USER_LOADING = 'USER_LOADING';
export const USER_LOADED = 'USER_LOADED';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';

// errors
export const GET_ERRORS = 'GET_ERRORS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

// ui
export const SET_LOADING = 'SET_LOADING';
export const SET_ALERT = 'SET_ALERT';
export const EXPAND_FINDER_PANEL = 'EXPAND_FINDER_PANEL';
export const COLLAPSE_FINDER_PANEL = 'COLLAPSE_FINDER_PANEL';
export const EXPAND_ANNOTATIONS_PANEL = 'EXPAND_ANNOTATIONS_PANEL';
export const COLLAPSE_ANNOTATIONS_PANEL = 'COLLAPSE_ANNOTATIONS_PANEL';
export const EXPAND_NOTEBOOKS_PANEL = 'EXPAND_NOTEBOOKS_PANEL';
export const COLLAPSE_NOTEBOOKS_PANEL = 'COLLAPSE_NOTEBOOKS_PANEL';
export const EXPAND_TEXTS_PANEL = 'EXPAND_TEXTS_PANEL';
export const COLLAPSE_TEXTS_PANEL = 'COLLAPSE_TEXTS_PANEL';

// spareIds
export const PUSH_SPARE_IDS = 'PUSH_SPARE_IDS';
export const USE_SPARE_ID = 'USE_SPARE_ID'; // Not in use
export const RESTORE_SPARE_ID = 'RESTORE_SPARE_ID';
export const DELETE_ALL_SPARE_IDS = 'DELETE_ALL_SPARE_IDS';

// textsPanel
export const SET_EXPAND_ALL = 'SET_EXPAND_ALL';
export const SET_COMMITTED_SECTIONS = 'SET_COMMITTED_SECTIONS';
export const UNCOMMIT_FROM_SECTION = 'UNCOMMIT_FROM_SECTION';
export const CLEAR_COMMITTED_SECTIONS = 'CLEAR_COMMITTED_SECTIONS';
export const SET_ALL_COMMITTED_SECTIONS = 'SET_ALL_COMMITTED_SECTIONS';
export const SET_TENTATIVE_SECTIONS = 'SET_TENTATIVE_SECTIONS';
export const START_EDIT_SECTION = 'START_EDIT_SECTION';
export const STOP_EDIT_SECTION = 'STOP_EDIT_SECTION';
export const SET_VALID_SELECTION = 'SET_VALID_SELECTION';
export const SET_NOSELECT = 'SET_NOSELECT';
export const SET_HOLDCONTROL = 'SET_HOLDCONTRO';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';

// uploadpage
export const UPLOADED_TEXT = 'UPLOADED_TEXT';
export const SET_TEXT_UPLOAD_STATUS = 'SET_TEXT_UPLOAD_STATUS';
export const SET_TEXT_SEARCH_RESULTS = 'SET_TEXT_SEARCH_RESULTS';

// notebookpage
export const CLOSE_NOTEBOOK = 'CLOSE_NOTEBOOK'; // remove from openNotebooks
export const OPEN_NOTEBOOK = 'OPEN_NOTEBOOK'; // change activeNotebook //append to openNotebooks

// notebook actions
export const GET_NOTEBOOKS = 'GET_NOTEBOOKS'; // GET all notebooks
export const ADD_NOTEBOOK = 'ADD_NOTEBOOK';
export const UPDATE_NOTEBOOK = 'UPDATE_NOTEBOOK';
export const DELETE_NOTEBOOK = 'DELETE_NOTEBOOK';

// note actions
export const GET_NOTES = 'GET_NOTES'; // GET load notes when opening notebook
export const ADD_NOTE = 'ADD_NOTE'; // add a single note
export const UPDATE_NOTE = 'UPDATE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const DELETE_ALL_NOTES = 'DELETE_ALL_NOTES';

// text actions
export const OPEN_TEXT = 'OPEN_TEXT'; //new
export const ADD_TEXT = 'ADD_TEXT';
export const ADD_AND_OPEN_TEXT = 'ADD_AND_OPEN_TEXT'; //new
export const UPDATE_TEXT = 'UPDATE_TEXT'; //new
export const DELETE_TEXT = 'DELETE_TEXT';
export const GET_USER_TEXTS_META = 'GET_USER_TEXTS_META';
export const SWITCH_TO_OPEN_TEXTPANEL = 'SWITCH_TO_OPEN_TEXTPANEL';
export const CLOSE_TEXT = 'CLOSE_TEXT';
export const OPEN_ADDTEXTPANEL = 'OPEN_ADDTEXTPANEL';
export const CLEAR_ADDTEXTPANEL = 'CLEAR_ADDTEXTPANEL';

// sections actions
export const ADD_SECTION = 'ADD_SECTION';
export const UPDATE_SECTION = 'UPDATE_SECTION';
export const DELETE_SECTION = 'DELETE_SECTION';
export const DELETE_ALL_SECTIONS = 'DELETE_ALL_SECTIONS';

// annotation actions
export const GET_ANNOTATIONS = 'GET_ANNOTATIONS';
export const ADD_ANNOTATION = 'ADD_ANNOTATION';
export const UPDATE_ANNOTATION = 'UPDATE_ANNOTATION';
export const DELETE_ANNOTATION = 'DELETE_ANNOTATION';
