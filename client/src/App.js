import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import JobSearch from "./components/pages/JobSearch";
import Login from "./components/pages/Login";
import NavBar from "./components/subcomponents/Shared/NavBar";
import SignUp from "./components/pages/SignUp";
import Profile from "./components/pages/Profile";
import JobPosting from "./components/pages/JobPosting";
import SkillSearch from "./components/pages/SkillSearch";

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          <Redirect exact from="/" to="/JobSearch" />
          <Redirect exact from="/Job Search" to="/JobSearch" />
          <Route exact component={JobSearch} path="/JobSearch" />
          <Redirect exact from="/Sign Out" to="/Login" />
          <Redirect exact from="/Log In" to="/Login" />
          <Route exact component={Login} path="/Login" />
          <Redirect exact from="/Sign Up" to="/SignUp" />
          <Route exact component={SignUp} path="/SignUp" />
          <Route exact component={Profile} path="/Profile" />
          <Route component={JobPosting} path="/JobPost/:id" />
          <Redirect exact from="/Skill Search" to={"/SkillSearch"} />
          <Route component={SkillSearch} path={"/SkillSearch"} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
