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
    // case types.ATTACH_ANNOTATION_TO_NOTEBOOK:
    //   return {
    //     ...state,
    //     byId: {
    //       ...state.byId,
    //       [payload.annotationId]: {
    //         ...state.byId[payload.annotationId],
    //         annotationVersion: `v${
    //           extractNumber(
    //             state.byId[payload.annotationId].annotationVersion,
    //             0
    //           ) + 1
    //         }`
    //       }
    //     }
    //   };
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
