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
  closeAllModals,
  toggleFlowchart
} from '../../store/actions';
import { Link } from 'react-router-dom';
import {
  BsPower,
  BsPerson,
  BsCollection,
  BsCollectionFill,
  BsLayoutThreeColumns
} from 'react-icons/bs';
import BiNetworkIcon from './icons/BiNetworkIcon';
// import { BiNetworkChart } from 'react-icons/bi';

const Navbar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(s => s.auth.isAuthenticated);
  // const welcomeOpen = useSelector(s => s.modal.welcomeOpen);
  const aboutOpen = useSelector(s => s.modal.aboutOpen);
  const registerOpen = useSelector(s => s.modal.registerOpen);
  const signInOpen = useSelector(s => s.modal.signInOpen);
  const logoutOpen = useSelector(s => s.modal.logoutOpen);
  const flowchartIsOpen = useSelector(s => s.panel.flowchartIsOpen);
  const projects = useSelector(s => s.projects);
  const deskOpen = !aboutOpen && !registerOpen && !signInOpen && !logoutOpen;
  const lastDeskPathname = useSelector(s => s.modal.lastDeskPathname);
  const username = useSelector(s => s.user.username);

  // 2do: make mini when mouse is not over.
  return (
    <nav className='navbar navbar-expand navbar-dark bg-secondary row static nav-main'>
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
          {Object.keys(projects).map(projectId => (
            <li className='nav-item' key={projectId}>
              <span
                className={`nav-link ${false ? 'active' : ''}`}
                // onClick={() => dispatch(closeAllModals(history))}
              >
                {false ? <BsCollectionFill /> : <BsCollection />}
                {' ' + projects[projectId].title}
              </span>
            </li>
          ))}

          <li className='nav-item'>
            <span
              className={`nav-link ${
                deskOpen && flowchartIsOpen ? 'active' : ''
              }`}
              onClick={() => {
                dispatch(closeAllModals(history));
                dispatch(toggleFlowchart());
              }}
            >
              <BiNetworkIcon />
              Network-Graph
            </span>
          </li>

          <li className='nav-item'>
            <Link
              className={`nav-link ${
                deskOpen && !flowchartIsOpen ? 'active' : ''
              }`}
              onClick={() => {
                dispatch(closeAllModals(history));
                if (flowchartIsOpen) dispatch(toggleFlowchart());
              }}
              to={lastDeskPathname}
            >
              <BsLayoutThreeColumns />
              Desk
            </Link>
          </li>

          <li className='nav-item'>
            <Link
              className={`nav-link ${aboutOpen ? 'active' : ''}`}
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
                  <BsPerson /> {username}
                </span>
              </li>
              <li className='nav-item'>
                <Link
                  className={`nav-link ${logoutOpen ? 'active' : ''}`}
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
                  className={`nav-link ${signInOpen ? 'active' : ''}`}
                  to='/signin'
                  onClick={() => dispatch(toggleSignInModal(history))}
                >
                  Login
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className={`nav-link ${registerOpen ? 'active' : ''}`}
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
