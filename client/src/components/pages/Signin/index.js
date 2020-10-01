import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BsXCircle } from 'react-icons/bs';
import { addAlert, loginUser, closeAllModals } from '../../../store/actions';

const Signin = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    if (!missingFields) {
      dispatch(loginUser({ email, password, history }));
    } else {
      dispatch(
        addAlert({
          type: 'alert alert-warning',
          message: `<p>Fill in ${missingFields} to upload text.</p>`
        })
      );
    }
  };

  let missingFields = [];
  if (!email) missingFields.push('E-Mail');
  if (!password) missingFields.push('Password');
  missingFields = missingFields.join(' and ');

  return (
    <>
      <div
        className='page-modal-outer'
        onClick={() => dispatch(closeAllModals(history))}
      ></div>
      <div className='page-modal-body'>
        <div className='page-modal-toolbar'>
          <button
            className='page-modal-close'
            onClick={() => dispatch(closeAllModals(history))}
          >
            <BsXCircle />
          </button>
        </div>
        <h1 className='display-4'>Sign in</h1>
        <div className='container'>
          <div className='input-group mb-2'>
            <div className='input-group-prepend' id='E-Mail'>
              <span className='input-group-text'>E-Mail</span>
            </div>
            <input
              id='email'
              type='text'
              className='form-control'
              aria-label='Email'
              aria-describedby='Email'
              placeholder='enter email address...'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className='input-group mb-2'>
            <div className='input-group-prepend' id='Password'>
              <span className='input-group-text'>Password</span>
            </div>
            <input
              id='password'
              type='password'
              className='form-control'
              aria-label='Password'
              aria-describedby='Password'
              placeholder='enter password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            className='add-btn btn btn-secondary btn-block btn-lg mb-2'
            onClick={onSubmit}
          >
            {missingFields ? `Fill in ${missingFields} to sign in` : 'Sign in'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Signin;
