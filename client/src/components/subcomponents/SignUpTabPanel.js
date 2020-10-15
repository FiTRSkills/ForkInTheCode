import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import "./SignUpTabPanel.css";

function SignUpTabPanel(props) {
  const { value, index, title } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event) => {
    switch (event.target.name) {
      case "username":
        setUsername(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
    }
  };

  return (
    <Box component={"form"} hidden={value !== index}>
      <Typography className={"formRow"} align={"center"} variant={"h6"}>
        Sign Up for {title}
      </Typography>
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
              id={"username"}
              onChange={handleChange}
              required
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
              id={"password"}
              onChange={handleChange}
              required
              type={"password"}
            />
          </Grid>
        </Grid>
        <Grid className={"formRow"} item justify={"center"}>
          <Button color={"primary"} variant={"contained"} type={"submit"}>
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUpTabPanel;
