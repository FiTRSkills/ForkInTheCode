import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logOut } from "../../../redux/actions";
import { logOut as axiosLogOut } from "../../../services/AuthService";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  navBar: {
    height: "50px",
  },

  navBarSides: {
    flexBasis: "0",
    flexGrow: "1",
  },

  navBarRight: {
    display: "flex",
    justifyContent: "flex-end",
  },

  navBarTitle: {
    flexGrow: 1,
    flexBasis: 0,
    textAlign: "center",
    display: "table-cell",
  },
}));

const authLeftSide = ["Job Search", "Skill Search"];
const authRightSide = ["Sign Out"];
const notAuthLeftSide = ["Job Search", "Skill Search"];
const notAuthRightSide = ["Log In", "Sign Up"];
const jobSeekerRightSide = ["Profile"];
const educatorRightSide = ["My Courses"];
const employerRightSide = ["My Job Postings"];

function NavBar(props) {
  const [navBarListLeft, editNavBarListLeft] = useState([]);
  const [navBarListRight, editNavBarListRight] = useState([]);

  const classes = useStyles();

  // Lifecycle hooks
  useEffect(() => {
    assignBarContents(Object.keys(props.user).length > 0);
    // eslint-disable-next-line
  }, [props.currentPage, props.user]);

  // Helper functions
  function assignBarContents(isAuthenticated) {
    if (isAuthenticated) {
      let leftSide = [];
      let rightSide = [];
      if (props.user.type === "JobSeekerProfile") {
        rightSide.push(...jobSeekerRightSide);
      }
      if (props.user.type === "EducatorProfile") {
        rightSide.push(...educatorRightSide);
      }
      if (props.user.type === "EmployerProfile") {
        rightSide.push(...employerRightSide);
      }
      leftSide.push(...authLeftSide);
      rightSide.push(...authRightSide);
      editNavBarListLeft(getButtonArray(leftSide));
      editNavBarListRight(getButtonArray(rightSide));
    } else {
      editNavBarListLeft(getButtonArray(notAuthLeftSide));
      editNavBarListRight(getButtonArray(notAuthRightSide));
    }
  }

  function getButtonArray(labelList) {
    return labelList.map((item) => {
      if (item === "Sign Out") {
        return (
          <Button
            color="inherit"
            key="Sign Out"
            onClick={() => {
              clickLogOut();
            }}
            id="SignOut"
          >
            Sign Out
          </Button>
        );
      }
      return (
        <Button
          color="inherit"
          key={item}
          component={Link}
          to={"/" + item}
          id={item.replace(" ", "")}
        >
          {item}
        </Button>
      );
    });
  }

  function clickLogOut() {
    axiosLogOut().then(() => {
      props.logOut();
      props.history.push("/Login");
    });
  }

  // Renderer
  return (
    <Box>
      <AppBar position="static">
        <Toolbar className={classes.navBar}>
          <Box className={classes.navBarSides}>{navBarListLeft}</Box>
          <Typography
            variant="h6"
            className={classes.navBarTitle}
            id="navBarTitle"
          >
            {props.currentPage}
          </Typography>
          <Box className={classes.navBarSides + " " + classes.navBarRight}>
            {navBarListRight}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.authentication,
    currentPage: state.navigation.currentPage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(logOut()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
