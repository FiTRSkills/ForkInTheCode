import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import "./SignUpTabPanel.css";
import axios from "axios";
import { Alert } from "@material-ui/lab";

const url =
  process.env.REACT_APP_ENVIRONMENT === "prod"
    ? process.env.REACT_APP_PROD_SERVER_URL
    : process.env.REACT_APP_DEV_SERVER_URL;

function SignUpTabPanel(props) {
  const { value, index, title, usertype, history, form_id } = props;

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

  return (
    <Box
      component={"form"}
      hidden={value !== index}
      onSubmit={signUp}
      id={form_id}
    >
      <Typography className={"formRow"} align={"center"} variant={"h6"}>
        Sign Up for {title}
      </Typography>
      {error && <Alert severity={"error"}>{error}</Alert>}
      <Grid container justify={"center"} alignItems={"center"}>
        <Grid
          className={"formRow"}
          container
          justify={"center"}
          alignItems={"center"}
          spacing={3}
        >
          <Grid item>
            <Typography variant={"body1"}>Username: </Typography>
          </Grid>
          <Grid item>
            <TextField
              name={"username"}
              onChange={handleChange}
              required
              value={username}
              type={"username"}
            />
          </Grid>
        </Grid>
        <Grid
          className={"formRow"}
          container
          justify={"center"}
          alignItems={"center"}
          spacing={3}
        >
          <Grid item>
            <Typography variant={"body1"}>Password: </Typography>
          </Grid>
          <Grid item>
            <TextField
              name={"password"}
              onChange={handleChange}
              required
              value={password}
              type={"password"}
            />
          </Grid>
        </Grid>
        <Grid className={"formRow"} item justify={"center"}>
          <Button color={"primary"} variant={"contained"} type={"submit"}>
            {!loading ? "Sign Up" : "Processing..."}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUpTabPanel;
