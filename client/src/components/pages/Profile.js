import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { changeCurrentPage } from "../../redux/actions";
import { connect } from "react-redux";
import ProfileDisplay from "../subcomponents/ProfileDisplay";
import ProfileEdit from "../subcomponents/ProfileEdit";
import axios from "axios";

let url = process.env.REACT_APP_SERVER_URL;

const Profile = (props) => {
  /**
   * Local states for text fields
   */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(null);
  const [education, setEducation] = useState([]);
  const [career, setCareer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Profile edit mode
   */
  const [isEdit, setEdit] = useState(false);

  /**
   * Change the nav title to Profile, but if user is not signed in, redirect to login
   */
  useEffect(() => {
    if (props.user !== undefined && Object.keys(props.user).length === 0) {
      // props.history.push("/Login");
    } else {
      props.changeCurrentPage("Profile");
      loadProfile();
    }
  }, []);

  /**
   * Toggle the profile edit mode
   */
  const toggleEdit = () => {
    setEdit(!isEdit);
  };

  /**
   * Load profile
   */
  const loadProfile = () => {
    // Load profile
    setLoading(true);
    axios
      .get(url + "/Profile")
      .then((response) => {
        setFirstName(response.data.firstname);
        setLastName(response.data.lastname);
        setDob(response.data.dob);
        setEducation(response.data.education);
        setCareer(response.data.career);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to load profile");
        }
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  /**
   * If edit mode is true, then show edit profile, else show regular profile
   */
  return (
    <Container>
      {!isEdit ? (
        <ProfileDisplay
          startEdit={toggleEdit}
          firstName={firstName}
          lastName={lastName}
          dob={dob}
          education={education}
          career={career}
          loading={loading}
          error={error}
        />
      ) : (
        <ProfileEdit
          endEdit={toggleEdit}
          loadProfile={loadProfile}
          user={props.user}
        />
      )}
    </Container>
  );
};

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
