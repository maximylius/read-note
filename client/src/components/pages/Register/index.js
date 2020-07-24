import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addAlert, registerUser, closeAllModals } from '../../../store/actions';
import { BsXCircle } from 'react-icons/bs';

const emailRegExp = /\S+@\S+\.\S+/;

function Register() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    console.log('sumbit');
    if (emailRegExp.test(email) && username.length > 2 && password.length > 6) {
      dispatch(registerUser({ username, email, password }));
    } else {
      if (!emailRegExp.test(email)) {
        dispatch(
          addAlert(
            {
              type: 'alert alert-warning',
              message: `<p>Please enter a valid email adress.</p>`
            },
            5000
          )
        );
      }
      if (username.length <= 2) {
        dispatch(
          addAlert(
            {
              type: 'alert alert-warning',
              message: `<p>Display name must contain at least 3 characters.</p>`
            },
            5000
          )
        );
      }

      if (password.length <= 6) {
        dispatch(
          addAlert(
            {
              type: 'alert alert-warning',
              message: `<p>Password must contain at least 7 characters.</p>`
            },
            5000
          )
        );
      }
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
        <div className='card text-center'>
          <h1 className='display-4'>Register</h1>
          <div className='container'>
            <div className='input-group mb-2'>
              <div className='input-group-prepend' id='E-Mail'>
                <span className='input-group-text'>E-Mail</span>
              </div>
              <input
                type='text'
                className={`form-control ${
                  emailRegExp.test(email) ? 'input-valid' : 'input-non-valid'
                }`}
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
                className={`form-control ${
                  username.length > 2 ? 'input-valid' : 'input-non-valid'
                }`}
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
                className={`form-control ${
                  password.length > 6 ? 'input-valid' : 'input-non-valid'
                }`}
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
              {missingFields
                ? `Fill in ${missingFields} to register`
                : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
