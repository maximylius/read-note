import * as types from '../types';

const initialState = {
  _id: null,
  anonymousId: null,
  username: null,
  email: null,
  notebookIds: [],
  textIds: [],
  sectionIds: [],
  annotationIds: [],
  accessedNotebookIds: [],
  accessedTextIds: [],
  reputation: 0
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_NOTEBOOKS:
      return {
        ...state,
        notebookIds: [
          ...new Set([
            ...state.notebookIds,
            ...Object.keys(payload.notebooksById)
          ])
        ]
      };
    case types.ADD_NOTEBOOK:
      return {
        ...state,
        notebookIds: [...state.notebookIds, payload.notebook._id]
      };
    case types.UPLOADED_TEXT:
    case types.ADD_TEXT:
    case types.ADD_AND_OPEN_TEXT:
      console.log('state', state);
      return {
        ...state,
        textIds: [...new Set([...state.textIds, payload.text._id])]
      };
    case types.ADD_SECTION:
      return {
        ...state,
        sectionIds: [...state.sectionIds, payload.section.Id]
      };
    case types.ADD_ANNOTATION:
      return {
        ...state,
        annotationIds: [...state.annotationIds, payload.annotation._id]
      };

    case types.DELETE_NOTEBOOK:
      return {
        ...state,
        notebookIds: state.notebookIds.filter(id => id !== payload.notebookId)
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
    case types.DELETE_ANNOTATION:
      return {
        ...state,
        annotationIds: state.annotationIds.filter(
          id => id !== payload.annotationId
        )
      };
    case types.USER_LOADED:
    case types.LOGIN_SUCCESS:
    case types.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      // merge with any previous user activity.
      console.log(payload);
      console.log(payload.user);
      console.log(payload.user.notebookIds);
      return {
        ...payload.user,
        notebookIds: [
          ...new Set([...payload.user.notebookIds, ...state.notebookIds])
        ],
        textIds: [...new Set([...payload.user.textIds, ...state.textIds])],
        sectionIds: [
          ...new Set([...payload.user.sectionIds, ...state.sectionIds])
        ],
        annotationIds: [
          ...new Set([...payload.user.annotationIds, ...state.annotationIds])
        ],
        accessedNotebookIds: [
          ...new Set([
            ...payload.user.accessedNotebookIds,
            ...state.accessedNotebookIds
          ])
        ],
        accessedTextIds: [
          ...new Set([
            ...payload.user.accessedTextIds,
            ...state.accessedTextIds
          ])
        ]
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
