import * as types from '../types';

const initialState = {
  isOpen: false,
  sidepanelOpen: true,
  inspectElements: []
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.TOGGLE_FLOWCHART:
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case types.OPEN_FLOWCHART_SIDEPANEL:
      return {
        ...state,
        sidepanelOpen: true
      };
    case types.CLOSE_FLOWCHART_SIDEPANEL:
      return {
        ...state,
        sidepanelOpen: false
      };
    case types.INSPECT_ELEMENT_IN_FLOWCHART:
      return {
        ...state,
        inspectElements: [
          ...(state.inspectElements.some(el => el.id === payload.id)
            ? []
            : [{ id: payload.id, type: payload.type }]),
          ...state.inspectElements.slice(0, 3) //max 4 open resources
        ],
        sidepanelOpen: true
      };

    case types.CLOSE_FLOWCHART_ELEMENT:
      return {
        ...state,
        inspectElements: state.inspectElements.filter(
          el => el.id !== payload.id
        )
      };
    case types.OPEN_FLOWCHART_ELEMENT_FULLSCREEN:
    case types.ADD_AND_OPEN_TEXT:
    case types.OPEN_TEXT:
    case types.GET_NOTEBOOKS:
      return state.isOpen ? { ...state, isOpen: false } : state;
    default:
      return state;
  }
};
