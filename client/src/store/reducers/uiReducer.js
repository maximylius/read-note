import * as types from '../types';
import _isEqual from 'lodash/isEqual';

const mdResolver = (finderOpen, textsOpen, annotationsOpen, notebooksOpen) => {
  if (finderOpen) {
    if (textsOpen) {
      if (annotationsOpen) {
        if (notebooksOpen) {
          return {
            mdFinderPanel: 2,
            mdTextsPanel: 6,
            mdAnnotationsPanel: 5,
            mdNotebooksPanel: 4
          };
        } else if (!notebooksOpen) {
          return {
            mdFinderPanel: 3,
            mdTextsPanel: 9,
            mdAnnotationsPanel: 5,
            mdNotebooksPanel: 0
          };
        }
      } else if (!annotationsOpen) {
        if (notebooksOpen) {
          return {
            mdFinderPanel: 2,
            mdTextsPanel: 5,
            mdAnnotationsPanel: 0,
            mdNotebooksPanel: 5
          };
        } else if (!notebooksOpen) {
          return {
            mdFinderPanel: 3,
            mdTextsPanel: 9,
            mdAnnotationsPanel: 0,
            mdNotebooksPanel: 0
          };
        }
      }
    } else if (!textsOpen) {
      if (notebooksOpen) {
        return {
          mdFinderPanel: 3,
          mdTextsPanel: 0,
          mdAnnotationsPanel: Number(annotationsOpen),
          mdNotebooksPanel: 9
        };
      } else if (!notebooksOpen) {
        return {
          mdFinderPanel: 6,
          mdTextsPanel: 0,
          mdAnnotationsPanel: Number(annotationsOpen),
          mdNotebooksPanel: 0
        };
      }
    }
  } else if (!finderOpen) {
    if (textsOpen) {
      if (annotationsOpen) {
        if (notebooksOpen) {
          return {
            mdFinderPanel: 0,
            mdTextsPanel: 8,
            mdAnnotationsPanel: 5,
            mdNotebooksPanel: 4
          };
        } else if (!notebooksOpen) {
          return {
            mdFinderPanel: 0,
            mdTextsPanel: 12,
            mdAnnotationsPanel: 5,
            mdNotebooksPanel: 0
          };
        }
      } else if (!annotationsOpen) {
        if (notebooksOpen) {
          return {
            mdFinderPanel: 0,
            mdTextsPanel: 7,
            mdAnnotationsPanel: 0,
            mdNotebooksPanel: 5
          };
        } else if (!notebooksOpen) {
          return {
            mdFinderPanel: 0,
            mdTextsPanel: 12,
            mdAnnotationsPanel: 0,
            mdNotebooksPanel: 0
          };
        }
      }
    } else if (!textsOpen) {
      if (notebooksOpen) {
        return {
          mdFinderPanel: 0,
          mdTextsPanel: 0,
          mdAnnotationsPanel: Number(annotationsOpen),
          mdNotebooksPanel: 12 // smaller for extra padding
        };
      } else if (!notebooksOpen) {
        return {
          mdFinderPanel: 6,
          mdTextsPanel: 0,
          mdAnnotationsPanel: Number(annotationsOpen),
          mdNotebooksPanel: 0
        };
      }
    }
  }
};

