import * as types from '../types';
import { filterObjectByKeys } from '../../functions/main';

const initialState = { byId: {} };

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_NOTEBOOKS:
      return {
        ...state,
        byId: { ...state.byId, ...payload.notebooksById }
      };
    case types.UPDATE_NOTEBOOK:
      return {
        byId: { ...state.byId, [payload.notebook._id]: payload.notebook }
      };
    case types.ADD_NOTEBOOK:
      return {
        ...state,
        byId: { ...state.byId, [payload.notebook._id]: payload.notebook }
      };
    case types.DELETE_NOTEBOOK:
      return {
        ...state,
        byId: filterObjectByKeys(state.byId, [payload.notebookId], null)
      };
    case types.ADD_NOTE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.notebookId]: {
            ...state.byId[payload.notebookId],
            contentIds: payload.contentIds
          }
        }
      };
    case types.UPDATE_NOTE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.notebookId]: {
            ...state.byId[payload.notebookId],
            contentIds: payload.updateContentIds
              ? payload.contentIds
              : state.byId[payload.notebookId].contentIds
          }
        }
      };
    case types.DELETE_NOTE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.notebookId]: {
            ...state.byId[payload.notebookId],
            contentIds: state.byId[payload.notebookId].contentIds.filter(
              id => id !== payload.noteId
            )
          }
        }
      };
    case types.DELETE_ALL_NOTES:
      return {
        ...state,
        noteIds: []
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
