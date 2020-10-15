import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { changeCurrentPage } from '../../redux/actions'

function SignUp(props) {
    useEffect(() => {
        if (props.user !== undefined && Object.keys(props.user).length > 0) {
            props.history.push('/Home')
        }
        props.changeCurrentPage("Sign Up")
    });

    return (
        <div>
            Sign Up - TODO
        </div>
    );
}

export default connect(
    state => ({ user: state.authentication }),
    { changeCurrentPage }
)(SignUp);
