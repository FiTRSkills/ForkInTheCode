import React, { useEffect } from "react";
import { connect } from "react-redux";
import { changeCurrentPage } from "../../redux/actions";
import { Container, Tabs, Tab } from "@material-ui/core";
import "./SignUp.css";
import SignUpTabPanel from "../subcomponents/SignUpTabPanel";
import { makeStyles } from "@material-ui/core/styles";

const JOB_SEEKER_USERTYPE = "JobSeekerProfile";
const EMPLOYER_USERTYPE = "EmployerProfile";
const EDUCATOR_USERTYPE = "EducatorProfile";

function SignUp(props) {
  const [currentTabIdx, setTabIdx] = React.useState(0);

  const handleChange = (event, newIdx) => {
    setTabIdx(newIdx);
  };
  const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
  }));
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
        <Tabs
          value={currentTabIdx}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Job Seeker" />
          <Tab label="Employer" />
          <Tab label="Educator" />
        </Tabs>
        <SignUpTabPanel
          usertype={JOB_SEEKER_USERTYPE}
          currentTabIdx={currentTabIdx}
          index={0}
          title={"Job Seeker"}
          form_id={"job_seeker_form"}
          {...props}
        />
        <SignUpTabPanel
          usertype={EMPLOYER_USERTYPE}
          currentTabIdx={currentTabIdx}
          index={1}
          title={"Employer"}
          form_id={"employer_form"}
          {...props}
        />
        <SignUpTabPanel
          usertype={EDUCATOR_USERTYPE}
          currentTabIdx={currentTabIdx}
          index={2}
          title={"Educator"}
          form_id={"educator_form"}
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