const initialState = {
  mdFinderPanel: 2,
  mdTextsPanel: 6,
  mdAnnotationsPanel: 4,
  mdAnnotationsPanelLast: 4,
  mdNotebooksPanel: 4,
  mdNotebooksPanelLast: 4,
  keepFinderOpen: false,
  loading: false,
  alerts: [],
  alertId: 0
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.EXPAND_FINDER_PANEL:
      return {
        ...state,
        ...mdResolver(
          true,
          state.mdTextsPanel > 0,
          false,
          state.mdNotebooksPanel > 0
        ),
        mdAnnotationsPanelLast: state.mdAnnotationsPanel
      };
    // close finder...
    case types.OPEN_NOTEBOOK:
    case types.ADD_NOTEBOOK:
    case types.UPDATE_NOTEBOOK:
    case types.UPDATE_TEXT:
    case types.OPEN_ADDTEXTPANEL:
    case types.UPLOADED_TEXT:
      if (state.keepFinderOpen) return state;
    // else collapse
    case types.COLLAPSE_FINDER_PANEL:
      return {
        ...state,
        ...mdResolver(
          false,
          state.mdTextsPanel > 0,
          state.mdAnnotationsPanelLast > 0,
          state.mdNotebooksPanel > 0
        )
      };
    case types.EXPAND_TEXTS_PANEL:
    case types.OPEN_ADDTEXTPANEL:
    case types.SWITCH_TO_OPEN_TEXTPANEL:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          true,
          state.mdAnnotationsPanel > 0,
          state.mdNotebooksPanel > 0
        )
      };
    // OPEN TEXT AND COLLAPSE FINDER
    case types.OPEN_TEXT:
    case types.ADD_AND_OPEN_TEXT:
    case types.ADD_TEXT:
    case types.SWITCH_TO_OPEN_TEXTPANEL:
      return {
        ...state,
        ...mdResolver(
          state.keepFinderOpen,
          true,
          state.mdAnnotationsPanel > 0,
          state.mdNotebooksPanel > 0
        )
      };

    case types.COLLAPSE_TEXTS_PANEL:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          false,
          state.mdAnnotationsPanel > 0,
          state.mdNotebooksPanel > 0
        ),
        mdAnnotationsPanelLast: state.mdAnnotationsPanel
      };
    case types.CLOSE_TEXT:
      if (!payload.last) {
        return state;
      } else {
        return {
          ...state,
          ...mdResolver(
            state.mdFinderPanel > 0,
            false,
            state.mdAnnotationsPanel > 0,
            state.mdNotebooksPanel > 0
          )
        };
      }
    case types.EXPAND_ANNOTATIONS_PANEL:
    case types.SET_COMMITTED_SECTIONS:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          state.mdTextsPanel > 0,
          true,
          state.mdNotebooksPanel > 0
        ),
        mdAnnotationsPanelLast: 1
      };
    // EXPAND ANNOTATIONS PANEL AND COLLAPSE FINDER
    case types.ADD_SECTION:
    case types.UPDATE_SECTION:
    case types.DELETE_SECTION:
    case types.ADD_ANNOTATION:
    case types.DELETE_ANNOTATION:
      return {
        ...state,
        ...mdResolver(
          state.keepFinderOpen,
          state.mdTextsPanel > 0,
          true,
          state.mdNotebooksPanel > 0
        ),
        mdAnnotationsPanelLast: 1
      };
    case types.COLLAPSE_ANNOTATIONS_PANEL:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          state.mdTextsPanel > 0,
          false,
          state.mdNotebooksPanel > 0
        ),
        mdAnnotationsPanelLast: 0
      };
    case types.EXPAND_NOTEBOOKS_PANEL:
    case types.ADD_NOTEBOOK:
    case types.OPEN_NOTEBOOK:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          state.mdTextsPanel > 0,
          state.mdAnnotationsPanel > 0,
          true
        )
      };
    case types.COLLAPSE_NOTEBOOKS_PANEL:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          state.mdTextsPanel > 0,
          state.mdAnnotationsPanel > 0,
          false
        ),
        mdNotebooksPanelLast: 0
      };
    case types.CLOSE_NOTEBOOK:
      if (!payload.last) {
        return state;
      } else {
        return {
          ...state,
          ...mdResolver(
            state.mdFinderPanel > 0,
            state.mdTextsPanel > 0,
            state.mdAnnotationsPanel > 0,
            false
          ),
          mdNotebooksPanelLast: 0
        };
      }
    // case types.OPEN_SPEED_READER:
    //   return {
    //     ...state,
    //     ...mdResolver(false, true, false, false),
    //     mdAnnotationsPanelLast: state.mdAnnotationsPanel,
    //     mdNotebooksPanelLast: state.mdNotebooksPanel
    //   };
    case types.PLAY_SPEED_READER:
      return {
        ...state,
        ...mdResolver(false, true, false, false),
        mdAnnotationsPanelLast: state.mdAnnotationsPanel,
        mdNotebooksPanelLast: state.mdNotebooksPanel
      };
    case types.PAUSE_SPEED_READER:
      return {
        ...state,
        ...mdResolver(
          false,
          true,
          state.mdAnnotationsPanelLast,
          state.mdNotebooksPanelLast
        )
      };
    case types.CLOSE_SPEED_READER:
      return {
        ...state,
        ...mdResolver(
          false,
          true,
          state.mdAnnotationsPanelLast,
          state.mdNotebooksPanelLast
        )
      };
    case types.TOGGLE_KEEP_FINDER_OPEN:
      return {
        ...state,
        keepFinderOpen: !state.keepFinderOpen
      };
    case types.ADD_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, payload.alertObj],
        alertId: payload.alertObj.id
      };
    case types.CLEAR_ALERT:
      const alertIndex = state.alerts.findIndex(el => el.id === payload.id);
      return {
        ...state,
        alerts: state.alerts.filter((el, index) => index !== alertIndex)
      };
    case types.SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
