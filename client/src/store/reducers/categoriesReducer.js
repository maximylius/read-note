import * as types from '../types';
const initialState = {
  byId: {
    // none: {
    //   title: 'not categorized',
    //   rgbColor: '240,240,250',
    //   icon: '',
    //   parent: null,
    //   children: [],
    //   accessFor: []
    // },
    standard_0: {
      title: 'Assumption',
      rgbColor: '212, 240, 134',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_1: {
      title: 'Hypothesis',
      rgbColor: '247, 197, 157',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_2: {
      title: 'Theory',
      rgbColor: '233, 183, 243',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_3: {
      title: 'Reference',
      rgbColor: '250, 241, 157',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_4: {
      title: 'Argument',
      rgbColor: '180, 235, 144',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_5: {
      title: 'Question',
      rgbColor: '233, 169, 241',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_6: {
      title: 'Method',
      rgbColor: '154, 206, 147',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_7: {
      title: 'Data',
      rgbColor: '177, 206, 245',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_8: {
      title: 'Result',
      rgbColor: '152, 248, 157',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_9: {
      title: 'Limitation',
      rgbColor: '243, 164, 164',
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
