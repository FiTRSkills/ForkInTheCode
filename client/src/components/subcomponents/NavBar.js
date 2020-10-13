import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { changeCurrentPage, logOut } from '../../redux/Actions'
import './NavBar.css'

function NavBar(props) {
    const authLeftSide = ["Search", "Something Else"];
    const authRightSide = ["Profile", "Sign Out"];
    const notAuthLeftSide = []
    const notAuthRightSide = ["Log In", "Sign Up"];

    const [navBarListLeft, editNavBarListLeft] = useState([])
    const [navBarListRight, editNavBarListRight] = useState([])

    // Lifecycle hooks
    useEffect(() => {
        assignBarContents(Object.keys(props.user).length > 0)
    }, [props.currentPage]);

    // Helper functions
    function assignBarContents(isAuthenticated) {
        if (isAuthenticated) {
            editNavBarListLeft(getButtonArray(authLeftSide));
            editNavBarListRight(getButtonArray(authRightSide));
        }
        else {
            editNavBarListLeft(getButtonArray(notAuthLeftSide));
            editNavBarListRight(getButtonArray(notAuthRightSide));
        }
    }

    function getButtonArray(labelList) {
        return labelList.map((item) =>
            <Button color="inherit" key={item} onClick={() => { onButtonClick(item) }} component={Link} to={'/' + item}>{item}</Button>
        )
    }

    function onButtonClick(item) {
        if (item === "Sign Out") {
            props.logOut();
        }
    }

    // Renderer
    return (
        <div >
            <AppBar position="static">
                <Toolbar className="navBar">
                    <div className="navBarSides">
                        {navBarListLeft}
                    </div>
                    {/*<Typography variant="h6" className="navBarTitle">*/}
                        {/*{props.currentPage}*/}
                    {/*</Typography>*/}
                    <div className="navBarSides navBarRight">
                        {navBarListRight}
                    </div>
                </Toolbar>
            </AppBar>
        </div>

    );
}

export default connect(
    state => ({ user: state.authentication, currentPage: state.navigation.currentPage }),
    { changeCurrentPage, logOut }
)(NavBar)
