import * as types from '../types';
import { sortSectionIds, filterObjectByKeys } from '../../functions/main';

const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_USER_TEXTS_META:
      return {
        ...payload.textsMetaById,
        ...state
      };
    case types.OPEN_TEXT:
    case types.ADD_AND_OPEN_TEXT:
    case types.UPLOADED_TEXT:
    case types.ADD_TEXT:
      return {
        ...state,
        [payload.text._id]: payload.text
      };
    case types.DELETE_TEXT: //2do
      return {
        ...state
      };
    case types.UPDATE_TEXT:
      return {
        ...state,
        [payload.text._id]: payload.text
      };

    case types.ADD_SECTION:
      return {
        ...state,
        [payload.textId]: {
          ...state[payload.textId],
          sectionIds: payload.textSectionIds
        }
      };
    case types.UPDATE_SECTION:
      console.log('UPDATE_TEXT from', type, 'with', payload);
      return {
        ...state,
        [payload.textId]: {
          ...state[payload.textId],
          sectionIds: payload.textSectionIds
        }
      };
    case types.DELETE_SECTION:
      return {
        ...state,
        [payload.textId]: {
          ...state[payload.textId],
          sectionIds: [...state[payload.textId].sectionIds].filter(
            id => id !== payload.sectionId
          )
        }
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
