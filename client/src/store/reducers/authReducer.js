import * as types from '../types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case types.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false
      };
    case types.LOGIN_SUCCESS:
    case types.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: payload.token,
        isAuthenticated: true,
        isLoading: false
      };
    case types.LOGIN_FAIL:
    case types.REGISTER_FAIL:
    case types.LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
    case types.AUTH_ERROR:
      return state; //what is auth error?
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
