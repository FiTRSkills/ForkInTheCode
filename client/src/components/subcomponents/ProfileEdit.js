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
  const [company, setCompany] = useState("");
  const [career, setCareer] = useState("");

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
  const handleChange = (event) => {
    switch (event.target.name) {
      case "firstName":
        setFirstName(event.target.value);
        break;
      case "lastName":
        setLastName(event.target.value);
        break;
      case "company":
        setCompany(event.target.value);
        break;
      case "career":
        setCareer(event.target.value);
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
            className={classes.field}
          />
        </Box>
        <Box className={classes.field}>
          <Typography>Company</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="company"
            label="Company"
            name="company"
            autoFocus
            value={company}
            onChange={handleChange}
          />
        </Box>
        <Box className={classes.field}>
          <Typography>Career</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="career"
            label="Career"
            name="career"
            autoFocus
            value={career}
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
