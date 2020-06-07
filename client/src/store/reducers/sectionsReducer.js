import * as types from '../types';
import { ObjectRemoveKeys } from '../../functions/main';

let initialState = {
  byId: {}
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.ADD_TEXT:
    case types.ADD_AND_OPEN_TEXT:
      return {
        ...state,
        byId: { ...state.byId, ...payload.sectionsById }
      };
    case types.ADD_SECTION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.section._id]: payload.section
        }
      };
    case types.UPDATE_SECTION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.section._id]: payload.section
        }
      };
    case types.DELETE_SECTION:
      return {
        ...state,
        byId: ObjectRemoveKeys(state.byId, [payload.sectionId])
      };
    case types.DELETE_ALL_SECTIONS:
      return {
        ...state,
        byId: {}
      };

    case types.ADD_ANNOTATION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.sectionId]: {
            ...state.byId[payload.sectionId],
            annotationIds: [
              ...state.byId[payload.sectionId].annotationIds,
              payload.annotation._id
            ]
          }
        }
      };
    case types.DELETE_ANNOTATION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.sectionId]: {
            ...state.byId[payload.sectionId],
            annotationIds: [
              ...state.byId[payload.sectionId].annotationIds
            ].filter(id => id !== payload.annotationId)
          }
        }
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
