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
}));
function getSkills(skillsList) {
  let arr = [];
  for (let skill of skillsList) {
    arr.push(skill["name"]);
  }
  return arr;
}

function JobResult(props) {
  const classes = useStyles();
  const { jobInfo } = props;
  const skills = getSkills(jobInfo.skills);
  return (
    <ButtonBase
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
      <Typography variant="h6">${jobInfo.pay}</Typography>
      <Typography variant="h7" className={classes.smalltext}>
        {jobInfo.description}
      </Typography>
      <Typography variant="h6">Skills:</Typography>
      <Typography variant="h7" className={classes.smalltext}>
        {skills.map((skill) => {
          return (
            <Chip
              color="primary"
              variant="outlined"
              label={skill}
              className={classes.chip}
            />
          );
        })}
      </Typography>
    </ButtonBase>
  );
}
export default JobResult;
