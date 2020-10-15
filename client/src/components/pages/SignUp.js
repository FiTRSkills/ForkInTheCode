import React, { useEffect } from "react";
import { connect } from "react-redux";
import { changeCurrentPage } from "../../redux/actions";
import { Container, Box, Tabs, Tab } from "@material-ui/core";
import "./SignUp.css";
import SignUpTabPanel from "../subcomponents/SignUpTabPanel";

const JOB_SEEKER_USERTYPE = "JobSeekerProfile";
const EMPLOYER_USERTYPE = "EmployerProfile";
const EDUCATOR_USERTYPE = "EducatorProfile";

function SignUp(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (props.user !== undefined && Object.keys(props.user).length > 0) {
      props.history.push("/Home");
    }
    props.changeCurrentPage("Sign Up");
  });

  return (
    <Container>
      <Box className={"signUpContainer"}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Job Seeker" />
          <Tab label="Employer" />
          <Tab label="Educator" />
        </Tabs>
        <SignUpTabPanel
          usertype={JOB_SEEKER_USERTYPE}
          value={value}
          index={0}
          title={"Job Seeker"}
          form_id={"job_seeker_form"}
          {...props}
        />
        <SignUpTabPanel
          usertype={EMPLOYER_USERTYPE}
          value={value}
          index={1}
          title={"Employer"}
          form_id={"employer_form"}
          {...props}
        />
        <SignUpTabPanel
          usertype={EDUCATOR_USERTYPE}
          value={value}
          index={2}
          title={"Educator"}
          form_id={"educator_form"}
          {...props}
        />
      </Box>
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
