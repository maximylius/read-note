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
    case types.SET_NOTEBOOK_ANNOTATION_VERSIONS:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...Object.fromEntries(
            payload.notebookUpdates.map(notebookUpdate => [
              notebookUpdate.notebookId,
              {
                ...state.byId[notebookUpdate.notebookId],
                annotationVersions: notebookUpdate.annotationVersions
              }
            ])
          )
        }
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
