import * as types from '../types';
const initialState = {
  byId: {
    standard_0: {
      title: 'Assumption',
      rgbColor: '170,250,200',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_1: {
      title: 'Reference',
      rgbColor: '230,250,210',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_2: {
      title: 'Argument',
      rgbColor: '240,230,220',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_3: {
      title: 'Method',
      rgbColor: '250,210,230',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_4: {
      title: 'Result',
      rgbColor: '250,190,250',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    }
  }
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
