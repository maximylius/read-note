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
      rgbColor: '198, 231, 106',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_1: {
      title: 'Hypothesis',
      rgbColor: '247, 185, 134',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_2: {
      title: 'Theory',
      rgbColor: '220, 155, 233',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_3: {
      title: 'Reference',
      rgbColor: '240, 230, 138',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_4: {
      title: 'Argument',
      rgbColor: '161, 219, 122',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_5: {
      title: 'Question',
      rgbColor: '206, 116, 218',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_6: {
      title: 'Method',
      rgbColor: '127, 185, 119',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_7: {
      title: 'Data',
      rgbColor: '168, 200, 241',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_8: {
      title: 'Result',
      rgbColor: '128, 233, 133',
      icon: '',
      parent: null,
      children: [],
      accessFor: []
    },
    standard_9: {
      title: 'Limitation',
      rgbColor: '235, 144, 144',
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
