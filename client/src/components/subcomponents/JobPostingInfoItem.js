import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import JobPostingClassItem from "./JobPostingClassItem";

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
  /**
   * Get string of list of skills
   * @returns {string}
   */
  function getSkillsString() {
    let skillsString = "";
    skills.forEach((skill, index) => {
      if (index < skills.length - 1) {
        skillsString += skill.name + ", ";
      } else {
        skillsString += skill.name;
      }
    });
    return skillsString;
  }

  const classes = useStyles();

  return (
    <Box className={classes.infoItem}>
      <Typography variant={"h6"}>{title}</Typography>
      {isDescription && <Typography>{description}</Typography>}
      {isSkills && <Typography>{getSkillsString()}</Typography>}
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
