
import Profile from "./components/pages/Profile";

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import NavBar from './components/subcomponents/NavBar'
import SignUp from './components/pages/SignUp';
function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          <Redirect exact from="/" to="/Home" />
          <Route exact component={Home} path="/Home" />
          <Redirect exact from="/Sign Out" to="/Login" />
          <Redirect exact from="/Log In" to="/Login" />
          <Route exact component={Login} path="/Login" />
          <Redirect exact from="/Sign Up" to="/SignUp" />
          <Route exact component={SignUp} path="/SignUp" />
          <Route exact component={Profile} path="/Profile" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
