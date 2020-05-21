import * as types from '../types';

const initialState = {
  activeTextPanel: 'addTextPanel',
  openTextPanels: ['addTextPanel'],
  addTextState: null,
  addedId: null,
  expandAll: false,
  committedSectionIds: [],
  tentativeSectionIds: [],
  editState: [],
  validSelection: null,
  noSelectActive: false,
  holdControl: false,
  progress: 0
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.ADD_AND_OPEN_TEXT:
    case types.OPEN_TEXT:
      return {
        ...state,
        activeTextPanel: payload.text._id,
        openTextPanels: state.addTextState
          ? [...new Set([...state.openTextPanels, payload.text._id])]
          : [...new Set([...state.openTextPanels, payload.text._id])].filter(
              id => id !== 'addTextPanel'
            ),
        validSelection: null
      };
    case types.SWITCH_TO_OPEN_TEXTPANEL:
      return {
        ...state,
        activeTextPanel: payload.textPanelId,
        validSelection: null
      };
    case types.CLOSE_TEXT:
      return {
        ...state,
        activeTextPanel:
          state.activeTextPanel !== payload.textPanelId
            ? state.activeTextPanel
            : state.openTextPanels.length === 1
            ? null
            : state.openTextPanels.filter(id => id !== payload.textPanelId)[
                Math.max(
                  state.openTextPanels.indexOf(payload.textPanelId) - 1,
                  0
                )
              ],
        openTextPanels:
          state.openTextPanels.length > 1
            ? state.openTextPanels.filter(id => id !== payload.textPanelId)
            : ['addTextPanel'],
        validSelection: null
      };
    case types.OPEN_ADDTEXTPANEL:
      return {
        ...state,
        activeTextPanel: 'addTextPanel',
        openTextPanels: [...new Set([...state.openTextPanels, 'addTextPanel'])],
        validSelection: null
      };
    case types.UPLOADED_TEXT:
      return {
        ...state,
        addedId: payload.text._id
      };
    case types.CLEAR_ADDTEXTPANEL:
      return {
        ...state,
        openTextPanels: state.openTextPanels.filter(
          id => id !== 'addTextPanel'
        ),
        addTextState: null,
        addedId: null
      };
    case types.DELETE_ALL_SECTIONS:
    case types.CLEAR_COMMITTED_SECTIONS:
      return {
        ...state,
        committedSectionIds: []
      };
    case types.SET_ALL_COMMITTED_SECTIONS:
      return {
        ...state,
        committedSectionIds: payload.sectionIds
      };
    case types.ADD_SECTION:
      return {
        ...state,
        committedSectionIds:
          payload.add === true
            ? state.committedSectionIds.includes(payload.id)
              ? state.committedSectionIds
              : [...state.committedSectionIds, payload.id]
            : [payload.id],
        validSelection: null
      };

    case types.SET_EXPAND_ALL:
      return {
        ...state,
        expandAll: payload.expandAll,
        committedSectionIds: payload.expandAll ? state.committedSectionIds : []
      };
    case types.SET_COMMITTED_SECTIONS:
      return {
        ...state,
        committedSectionIds:
          payload.add === true
            ? [
                ...new Set([
                  ...state.committedSectionIds,
                  ...payload.sectionIds
                ])
              ]
            : [...payload.sectionIds]
      };
    case types.DELETE_SECTION:
      return {
        ...state,
        committedSectionIds: state.committedSectionIds.filter(
          id => payload.sectionId !== id
        )
      };
    case types.UNCOMMIT_FROM_SECTION:
      return {
        ...state,
        committedSectionIds: state.committedSectionIds.filter(
          id => !payload.sectionIds.includes(id)
        )
      };
    case types.SET_TENTATIVE_SECTIONS:
      return {
        ...state,
        tentativeSectionIds:
          payload.add === true
            ? [...state.tentativeSectionIds, ...payload.sectionIds]
            : payload.id === null
            ? []
            : [...payload.sectionIds]
      };
    case types.START_EDIT_SECTION:
      return {
        ...state,
        editState: state.editState.includes(payload)
          ? state.editState
          : [...state.editState, payload]
      };
    case types.STOP_EDIT_SECTION:
      return {
        ...state,
        editState: [...state.editState.filter(id => id !== payload)]
      };

    case types.SET_VALID_SELECTION:
      return {
        ...state,
        validSelection: payload.setValidSelectionTo
      };
    case types.SET_HOLDCONTROL:
      return {
        ...state,
        holdControl: payload
      };
    case types.UPDATE_PROGRESS:
      return {
        ...state,
        progress:
          (100 *
            Object.keys(payload.textById)
              .map(id => (payload.textById[id].categoryNum >= 0 ? 1 : 0))
              .reduce((pv, cv) => pv + cv, 0)) /
          Object.keys(payload.textById).length
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
