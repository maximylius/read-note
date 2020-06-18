import * as types from '../types';
import { sortSectionIds, filterObjectByKeys } from '../../functions/main';

const initialState = { byId: {} };

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_USER_TEXTS_META:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...payload.textsMetaById
        }
      };
    case types.OPEN_TEXT:
    case types.ADD_AND_OPEN_TEXT:
    case types.UPLOADED_TEXT:
    case types.ADD_TEXT:
      return {
        ...state,
        byId: { ...state.byId, [payload.text._id]: payload.text }
      };
    case types.DELETE_TEXT: //2do
      return {
        ...state
      };
    case types.UPDATE_TEXT:
      return {
        ...state,
        byId: { ...state.byId, [payload.text._id]: payload.text }
      };

    case types.ADD_SECTION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.textId]: {
            ...state.byId[payload.textId],
            sectionIds: payload.textSectionIds
          }
        }
      };
    case types.UPDATE_SECTION:
      console.log('UPDATE_TEXT from', type, 'with', payload);
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.textId]: {
            ...state.byId[payload.textId],
            sectionIds: payload.textSectionIds
          }
        }
      };
    case types.DELETE_SECTION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.textId]: {
            ...state.byId[payload.textId],
            sectionIds: [...state.byId[payload.textId].sectionIds].filter(
              id => id !== payload.sectionId
            )
          }
        }
      };
    case types.DELETE_ALL_SECTIONS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [payload.textId]: {
            ...state.byId[payload.textId],
            sectionIds: []
          }
        }
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
