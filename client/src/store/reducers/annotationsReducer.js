import * as types from '../types';
import { ObjectRemoveKeys, extractNumber } from '../../functions/main';

const initialState = { byId: {} };

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_ANNOTATIONS:
    case types.ADD_TEXT:
    case types.ADD_AND_OPEN_TEXT:
      return {
        ...state,
        byId: { ...state.byId, ...payload.annotationsById }
      };
    case types.ADD_ANNOTATION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.annotation._id]: payload.annotation
        }
      };

    case types.SYNC_ANNOTATION_WITH:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.annotationId]: {
            ...state.byId[payload.annotationId],
            syncWith: payload.notebookIds
          }
        }
      };

    case types.UPDATE_ANNOTATION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.annotation._id]: payload.annotation
        }
      };
    case types.DELETE_ANNOTATION:
      return {
        ...state,
        byId: ObjectRemoveKeys(state.byId, [payload.annotationId])
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
