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

function ViewEditEducationItem({
  educationItem,
  allowEdit,
  deleteEducation,
  editEducation,
  number,
}) {
  const [degree, setDegree] = useState(educationItem.degree);
  const [major, setMajor] = useState(educationItem.major);
  const [gradDate, setGradDate] = useState(educationItem.gradDate);
  const [organization, setOrganization] = useState(
    educationItem.organization.name
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

  function handleGradDateChange(date) {
    setGradDate(date);
  }

  function submitEdit() {
    setLoading(true);
    editEducation({
      id: educationItem._id,
      degree,
      major,
      gradDate,
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
    deleteEducation(educationItem._id)
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
    setDegree(educationItem.degree);
    setMajor(educationItem.major);
    setGradDate(educationItem.gradDate);
    setOrganization(educationItem.organization.name);
  }

  function toggleEdit() {
    if (edit) {
      cancelEdit();
    }
    setEdit(!edit);
  }

  return (
    <Box className={classes.container} id={"education" + number}>
      {edit && allowEdit && (
        <Button
          name="deleteEducation"
          className={classes.icon}
          onClick={submitDelete}
        >
          <CloseIcon />
        </Button>
      )}
      {allowEdit && (
        <Button
          name="editEducation"
          className={classes.icon}
          onClick={toggleEdit}
        >
          <EditIcon />
        </Button>
      )}
      {error && <Alert severity={"error"}>{error}</Alert>}
      <Box className={classes.field}>
        <Typography>Degree</Typography>
        <TextField
          variant={edit && allowEdit ? "outlined" : "standard"}
          margin="normal"
          fullWidth
          name="degree"
          autoFocus
          required
          disabled={!(edit && allowEdit)}
          value={degree}
          onChange={handleChange}
        />
      </Box>
      <Box className={classes.field}>
        <Typography>Major</Typography>
        <TextField
          variant={edit && allowEdit ? "outlined" : "standard"}
          margin="normal"
          fullWidth
          name="major"
          required
          disabled={!(edit && allowEdit)}
          value={major}
          onChange={handleChange}
        />
      </Box>
      <Box className={classes.field}>
        <Typography>Grad date</Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            inputVariant={edit && allowEdit ? "outlined" : "standard"}
            variant="inline"
            format="yyyy/MM/dd"
            placeholder="YYYY/MM/DD"
            margin="normal"
            name="gradDate"
            value={gradDate}
            required
            fullWidth
            onChange={handleGradDateChange}
            KeyboardButtonProps={{
              "aria-label": "change graduation date",
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
          name="updateEducation"
        >
          {loading ? "Processing..." : "Update Education"}
        </Button>
      )}
    </Box>
  );
}

export default ViewEditEducationItem;
