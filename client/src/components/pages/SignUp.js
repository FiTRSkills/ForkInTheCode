import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeCurrentPage } from '../../redux/Actions'

class SignUp extends Component {
    constructor(props) {
        super(props);
        if (props.user !== undefined && Object.keys(props.user).length > 0) {
            props.history.push('/Home')
        }
    }

    componentDidMount() {
        if (this.props.user !== undefined && Object.keys(this.props.user).length > 0) {
            this.props.history.push('/Home')
        }
        this.props.changeCurrentPage("Sign Up")
    }

    render() {
        return (
            <div>
                Home - TODO
            </div>
        );
    }
}
export default connect(
    state => ({ user: state.authentication }),
    { changeCurrentPage }
)(SignUp);
