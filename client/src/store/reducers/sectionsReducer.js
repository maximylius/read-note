import * as types from '../types';
import { ObjectRemoveKeys } from '../../functions/main';

let initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.LOAD_SECTIONS:
      return {
        ...state,
        ...payload.docsById
      };
    case types.ADD_TEXT:
    case types.ADD_AND_OPEN_TEXT:
      return {
        ...state,
        ...payload.sectionsById
      };
    case types.ADD_NEW_SECTION:
      return {
        ...state,
        [payload.section._id]: payload.section
      };
    case types.UPDATE_SECTION:
      return {
        ...state,
        [payload.section._id]: {
          ...state[payload.section._id],
          ...payload.section
        }
      };
    case types.DELETE_SECTION:
      return {
        ...ObjectRemoveKeys(state, [payload.sectionId]),
        ...Object.fromEntries(
          [
            ...new Set([
              ...state[payload.sectionId].directConnections.filter(
                c => c.resType === 'section'
              ),
              ...state[payload.sectionId].directConnections.filter(
                c => c.resType === 'section'
              )
            ])
          ].map(c => [
            c.resId,
            {
              ...state[c.resId],
              directConnections: state[c.resId].directConnections.filter(
                r => r.resId !== payload.sectionId
              ),
              indirectConnections: state[c.resId].indirectConnections.filter(
                r => r.resId !== payload.sectionId
              )
            }
          ])
        )
      };

    case types.ADD_NEW_NOTE:
      return payload.note.isAnnotation
        ? {
            ...state,
            [payload.note.isAnnotation.sectionId]: {
              ...state[payload.note.isAnnotation.sectionId],
              noteIds: [
                ...state[payload.note.isAnnotation.sectionId].noteIds,
                payload.note._id
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
              payload.connectionsToAdd
                .filter(c => c.resType === 'section')
                .map(el => [
                  el.resId,
                  {
                    ...state[el.resId],
                    indirectConnections: state[el.resId].indirectConnections
                      .filter(c => c.resId !== el.resId)
                      .concat({
                        resId: payload.note._id,
                        resType: 'note'
                      })
                  }
                ])
            ),
            ...Object.fromEntries(
              payload.connectionsToRemove
                .filter(c => c.resType === 'section')
                .map(el => [
                  el.resId,
                  {
                    ...state[el.resId],
                    indirectConnections: state[
                      el.resId
                    ].indirectConnections.filter(
                      el => el.resId !== payload.note._id
                    )
                  }
                ])
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

    case types.DELETE_NOTE:
      return payload.note.directConnections.some(el => el.resType === 'section')
        ? {
            ...state,
            ...Object.fromEntries(
              [
                ...payload.note.directConnections
                  .filter(
                    el =>
                      el.resType === 'section' &&
                      Object.keys(state).includes(el.resId)
                  )
                  .map(el => el.resId),
                ...(payload.note.isAnnotation
                  ? [payload.note.isAnnotation.sectionId]
                  : [])
              ].map(sectionId => [
                sectionId,
                {
                  ...state[sectionId],
                  noteIds: state[sectionId].noteIds.filter(
                    id => id !== payload.note._id
                  ),
                  indirectConnections: state[
                    sectionId
                  ].indirectConnections.filter(
                    el => el.resId !== payload.note._id
                  )
                }
              ])
            )
          }
        : state;
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
