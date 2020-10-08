import React from 'react';
import logo from './logo.svg';
import './App.css';
import {actions as appActions} from './reducers/AppReducer';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Home from './components/pages/Home'
const mapStateToProps = (state) => {
    return {
        // General
        state: state
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...appActions}, dispatch)
});
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (

        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>

                </Switch>
            </div>
        </Router>
    )
  };





}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
