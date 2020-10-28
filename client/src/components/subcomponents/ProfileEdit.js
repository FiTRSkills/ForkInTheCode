import React, { useState } from "react";
import {
  Container,
  Box,
  Avatar,
  TextField,
  Typography,
  Button,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const ProfileEdit = (props) => {
  /**
   * Local states for text fields
   */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(null);
  const [education, setEducation] = useState([]);
  const [career, setCareer] = useState([]);

  /**
   * Props
   */
  const { endEdit } = props;

  /**
   * Style hook
   */
  const classes = useStyles();

  /**
   * Handle change of text fields to local states
   *
   * @param event
   */
  const handleChange = (event, index) => {
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
      case "dob":
        setDob(event.target.value);
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
  };

  /**
   * Add a new item to education or career
   *
   * @param type
   */
  const addItemToList = (type) => {
    switch (type) {
      case "education":
        const newEducationItem = {
          degree: "",
          major: "",
          institution: "",
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
  };

  /**
   * Save updated profile
   */
  const saveProfile = () => {
    endEdit();
  };

  return (
    <Container className={classes.container}>
      <Avatar className={classes.avatar} />
      <Link href={"/Profile"} onClick={endEdit}>
        Back to profile
      </Link>
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
            value={firstName}
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
            value={lastName}
            onChange={handleChange}
          />
        </Box>
        <Box className={classes.field}>
          <Typography>DOB</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            id="dob"
            name="dob"
            type="date"
            fullWidth
            autoFocus
            required
            className={classes.field}
            value={dob}
            onChange={handleChange}
          />
        </Box>
        <Typography className={classes.field} variant={"h5"}>
          Education
        </Typography>
        {education.map((educationItem, index) => (
          <Box>
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
                value={educationItem.degree}
                onChange={(event) => handleChange(event, index)}
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
                autoFocus
                required
                value={educationItem.major}
                onChange={(event) => handleChange(event, index)}
              />
            </Box>
            <Box className={classes.field}>
              <Typography>Institution</Typography>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="institution"
                label="Institution"
                name="institution"
                autoFocus
                required
                value={educationItem.institution}
                onChange={(event) => handleChange(event, index)}
              />
            </Box>
          </Box>
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
          <Box>
            <Box className={classes.field}>
              <Typography>Job title</Typography>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="jobTitle"
                label="jobTitle"
                name="jobTitle"
                autoFocus
                required
                value={careerItem.jobTitle}
                onChange={(event) => handleChange(event, index)}
              />
            </Box>
            <Box className={classes.field}>
              <Typography>Start date</Typography>
              <TextField
                variant="outlined"
                margin="normal"
                id="startDate"
                name="startDate"
                type="date"
                fullWidth
                autoFocus
                required
                className={classes.field}
                value={careerItem.startDate}
                onChange={(event) => handleChange(event, index)}
              />
            </Box>
            <Box className={classes.field}>
              <Typography>End date</Typography>
              <TextField
                variant="outlined"
                margin="normal"
                id="endDate"
                name="endDate"
                type="date"
                fullWidth
                autoFocus
                required
                className={classes.field}
                value={careerItem.endDate}
                onChange={(event) => handleChange(event, index)}
              />
            </Box>
            <Box className={classes.field}>
              <Typography>Organization</Typography>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="organization"
                label="Organization"
                name="organization"
                autoFocus
                required
                value={careerItem.organization}
                onChange={(event) => handleChange(event, index)}
              />
            </Box>
          </Box>
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
        >
          Save
        </Button>
      </form>
    </Container>
  );
};

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

export default ProfileEdit;