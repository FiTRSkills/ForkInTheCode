import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { changeCurrentPage } from "../../redux/actions";
import { connect } from "react-redux";
import ProfileDisplay from "../subcomponents/ProfileDisplay";
import ProfileEdit from "../subcomponents/ProfileEdit";

const Profile = (props) => {
  /**
   * Profile edit mode
   */
  const [isEdit, setEdit] = useState(true);

  /**
   * Change the nav title to Profile, but if user is not signed in, redirect to login
   */
  useEffect(() => {
    if (props.user !== undefined && Object.keys(props.user).length === 0) {
      props.history.push("/Login");
    }
    props.changeCurrentPage("Profile");
  });

  /**
   * Toggle the profile edit mode
   */
  const toggleEdit = () => {
    setEdit(!isEdit);
  };

  /**
   * If edit mode is true, then show edit profile, else show regular profile
   */
  return (
    <Container>
      {!isEdit ? (
        <ProfileDisplay startEdit={toggleEdit} user={props.user} />
      ) : (
        <ProfileEdit endEdit={toggleEdit} user={props.user} />
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
