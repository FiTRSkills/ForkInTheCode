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
import { Alert } from "@material-ui/lab";
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

function AddCareer({ closePopup, updateCareer }) {
  /**
   * Local state
   */
  const [jobTitle, setJobTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
      case "jobTitle":
        setJobTitle(event.target.value);
        break;
      case "organization":
        setOrganization(event.target.value);
        break;
      default:
        break;
    }
  }

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  /**
   * Submit form
   */
  function submitCareerForm(event) {
    event.preventDefault();

    setLoading(true);
    axios
      .post(
        process.env.REACT_APP_SERVER_URL + "/profile/career",
        {
          jobTitle,
          startDate,
          endDate,
          organization,
        },
        { withCredentials: true }
      )
      .then(() => {
        closePopup();
        updateCareer();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to create a new career.");
        }
        console.error(error);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Box className={classes.container}>
      <Typography className={classes.field} variant={"h5"}>
        New Career
      </Typography>
      {error && <Alert severity={"error"}>{error}</Alert>}
      <form className={classes.form} onSubmit={submitCareerForm}>
        <Box className={classes.field}>
          <Typography>Job Title</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="addCareerJobTitle"
            name="jobTitle"
            autoFocus
            required
            value={jobTitle}
            onChange={handleChange}
          />
        </Box>
        <Box className={classes.field}>
          <Typography>Start Date</Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              fullWidth
              inputVariant="outlined"
              variant="inline"
              format="yyyy/MM/dd"
              placeholder="YYYY/MM/DD"
              margin="normal"
              id="addCareerStartDate"
              name="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              KeyboardButtonProps={{
                "aria-label": "change start date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Box>
        <Box className={classes.field}>
          <Typography>End Date</Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              fullWidth
              inputVariant="outlined"
              variant="inline"
              format="yyyy/MM/dd"
              placeholder="YYYY/MM/DD"
              margin="normal"
              id="addCareerEndDate"
              name="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              KeyboardButtonProps={{
                "aria-label": "change end date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Box>
        <Box className={classes.field}>
          <Typography>Organization</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="addCareerOrganization"
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
          id="addCareerSubmit"
          onClick={submitCareerForm}
        >
          {!loading ? "Save" : "Processing..."}
        </Button>
      </form>
    </Box>
  );
}

export default AddCareer;
