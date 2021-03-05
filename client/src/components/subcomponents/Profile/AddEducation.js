import React, { useState } from "react";
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
import Alert from "@material-ui/lab/Alert";
const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
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

function AddEducation({ closePopup, updateEducation }) {
  /**
   * Local state
   */
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [gradDate, setGradDate] = useState(null);
  const [organization, setOrganization] = useState("");
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
      case "degree":
        setDegree(event.target.value);
        break;
      case "major":
        setMajor(event.target.value);
        break;
      case "organization":
        setOrganization(event.target.value);
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

    setLoading(true);
    axios
      .post(
        process.env.REACT_APP_SERVER_URL + "/profile/education",
        {
          degree,
          major,
          gradDate,
          organization,
        },
        { withCredentials: true }
      )
      .then(() => {
        closePopup();
        updateEducation();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to create a new education.");
        }
        console.error(error);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Box className={classes.container}>
      <Typography className={classes.field} variant={"h5"}>
        New Education
      </Typography>
      {error && <Alert severity={"error"}>{error}</Alert>}
      <form className={classes.form} onSubmit={submitEducationForm}>
        <Box className={classes.field}>
          <Typography>Degree</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="addEducationDegree"
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
            id="addEducationMajor"
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
              fullWidth
              required
              inputVariant="outlined"
              variant="inline"
              format="yyyy/MM/dd"
              placeholder="YYYY/MM/DD"
              margin="normal"
              id="addEducationGradDate"
              name="gradDate"
              value={gradDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change graduation date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Box>
        <Box className={classes.field}>
          <Typography>School</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="addEducationOrganization"
            name="organization"
            required
            value={organization}
            onChange={handleChange}
          />
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          id="addEducationSubmit"
          disabled={loading}
        >
          {!loading ? "Save" : "Processing..."}
        </Button>
      </form>
    </Box>
  );
}

export default AddEducation;
