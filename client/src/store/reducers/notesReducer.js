import * as types from '../types';
import { ObjectRemoveKeys } from '../../functions/main';

const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.ADD_NOTE_TO_NOTE_CONNECTION:
      return {
        ...state,
        [payload.targetNoteId]: {
          ...state[payload.targetNoteId],
          indirectConnections: [
            ...new Set([
              ...state[payload.targetNoteId].indirectConnections,
              payload.originNoteId
            ])
          ]
        }
      };
    case types.REMOVE_NOTE_TO_NOTE_CONNECTION:
      return {
        ...state,
        [payload.targetNoteId]: {
          ...state[payload.targetNoteId],
          indirectConnections: state[
            payload.targetNoteId
          ].indirectConnections.filter(id => id !== payload.originNoteId)
        }
      };
    case types.GET_NOTES:
      return {
        ...state,
        ...payload.notesById
      };
    case types.UPDATE_NOTE:
      return {
        ...state,
        [payload.note._id]: payload.note
      };
    case types.ADD_NOTE:
      return {
        ...state,
        [payload.note._id]: payload.note
      };
    case types.DELETE_NOTE:
      return ObjectRemoveKeys(state, [payload.noteId]);

    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
