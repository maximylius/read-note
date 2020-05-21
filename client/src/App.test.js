import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

Object.assgin(state.data, data);

return {
  ...state,
  data: {
    ...state.data,
    Endereco: action.payload.logradouro,
    Bairro: action.payload.bairro,
    UF: action.payload.uf,
    Cidade: action.payload.cidade
  }
};

// case Actions.SEARCH_CEP
return {
  ...state,
  data: {
    ...state.data,
    Endereco: action.payload.logradouro,
    Bairro: action.payload.bairro,
    UF: action.payload.uf,
    Cidade: action.payload.cidade
  }
};
