import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { changeCurrentPage } from "../../redux/actions";
import { connect } from "react-redux";
import MainProfile from "../subcomponents/MainProfile";
import Divider from "@material-ui/core/Divider";
import CareerItemList from "../subcomponents/CareerItemList";
import EducationItemList from "../subcomponents/EducationItemList";
import { makeStyles } from "@material-ui/core/styles";
import ProfileSkills from "../subcomponents/ProfileSkills";
import Box from "@material-ui/core/Box";
import { checkAndUpdateAuth } from "../../services/AuthService";

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
  // Style hook
  const classes = useStyles();

  const [authenticated, setAuthenticated] = useState(false);

  /**
   * Change the nav title to Profile, but if user is not signed in, redirect to login
   */
  useEffect(() => {
    async function asyncAuth() {
      let response = await checkAndUpdateAuth(props.user.type);
      if (response === undefined || response.length < 1) {
        props.history.push("/Login");
      } else {
        props.changeCurrentPage("Profile");
        setAuthenticated(true);
      }
    }
    asyncAuth();
  }, []);

  if (!authenticated) {
    return <Box />;
  }

  return (
    <Container className={classes.container}>
      <MainProfile />
      <Divider className={classes.divider} variant="middle" />
      <ProfileSkills />
      <Divider className={classes.divider} variant="middle" />
      <CareerItemList />
      <Divider className={classes.divider} variant="middle" />
      <EducationItemList />
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
