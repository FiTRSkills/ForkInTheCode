import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@material-ui/core";
import axios from "axios";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

/**
 * Base URL for sign up API
 *
 * @type {*|string}
 */
const url =
  process.env.REACT_APP_ENVIRONMENT === "prod"
    ? process.env.REACT_APP_PROD_SERVER_URL
    : process.env.REACT_APP_DEV_SERVER_URL;

/**
 * Sign up tab panel component
 *
 * @param props: injected props
 * @returns {JSX.Element}: render component
 * @constructor
 */
function SignUpTabPanel(props) {
  const { currentTabIdx, index, title, usertype, history, form_id } = props;

  /**
   * Local states: username, password, sign-up loading, sign-up error
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  /**
   * Register the username and password inputs into states
   *
   * @param event: submitted action event
   */
  const handleChange = (event) => {
    switch (event.target.name) {
      case "email":
        setEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  };

  /**
   * Submit sign up API calls and process returned responses and errors
   *
   * @param event: submit event
   */
  const signUp = (event) => {
    event.preventDefault();
    if (!validEmail(email)) {
      setError("Invalid email!");
      return;
    }
    setLoading(true);
    axios
      .post(url + "/register", {
        usertype,
        username,
        password,
      })
      .then((response) => {
        history.push("/Login");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data.message);
        } else {
          setError("Something wrong occurred");
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Validate email inputs
   *
   * @param email: input email
   * @returns {boolean}
   */
  const validEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  /**
   * Style the sign up tab panel component
   *
   * @type {(props?: any) => ClassNameMap<"paper"|"form"|"submit"|"header"|"avatar">}
   */
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
      maxWidth: 480,
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      width: "100%",
    },
    header: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
  }));

  const classes = useStyles();

  /**
   * Render sign up tab panel component
   */
  return (
    <Box hidden={currentTabIdx !== index}>
      <Typography
        component="h1"
        variant="h5"
        align={"center"}
        className={classes.header}
      >
        Sign Up for {title}
      </Typography>

      {error && <Alert severity={"error"}>{error}</Alert>}
      <form className={classes.form} onSubmit={signUp} id={form_id}>
        <TextField
          variant="outlined"
          margin="normal"
          required={true}
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoFocus
          value={email}
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
          value={password}
          onChange={handleChange}
        />
        <Button
          color={"primary"}
          variant={"contained"}
          type={"submit"}
          className={classes.submit}
        >
          {!loading ? "Sign Up" : "Processing..."}
        </Button>
      </form>
    </Box>
  );
}

export default SignUpTabPanel;
