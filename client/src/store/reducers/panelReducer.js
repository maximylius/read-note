import * as types from '../types';

const mdResolver = (
  finderOpen,
  textsOpen,
  annotationsOpen,
  notesOpen,
  flowChartView
) => {
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
            mdAnnotationsPanel: flowChartView ? 7 : 5,
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
// integrate flowchart in panels: left hand side: 2/3 flowchart. right 1/3 insepect elements
// when text is open:
// - 3/5 texts, 2/5 sidepanel-sidenotes.
// - 3/5 texts, 2/5 notes.
// - 2/5 texts, 1/5 annotation 2/5 notes.
// - text(3/5) sidepanel-flowchart (2/5).
// - text(2/5) sidepanel-flowchart (2/5) inspect (1/5).
const initialState = {
  mdFinderPanel: 2,
  mdTextsPanel: 6,
  mdTextsPanelLast: 6,
  mdAnnotationsPanel: 4,
  mdAnnotationsPanelLast: 4,
  mdNotesPanel: 4,
  mdNotesPanelLast: 4,
  mdFlowchartPanel: 8,
  mdInspectPanel: 4,
  flowSectionView: false,
  flowchartIsOpen: false,
  inspectIsOpen: true,
  keepFinderOpen: false
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
          state.mdNotesPanel > 0,
          state.flowSectionView
        ),
        mdAnnotationsPanelLast: state.mdAnnotationsPanel
      };
    // close finder...
    case types.ADD_NEW_NOTE:
      return {
        ...state,
        ...mdResolver(
          false,
          state.mdTextsPanel > 0,
          state.mdAnnotationsPanelLast > 0,
          state.mdNotesPanel > 0,
          state.flowSectionView
        )
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
          state.mdNotesPanel > 0,
          state.flowSectionView
        )
      };
    case types.EXPAND_TEXTS_PANEL:
    case types.OPEN_ADDTEXTPANEL:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          true,
          state.mdAnnotationsPanel > 0,
          state.mdNotesPanel > 0,
          state.flowSectionView
        )
      };
    // OPEN TEXT AND COLLAPSE FINDER
    case types.LOAD_TEXTS:
      return payload.openTexts.length > 0
        ? {
            ...state,
            ...mdResolver(
              state.keepFinderOpen,
              true,
              state.mdAnnotationsPanel > 0,
              state.mdNotesPanel > 0,
              state.flowSectionView
            )
          }
        : state;
    case types.OPEN_TEXT:
    case types.ADD_AND_OPEN_TEXT:
    case types.ADD_TEXT:
    case types.SWITCH_TO_OPEN_TEXTPANEL:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0 && state.keepFinderOpen,
          true,
          state.mdAnnotationsPanel > 0,
          state.mdNotesPanel > 0,
          state.flowSectionView
        )
      };

    case types.COLLAPSE_TEXTS_PANEL:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          false,
          state.mdAnnotationsPanel > 0,
          state.mdNotesPanel > 0,
          state.flowSectionView
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
            state.mdNotesPanel > 0,
            state.flowSectionView
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
          state.mdNotesPanel > 0,
          state.flowSectionView
        ),
        mdAnnotationsPanelLast: 1
      };
    // EXPAND ANNOTATIONS PANEL AND COLLAPSE FINDER
    case types.ADD_NEW_SECTION:
    case types.UPDATE_SECTION:
    case types.DELETE_SECTION:
      return {
        ...state,
        ...mdResolver(
          state.keepFinderOpen,
          state.mdTextsPanel > 0,
          true,
          state.mdNotesPanel > 0,
          state.flowSectionView
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
          state.mdNotesPanel > 0,
          state.flowSectionView
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
          true,
          state.flowSectionView
        )
      };
    case types.COLLAPSE_NOTES_PANEL:
      return {
        ...state,
        ...mdResolver(
          state.mdFinderPanel > 0,
          state.mdTextsPanel > 0,
          state.mdAnnotationsPanel > 0,
          false,
          state.flowSectionView
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
            false,
            state.flowSectionView
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
    case types.OPEN_FLOW_SECTION_VIEW:
      return {
        ...state,
        ...mdResolver(false, true, true, false, true),
        mdNotesPanelLast: state.mdNotesPanel,
        flowSectionView: true
      };
    case types.CLOSE_FLOW_SECTION_VIEW:
      return {
        ...state,
        ...mdResolver(false, true, true, state.mdNotesPanelLast),
        flowSectionView: false
      };
    case types.OPEN_FLOWCHART:
      return {
        ...state,
        mdTextsPanelLast: state.mdTextsPanel,
        mdAnnotationsPanelLast: state.mdAnnotationsPanel,
        mdNotesPanelLast: state.mdNotesPanel,
        flowchartIsOpen: true,
        inspectIsOpen: true
      };
    case types.OPEN_FLOWCHART_ELEMENT_FULLSCREEN:
    case types.ADD_AND_OPEN_TEXT:
    case types.OPEN_TEXT:
    case types.CLOSE_FLOWCHART:
      return {
        ...state,
        ...mdResolver(
          false,
          state.mdTextsPanelLast,
          state.mdAnnotationsPanelLast,
          state.mdNotesPanelLast,
          state.flowSectionView
        ),
        flowchartIsOpen: false,
        inspectIsOpen: true
      };
    case types.GET_NOTES:
      return {
        ...state,
        ...mdResolver(
          false,
          state.mdTextsPanelLast,
          state.mdAnnotationsPanelLast,
          payload.open || state.mdNotesPanelLast,
          state.flowSectionView
        ),
        flowchartIsOpen: false,
        inspectIsOpen: true
      };
    case types.OPEN_FLOWCHART_SIDEPANEL:
      return {
        ...state,
        inspectIsOpen: true
      };
    case types.CLOSE_FLOWCHART_SIDEPANEL:
      return {
        ...state,
        inspectIsOpen: false
      };
    case types.INSPECT_ELEMENT_IN_FLOWCHART:
      return {
        ...state,
        inspectIsOpen: true
      };

    case types.TOGGLE_KEEP_FINDER_OPEN:
      return {
        ...state,
        keepFinderOpen: !state.keepFinderOpen
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
