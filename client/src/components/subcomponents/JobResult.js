import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import ButtonBase from "@material-ui/core/ButtonBase";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    textAlign: "left",
    width: "100%",
    border: "1px solid #3f51b5",
    borderRadius: "5px",
    padding: theme.spacing(2),
    "&:hover": {
      border: "2px solid #3f51b5",
    },
  },
  alert: {
    width: "100%",
  },
  title: {
    color: "#3f51b5",
  },
  smalltext: {
    fontSize: "20px",
    marginTop: theme.spacing(1),
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  boldText:{
    fontSize: "1.25rem",
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: "0.0075rem"
}}));

function JobResult(props) {
  const classes = useStyles();
  const { jobInfo } = props;
  return (
    <ButtonBase //Makes the whole div clickable
      className={classes.paper}
      component={RouterLink}
      to={"/JobPost/" + jobInfo._id}
    >
      <Link
        variant="h4"
        className={classes.title}
        to={"/JobPost/" + jobInfo._id}
      >
        {jobInfo.jobTitle}
      </Link>
      <Typography variant="h5">{jobInfo.organization.name}</Typography>
      <Typography className = {classes.boldText}>${jobInfo.pay}</Typography>
      <Typography  className={classes.smalltext}>
        {jobInfo.description}
      </Typography>
      <Typography className = {classes.boldText}>Skills:</Typography>
      <Typography className={classes.smalltext}>
        {jobInfo.skills.map((skill) => {
          return (
            <Chip
              color="primary"
              variant="outlined"
              label={skill.name}
              className={classes.chip}
            />
          );
        })}
      </Typography>
    </ButtonBase>
  );
}
export default JobResult;
