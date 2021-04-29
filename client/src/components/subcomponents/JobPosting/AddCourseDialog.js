import React, { useState } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import Skills from "../Shared/Skills";
import CourseSelectionPreview from "../Shared/CourseSelectionPreview";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  form: {
    minWidth: 480,
  },
  field: {
    marginTop: theme.spacing(2),
  },
  selectedCourses: {
    marginTop: theme.spacing(2),
    maxHeight: 300,
    overflowY: "auto",
  },
  results: {
    marginTop: theme.spacing(2),
    maxHeight: "40%",
    overflowY: "auto",
  },
  submit: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  body: {
    marginTop: theme.spacing(2),
  },
  closeButton: { position: "absolute", right: 0 },
  itemContainer: {
    backgroundColor: "#F6F6F6",
    padding: 20,
    borderRadius: 6,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  button: {
    margin: 10,
    float: "right",
  },
  buttonContainer: {
    height: 0,
  },
}));

function AddCourseDialog({
  open,
  closeDialog,
  skills,
  courses,
  setCourses,
  user,
}) {
  /**
   * Local state
   */
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Style hook
   */
  const classes = useStyles();

  /**
   * Handle change of text fields to local states
   *
   * @param event
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "search":
        setSearch(event.target.value);
        break;
      default:
        break;
    }
  }

  function searchCourses() {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/courses/search", {
        params: {
          skills: JSON.stringify(skills),
          searchValue: search,
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          setResults(response.data);
          setError("");
        }
      })
      .catch((error) => {
        setError("Failed to search for courses");
        console.log(error);
      })
      .finally(() => setLoading(false));
  }

  function deleteCourse(courseId) {
    setCourses((courses) =>
      courses.filter((course) => course._id !== courseId)
    );
  }

  function addCourse(course) {
    if (courses && courses.length > 0) {
      setCourses([...courses, course]);
    } else {
      setCourses([course]);
    }
  }

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <Button
        className={classes.closeButton}
        onClick={closeDialog}
        id="closeAddCourses"
      >
        <CloseIcon />
      </Button>
      <Box className={classes.container}>
        <Box className={classes.field} alignItems={"center"}>
          <Typography variant={"h5"} align={"center"}>
            Add Courses
          </Typography>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        <Box className={classes.field}>
          <Typography>Skills in Job Posting:</Typography>
          <Skills skills={skills} editMode={false} user={user.type} />
        </Box>
        <Box className={classes.selectedCourses}>
          <Typography>Selected Courses:</Typography>
          <CourseSelectionPreview
            courses={courses}
            deleteCourse={deleteCourse}
          />
        </Box>
        <form className={classes.form}>
          <Box className={classes.field}>
            <Typography>Course Search:</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="search"
              name="search"
              autoFocus
              required
              value={search}
              onChange={handleChange}
            />
          </Box>
          <Button
            type="button"
            onClick={searchCourses}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            id="searchCourses"
            disabled={loading}
          >
            {!loading ? "Search Courses" : "Processing..."}
          </Button>
        </form>
        <Box className={classes.results}>
          {results.map((courseInfo) => (
            <Box
              className={classes.itemContainer}
              id={"courseId" + courseInfo._id}
              key={courseInfo._id}
            >
              <Box className={classes.header}>
                <Typography variant="h5" component="h2">
                  {courseInfo.name}
                </Typography>
              </Box>
              <Box className={classes.buttonContainer}>
                <Button
                  className={classes.button}
                  name="AddCourse"
                  id={"AddCourse" + courseInfo._id}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    addCourse(courseInfo);
                  }}
                >
                  Add
                </Button>
              </Box>
              <Box className={classes.body}>
                <Typography className={classes.item} component="div">
                  Organization:{" "}
                  <span className={classes.value}>
                    {courseInfo.organization.name}
                  </span>
                </Typography>
              </Box>
              <Box className={classes.body}>
                <Typography className={classes.item} component="div">
                  Description:{" "}
                  <span className={classes.value}>
                    {courseInfo.description}
                  </span>
                </Typography>
              </Box>
              <Box className={classes.body}>
                <Typography className={classes.item} component="div">
                  Skills to be Learned:{" "}
                  <span className={classes.value}>
                    {courseInfo.skills.map((skill) => skill.name).join(", ")}
                  </span>
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Dialog>
  );
}

function mapStateToProps(state) {
  return {
    user: state.authentication,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCourseDialog);
