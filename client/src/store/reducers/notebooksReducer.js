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
    case types.ATTACH_ANNOTATION_TO_NOTEBOOK:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.notebookId]: {
            ...state.byId[payload.notebookId],
            annotations: payload.indexInNotebookAnnotations
              ? state.byId[payload.notebookId].annotations.map(
                  (annotation, index) =>
                    index === payload.indexInNotebookAnnotations
                      ? {
                          ...annotation,
                          version: payload.version,
                          plainText: payload.plainText
                        }
                      : annotation
                )
              : [
                  ...state.byId[payload.notebookId].annotations,
                  {
                    annotationId: payload.annotationId,
                    version: payload.version,
                    plainText: payload.plainText
                  }
                ]
          }
        }
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
