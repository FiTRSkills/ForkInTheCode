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
import ProfileEditEducationItem from "./ProfileEditEducationItem";
import ProfileEditCareerItem from "./ProfileEditCareerItem";

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

function ProfileEdit({ endEdit, ...props }) {
  /**
   * Local states for text fields
   */
  const [firstname, setFirstName] = useState(props.firstName);
  const [lastname, setLastName] = useState(props.lastName);
  const [dob, setDob] = useState(props.dob);
  const [education, setEducation] = useState(props.education);
  const [career, setCareer] = useState(props.career);
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
   * @param index - index position of education or career items in education or career array
   */
  function handleChange(event, index) {
    let copyEducation = [...education];
    let targetEducationItem = { ...copyEducation[index] };
    let copyCareer = [...career];
    let targetCareerItem = { ...copyCareer[index] };
    switch (event.target.name) {
      case "firstName":
        setFirstName(event.target.value);
        break;
      case "lastName":
        setLastName(event.target.value);
        break;
      case "degree":
        targetEducationItem.degree = event.target.value;
        copyEducation[index] = targetEducationItem;
        setEducation(copyEducation);
        break;
      case "major":
        targetEducationItem.major = event.target.value;
        copyEducation[index] = targetEducationItem;
        setEducation(copyEducation);
        break;
      case "institution":
        targetEducationItem.institution = event.target.value;
        copyEducation[index] = targetEducationItem;
        setEducation(copyEducation);
        break;
      case "jobTitle":
        targetCareerItem.jobTitle = event.target.value;
        copyCareer[index] = targetCareerItem;
        setCareer(copyCareer);
        break;
      case "startDate":
        targetCareerItem.startDate = event.target.value;
        copyCareer[index] = targetCareerItem;
        setCareer(copyCareer);
        break;
      case "endDate":
        targetCareerItem.endDate = event.target.value;
        copyCareer[index] = targetCareerItem;
        setCareer(copyCareer);
        break;
      case "organization":
        targetCareerItem.organization = event.target.value;
        copyCareer[index] = targetCareerItem;
        setCareer(copyCareer);
        break;
      default:
        break;
    }
  }

  const handleDateChange = (date) => {
    setDob(date);
  };

  /**
   * Add a new item to education or career
   *
   * @param type - education or career
   */
  function addItemToList(type) {
    switch (type) {
      case "education":
        const newEducationItem = {
          degree: "",
          major: "",
          organization: "",
        };
        let updatedEducation = education.concat(newEducationItem);
        setEducation(updatedEducation);
        break;
      case "career":
        const newCareerItem = {
          jobTitle: "",
          startDate: "",
          endDate: "",
          organization: "",
        };
        let updatedCareer = career.concat(newCareerItem);
        setCareer(updatedCareer);
        break;
      default:
        break;
    }
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
          education: [], // TODO: implemented later
          career: [], // TODO: implemented later
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

  return (
    <Container className={classes.container}>
      <Avatar className={classes.avatar} />
      <Link href={"/Profile"} onClick={cancelEdit}>
        Back to profile
      </Link>
      {error && <Alert severity={"error"}>{error}</Alert>}
      <form className={classes.form} onSubmit={saveProfile}>
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
            autoFocus
            required
            value={lastname}
            onChange={handleChange}
          />
        </Box>
        <Box className={classes.field}>
          <Typography>Date of Birth</Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
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
            />
          </MuiPickersUtilsProvider>
        </Box>
        <Typography className={classes.field} variant={"h5"}>
          Education
        </Typography>
        {education.map((educationItem, index) => (
          <ProfileEditEducationItem
            educationItem={educationItem}
            index={index}
            handleChange={handleChange}
          />
        ))}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => addItemToList("education")}
          className={classes.field}
        >
          Add education
        </Button>
        <Typography className={classes.field} variant={"h5"}>
          Career
        </Typography>
        {career.map((careerItem, index) => (
          <ProfileEditCareerItem
            careerItem={careerItem}
            index={index}
            handleChange={handleChange}
          />
        ))}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => addItemToList("career")}
          className={classes.field}
        >
          Add career
        </Button>
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
      </form>
    </Container>
  );
}

export default ProfileEdit;
