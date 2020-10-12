import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom"
import { connect } from 'react-redux';
import { updateUser, changeCurrentPage } from '../../redux/Actions'
import './Login.css'
import { Grid } from '@material-ui/core';

function Login(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        if (props.user !== undefined && Object.keys(props.user).length > 0) {
            props.history.push('/Home')
        }
        props.changeCurrentPage("Login")
    })

    function attemptLogin() {
        props.updateUser({ username, password })
        props.history.push('/Home')

        // Leaving for now since we will eventually need api calls, will be removed before merge with sprint branch
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

    function handleChange(event) {
        switch (event.target.name) {
            case "username":
                setUsername(event.target.value)
                break;
            case "password":
                setPassword(event.target.value)
                break;
        }

    }

    return (
        <div className="home">
            <div className="loginContainer">
                <div className="loginHeading">Log In:</div>
                <Grid container alignItems="center" justify="center" spacing={4}>
                    <Grid item xs={6}>
                        <label htmlFor="username" className="loginLabel">Username:</label>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField name="username" id="username" className="loginInput" value={username} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={6}>
                        <label htmlFor="password" className="loginLabel">Password:</label>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField name="password" id="password" type="password" className="loginInput" value={password} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Button variant="contained" color="inherit" className="loginSubmit" onClick={attemptLogin}>Submit</Button>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <div>Don't have an account? Sign up <Link to="/SignUp" onClick={() => { console.log("click") }}>here</Link>!</div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default connect(
    state => ({ user: state.authentication }),
    { updateUser, changeCurrentPage }
)(Login);
