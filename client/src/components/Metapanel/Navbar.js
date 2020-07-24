import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  logoutUser,
  toggleWelcomeModal,
  toggleAboutModal,
  toggleRegisterModal,
  toggleSignInModal,
  toggleLogoutModal,
  closeAllModals
} from '../../store/actions';
import { Link } from 'react-router-dom';
import { BsPower, BsLaptop, BsPerson } from 'react-icons/bs';

const Navbar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(s => s.auth.isAuthenticated);
  const user = useSelector(s => s.user);
  // 2do: make mini when mouse is not over.
  return (
    <nav className='navbar navbar-expand-sm navbar-dark bg-secondary row static nav-main'>
      <Link
        to='/'
        className='navbar-brand'
        onClick={() => dispatch(toggleWelcomeModal(history))}
      >
        Give-me-a-name
      </Link>

      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarSupportedContent'
      >
        <span className='navbar-toggler-icon'></span>
      </button>

      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <Link
              className='nav-link'
              to='/desk'
              onClick={() => dispatch(closeAllModals(history))}
            >
              <BsLaptop />
              Desk
            </Link>
          </li>

          <li className='nav-item'>
            <Link
              className='nav-link'
              to='/about'
              onClick={() => dispatch(toggleAboutModal(history))}
            >
              About
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className='nav-item'>
                <span className='nav-link'>
                  <BsPerson /> {user.username}
                </span>
              </li>
              <li className='nav-item'>
                <Link
                  className='nav-link'
                  to='/logout'
                  onClick={() => {
                    dispatch(logoutUser());
                    dispatch(toggleLogoutModal(history));
                  }}
                >
                  <BsPower /> Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className='nav-item'>
                <Link
                  className='nav-link'
                  to='/signin'
                  onClick={() => dispatch(toggleSignInModal(history))}
                >
                  Login
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className='nav-link'
                  to='/signup'
                  onClick={() => dispatch(toggleRegisterModal(history))}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
