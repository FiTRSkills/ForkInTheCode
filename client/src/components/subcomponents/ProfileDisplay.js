import React from "react";
import {
  Avatar,
  Button,
  Container,
  Grid,
  Typography,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";

const ProfileDisplay = ({
  startEdit,
  firstName,
  lastName,
  dob,
  education,
  career,
  loading,
  error,
}) => {
  /**
   * Style hook
   */
  const classes = useStyles();

  return (
    <Container>
      {error && <Alert severity={"error"}>{error}</Alert>}
      <Box>
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
            <Typography name={"firstName"}>{firstName}</Typography>
          </Grid>
          <Grid item>
            <Typography variant={"h6"}>Last name</Typography>
            <Typography name={"lastName"}>{lastName}</Typography>
          </Grid>
          <Grid item>
            <Grid item>
              <Typography variant={"h6"}>Date of birth</Typography>
              <Typography name={"dob"}>{dob}</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant={"h5"}>Education</Typography>
          </Grid>
          {education.map((educationItem, index) => (
            <Grid item container>
              <Grid item xl={4} lg={4} sm={4} xs={4}>
                <Typography variant={"h6"}>Degree</Typography>
                <Typography name={`degree${index}`}>
                  {educationItem.degree}
                </Typography>
              </Grid>
              <Grid item xl={4} lg={4} sm={4} xs={4}>
                <Typography variant={"h6"}>Major</Typography>
                <Typography name={`major${index}`}>
                  {educationItem.major}
                </Typography>
              </Grid>
              <Grid item xl={4} lg={4} sm={4} xs={4}>
                <Typography variant={"h6"}>Institution</Typography>
                <Typography name={`institution${index}`}>
                  {educationItem.institution}
                </Typography>
              </Grid>
            </Grid>
          ))}
          <Grid item>
            <Typography variant={"h5"}>Career</Typography>
          </Grid>
          {career.map((careerItem, index) => (
            <Grid item container>
              <Grid item xl={3} lg={3} sm={3} xs={3}>
                <Typography variant={"h6"}>Job title</Typography>
                <Typography name={`jobTitle${index}`}>
                  {careerItem.jobTitle}
                </Typography>
              </Grid>
              <Grid item xl={3} lg={3} sm={3} xs={3}>
                <Typography variant={"h6"}>Start date</Typography>
                <Typography name={`startDate${index}`}>
                  {careerItem.startDate}
                </Typography>
              </Grid>
              <Grid item xl={3} lg={3} sm={3} xs={3}>
                <Typography variant={"h6"}>End date</Typography>
                <Typography name={`endDate${index}`}>
                  {careerItem.endDate}
                </Typography>
              </Grid>
              <Grid item xl={3} lg={3} sm={3} xs={3}>
                <Typography variant={"h6"}>Organization</Typography>
                <Typography name={`organization${index}`}>
                  {careerItem.organization}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
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
