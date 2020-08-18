import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fillSpareIds, loadUser } from './store/actions';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'quill-mention/dist/quill.mention.css';
import './App.css';
import './styles/flowchart.css';
import './styles/section.css';
import './styles/note.css';
import './styles/embed.css';
import Navbar from './components/Metapanel/Navbar';
import Alerts from './components/Metapanel/Alerts';
// import Desk from './components/pages/Desk';
// import About from './components/pages/About/';
// import NotFound from './components/pages/NotFound/';
// import Register from './components/pages/Register';
// import SignIn from './components/pages/SignIn/';
// import Logout from './components/pages/Logout';
// import Welcome from './components/pages/Welcome';
import Footer from './components/Metapanel/Footer';
import MainPage from './components/pages';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fillSpareIds());
    dispatch(loadUser());
    return () => {};
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Router>
        <div className='box'>
          <Navbar />
          <Alerts />
          <Switch>
            <Route exact path='/' component={MainPage} />
            <Route
              exact
              path='/desk/texts=:textIds&notes=:noteIds'
              component={MainPage}
            />
            <Route exact path='/desk/texts=:textIds' component={MainPage} />
            <Route exact path='/desk/notes=:noteIds' component={MainPage} />
            <Route path='/desk' component={MainPage} />
            <Route exact path='/about' component={MainPage} />
            <Route exact path='/signup' component={MainPage} />
            <Route exact path='/signin' component={MainPage} />
            <Route exact path='/logout' component={MainPage} />
            <Route component={MainPage} />
          </Switch>
          <Footer />
        </div>
      </Router>
    </>
  );
};

export default App;
