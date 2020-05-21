import * as types from '../types';
import { filterObjectByKeys } from '../../functions/main';

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
    case types.UPDATE_ANNOTATION:
      return {
        ...state
      };
    case types.DELETE_ANNOTATION:
      return {
        ...state,
        byId: filterObjectByKeys(state.byId, [payload.annotationId], null)
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
