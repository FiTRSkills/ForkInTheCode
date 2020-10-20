import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateUser, changeCurrentPage } from "../../redux/actions";
import "./Login.css";
import { Grid } from "@material-ui/core";
import Form from "../subcomponents/Form";

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
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (props.user !== undefined && Object.keys(props.user).length > 0) {
      props.history.push("/Home");
    }
    props.changeCurrentPage("Login");
  });

  function attemptLogin(username, password) {
    return axios
      .post(process.env.REACT_APP_SERVER_URL + "/Login", { username, password })
      .then((response) => {
        if (response.status === 200) {
          props.updateUser({ username: response.data });
          props.history.push("/Home");
        } else {
          setErrorMessage("Your Username and/or Password was incorrect, please try again.")
        }
      })
      .catch((error) => {
        setErrorMessage("Your Username and/or Password was incorrect, please try again.")
        console.log(error);
      });  }

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Form apiCall={attemptLogin} buttonTitle="Sign In" errorMessage={errorMessage} />
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2" to="#">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2" to="/SignUp">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
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
    updateUser: (content) => dispatch(updateUser(content)),
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
