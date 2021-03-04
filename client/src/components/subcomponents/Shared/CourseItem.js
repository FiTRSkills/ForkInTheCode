import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Skills from "./Skills";

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

function CourseItem({ description, skills, title, id }) {
  const classes = useStyles();

  return (
    <Box className={classes.container} id={"courseNumber" + id}>
      <Box className={classes.header}>
        <Typography variant={"h5"}>{title}</Typography>
        <Button name={"readMore"} variant="contained" color="primary">
          Read More
        </Button>
      </Box>
      <Box className={classes.body}>
        <Typography variant={"h6"}>{"Description"}</Typography>
        <Typography>{description}</Typography>
      </Box>
      <Box className={classes.body}>
        <Typography variant={"h6"}>{"Skills Will Be Achieved"}</Typography>
        <Skills skills={skills.map((skill) => skill.name)} />
      </Box>
    </Box>
  );
}

export default CourseItem;
