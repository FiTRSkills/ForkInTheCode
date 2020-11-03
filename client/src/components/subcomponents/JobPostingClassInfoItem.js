import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
  },
  title: {
    fontWeight: "bold",
  },
}));

function JobPostingClassInfoItem({ title, description }) {
  const classes = useStyles();

  return (
    <Grid container className={classes.row} spacing={1}>
      <Grid item>
        <Typography className={classes.title}>{title}:</Typography>
      </Grid>
      <Grid item>
        <Typography>{description}</Typography>
      </Grid>
    </Grid>
  );
}

export default JobPostingClassInfoItem;
