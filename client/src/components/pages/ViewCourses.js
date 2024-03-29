import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  changeCurrentPage,
  setCourseToEdit,
  setCourseSuccessMessage,
} from "../../redux/actions";
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
import ConfirmationDialogue from "../subcomponents/Shared/ConfirmationDialogue";

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
    marginTop: theme.spacing(2),
  },
  row: {
    display: "flex",
  },
  title: {
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
  },
  value: {
    fontWeight: "normal",
  },
  item: {
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  button: {
    margin: 10,
    float: "right",
  },
  buttonContainer: {
    height: 0,
  },
  titleContainer: {
    paddingBottom: theme.spacing(3),
  },
}));

function ViewCourses({
  changeCurrentPage,
  user,
  history,
  setCourseToEdit,
  setCourseSuccessMessage,
  incomingSuccessMessage,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseToDeleteId, setCourseToDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
   * Check for authenticated user, and if so change the nav title to Courses and getCourses, otherwise go to Login
   */
  useEffect(() => {
    async function asyncAuth() {
      let response = await checkAndUpdateAuth(user.type);
      if (response !== "EducatorProfile") {
        history.push("/Login");
      } else {
        changeCurrentPage("Courses");
        getCourses();
        setSuccessMessage(incomingSuccessMessage);
        if (incomingSuccessMessage !== "") {
          setCourseSuccessMessage("");
          clearSuccessMessageTimeout();
        }
        setAuthenticated(true);
      }
    }
    asyncAuth();
    // eslint-disable-next-line
  }, []);

  const clearSuccessMessageTimeout = () => {
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const confirmDelete = (courseItem) => {
    setCourseToDeleteId(courseItem._id);
    setShowConfirmDialogue(true);
  };

  const submitDelete = () => {
    axios({
      method: "DELETE",
      url: process.env.REACT_APP_SERVER_URL + "/courses/course",
      data: {
        _id: courseToDeleteId,
      },
      withCredentials: true,
    })
      .then(() => {
        setSuccessMessage("A course has been successfully deleted!");
        clearSuccessMessageTimeout();
        getCourses();
      })
      .catch((error) => {
        if (error?.response?.message?.length > 0) {
          setError(error.response.data.message);
        } else {
          setError("An error has occurred while trying to delete a course.");
        }
        console.error(error);
      })
      .finally(() => {
        setShowConfirmDialogue(false);
      });
  };

  const editCourse = (courseItem) => {
    setCourseToEdit(courseItem);
    history.push("/Course/Edit");
  };

  if (!authenticated) {
    return <Box />;
  }

  return (
    <Container className={classes.container}>
      <Box className={classes.titleContainer}>
        <Typography className={classes.title} variant="h5" component="h1">
          Manage Courses
        </Typography>
        <Link className={classes.addButtonLink} to="/Course/Add">
          <Button
            className={classes.addButton}
            id="addCourseButton"
            variant="contained"
            color="primary"
          >
            Add Course
          </Button>
        </Link>
      </Box>
      {error && (
        <Alert severity={"error"} id="error">
          {error}
        </Alert>
      )}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
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
                <Typography variant="h5" component="h2">
                  {courseItem.name}
                </Typography>
                <Box className={classes.buttonContainer}>
                  <Button
                    className={classes.button}
                    name="DeleteCourse"
                    id={"DeleteCourse" + courseItem._id}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      confirmDelete(courseItem);
                    }}
                  >
                    Delete
                  </Button>
                  <br />
                  <Button
                    className={classes.button}
                    name="EditCourse"
                    id={"EditCourse" + courseItem._id}
                    variant="contained"
                    onClick={() => {
                      editCourse(courseItem);
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>
              <Box className={classes.body}>
                <Typography className={classes.item} component="div">
                  Organization:{" "}
                  <span className={classes.value}>
                    {courseItem.organization.name}
                  </span>
                </Typography>
              </Box>
              <Box className={classes.body}>
                <Typography className={classes.item} component="div">
                  Location:{" "}
                  <span className={classes.value}>{courseItem.location}</span>
                </Typography>
              </Box>
              {courseItem.period && (
                <Box className={classes.body}>
                  <Typography className={classes.item} component="div">
                    Period:{" "}
                    <span className={classes.value}>{courseItem.period}</span>
                  </Typography>
                </Box>
              )}
              {courseItem.times && (
                <Box className={classes.body}>
                  <Typography className={classes.item} component="div">
                    Times:{" "}
                    <span className={classes.value}>{courseItem.times}</span>
                  </Typography>
                </Box>
              )}
              <Box className={classes.body}>
                <Typography className={classes.item} component="div">
                  Skills Will Be Achieved:{" "}
                  <span className={classes.value}>
                    {courseItem.skills.map((skill) => skill.name).join(", ")}
                  </span>
                </Typography>
              </Box>
            </Box>
          ))}
          <ConfirmationDialogue
            title="Are you sure you would like to delete this Course?"
            open={showConfirmDialogue}
            onCancel={() => {
              setShowConfirmDialogue(false);
            }}
            onConfirm={submitDelete}
          />
        </Box>
      )}
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    user: state.authentication,
    incomingSuccessMessage: state.courses.successMessage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
    setCourseToEdit: (content) => dispatch(setCourseToEdit(content)),
    setCourseSuccessMessage: (content) =>
      dispatch(setCourseSuccessMessage(content)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewCourses);
