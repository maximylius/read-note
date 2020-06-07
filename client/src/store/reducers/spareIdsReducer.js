import * as types from '../types';

const initialState = {
  notebooks: [],
  texts: [],
  sections: [],
  annotations: []
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.ADD_NOTEBOOK:
      return {
        ...state,
        notebooks: state.notebooks.slice(1)
      };
    case types.ADD_SECTION:
      return {
        ...state,
        sections: state.sections.slice(1)
      };
    case types.ADD_ANNOTATION:
      return {
        ...state,
        annotations: state.annotations.slice(1)
      };
    case types.UPLOADED_TEXT:
      return {
        ...state,
        texts: state.texts.slice(1)
      };
    case types.USE_SPARE_ID:
      return {
        ...state,
        [payload.prefix]: state[payload.prefix].filter(
          id => id !== payload.spareId
        )
      };
    case types.PUSH_SPARE_IDS:
      return {
        ...state,
        [payload.prefix]: [...state[payload.prefix], ...payload.spareIds]
      };
    case types.RESTORE_SPARE_ID:
      return {
        ...state,
        [payload.prefix]: [payload.id, ...state[payload.prefix]]
      };
    case types.DELETE_ALL_SPARE_IDS:
      return {
        ...initialState
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
