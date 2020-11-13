import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  field: {
    marginTop: theme.spacing(2),
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 1)",
    },
  },
  container: {
    borderColor: "black",
    borderWidth: "2px",
    borderStyle: "solid",
    borderRadius: "15px",
    padding: "15px",
    paddingTop: "0px",
    marginTop: "10px",
    marginBottom: "10px",
  },
  icon: { float: "right", marginTop: "5px" },
}));

function ViewEditCareerItem({
  careerItem,
  allowEdit,
  deleteCareer,
  editCareer,
  number,
}) {
  const [jobTitle, setJobTitle] = useState(careerItem.jobTitle);
  const [startDate, setStartDate] = useState(careerItem.startDate);
  const [endDate, setEndDate] = useState(careerItem.endDate);
  const [organization, setOrganization] = useState(
    careerItem.organization.name
  );
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Whenever we swap between allowing editing and not make the individual items not in the edit state
  useEffect(() => {
    setEdit(false);
  }, [allowEdit]);

  const classes = useStyles();

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

  function handleStartDateChange(date) {
    setStartDate(date);
  }

  function handleEndDateChange(date) {
    setEndDate(date);
  }

  function submitEdit() {
    setLoading(true);
    editCareer({
      id: careerItem._id,
      jobTitle,
      startDate,
      endDate,
      organization,
    })
      .then(() => {
        setError(null);
        setEdit(false);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(setLoading(false));
  }

  function submitDelete() {
    setLoading(true);
    deleteCareer(careerItem._id)
      .then(() => {
        setError(null);
        setEdit(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function cancelEdit() {
    setJobTitle(careerItem.jobTitle);
    setStartDate(careerItem.startDate);
    setEndDate(careerItem.endDate);
    setOrganization(careerItem.organization.name);
  }

  function toggleEdit() {
    if (edit) {
      cancelEdit();
    }
    setEdit(!edit);
  }

  return (
    <Box key={number} className={classes.container} id={"career" + number}>
      {edit && allowEdit && (
        <Button
          name="deleteCareer"
          className={classes.icon}
          onClick={submitDelete}
        >
          <CloseIcon />
        </Button>
      )}
      {allowEdit && (
        <Button name="editCareer" className={classes.icon} onClick={toggleEdit}>
          <EditIcon />
        </Button>
      )}
      {error && <Alert severity={"error"}>{error}</Alert>}
      <Box className={classes.field}>
        <Typography>Job title</Typography>
        <TextField
          variant={edit && allowEdit ? "outlined" : "standard"}
          margin="normal"
          fullWidth
          name="jobTitle"
          autoFocus
          required
          disabled={!(edit && allowEdit)}
          value={jobTitle}
          onChange={handleChange}
        />
      </Box>
      <Box className={classes.field}>
        <Typography>Start date</Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            inputVariant={edit && allowEdit ? "outlined" : "standard"}
            variant="inline"
            format="yyyy/MM/dd"
            placeholder="YYYY/MM/DD"
            margin="normal"
            name="startDate"
            value={startDate}
            required
            fullWidth
            onChange={handleStartDateChange}
            KeyboardButtonProps={{
              "aria-label": "change start date",
            }}
            disabled={!(edit && allowEdit)}
          />
        </MuiPickersUtilsProvider>
      </Box>
      <Box className={classes.field}>
        <Typography>End date</Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            inputVariant={edit && allowEdit ? "outlined" : "standard"}
            variant="inline"
            format="yyyy/MM/dd"
            placeholder="YYYY/MM/DD"
            margin="normal"
            name="endDate"
            value={endDate}
            required
            fullWidth
            onChange={handleEndDateChange}
            KeyboardButtonProps={{
              "aria-label": "change end date",
            }}
            disabled={!(edit && allowEdit)}
          />
        </MuiPickersUtilsProvider>
      </Box>
      <Box className={classes.field}>
        <Typography>Organization</Typography>
        <TextField
          variant={edit && allowEdit ? "outlined" : "standard"}
          margin="normal"
          fullWidth
          name="organization"
          required
          disabled={!(edit && allowEdit)}
          value={organization}
          onChange={handleChange}
        />
      </Box>
      {edit && allowEdit && (
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={submitEdit}
          name="updateCareer"
        >
          {loading ? "Processing..." : "Update Career"}
        </Button>
      )}
    </Box>
  );
}

export default ViewEditCareerItem;
