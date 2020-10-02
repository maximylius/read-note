import * as types from '../types';

const initialState = {
  inspectElements: [],
  inspectFlowSection: null,
  nonLayoutedElements: [],
  elements: [],
  strictSearchResults: [],
  displayNonMatches: true,
  searchWithinTextcontent: true,
  filterTypes: ['texts', 'sections', 'annotations', 'replies', 'notes'],
  filterAncestors: 'all', // direct-nr | none
  filterDescendants: 'all'
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.DELETE_NOTE:
      return {
        ...state,
        inspectElements: state.inspectElements.filter(
          el => el.resId !== payload.note._id
        )
      };
    case types.DELETE_SECTION:
      return {
        ...state,
        inspectElements: state.inspectElements.filter(
          el => el.resId !== payload.sectionId
        )
      };
    case types.DELETE_TEXT:
      return {
        ...state,
        inspectElements: state.inspectElements.filter(
          el => el.resId !== payload.textId
        )
      };
    case types.SET_INSPECT_FLOW_SECTION:
      return {
        ...state,
        inspectFlowSection: payload.setTo
      };
    case types.SET_NONLAYOUTED_FLOWCHART_ELEMENTS:
      return {
        ...state,
        nonLayoutedElements: payload.elements
      };
    case types.SET_FLOWCHART_ELEMENTS:
      return {
        ...state,
        elements: payload.elements
      };
    case types.SET_FLOWCHART_SEARCHRESULTS:
      return {
        ...state,
        strictSearchResults: payload.strictSearchResults,
        inspectElements: payload.strictSearchResults
      };
    case types.TOGGLE_DISPLAY_FLOWCHART_NONMATCHTES:
      return {
        ...state,
        displayNonMatches: !state.displayNonMatches
      };
    case types.TOGGLE_TYPES_FILTER_FLOWCHART:
      return {
        ...state,
        filterTypes: state.filterTypes.includes(payload.toggleType)
          ? state.filterTypes.filter(el => el !== payload.toggleType)
          : [...state.filterTypes, payload.toggleType]
      };
    case types.TOGGLE_SEARCHWITHIN_TEXTCONTENT_FLOWCHART:
      return {
        ...state,
        searchWithinTextcontent: !state.searchWithinTextcontent
      };
    case types.SET_FILTER_ANCESTORS_FLOWCHART:
      return {
        ...state,
        filterAncestors: payload.to
      };
    case types.SET_FILTER_DESCENDANTS_FLOWCHART:
      return {
        ...state,
        filterDescendants: payload.to
      };

    case types.INSPECT_ELEMENT_IN_FLOWCHART:
      return {
        ...state,
        inspectElements: [
          { resId: payload.resId, resType: payload.resType },
          ...state.inspectElements
            .filter(el => el.resId !== payload.resId)
            .slice(0, 3) //max 4 open resources
        ]
      };
    case types.CLOSE_FLOWCHART_ELEMENT:
      return {
        ...state,
        inspectElements: state.inspectElements.filter(
          el => el.resId !== payload.id
        )
      };
    default:
      return state;
  }
};
