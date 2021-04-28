import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  course: {
    padding: theme.spacing(3),
    backgroundColor: "#F6F6F6",
    marginBottom: theme.spacing(1),
    borderRadius: 6,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  value: {
    fontWeight: "normal",
  },
}));

function CourseSelectionPreview({ courses, deleteCourse }) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {courses &&
        courses.map((course, index) => (
          <Box key={index} className={classes.course} id={"course" + index}>
            <Box>
              <Typography variant={"h5"}>{course.name}</Typography>
              <Typography className={classes.item} component="div">
                Skills will be achieved:{" "}
                <span className={classes.value}>
                  {course.skills.map((skill) => skill.name).join(", ")}
                </span>
              </Typography>
            </Box>
            <Button
              id={"#deleteCourseSelection"}
              onClick={() => deleteCourse(course._id)}
            >
              <CloseIcon />
            </Button>
          </Box>
        ))}
    </Box>
  );
}

export default CourseSelectionPreview;
