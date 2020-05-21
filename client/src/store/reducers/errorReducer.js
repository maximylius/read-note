import * as types from '../types';

const initialState = { msg: {}, status: null, id: null };

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_ERRORS:
      return {
        ...state,
        msg: payload.msg,
        status: payload.status,
        id: payload.id
      };
    case types.CLEAR_ERRORS:
      return {
        ...state,
        msg: {},
        status: null,
        id: null
      };
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
