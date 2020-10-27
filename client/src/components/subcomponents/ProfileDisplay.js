import React from "react";
import { Avatar, Button, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
          <Typography variant={"h6"}>Last namt</Typography>
          <Typography>Appleseed</Typography>
        </Grid>
        <Grid item>
          <Grid item>
            <Typography variant={"h6"}>DOB</Typography>
            <Typography>01/05/1998</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant={"h6"}>Company</Typography>
          <Typography>RIT</Typography>
        </Grid>
        <Grid item>
          <Typography variant={"h6"}>Career</Typography>
          <Typography>Engineer</Typography>
        </Grid>
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
