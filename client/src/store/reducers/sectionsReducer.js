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
      return payload.note.isAnnotation
        ? {
            ...state,
            [payload.note.isAnnotation.sectionId]: {
              ...state[payload.note.isAnnotation.sectionId],
              directConnections: [
                ...state[payload.note.isAnnotation.sectionId].directConnections,
                { resId: payload.note._id, resType: 'note' }
              ]
            }
          }
        : state;
    case types.UPDATE_NOTE:
      return [
        ...payload.connectionsToAdd,
        ...payload.connectionsToRemove
      ].filter(el => el.resType === 'section').length === 0
        ? state
        : {
            ...state,
            // update when directConnections have changed.
            ...Object.fromEntries(
              payload.connectionsToAdd.flatMap(el =>
                el.resType === 'section'
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
                el.resType === 'section'
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

    case types.ADD_SECTION_CONNECTION:
      return {
        ...state,
        [payload.sectionId]: {
          ...state[payload.sectionId],
          directConnections: state[payload.sectionId].directConnections.concat(
            ...[
              ['two-way', 'outgoing'].includes(payload.connectionType)
                ? [{ resId: payload.connectionId, resType: 'section' }]
                : []
            ]
          ),
          indirectConnections: state[
            payload.sectionId
          ].indirectConnections.concat(
            ...[
              ['two-way', 'incoming'].includes(payload.connectionType)
                ? [{ resId: payload.connectionId, resType: 'section' }]
                : []
            ]
          )
        },
        [payload.connectionId]: {
          ...state[payload.connectionId],
          directConnections: state[
            payload.connectionId
          ].directConnections.concat(
            ...[
              ['two-way', 'incoming'].includes(payload.connectionType)
                ? [{ resId: payload.sectionId, resType: 'section' }]
                : []
            ]
          ),
          indirectConnections: state[
            payload.connectionId
          ].indirectConnections.concat(
            ...[
              ['two-way', 'outgoing'].includes(payload.connectionType)
                ? [{ resId: payload.sectionId, resType: 'section' }]
                : []
            ]
          )
        }
      };
    case types.REMOVE_SECTION_CONNECTION:
      return {
        ...state,
        [payload.sectionId]: {
          ...state[payload.sectionId],
          directConnections: state[payload.sectionId].directConnections.filter(
            connection => connection.resId !== payload.connectionId
          ),
          indirectConnections: state[
            payload.sectionId
          ].indirectConnections.filter(
            connection => connection.resId !== payload.connectionId
          )
        },
        [payload.connectionId]: {
          ...state[payload.connectionId],
          directConnections: state[
            payload.connectionId
          ].directConnections.filter(
            connection => connection.resId !== payload.sectionId
          ),
          indirectConnections: state[
            payload.connectionId
          ].indirectConnections.filter(
            connection => connection.resId !== payload.sectionId
          )
        }
      };
    case types.ADD_SECTION_CATEGORY:
      return {
        ...state,
        [payload.sectionId]: {
          ...state[payload.sectionId],
          categoryIds: state[payload.sectionId].categoryIds.concat(
            payload.categoryId
          )
        }
      };
    case types.REMOVE_SECTION_CATEGORY:
      return {
        ...state,
        [payload.sectionId]: {
          ...state[payload.sectionId],
          categoryIds: state[payload.sectionId].categoryIds.filter(
            id => id !== payload.categoryId
          )
        }
      };
    case types.SET_SECTION_WEIGHT:
      return {
        ...state,
        [payload.sectionId]: {
          ...state[payload.sectionId],
          importance: payload.importance
        }
      };

    case types.DELETE_NOTE:
      return payload.note.directConnections.some(el => el.resType === 'section')
        ? {
            ...state,
            ...Object.fromEntries(
              payload.note.directConnections.flatMap(el =>
                el.resType === 'section' &&
                Object.keys(state).includes(el.resId)
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
