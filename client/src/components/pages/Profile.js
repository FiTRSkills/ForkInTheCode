import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { changeCurrentPage } from "../../redux/actions";
import { connect } from "react-redux";
import MainProfile from "../subcomponents/MainProfile";
import axios from "axios";
import Divider from "@material-ui/core/Divider";
import CareerItemList from "../subcomponents/CareerItemList";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(6),
  },
}));

function Profile(props) {
  /**
   * Local states for text fields
   */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(null);
  const [education, setEducation] = useState([]);
  const [careers, setCareers] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Style hook
   */
  const classes = useStyles();

  /**
   * Profile edit mode
   */
  const [isEdit, setEdit] = useState(false);

  /**
   * Change the nav title to Profile, but if user is not signed in, redirect to login
   */
  useEffect(() => {
    if (props.user !== undefined && Object.keys(props.user).length === 0) {
      //props.history.push("/Login");
    } else {
      props.changeCurrentPage("Profile");
    }
  });

  useEffect(() => {
    loadProfile();
  }, [isEdit]);

  /**
   * Toggle the profile edit mode
   */
  function toggleEdit() {
    setEdit(!isEdit);
  }

  /**
   * Load profile
   */
  function loadProfile() {
    // Load profile
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/Profile", {
        withCredentials: true,
      })
      .then((response) => {
        setFirstName(response.data.firstname);
        setLastName(response.data.lastname);
        setDob(new Date(response.data.dob));
        setEducation(response.data.education);
        setCareers(response.data.career);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to load profile");
        }
        console.error(error);
      });
  }

  function updateCareers() {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/Profile", {
        withCredentials: true,
      })
      .then((response) => {
        setCareers(response.data.career);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to get updated Career list.");
        }
        console.error(error);
      });
  }

  function updateEducation() {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/Profile", {
        withCredentials: true,
      })
      .then((response) => {
        setEducation(response.data.education);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to get updated Education list.");
        }
        console.error(error);
      });
  }

  return (
    <Container className={classes.container}>
      {error && <Alert severity={"error"}>{error}</Alert>}
      <MainProfile
        endEdit={toggleEdit}
        user={props.user}
        firstName={firstName}
        lastName={lastName}
        dob={dob}
        education={education}
        career={careers}
      />
      <Divider />
      <CareerItemList careers={careers} updateCareers={updateCareers} />
      <Divider />
      {/*<EducationItemList
        education={education}
        updateEducation={updateEducation}
      />*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
