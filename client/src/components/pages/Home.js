import { Button } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { changeCurrentPage } from '../../redux/actions'

function Home(props) {
    useEffect(() => {
        if (props.user === undefined || Object.keys(props.user).length === 0) {
            props.history.push('/Login')
        }
        props.changeCurrentPage("Home")
    });

    function doThing(user) {
        let url = process.env.REACT_APP_ENVIRONMENT === 'prod' ? process.env.REACT_APP_PROD_SERVER_URL : process.env.REACT_APP_DEV_SERVER_URL;
        axios.post(url + "/HomeTest", user).then(response => {
            console.log(response)
        }).catch(response => {
            console.log(response)
        })
    }

    function sendUser() {
        doThing(props.user)
    }

    function sendNoUser() {
        doThing({})
    }

    return (
        <div className="home">
            <Button onClick={sendUser}>testing for rochel w/ user</Button>
            <Button onClick={sendNoUser}>testing for rochel w/o user</Button>
        </div>
    );
}

export default connect(
    state => ({ user: state.authentication }),
    { changeCurrentPage }
)(Home);
