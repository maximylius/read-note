import * as types from '../types';
import _isEqual from 'lodash/isEqual';

const mdResolver = (finderOpen, textsOpen, annotationsOpen, notesOpen) => {
  if (finderOpen) {
    if (textsOpen) {
      if (annotationsOpen) {
        if (notesOpen) {
          return {
            mdFinderPanel: 2,
            mdTextsPanel: 6,
            mdAnnotationsPanel: 5,
            mdNotesPanel: 4
          };
        } else if (!notesOpen) {
          return {
            mdFinderPanel: 3,
            mdTextsPanel: 9,
            mdAnnotationsPanel: 5,
            mdNotesPanel: 0
          };
        }
      } else if (!annotationsOpen) {
        if (notesOpen) {
          return {
            mdFinderPanel: 2,
            mdTextsPanel: 5,
            mdAnnotationsPanel: 0,
            mdNotesPanel: 5
          };
        } else if (!notesOpen) {
          return {
            mdFinderPanel: 3,
            mdTextsPanel: 9,
            mdAnnotationsPanel: 0,
            mdNotesPanel: 0
          };
        }
      }
    } else if (!textsOpen) {
      if (notesOpen) {
        return {
          mdFinderPanel: 3,
          mdTextsPanel: 0,
          mdAnnotationsPanel: Number(annotationsOpen),
          mdNotesPanel: 9
        };
      } else if (!notesOpen) {
        return {
          mdFinderPanel: 6,
          mdTextsPanel: 0,
          mdAnnotationsPanel: Number(annotationsOpen),
          mdNotesPanel: 0
        };
      }
    }
  } else if (!finderOpen) {
    if (textsOpen) {
      if (annotationsOpen) {
        if (notesOpen) {
          return {
            mdFinderPanel: 0,
            mdTextsPanel: 8,
            mdAnnotationsPanel: 5,
            mdNotesPanel: 4
          };
        } else if (!notesOpen) {
          return {
            mdFinderPanel: 0,
            mdTextsPanel: 12,
            mdAnnotationsPanel: 5,
            mdNotesPanel: 0
          };
        }
      } else if (!annotationsOpen) {
        if (notesOpen) {
          return {
            mdFinderPanel: 0,
            mdTextsPanel: 7,
            mdAnnotationsPanel: 0,
            mdNotesPanel: 5
          };
        } else if (!notesOpen) {
          return {
            mdFinderPanel: 0,
            mdTextsPanel: 12,
            mdAnnotationsPanel: 0,
            mdNotesPanel: 0
          };
        }
      }
    } else if (!textsOpen) {
      if (notesOpen) {
        return {
          mdFinderPanel: 0,
          mdTextsPanel: 0,
          mdAnnotationsPanel: Number(annotationsOpen),
          mdNotesPanel: 12 // smaller for extra padding
        };
      } else if (!notesOpen) {
        return {
          mdFinderPanel: 6,
          mdTextsPanel: 0,
          mdAnnotationsPanel: Number(annotationsOpen),
          mdNotesPanel: 0
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
  mdNotesPanel: 4,
  mdNotesPanelLast: 4,
  welcomeOpen: false,
  aboutOpen: false,
  registerOpen: false,
  signInOpen: false,
  logoutOpen: false,
  keepFinderOpen: false,
  currentPathname: null,
  lastDeskPathname: '/desk',
  loading: false,
  openReplyNotes: [],
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
          state.mdNotesPanel > 0
        ),
        mdAnnotationsPanelLast: state.mdAnnotationsPanel
      };
    // close finder...
    case types.SHOW_SIDENOTE_REPLIES:
      return {
        ...state,
        openReplyNotes: state.openReplyNotes.concat(payload.noteId)
      };
    case types.HIDE_SIDENOTE_REPLIES:
      return {
        ...state,
        openReplyNotes: state.openReplyNotes.filter(id => id !== payload.noteId)
      };
    case types.ADD_NOTE:
      return {
        ...state,
        ...mdResolver(
          false,
          state.mdTextsPanel > 0,
          state.mdAnnotationsPanelLast > 0,
          state.mdNotesPanel > 0
        ),
        openReplyNotes: state.openReplyNotes.concat([
          payload.note._id,
          ...(payload.note.isReply ? [payload.note.isReply.noteId] : [])
        ])
      };
    case types.UPDATE_NOTE:
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
          state.mdNotesPanel > 0
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
          state.mdNotesPanel > 0
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
          state.mdNotesPanel > 0
        )
      };

    case types.COLLAPSE_TEXTS_PANEL:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          false,
          state.mdAnnotationsPanel > 0,
          state.mdNotesPanel > 0
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
            state.mdNotesPanel > 0
          )
        };
      }
    // case types.EXPAND_ANNOTATIONS_PANEL:
    case types.SET_COMMITTED_SECTIONS:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          state.mdTextsPanel > 0,
          true,
          state.mdNotesPanel > 0
        ),
        mdAnnotationsPanelLast: 1
      };
    // EXPAND ANNOTATIONS PANEL AND COLLAPSE FINDER
    case types.ADD_SECTION:
    case types.UPDATE_SECTION:
    case types.DELETE_SECTION:
      // case types.ADD_ANNOTATION:
      // case types.DELETE_ANNOTATION:
      return {
        ...state,
        ...mdResolver(
          state.keepFinderOpen,
          state.mdTextsPanel > 0,
          true,
          state.mdNotesPanel > 0
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
          state.mdNotesPanel > 0
        ),
        mdAnnotationsPanelLast: 0
      };
    case types.EXPAND_NOTES_PANEL:
    case types.OPEN_NOTE:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          state.mdTextsPanel > 0,
          state.mdAnnotationsPanel > 0,
          true
        )
      };
    case types.COLLAPSE_NOTES_PANEL: //2do: why not exported?
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          state.mdTextsPanel > 0,
          state.mdAnnotationsPanel > 0,
          false
        ),
        mdNotesPanelLast: 0
      };
    case types.CLOSE_NOTE:
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
          mdNotesPanelLast: 0
        };
      }
    // case types.OPEN_SPEED_READER:
    //   return {
    //     ...state,
    //     ...mdResolver(false, true, false, false),
    //     mdAnnotationsPanelLast: state.mdAnnotationsPanel,
    //     mdNotesPanelLast: state.mdNotesPanel
    //   };
    case types.PLAY_SPEED_READER:
      return {
        ...state,
        ...mdResolver(false, true, false, false),
        mdAnnotationsPanelLast: state.mdAnnotationsPanel,
        mdNotesPanelLast: state.mdNotesPanel
      };
    case types.PAUSE_SPEED_READER:
      return {
        ...state,
        ...mdResolver(
          false,
          true,
          state.mdAnnotationsPanelLast,
          state.mdNotesPanelLast
        )
      };
    case types.CLOSE_SPEED_READER:
      return {
        ...state,
        ...mdResolver(
          false,
          true,
          state.mdAnnotationsPanelLast,
          state.mdNotesPanelLast
        )
      };

    case types.SET_CURRENT_PATHNAME:
      return {
        ...state,
        currentPathname: payload.pathname
      };
    case types.OPEN_WELCOME_MODAL:
      return {
        ...state,
        welcomeOpen: true,
        aboutOpen: false,
        registerOpen: false,
        signInOpen: false,
        logoutOpen: false,
        lastDeskPathname: payload.pathname || state.lastDeskPathname
      };
    case types.OPEN_ABOUT_MODAL:
      return {
        ...state,
        welcomeOpen: false,
        aboutOpen: true,
        registerOpen: false,
        signInOpen: false,
        logoutOpen: false,
        lastDeskPathname: payload.pathname || state.lastDeskPathname
      };
    case types.OPEN_REGISTER_MODAL:
      return {
        ...state,
        welcomeOpen: false,
        aboutOpen: false,
        registerOpen: true,
        signInOpen: false,
        logoutOpen: false,
        lastDeskPathname: payload.pathname || state.lastDeskPathname
      };
    case types.OPEN_SIGNIN_MODAL:
      return {
        ...state,
        welcomeOpen: false,
        aboutOpen: false,
        registerOpen: false,
        signInOpen: true,
        logoutOpen: false,
        lastDeskPathname: payload.pathname || state.lastDeskPathname
      };
    case types.OPEN_LOGOUT_MODAL:
      return {
        ...state,
        welcomeOpen: false,
        aboutOpen: false,
        registerOpen: false,
        signInOpen: false,
        logoutOpen: true,
        lastDeskPathname: payload.pathname || state.lastDeskPathname
      };
    case types.CLOSE_WELCOME_MODAL:
      return {
        ...state,
        welcomeOpen: false
      };
    case types.CLOSE_ABOUT_MODAL:
      return {
        ...state,
        aboutOpen: false
      };
    case types.REGISTER_SUCCESS:
    case types.CLOSE_REGISTER_MODAL:
      return {
        ...state,
        registerOpen: false
      };
    case types.LOGIN_SUCCESS:
    case types.CLOSE_SIGNIN_MODAL:
      return {
        ...state,
        signInOpen: false
      };
    case types.CLOSE_LOGOUT_MODAL:
      return {
        ...state,
        logoutOpen: false
      };
    case types.CLOSE_ALL_MODALS:
      return {
        ...state,
        welcomeOpen: false,
        aboutOpen: false,
        registerOpen: false,
        signInOpen: false,
        logoutOpen: false
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
