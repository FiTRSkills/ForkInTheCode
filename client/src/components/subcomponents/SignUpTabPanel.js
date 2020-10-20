import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import "./SignUpTabPanel.css";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Form from "../subcomponents/Form";

const TAB_TYPES = ["JobSeekerProfile", "EmployerProfile", "EducatorProfile"];
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

function SignUpTabPanel(props) {
  const [errorMessage, setErrorMessage] = useState("");

  function signUp(username, password) {
    return axios
      .post(process.env.REACT_APP_SERVER_URL + "/register", {
        usertype: TAB_TYPES[props.index],
        username,
        password
      })
      .then((response) => {
        console.log(response)
        // APPLE: should this be changed to only go to login if it responds with it worked?
        if (response.data.name && response.data.name === "UserExistsError") {
          setErrorMessage(response.data.message);
        } else {
          props.history.push("/Login");
        }
      })
      .catch((error) => {
        // APPLE: this is a bad error message, what should it be? Even just "An error has occoured, please try again." is probably better?
        setErrorMessage("Something wrong occurs!");
        console.log(error);
      });
  };

  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={props.currentTab !== props.index}
      id={`simple-tabpanel-${props.index}`}
      aria-labelledby={`simple-tab-${props.index}`}
    >
      {props.currentTab === props.index && (
        <Box>
          <Typography
            component="h1"
            variant="h5"
            align={"center"}
            className={classes.header}
          >
            Sign Up for {props.typeTitle}
          </Typography>
          <Form apiCall={signUp} buttonTitle="Sign Up" errorMessage={errorMessage} />
        </Box>
      )}
    </div>
  );
}

export default SignUpTabPanel;
