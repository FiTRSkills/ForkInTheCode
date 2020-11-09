import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
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

function AddEducation({ education, closePopup }) {
  /**
   * Local state
   */
  const [degree, setDegree] = useState(education.degree);
  const [major, setMajor] = useState(education.major);
  const [gradDate, setGradDate] = useState(education.gradDate);
  const [school, setSchool] = useState(education.organization);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const newEducation = education.id === -1;

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
      case "degree":
        setDegree(event.target.value);
        break;
      case "major":
        setMajor(event.target.value);
        break;
      case "school":
        setSchool(event.target.value);
        break;
      default:
        break;
    }
  }

  const handleDateChange = (date) => {
    setGradDate(date);
  };

  /**
   * Submit form
   */
  function submitEducationForm(event) {
    event.preventDefault();

    // Save profile
    setLoading(true);
    const url = process.env.REACT_APP_SERVER_URL + "/profile/education";
    let body = {
      degree,
      major,
      gradDate,
      organization: school,
    };
    function catchFunction(error) {
      if (error.response.status === 400) {
        setError(error.response.data);
      } else {
        let errorMessage = newEducation
          ? "Failed to create a new education."
          : "Failed to update education.";
        setError(errorMessage);
      }
      console.error(error);
    }

    if (newEducation) {
      axios
        .post(url, body, { withCredentials: true })
        .then((response) => {
          closePopup();
        })
        .catch(catchFunction)
        .finally(() => setLoading(false));
    } else {
      axios
        .patch(url, { id: education.id, ...body }, { withCredentials: true })
        .then((response) => {
          closePopup();
        })
        .catch(catchFunction)
        .finally(() => setLoading(false));
    }
  }

  return (
    <Container className={classes.container}>
      <Typography>{newEducation ? "New" : "Update"} Education</Typography>
      {error && <Alert severity={"error"}>{error}</Alert>}
      <form className={classes.form} onSubmit={submitEducationForm}>
        <Box className={classes.field}>
          <Typography>Degree</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="degree"
            label="Degree"
            name="degree"
            autoFocus
            required
            value={degree}
            onChange={handleChange}
          />
        </Box>
        <Box className={classes.field}>
          <Typography>Major</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="major"
            label="Major"
            name="major"
            required
            value={major}
            onChange={handleChange}
          />
        </Box>
        <Box className={classes.field}>
          <Typography>Graduation Date</Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy/MM/dd"
              margin="normal"
              id="dob"
              label="Graduation Date"
              name="dob"
              value={gradDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change graduation date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Box>
        <Box className={classes.field}>
          <Typography>Major</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="major"
            label="Major"
            name="major"
            required
            value={major}
            onChange={handleChange}
          />
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          id="submit"
          onClick={submitEducationForm}
        >
          {!loading ? "Save" : "Processing..."}
        </Button>
      </form>
    </Container>
  );
}

export default AddEducation;
