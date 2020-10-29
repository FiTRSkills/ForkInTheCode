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

  function handleChange(event, newIndex) {
    setTabIndex(newIndex);
  };

  useEffect(() => {
    if (props.user !== undefined && Object.keys(props.user).length > 0) {
      props.history.push("/Home");
    }
    props.changeCurrentPage("Sign Up");
  });

  const classes = useStyles();

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
        <SignUpTabPanel currentTab={tabIndex} index={0} typeTitle="Job Seeker" {...props} />
        <SignUpTabPanel currentTab={tabIndex} index={1} typeTitle="Employer" {...props} />
        <SignUpTabPanel currentTab={tabIndex} index={2} typeTitle="Educator" {...props} />
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
