import * as types from '../types';
import { ObjectRemoveKeys } from '../../functions/main';

const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.LOAD_TEXTS:
      return {
        ...state,
        ...payload.docsById
      };
    case types.GET_USER_TEXTS_META:
      return {
        ...state,
        ...payload.textsMetaById
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
        ...ObjectRemoveKeys(state, payload.textId)
      };
    case types.UPDATE_TEXT:
      return {
        ...state,
        [payload.text._id]: payload.text
      };

    case types.ADD_NEW_SECTION:
      return {
        ...state,
        [payload.textId]: {
          ...state[payload.textId],
          sectionIds: payload.textSectionIds
        }
      };
    case types.UPDATE_SECTION:
      return payload.textSectionIds
        ? {
            ...state,
            [payload.textId]: {
              ...state[payload.textId],
              sectionIds: payload.textSectionIds
            }
          }
        : state;
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

    case types.ADD_NEW_NOTE:
      return payload.note.isAnnotation
        ? {
            ...state,
            [payload.note.isAnnotation.textId]: {
              ...state[payload.note.isAnnotation.textId],
              directConnections: [
                ...state[payload.note.isAnnotation.textId].directConnections,
                { resId: payload.note._id, resType: 'note' }
              ]
            }
          }
        : state;
    case types.UPDATE_NOTE:
      return [
        ...payload.connectionsToAdd,
        ...payload.connectionsToRemove
      ].filter(el => el.resType === 'text').length === 0
        ? state
        : {
            ...state,
            // update when directConnections have changed.
            ...Object.fromEntries(
              payload.connectionsToAdd.flatMap(el =>
                el.resType === 'text'
                  ? [
                      [
                        el.resId,
                        {
                          ...state[el.resId],
                          indirectConnections: [
                            ...new Set(
                              ...state[el.resId].indirectConnections.concat({
                                resId: payload.note._id,
                                resType: 'note'
                              })
                            )
                          ]
                        }
                      ]
                    ]
                  : []
              )
            ),
            ...Object.fromEntries(
              payload.connectionsToRemove.flatMap(el =>
                el.resType === 'text'
                  ? [
                      [
                        el.resId,
                        {
                          ...state[el.resId],
                          indirectConnections: state[
                            el.resId
                          ].indirectConnections.filter(
                            el => el.resId !== payload.note._id
                          )
                        }
                      ]
                    ]
                  : []
              )
            )
          };
    case types.DELETE_NOTE:
      return payload.note.directConnections.some(el => el.resType === 'text')
        ? {
            ...state,
            ...Object.fromEntries(
              payload.note.directConnections.flatMap(el =>
                el.resType === 'text' && Object.keys(state).includes(el.resId)
                  ? [
                      [
                        el.resId,
                        {
                          ...state[el.resId],
                          indirectConnections: state[
                            el.resId
                          ].indirectConnections.filter(
                            el => el.resId !== payload.note._id
                          )
                        }
                      ]
                    ]
                  : []
              )
            )
          }
        : state;

    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
