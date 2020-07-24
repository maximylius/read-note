import * as types from '../types';
import { ObjectRemoveKeys } from '../../functions/main';

let initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.ADD_TEXT:
    case types.ADD_AND_OPEN_TEXT:
      return {
        ...state,
        ...payload.sectionsById
      };
    case types.ADD_SECTION:
      return {
        ...state,
        [payload.section._id]: payload.section
      };
    case types.UPDATE_SECTION:
      return {
        ...state,
        [payload.section._id]: payload.section
      };
    case types.DELETE_SECTION:
      return ObjectRemoveKeys(state, [payload.sectionId]);
    case types.ADD_NOTE:
      return payload !== '2do'
        ? state
        : {
            ...state,
            [payload.sectionId]: {
              ...state[payload.sectionId],
              annotationIds: [
                ...state[payload.sectionId].annotationIds,
                payload.annotation._id
              ]
            }
          };

    case types.DELETE_NOTE:
      return payload !== '2do'
        ? state
        : {
            ...state,
            [payload.sectionId]: {
              ...state[payload.sectionId],
              annotationIds: [...state[payload.sectionId].annotationIds].filter(
                id => id !== payload.annotationId
              )
            }
          };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
