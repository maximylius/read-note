import React from 'react';
import { useSelector } from 'react-redux';
import Desk from './Desk';
import Welcome from './Welcome';
import About from './About';
import Register from './Register';
import Signin from './Signin';
import Logout from './Logout';

const MainPage = () => {
  const welcomeOpen = useSelector(s => s.modal.welcomeOpen);
  const aboutOpen = useSelector(s => s.modal.aboutOpen);
  const registerOpen = useSelector(s => s.modal.registerOpen);
  const signInOpen = useSelector(s => s.modal.signInOpen);
  const logoutOpen = useSelector(s => s.modal.logoutOpen);

  return (
    <>
      {welcomeOpen && <Welcome />}
      {aboutOpen && <About />}
      {registerOpen && <Register />}
      {signInOpen && <Signin />}
      {logoutOpen && <Logout />}
      <Desk />
    </>
  );
};

export default MainPage;
