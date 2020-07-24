import React from 'react';
import { useSelector } from 'react-redux';
import Desk from './Desk';
import Welcome from './Welcome';
import About from './About';
import Register from './Register';
import SignIn from './SignIn';
import Logout from './Logout';

const MainPage = () => {
  const welcomeOpen = useSelector(s => s.ui.welcomeOpen);
  const aboutOpen = useSelector(s => s.ui.aboutOpen);
  const registerOpen = useSelector(s => s.ui.registerOpen);
  const signInOpen = useSelector(s => s.ui.signInOpen);
  const logoutOpen = useSelector(s => s.ui.logoutOpen);

  return (
    <>
      {welcomeOpen && <Welcome />}
      {aboutOpen && <About />}
      {registerOpen && <Register />}
      {signInOpen && <SignIn />}
      {logoutOpen && <Logout />}
      <Desk />
    </>
  );
};

export default MainPage;
