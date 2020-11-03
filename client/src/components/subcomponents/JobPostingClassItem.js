import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import JobPostingClassInfoItem from "./JobPostingClassInfoItem";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#F6F6F6",
    padding: 20,
    borderRadius: 6,
    marginTop: theme.spacing(3),
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  body: {
    marginTop: theme.spacing(3),
  },
  row: {
    display: "flex",
  },
}));

function JobPostingClassItem({ college, skills }) {
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
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Typography variant={"h5"}>Special course of JAVA</Typography>
        <Button name={"readMore"} variant="contained" color="primary">
          Read More
        </Button>
      </Box>
      <Box className={classes.body}>
        <JobPostingClassInfoItem title={"College"} description={college} />
        <JobPostingClassInfoItem
          title={"Skills will be achieved"}
          description={getSkillsString()}
        />
      </Box>
    </Box>
  );
}

export default JobPostingClassItem;
