import * as types from '../types';

const initialState = {
  loading: false, // ?
  alerts: [], // IV Alerts
  alertId: 0
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
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
    default:
      return state;
  }
};
