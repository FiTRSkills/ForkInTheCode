import React, {useEffect} from "react";
import { Avatar, Button, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

const mockedEducation = [
  {
    degree: "B.S Software Engineering",
    major: "Software Engineering",
    institution: "RIT",
  },
  {
    degree: "B.S Software Engineering",
    major: "Software Engineering",
    institution: "RIT",
  },
];

const mockedCareer = [
  {
    jobTitle: "Student",
    startDate: moment().format("YYYY/MM/DD"),
    endDate: moment().format("YYYY/MM/DD"),
    organization: "RIT",
  },
  {
    jobTitle: "Student",
    startDate: moment().format("YYYY/MM/DD"),
    endDate: moment().format("YYYY/MM/DD"),
    organization: "RIT",
  },
];

const ProfileDisplay = (props) => {
  /**
   * Props
   */
  const { startEdit } = props;

  /**
   * Style hook
   */
  const classes = useStyles();

  return (
    <Container>
      <Grid
        container
        alignItems={"flex-end"}
        className={classes.section}
        spacing={6}
      >
        <Grid item>
          <Avatar className={classes.avatar} />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={startEdit}>
            Edit profile
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        className={classes.section}
        direction={"column"}
        spacing={3}
        justify={"center"}
      >
        <Grid item>
          <Typography variant={"h6"}>First name</Typography>
          <Typography>John</Typography>
        </Grid>
        <Grid item>
          <Typography variant={"h6"}>Last name</Typography>
          <Typography>Appleseed</Typography>
        </Grid>
        <Grid item>
          <Grid item>
            <Typography variant={"h6"}>Date of birth</Typography>
            <Typography>01/05/1998</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant={"h5"}>Education</Typography>
        </Grid>
        {mockedEducation.map((education) => (
          <Grid item container>
            <Grid item xl={4} lg={4} sm={4} xs={4}>
              <Typography variant={"h6"}>Degree</Typography>
              <Typography>{education.degree}</Typography>
            </Grid>
            <Grid item xl={4} lg={4} sm={4} xs={4}>
              <Typography variant={"h6"}>Major</Typography>
              <Typography>{education.major}</Typography>
            </Grid>
            <Grid item xl={4} lg={4} sm={4} xs={4}>
              <Typography variant={"h6"}>Institution</Typography>
              <Typography>{education.major}</Typography>
            </Grid>
          </Grid>
        ))}
        <Grid item>
          <Typography variant={"h5"}>Career</Typography>
        </Grid>
        {mockedCareer.map((career) => (
          <Grid item container>
            <Grid item xl={3} lg={3} sm={3} xs={3}>
              <Typography variant={"h6"}>Job title</Typography>
              <Typography>{career.jobTitle}</Typography>
            </Grid>
            <Grid item xl={3} lg={3} sm={3} xs={3}>
              <Typography variant={"h6"}>Start date</Typography>
              <Typography>{career.startDate}</Typography>
            </Grid>
            <Grid item xl={3} lg={3} sm={3} xs={3}>
              <Typography variant={"h6"}>End date</Typography>
              <Typography>{career.endDate}</Typography>
            </Grid>
            <Grid item xl={3} lg={3} sm={3} xs={3}>
              <Typography variant={"h6"}>Organization</Typography>
              <Typography>{career.organization}</Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 100,
    height: 100,
  },
  section: {
    marginTop: theme.spacing(6),
  },
}));

export default ProfileDisplay;
