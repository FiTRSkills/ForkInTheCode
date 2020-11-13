import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import Skills from "../subcomponents/Skills";
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

function JobResult({ jobInfo }) {
  const classes = useStyles();
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
      <Skills skills = {jobInfo.skills.map(skill =>skill.name)} editMode = {false}/>
    </ButtonBase>
  );
}
export default JobResult;
