import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { changeCurrentPage } from "../../redux/actions";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  skillHeading: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(6),
  },
  infoItem: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(3),
  },
  addButton: {
    float: "right",
  },
  container: {
    padding: 20,
  },
  addButtonLink: {
    color: "white",
    textDecoration: "none",
  },
}));

function ViewCourses(props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);

  const classes = useStyles();

  const getCourses = () => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/courses", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          setCourses(response.data);
        }
        setError(null);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setError(error.response.data);
          } else {
            setError("Failed to load Courses");
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Change the nav title to Courses and getCourses
   */
  useEffect(() => {
    props.changeCurrentPage("Courses");
    getCourses();
    // eslint-disable-next-line
  }, []);

  const deleteCourse = () => {};

  return (
    <Container className={classes.container}>
      <Link className={classes.addButtonLink} to="/AddCourse">
        <Button
          className={classes.addButton}
          id="addCourseButton"
          variant="contained"
          color="primary"
        >
          Add Course
        </Button>
      </Link>
      <Typography className={classes.field} variant={"h5"}>
        Manage Courses
      </Typography>
      {error && (
        <Alert severity={"error"} id="error">
          {error}
        </Alert>
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          {courses.map((courseItem) => (
            <Box
              className={classes.container}
              id={"courseNumber" + courseItem._id}
            >
              <Box className={classes.header}>
                <Typography variant={"h5"}>{courseItem.name}</Typography>
                <Button
                  name="DeleteCourse"
                  variant="contained"
                  color="primary"
                  onClick={deleteCourse(courseItem)}
                >
                  Delete
                </Button>
              </Box>
              <Box className={classes.body}>
                <Typography variant={"h6"}>Organization:</Typography>
                <Typography>{courseItem.Organization.name}</Typography>
              </Box>
              <Box className={classes.body}>
                <Typography variant={"h6"}>Location:</Typography>
                <Typography>{courseItem.location}</Typography>
              </Box>
              {courseItem.period && (
                <Box className={classes.body}>
                  <Typography variant={"h6"}>Period:</Typography>
                  <Typography>{courseItem.period}</Typography>
                </Box>
              )}
              {courseItem.times && (
                <Box className={classes.body}>
                  <Typography variant={"h6"}>Times:</Typography>
                  <Typography>{courseItem.times}</Typography>
                </Box>
              )}
              <Box className={classes.body}>
                <Typography variant={"h6"}>Skills Will Be Achieved</Typography>
                <Typography>
                  {courseItem.skills.map((skill) => skill.name).join(", ")}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewCourses);
