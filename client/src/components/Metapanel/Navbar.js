import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/actions';
import { Link } from 'react-router-dom';
import { BsPower, BsLaptop, BsPerson } from 'react-icons/bs';

const Navbar = () => {
  const dispatch = useDispatch();
  const {
    ui,
    user,
    auth: { isAuthenticated }
  } = useSelector(state => state);
  // 2do: make mini when mouse is not over.
  return (
    <nav className='navbar navbar-expand-sm navbar-dark bg-secondary row static nav-main'>
      <Link to='/' className='navbar-brand'>
        AnodeText
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
            <Link className='nav-link' to='/desk'>
              <BsLaptop />
              Desk
            </Link>
          </li>

          <li className='nav-item'>
            <Link className='nav-link' to='/about'>
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
                  onClick={() => dispatch(logoutUser())}
                >
                  <BsPower /> Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className='nav-item'>
                <Link className='nav-link' to='/signin'>
                  Login
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/signup'>
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
