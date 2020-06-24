import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAlert, loginUser } from '../../../store/actions';

function Signup() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    if (!missingFields) {
      dispatch(loginUser({ email, password }));
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
    <div className='row growContent w-100'>
      <div className='container mt-3'>
        <div className='card text-center'>
          <h1 className='display-4'>Sign in</h1>
          <div className='container'>
            <div className='input-group mb-2'>
              <div className='input-group-prepend' id='E-Mail'>
                <span className='input-group-text'>E-Mail</span>
              </div>
              <input
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
              className='add-btn btn btn-secondary btn-block btn-xl mb-2'
              onClick={onSubmit}
            >
              {missingFields
                ? `Fill in ${missingFields} to sign in`
                : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
