import * as types from '../types';

const initialState = {
  openNotes: [],
  activeNote: null,
  createNote: false,
  noteSearchResults: [],
  autoAddNotes: false,
  addNotesTo: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_NOTES:
      return {
        ...state,
        activeNote: payload.setToActive
          ? payload.setToActive
          : state.activeNote,
        openNotes: payload.open
          ? [
              ...new Set([
                ...state.openNotes,
                ...Object.keys(payload.notesById)
              ])
            ]
          : state.openNotes
      };
    case types.ADD_NOTE:
      return {
        ...state,
        ...(payload.open && {
          activeNote: payload.note._id,
          openNotes: [...new Set([...state.openNotes, payload.note._id])]
        })
      };
    case types.OPEN_NOTE:
      return {
        ...state,
        activeNote: payload.noteId,
        openNotes: [...new Set([...state.openNotes, payload.noteId])]
      };
    case types.CLOSE_NOTE:
      return {
        ...state,
        activeNote:
          state.activeNote !== payload.noteId
            ? state.activeNote
            : state.openNotes.filter(id => id !== payload.noteId).pop(),
        openNotes: state.openNotes.filter(id => id !== payload.noteId)
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
