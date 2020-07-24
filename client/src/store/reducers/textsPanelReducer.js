import * as types from '../types';

const initialState = {
  activeTextPanel: 'addTextPanel',
  openTextPanels: ['addTextPanel'],
  addTextState: null,
  addedId: null, //remove
  expandAll: false,
  committedSectionIds: [],
  tentativeSectionIds: [],
  holdControl: false,
  progress: 0,
  displayTextMeta: false,
  speedReader: { isOpenFor: [], words: [], byId: {} }
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
        addedId: payload.text._id,
        displayTextMeta: true
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
        committedSectionIds: [
          ...(payload.add === true ? state.committedSectionIds : []),
          payload.section._id
        ]
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
    // case types.ADD_ANNOTATION:
    //   return {
    //     ...state,
    //     editAnnotationId: payload.annotation._id
    //   };
    // case types.SET_ANNOTATION_EDIT_STATE:
    //   return {
    //     ...state,
    //     editAnnotationId: payload.annotationIdOrNull
    //   };

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

    case types.SET_SPEED_READER:
      return {
        ...state,
        speedReader: {
          ...state.speedReader,
          words: payload.words,
          ...(!state.speedReader.byId[payload.textId] && {
            byId: {
              ...state.speedReader.byId,
              [payload.textId]: {
                begin: 0,
                end: payload.words.length - 1,
                index: 0
              }
            }
          })
        }
      };
    case types.OPEN_SPEED_READER:
      return {
        ...state,
        speedReader: {
          ...state.speedReader,
          isOpenFor: [...state.speedReader.isOpenFor, payload.textId],
          byId: {
            ...state.speedReader.byId,
            [payload.textId]: {
              begin: payload.begin,
              end: payload.end,
              index: payload.index
            }
          }
        }
      };
    case types.PLAY_SPEED_READER:
      return {
        ...state,
        speedReader: {
          ...state.speedReader,
          byId: {
            ...state.speedReader.byId,
            [payload.textId]: {
              ...state.speedReader.byId[payload.textId],
              play: true
            }
          }
        }
      };
    case types.PAUSE_SPEED_READER:
      return {
        ...state,
        speedReader: {
          ...state.speedReader,
          byId: {
            ...state.speedReader.byId,
            [payload.textId]: {
              play: false,
              begin: payload.begin,
              end: payload.end,
              index: payload.index,
              lastIndex: state.speedReader.byId[payload.textId].index
            }
          }
        }
      };
    case types.CLOSE_SPEED_READER:
      return {
        ...state,
        speedReader: {
          ...state.speedReader,
          isOpenFor: state.speedReader.isOpenFor.filter(
            id => id !== payload.textId
          )
        }
      };

    case types.SET_DISPLAY_TEXT_META:
      return {
        ...state,
        displayTextMeta: payload.display
      };

    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
