import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { changeCurrentPage } from "../../redux/actions";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SignUpTabPanel from "../subcomponents/SignUpTabPanel";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Box from "@material-ui/core/Box";
import { checkAndUpdateAuth } from "../../services/AuthService";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

function SignUp(props) {
  const [tabIndex, setTabIndex] = useState(0);
  const [checkedAuth, setCheckedAuth] = useState(false);

  function handleChange(event, newIndex) {
    setTabIndex(newIndex);
  }

  useEffect(() => {
    async function asyncAuth() {
      let response = await checkAndUpdateAuth(props.user.type);
      if (response === undefined || response.length < 1) {
        props.changeCurrentPage("Sign Up");
        setCheckedAuth(true);
      } else {
        props.history.push("/JobSearch");
      }
    }
    asyncAuth();
    // eslint-disable-next-line
  }, []);

  const classes = useStyles();

  if (!checkedAuth) {
    return <Box />;
  }

  return (
    <Container>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="Account Sign Up Types"
        >
          <Tab label="Job Seeker" id="jobSeekerTab" />
          <Tab label="Employer" id="employerTab" />
          <Tab label="Educator" id="educatorTab" />
        </Tabs>
        <SignUpTabPanel
          currentTab={tabIndex}
          index={0}
          typeTitle="Job Seeker"
          {...props}
        />
        <SignUpTabPanel
          currentTab={tabIndex}
          index={1}
          typeTitle="Employer"
          {...props}
        />
        <SignUpTabPanel
          currentTab={tabIndex}
          index={2}
          typeTitle="Educator"
          {...props}
        />
      </div>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.authentication,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
