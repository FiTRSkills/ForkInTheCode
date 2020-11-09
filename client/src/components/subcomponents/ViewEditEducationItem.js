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

function ViewEditEducationItem({
  educationItem,
  edit,
  deleteEducation,
  editEducation,
}) {
  const [degree, setDegree] = useState(educationItem.degree);
  const [major, setMajor] = useState(educationItem.major);
  const [gradDate, setGradDate] = useState(educationItem.gradDate);
  const [organization, setOrganization] = useState(
    educationItem.organization.name
  );

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
    editEducation({
      id: educationItem.id,
      degree,
      major,
      gradDate,
      organization,
    });
  }

  return (
    <Box className={classes.container}>
      {edit && (
        <CloseIcon
          className={classes.icon}
          onClick={() => {
            deleteEducation(educationItem.id);
          }}
        />
      )}
      {edit && (
        <EditIcon
          className={classes.icon}
          onClick={() => {
            editEducation(educationItem.id);
          }}
        />
      )}
      <Box className={classes.field}>
        <Typography>Degree</Typography>
        <TextField
          variant={edit ? "outlined" : "standard"}
          margin="normal"
          fullWidth
          id="degree"
          name="degree"
          autoFocus
          required
          disabled={!edit}
          value={degree}
          onChange={handleChange}
          style={{ color: "rgba(0, 0, 0, 1)" }}
        />
      </Box>
      <Box className={classes.field}>
        <Typography>Major</Typography>
        <TextField
          variant={edit ? "outlined" : "standard"}
          margin="normal"
          fullWidth
          id="major"
          name="major"
          required
          disabled={!edit}
          value={major}
          onChange={handleChange}
          style={{ color: "rgba(0, 0, 0, 1)" }}
        />
      </Box>
      <Box className={classes.field}>
        <Typography>Grad date</Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            inputVariant={edit ? "outlined" : "standard"}
            variant="inline"
            format="yyyy/MM/dd"
            margin="normal"
            id="gradDate"
            name="gradDate"
            value={gradDate}
            required
            fullWidth
            onChange={handleGradDateChange}
            KeyboardButtonProps={{
              "aria-label": "change graduation date",
            }}
            disabled={!edit}
            style={{ color: "rgba(0, 0, 0, 1)" }}
          />
        </MuiPickersUtilsProvider>
      </Box>
      <Box className={classes.field}>
        <Typography>Organization</Typography>
        <TextField
          variant={edit ? "outlined" : "standard"}
          margin="normal"
          fullWidth
          id="organization"
          name="organization"
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
          Update Education
        </Button>
      )}
    </Box>
  );
}

export default ViewEditEducationItem;
