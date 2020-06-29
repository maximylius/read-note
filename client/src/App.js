import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fillSpareIds, deleteSpareIds, loadUser } from './store/actions';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'quill-mention/dist/quill.mention.css';
import './App.css';
import './styles/flowchart.css';
import './styles/note.css';
import Navbar from './components/Metapanel/Navbar';
import Alerts from './components/Metapanel/Alerts';
import Desk from './components/pages/Desk';
import About from './components/pages/About/';
import NotFound from './components/pages/NotFound/';
import Signup from './components/pages/Signup';
import Signin from './components/pages/Signin';
import Logout from './components/pages/Logout';
import Welcome from './components/pages/Welcome';
import Footer from './components/Metapanel/Footer';

const App = () => {
  const dispatch = useDispatch();
  const { spareIds } = useSelector(state => state.spareIds);
  useEffect(() => {
    dispatch(fillSpareIds());
    return () => {
      // dispatch(deleteSpareIds());
    };
    // eslint-disable-next-line
  }, [spareIds]);

  useEffect(() => {
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
            <Route exact path='/' component={Welcome} />
            <Route
              exact
              path='/desk&texts=:textIds&notebooks=:notebookIds'
              component={Desk}
            />
            <Route exact path='/desk&texts=:textIds' component={Desk} />
            <Route exact path='/desk&notebooks=:notebookIds' component={Desk} />
            <Route path='/desk' component={Desk} />
            <Route exact path='/about' component={About} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/logout' component={Logout} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </div>
      </Router>
    </>
  );
};

export default App;
