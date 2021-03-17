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
import { checkAndUpdateAuth } from "../../services/AuthService";

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
  itemContainer: {
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
  title: {
    textAlign: "center",
  },
  value: {
    fontWeight: "normal",
  },
  item: {},
}));

function ViewCourses({ changeCurrentPage, user, history }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
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
    async function asyncAuth() {
      let response = await checkAndUpdateAuth(user.type);
      if (response === undefined || response.length < 1) {
        history.push("/Login");
      } else {
        changeCurrentPage("Courses");
        getCourses();
        setAuthenticated(true);
      }
    }
    asyncAuth();
    // eslint-disable-next-line
  }, []);

  const deleteCourse = () => {};

  if (!authenticated) {
    return <Box />;
  }

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
      <Typography className={classes.title} variant={"h5"}>
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
              className={classes.itemContainer}
              id={"courseNumber" + courseItem._id}
              key={courseItem._id}
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
                <Typography variant={"h6"} component="span">
                  Organization:{" "}
                  <Typography
                    variant={"h6"}
                    component="span"
                    className={classes.value}
                  >
                    {courseItem.organization.name}
                  </Typography>
                </Typography>
              </Box>
              <Box className={classes.body}>
                <Typography variant={"h6"} component="span">
                  Location:{" "}
                  <Typography
                    variant={"h6"}
                    component="span"
                    className={classes.value}
                  >
                    {courseItem.location}
                  </Typography>
                </Typography>
              </Box>
              {courseItem.period && (
                <Box className={classes.body}>
                  <Typography className={classes.item} component="span">
                    Period:{" "}
                    <Typography
                      variant={"h6"}
                      component="span"
                      className={classes.value}
                    >
                      {courseItem.period}
                    </Typography>
                  </Typography>
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
  return { user: state.authentication };
}

function mapDispatchToProps(dispatch) {
  return {
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewCourses);
