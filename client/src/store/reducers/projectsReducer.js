import * as types from '../types';

const initialState = {};
//projects contain // this will make add note and stuff more complicated.

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.UPLOADED_TEXT:
      return {
        ...state,
        ...Object.fromEntries(
          payload.text.projectIds.map(projectId => [
            projectId,
            {
              ...state[projectId],
              textIds: [
                ...new Set([...state[projectId].textIds, payload.text._id])
              ]
            }
          ])
        )
      };
    case types.ADD_SECTION:
      return {
        ...state,
        ...Object.fromEntries(
          payload.section.projectIds.map(projectId => [
            projectId,
            {
              ...state[projectId],
              sectionIds: [...state[projectId].sectionIds, payload.section._id]
            }
          ])
        )
      };
    case types.ADD_NOTE:
      return {
        ...state,
        ...Object.fromEntries(
          payload.section.projectIds.map(projectId => [
            projectId,
            {
              ...state[projectId],
              noteIds: [...state.noteIds, payload.note._id]
            }
          ])
        )
      };

    case types.DELETE_NOTE:
      return Object.fromEntries(
        Object.keys(state).map(projectId => [
          projectId,
          {
            ...state[projectId],
            noteIds: state[projectId].noteIds.filter(
              id => id !== payload.note._id
            )
          }
        ])
      );
    case types.DELETE_TEXT:
      return Object.fromEntries(
        Object.keys(state).map(projectId => [
          projectId,
          {
            ...state[projectId],
            textIds: state[projectId].textIds.filter(
              id => id !== payload.textId
            )
          }
        ])
      );
    case types.DELETE_SECTION:
      return Object.fromEntries(
        Object.keys(state).map(projectId => [
          projectId,
          {
            ...state[projectId],
            sectionIds: state[projectId].sectionIds.filter(
              id => id !== payload.sectionId
            )
          }
        ])
      );
    case types.LOGOUT_SUCCESS:
      return {
        ...initialState
      };
    default:
      return state;
  }
};
