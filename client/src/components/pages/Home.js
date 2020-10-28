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

    return (
        <div className="home">
            <h1>Home</h1>
        </div>
    );
}

export default connect(
    state => ({ user: state.authentication }),
    { changeCurrentPage }
)(Home);
