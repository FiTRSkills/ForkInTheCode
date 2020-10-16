import React, { useState } from "react";
import {Box, Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import "./SignUpTabPanel.css";
import axios from "axios";
import { Alert } from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";

const url =
  process.env.REACT_APP_ENVIRONMENT === "prod"
    ? process.env.REACT_APP_PROD_SERVER_URL
    : process.env.REACT_APP_DEV_SERVER_URL;

function SignUpTabPanel(props) {
  const { currentTabIdx, index, title, usertype, history, form_id } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleChange = (event) => {
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
  };

  const signUp = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post(url + "/register", {
        usertype,
        username,
        password,
      })
      .then((response) => {
        if (response.data.name && response.data.name === "UserExistsError") {
          setError(response.data.message);
        } else {
          history.push("/Login");
        }
      })
      .catch((error) => {
        setError("Something wrong occurs!");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
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
      width:"100%"
    },
    header: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1)
    }
  }));
  const classes = useStyles();

  return (

      <Box
      component={"form"}
      hidden={currentTabIdx !== index}
      onSubmit={signUp}
      id={form_id}
    >
      <Typography component="h1" variant="h5" align={"center"} className = {classes.header}>
        Sign Up for {title}
      </Typography>

      {error && <Alert severity={"error"}>{error}</Alert>}
      <form className={classes.form}>
        <TextField
            variant="outlined"
            margin="normal"
            required={true}
            fullWidth
            id="username"
            label="Username"
            name="username"
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
            value={password}
            onChange={handleChange}
        />
          <Button color={"primary"} variant={"contained"} type={"submit"} className={classes.submit}>
            {!loading ? "Sign Up" : "Processing..."}
          </Button>
      </form>
    </Box>
  );
}

export default SignUpTabPanel;
