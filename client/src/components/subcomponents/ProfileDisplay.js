import React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import ProfileDisplayEducationItem from "./ProfileDisplayEducationItem";
import ProfileDisplayCareerItem from "./ProfileDisplayCareerItem";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 100,
    height: 100,
  },
  section: {
    marginTop: theme.spacing(6),
  },
}));

function ProfileDisplay({
  startEdit,
  firstName,
  lastName,
  dob,
  education,
  career,
  loading,
  error,
}) {
  /**
   * Style hook
   */
  const classes = useStyles();

  return (
    <Container>
      {error && <Alert severity={"error"}>{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
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
              <Button
                name={"editProfile"}
                variant="contained"
                color="primary"
                onClick={startEdit}
              >
                Edit Profile
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
              <Typography variant={"h6"}>First Name</Typography>
              <Typography name={"firstName"}>{firstName}</Typography>
            </Grid>
            <Grid item>
              <Typography variant={"h6"}>Last Name</Typography>
              <Typography name={"lastName"}>{lastName}</Typography>
            </Grid>
            <Grid item>
              <Grid item>
                <Typography variant={"h6"}>Date of Birth</Typography>
                <Typography name={"dob"}>
                  {dob !== null
                    ? [
                        dob.getFullYear(),
                        dob.getMonth() + 1,
                        dob.getDate(),
                      ].join("/")
                    : ""}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant={"h5"}>Education</Typography>
            </Grid>
            {education.map((educationItem, index) => (
              <ProfileDisplayEducationItem
                educationItem={educationItem}
                index={index}
              />
            ))}
            <Grid item>
              <Typography variant={"h5"}>Career</Typography>
            </Grid>
            {career.map((careerItem, index) => (
              <ProfileDisplayCareerItem careerItem={careerItem} index={index} />
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default ProfileDisplay;