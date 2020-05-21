import * as types from '../types';
import { filterObjectByKeys } from '../../functions/main';

const initialState = { byId: {} };

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_NOTES:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...payload.notesById
        }
      };
    case types.ADD_NOTEBOOK:
    case types.ADD_NOTE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.note._id]: payload.note
        }
      };
    case types.UPDATE_NOTE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.note._id]: payload.note
        }
      };
    case types.DELETE_NOTE:
      return {
        ...state,
        byId: filterObjectByKeys(state.byId, [payload.noteId], null)
      };
    case types.DELETE_NOTEBOOK:
      return {
        ...state,
        byId: filterObjectByKeys(state.byId, payload.notesToDelete, null)
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
