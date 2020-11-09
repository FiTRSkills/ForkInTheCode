import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 100,
    height: 100,
    margin: theme.spacing(2),
  },
  container: {
    minWidth: 680,
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

function MainProfile() {
  // Local State
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [dob, setDob] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Whenever we swap between editing and not the profile is updated
  useEffect(() => {
    updateProfile();
  }, [edit]);

  function updateProfile() {
    setLoading(true);
    // Load profile
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/Profile", {
        withCredentials: true,
      })
      .then((response) => {
        setFirstName(response.data.firstname);
        setLastName(response.data.lastname);
        setDob(response.data.dob);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status &&
          error.response.data &&
          error.response.status === 400
        ) {
          setError(error.response.data);
        } else {
          setError("Failed to get updated basic profile.");
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

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
  function saveProfile(event) {
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
        setEdit(false);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to save profile");
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function toggleEdit() {
    setEdit(!edit);
  }

  return (
    <Box className={classes.container}>
      <Avatar className={classes.avatar} />
      <Button className={classes.icon} onClick={toggleEdit}>
        <EditIcon />
      </Button>
      <Typography className={classes.field} variant={"h5"}>
        Overall
      </Typography>
      {error && <Alert severity={"error"}>{error}</Alert>}
      <form onSubmit={saveProfile}>
        <Box className={classes.field}>
          <Typography>First name</Typography>
          <TextField
            variant={edit ? "outlined" : "standard"}
            margin="normal"
            fullWidth
            id="firstName"
            name="firstName"
            autoFocus
            required
            value={firstname}
            onChange={handleChange}
            disabled={!edit}
            style={{ color: "rgba(0, 0, 0, 1)" }}
          />
        </Box>
        <Box className={classes.field}>
          <Typography>Last name</Typography>
          <TextField
            variant={edit ? "outlined" : "standard"}
            margin="normal"
            fullWidth
            id="lastName"
            name="lastName"
            required
            value={lastname}
            onChange={handleChange}
            disabled={!edit}
            style={{ color: "rgba(0, 0, 0, 1)" }}
          />
        </Box>
        <Box className={classes.field}>
          <Typography>Date of Birth</Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              inputVariant={edit ? "outlined" : "standard"}
              fullWidth
              disableToolbar
              variant="inline"
              format="yyyy/MM/dd"
              placeholder="YYYY/MM/DD"
              margin="normal"
              id="dob"
              name="dob"
              value={dob}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date of birth",
              }}
              disabled={!edit}
              style={{ color: "rgba(0, 0, 0, 1)" }}
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
            onClick={saveProfile}
          >
            {!loading ? "Save" : "Processing..."}
          </Button>
        )}
      </form>
    </Box>
  );
}

export default MainProfile;
