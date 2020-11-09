import React, { useState } from "react";
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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  icon: { float: "right", paddingTop: "15px" },
}));

function ViewEditCareerItem({
  careerItem,
  handleChange,
  edit,
  deleteCareer,
  editCareer,
}) {
  const [jobTitle, setJobTitle] = useState(careerItem.jobTitle);
  const [startDate, setStartDate] = useState(careerItem.startDate);
  const [endDate, setEndDate] = useState(careerItem.endDate);
  const [organization, setOrganization] = useState(careerItem.organization);

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
    editCareer({
      id: careerItem.id,
      jobTitle,
      startDate,
      endDate,
      organization,
    });
  }

  return (
    <Box className={classes.container}>
      {edit && (
        <CloseIcon
          className={classes.icon}
          onClick={() => {
            deleteCareer(careerItem.id);
          }}
        />
      )}
      {edit && (
        <EditIcon
          className={classes.icon}
          onClick={() => {
            editCareer(careerItem.id);
          }}
        />
      )}
      <Box className={classes.field}>
        <Typography>Job title</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="jobTitle"
          name="jobTitle"
          autoFocus
          required
          disabled={!edit}
          value={jobTitle}
          onChange={handleChange}
          style={{ color: "rgba(0, 0, 0, 1)" }}
        />
      </Box>
      <Box className={classes.field}>
        <Typography>Start date</Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            inputVariant="outlined"
            variant="inline"
            format="yyyy/MM/dd"
            margin="normal"
            id="startDate"
            name="startDate"
            value={startDate}
            required
            fullWidth
            onChange={handleStartDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            disabled={!edit}
            style={{ color: "rgba(0, 0, 0, 1)" }}
          />
        </MuiPickersUtilsProvider>
      </Box>
      <Box className={classes.field}>
        <Typography>End date</Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            inputVariant="outlined"
            variant="inline"
            format="yyyy/MM/dd"
            margin="normal"
            id="endDate"
            name="endDate"
            value={endDate}
            required
            fullWidth
            onChange={handleEndDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            disabled={!edit}
            style={{ color: "rgba(0, 0, 0, 1)" }}
          />
        </MuiPickersUtilsProvider>
      </Box>
      <Box className={classes.field}>
        <Typography>Organization</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="organization"
          name="organization"
          autoFocus
          required
          disabled={!edit}
          value={organization}
          onChange={handleChange}
        />
      </Box>
      {edit && (
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={submitEdit}
        >
          Update Career
        </Button>
      )}
    </Box>
  );
}

export default ViewEditCareerItem;
