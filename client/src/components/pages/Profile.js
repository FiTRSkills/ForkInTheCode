import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { changeCurrentPage } from "../../redux/actions";
import { connect } from "react-redux";
import MainProfile from "../subcomponents/MainProfile";
import axios from "axios";
import Divider from "@material-ui/core/Divider";
import CareerItemList from "../subcomponents/CareerItemList";
import EducationItemList from "../subcomponents/EducationItemList";
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
  divider: {
    marginTop: "25px",
    marginBottom: "25px",
    width: "680px",
    minHeight: "1px",
    backgroundColor: "rgba(0, 0, 0, .6)",
  },
}));

function Profile(props) {
  /**
   * Local states for text fields
   */
  const [education, setEducation] = useState([]);
  const [careers, setCareers] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Style hook
   */
  const classes = useStyles();

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
    updateCareers();
    updateEducation();
  }, [error]);

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
      <MainProfile />
      <Divider className={classes.divider} variant="middle" />
      <CareerItemList careers={careers} updateCareers={updateCareers} />
      <Divider className={classes.divider} variant="middle" />
      <EducationItemList
        education={education}
        updateEducation={updateEducation}
      />
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
