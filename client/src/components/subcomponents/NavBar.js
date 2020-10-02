import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { changeCurrentPage, logOut } from '../../redux/Actions'
import './NavBar.css'

const authLeftSide = ["Search", "Something Else"];
const authRightSide = ["Profile", "Sign Out"];
const notAuthLeftSide = []
const notAuthRightSide = ["Log In", "Sign Up"];

class NavBar extends Component {
    // Constructor/Life cycle hooks
    constructor(props) {
        super(props);
        this.assignBarContents(Object.keys(props.user).length > 0)
    }

    componentDidUpdate() {
        this.assignBarContents(Object.keys(this.props.user).length > 0)
    }

    // Helper functions
    assignBarContents(isAuthenticated) {
        if (isAuthenticated) {
            this.navBarListLeft = this.getButtonArray(authLeftSide);
            this.navBarListRight = this.getButtonArray(authRightSide)
        }
        else {
            this.navBarListRight = this.getButtonArray(notAuthRightSide)
            this.navBarListLeft = this.getButtonArray(notAuthLeftSide)
        }
    }

    getButtonArray(labelList) {
        return labelList.map((item) =>
            <Button color="inherit" key={item} onClick={() => { this.onButtonClick(item) }} component={Link} to={'/' + item}>{item}</Button>
        )
    }

    onButtonClick(item) {
        if (item === "Sign Out") {
            this.props.logOut();
        }
    }

    // Renderer
    render() {
        return (
            <div >
                <AppBar position="static">
                    <Toolbar className="navBar">
                        <div className="navBarSides">
                            {this.navBarListLeft}
                        </div>
                        <Typography variant="h6" className="navBarTitle">
                            {this.props.currentPage}
                        </Typography>
                        <div className="navBarSides navBarRight">
                            {this.navBarListRight}
                        </div>
                    </Toolbar>
                </AppBar>
            </div>

        );
    }
}

export default connect(
    state => ({ user: state.authentication, currentPage: state.navigation.currentPage }),
    { changeCurrentPage, logOut }
)(NavBar)
