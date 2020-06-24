import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAlert, registerUser } from '../../../store/actions';

function Signup() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    if (!missingFields) {
      dispatch(registerUser({ username, email, password }));
    } else {
      dispatch(
        addAlert({
          type: 'alert alert-warning',
          message: `<p>Please fill in ${missingFields}.</p>`
        })
      );
    }
  };

  let missingFields = [];
  if (!email) missingFields.push('Email');
  if (!username) missingFields.push('Username');
  if (!password) missingFields.push('Password');
  missingFields =
    missingFields.length === 0
      ? ''
      : missingFields.length === 1
      ? missingFields[0]
      : missingFields.length === 2
      ? missingFields.join(' and ')
      : `${missingFields[0]}, ${missingFields[1]} and ${missingFields[2]}`;

  return (
    <div className='row growContent w-100'>
      <div className='container mt-3'>
        <div className='card text-center'>
          <h1 className='display-4'>Register</h1>
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
                placeholder='enter Email adress...'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className='input-group mb-2'>
              <div className='input-group-prepend' id='username'>
                <span className='input-group-text'>username</span>
              </div>
              <input
                type='text'
                className='form-control'
                aria-label='username'
                aria-describedby='username'
                placeholder='enter username...'
                value={username}
                onChange={e => setUsername(e.target.value)}
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
                ? `Fill in ${missingFields} to register`
                : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
