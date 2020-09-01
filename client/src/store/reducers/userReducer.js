import * as types from '../types';

const initialState = {
  _id: null,
  anonymousId: null,
  username: null,
  email: null,
  noteIds: [],
  textIds: [],
  sectionIds: [],
  annotationIds: [],
  accessedNoteIds: [],
  accessedTextIds: [],
  favourites: [],
  reputation: 0
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_NOTES:
      return {
        ...state,
        noteIds: [
          ...new Set([...state.noteIds, ...Object.keys(payload.notesById)])
        ]
      };
    case types.ADD_NEW_NOTE:
      return {
        ...state,
        noteIds: [...state.noteIds, payload.note._id]
      };
    case types.UPLOADED_TEXT:
    case types.ADD_TEXT:
    case types.ADD_AND_OPEN_TEXT:
      console.log('state', state);
      return {
        ...state,
        textIds: [...new Set([...state.textIds, payload.text._id])]
      };
    case types.ADD_NEW_SECTION:
      return {
        ...state,
        sectionIds: [...state.sectionIds, payload.section.Id]
      };

    case types.DELETE_NOTE:
      return {
        ...state,
        noteIds: state.noteIds.filter(id => id !== payload.note._id)
      };
    case types.DELETE_TEXT:
      return {
        ...state,
        textIds: state.textIds.filter(id => id !== payload.textId)
      };
    case types.DELETE_SECTION:
      return {
        ...state,
        sectionIds: state.sectionIds.filter(id => id !== payload.sectionId)
      };
    case types.DELETE_ALL_SECTIONS:
      return {
        ...state,
        sectionIds: state.sectionIds.filter(
          id => !payload.sectionIds.includes(id)
        )
      };

    case types.TOGGLE_USER_FAVOURITE:
      return {
        ...state,
        favourites: state.favourites.some(fav => fav.resId === payload.resId)
          ? state.favourites.filter(fav => fav.resId !== payload.resId)
          : state.favourites.concat({
              resId: payload.resId,
              resType: payload.resType
            })
      };

    case types.LOGIN_SUCCESS:
    case types.REGISTER_SUCCESS:
    case types.USER_LOADED:
      // merge with any previous user activity.
      console.log(payload);
      console.log(payload.user);
      console.log(payload.user.noteIds);
      return {
        ...state,
        ...payload.user,
        ...Object.fromEntries(
          // merge all arrays
          Object.keys(payload.user).map(key => [
            key,
            Array.isArray(payload.user[key]) && Array.isArray(state[key])
              ? [...payload.user[key], ...state[key]]
              : payload.user[key]
          ])
        )
      };
    case types.LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...initialState
      };
    case types.AUTH_ERROR: //when does AUTH_ERROR Happen?
    case types.LOGIN_FAIL:
    case types.REGISTER_FAIL:
      return state;
    default:
      return state;
  }
};
