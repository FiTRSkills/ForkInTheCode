import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    margin: theme.spacing(2),
  },
  form: {
    minWidth: 480,
  },
  field: {
    marginTop: theme.spacing(2),
  },
  submit: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
}));

function MainProfileEdit({ endEdit, ...props }) {
  /**
   * Local states
   */
  const [firstname, setFirstName] = useState(props.firstName);
  const [lastname, setLastName] = useState(props.lastName);
  const [dob, setDob] = useState(props.dob);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Style hook
   */
  const classes = useStyles();

  /**
   * Handle change of text fields to local states
   *
   * @param event
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "firstName":
        setFirstName(event.target.value);
        break;
      case "lastName":
        setLastName(event.target.value);
        break;
      default:
        break;
    }
  }

  function handleDateChange(date) {
    setDob(date);
  }

  function dobAsString() {
    let month = "" + (dob.getMonth() + 1);
    let day = "" + (dob.getDate() + 1);
    let year = dob.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  /**
   * Save updated profile
   */
  function updateProfile(event) {
    event.preventDefault();

    // Save profile
    setLoading(true);
    axios
      .post(
        process.env.REACT_APP_SERVER_URL + "/Profile",
        {
          firstname,
          lastname,
          dob: dobAsString(),
        },
        { withCredentials: true }
      )
      .then((response) => {
        endEdit();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to save profile");
        }
        console.error(error);
      })
      .finally(() => setLoading(false));
  }

  /**
   * Cancel edit profile
   */
  function cancelEdit(event) {
    event.preventDefault();
    endEdit();
  }

  /*function editEducatio(id) {
    let education = educations.filter((education) => education.id === id);
    let newEducation = {
      degree: "",
      major: "",
      gradDate: Date.now(),
      organization: "",
      id: -1,
    };
    switch (education.length) {
      case 0:
        break;
      case 1:
        newEducation = { ...education };
        break;
      default:
        console.error(
          "Warning: trying to edit an id associated with multiple careers"
        );
        break;
    }
  }*/

  return (
    <Container className={classes.container}>
      <Avatar className={classes.avatar} />
      <Link href={"/Profile"} onClick={cancelEdit}>
        Back to profile
      </Link>
      {error && <Alert severity={"error"}>{error}</Alert>}
      <form className={classes.form} onSubmit={updateProfile}>
        <Box className={classes.field}>
          <Typography>First name</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="firstName"
            label="First name"
            name="firstName"
            autoFocus
            required
            value={firstname}
            onChange={handleChange}
            disabled={!edit}
          />
        </Box>
        <Box className={classes.field}>
          <Typography>Last name</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="lastName"
            label="Last name"
            name="lastName"
            required
            value={lastname}
            onChange={handleChange}
            disabled={!edit}
          />
        </Box>
        <Box className={classes.field}>
          <Typography>Date of Birth</Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              inputVariant="outlined"
              fullWidth
              disableToolbar
              variant="inline"
              format="yyyy/MM/dd"
              margin="normal"
              id="dob"
              label="Date of Birth"
              name="dob"
              value={dob}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              disabled={!edit}
            />
          </MuiPickersUtilsProvider>
        </Box>
        {edit && (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            id="submit"
            onClick={updateProfile}
          >
            {!loading ? "Save" : "Processing..."}
          </Button>
        )}
      </form>
    </Container>
  );
}

export default MainProfileEdit;
