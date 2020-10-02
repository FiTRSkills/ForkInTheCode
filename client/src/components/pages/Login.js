import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { updateUser, changeCurrentPage } from '../../redux/Actions'
import './Login.css'

function Login(props) {

    useEffect(() => {
        if (props.user !== undefined && Object.keys(props.user).length > 0) {
            props.history.push('/Home')
        }
        props.changeCurrentPage("Login")
    })

    function attemptLogin() {
        props.updateUser({ username: "temp", pw: "more temp" })
        props.history.push('/Home')

        // Leaving for now since we will eventually need api calls, will be remove before merge with sprint branch
        /*fetch("http://localhost:9000/login")
            .then(response => response.json())
            .then(response => {
                if (response.user !== undefined) {
                    props.updateUser(response.user)
                    props.history.push('/')
                }
                else {
                    // show that attempt to login was unsuccessful
                }
            });*/
    }

    return (
        <div className="home">
            <div className="loginContainer">
                <div className="loginHeading">Login:</div>
                <form name="login" className="loginForm">
                    <label htmlFor="username" className="loginLabel">Username:</label>
                    <input name="username" type="text" className="loginInput"></input>
                    <label htmlFor="password" className="loginLabel">Password:</label>
                    <input name="password" type="password" className="loginInput"></input>
                    <Button variant="contained" color="inherit" className="loginSubmit" onClick={attemptLogin}>Submit</Button>
                </form>
            </div>
        </div>
    );
}

export default connect(
    state => ({ user: state.authentication }),
    { updateUser, changeCurrentPage }
)(Login);
