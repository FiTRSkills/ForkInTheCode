import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { updateUser, changeCurrentPage } from '../../redux/Actions'
import './Login.css'

class Login extends Component {
    constructor(props) {
        super(props);
        this.user = props.user;
        if (props.user !== undefined && Object.keys(props.user).length > 0) {
            props.history.push('/Home')
        }
    }

    componentDidMount() {
        if (this.props.user !== undefined && Object.keys(this.props.user).length > 0) {
            this.props.history.push('/Home')
        }
        this.props.changeCurrentPage("Login")
    }

    attemptLogin() {
        this.props.updateUser({ username: "temp", pw: "more temp" })
        this.props.history.push('/Home')

        // Leaving for now since we will eventually need api calls, will be remove before merge with sprint branch
        /*fetch("http://localhost:9000/login")
            .then(response => response.json())
            .then(response => {
                if (response.user !== undefined) {
                    this.props.updateUser(response.user)
                    this.props.history.push('/')
                }
                else {
                    // show that attempt to login was unsuccessful
                }
            });*/
    }

    render() {
        return (
            <div className="home">
                <div className="loginContainer">
                    <div class="loginHeading">Login:</div>
                    <form name="login" className="loginForm">
                        <label for="username" className="loginLabel">Username:</label>
                        <input name="username" type="text" className="loginInput"></input>
                        <label for="password" className="loginLabel">Password:</label>
                        <input name="password" type="password" className="loginInput"></input>
                        <Button variant="contained" color="inherit" className="loginSubmit" onClick={this.attemptLogin.bind(this)}>Submit</Button>
                    </form>
                </div>
            </div>
        );
    }
}
export default connect(
    state => ({ user: state.authentication }),
    { updateUser, changeCurrentPage }
)(Login);
