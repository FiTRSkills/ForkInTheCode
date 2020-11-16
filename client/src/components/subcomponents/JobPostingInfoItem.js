import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import JobPostingClassItem from "./JobPostingClassItem";
import Skills from "./Skills";

const useStyles = makeStyles((theme) => ({
  infoItem: {
    marginTop: theme.spacing(6),
  },
  footer: {
    marginBottom: theme.spacing(3),
  },
}));

function JobPostingInfoItem({
  title,
  description,
  skills,
  availableClasses,
  isDescription = true,
  isSkills = false,
  isClasses = false,
}) {
  const classes = useStyles();

  return (
    <Box className={classes.infoItem}>
      <Typography variant={"h6"}>{title}</Typography>
      {isDescription && <Typography>{description}</Typography>}
      {isSkills && <Skills skills={skills} />}
      {isClasses &&
        availableClasses.map((classItem) => (
          <JobPostingClassItem
            college={classItem.college}
            skills={classItem.skills}
          />
        ))}
      <Box className={classes.footer} />
    </Box>
  );
}

export default JobPostingInfoItem;
