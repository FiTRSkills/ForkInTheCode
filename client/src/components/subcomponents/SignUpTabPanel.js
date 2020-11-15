import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
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

  function signUp({ email, password, organization }) {
    let body = {
      usertype: TAB_TYPES[props.index],
      email,
      password,
    };
    if (organization !== "") {
      body.organization = organization;
    }
    return axios
      .post(process.env.REACT_APP_SERVER_URL + "/register", body, {
        withCredentials: true,
      })
      .then(() => {
        props.history.push("/Login");
      })
      .catch((error) => {
        if (error?.response?.status === 400) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An error has occurred, please try again.");
        }
        console.error(error);
      });
  }

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
          <Form
            apiCall={signUp}
            buttonTitle="Sign Up"
            errorMessage={errorMessage}
            isEmployer={props.index === 1}
            isEducator={props.index === 2}
          />
        </Box>
      )}
    </div>
  );
}

export default SignUpTabPanel;
