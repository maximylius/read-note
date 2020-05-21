import * as types from '../types';

const initialState = {
  openNotebooks: [],
  activeNotebook: null,
  createNotebook: false,
  notebookSearchResults: []
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_NOTEBOOKS:
      return {
        ...state,
        activeNotebook: payload.setToActive
          ? payload.setToActive
          : state.activeNotebook,
        openNotebooks: payload.open
          ? [...state.openNotebooks, ...Object.keys(payload.notebooksById)]
          : state.openNotebooks
      };
    case types.ADD_NOTEBOOK:
      return {
        ...state,
        activeNotebook: payload.notebook._id,
        openNotebooks: [...state.openNotebooks, payload.notebook._id]
      };
    case types.OPEN_NOTEBOOK:
      return {
        ...state,
        activeNotebook: payload.notebookId,
        openNotebooks: [
          ...new Set([...state.openNotebooks, payload.notebookId])
        ]
      };
    case types.CLOSE_NOTEBOOK:
      return {
        ...state,
        activeNotebook:
          state.activeNotebook === payload.notebookId
            ? state.openNotebooks.length > 1
              ? state.openNotebooks[state.openNotebooks.length - 1]
              : null
            : state.activeNotebook,
        openNotebooks: state.openNotebooks.filter(
          id => id !== payload.notebookId
        )
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
