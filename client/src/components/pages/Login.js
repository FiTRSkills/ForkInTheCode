import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateUser, changeCurrentPage } from "../../redux/actions";
import "./Login.css";
import { Grid } from "@material-ui/core";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorHappened, setErrorHappened] = useState(false);

  useEffect(() => {
    if (props.user !== undefined && Object.keys(props.user).length > 0) {
      props.history.push("/Home");
    }
    props.changeCurrentPage("Login");
  });

  function attemptLogin(event) {
    let url =
      process.env.REACT_APP_ENVIRONMENT === "prod"
        ? process.env.REACT_APP_PROD_SERVER_URL
        : process.env.REACT_APP_DEV_SERVER_URL;
    axios
      .post(url + "/Login", { username, password })
      .then((response) => {
        if (response.status === 401) {
          setErrorHappened(true);
        } else {
          props.updateUser({ username: response.data });
          props.history.push("/Home");
        }
      })
      .catch((response) => {
        setErrorHappened(true);
        console.log(response);
      });
    event.preventDefault();
  }

  function handleChange(event) {
    switch (event.target.name) {
      case "username":
        setUsername(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  }
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
        {errorHappened && (
          <Alert severity="error">
            Your Username and/or Password was incorrect, please try again.
          </Alert>
        )}
        <form className={classes.form} onSubmit={attemptLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required={true}
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required={true}
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handleChange}
          />
          {/*<FormControlLabel*/}
          {/*control={<Checkbox value="remember" color="primary" />}*/}
          {/*label="Remember me"*/}
          {/*/> commenting out remember me*/}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={attemptLogin}
            id="submit"
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" to="/SignUp">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default connect((state) => ({ user: state.authentication }), {
  updateUser,
  changeCurrentPage,
})(Login);
