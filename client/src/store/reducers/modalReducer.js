import * as types from '../types';

const initialState = {
  welcomeOpen: false,
  aboutOpen: false,
  registerOpen: false,
  signInOpen: false,
  logoutOpen: false,
  currentPathname: null,
  lastDeskPathname: '/desk'
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
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
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
