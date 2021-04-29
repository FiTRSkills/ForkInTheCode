import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  changeCurrentPage,
  setJobPostingSuccessMessage,
} from "../../redux/actions";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Skills from "../subcomponents/Shared/Skills";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import { useParams } from "react-router-dom";
import { checkAndUpdateAuth } from "../../services/AuthService";
import CourseSelectionPreview from "../subcomponents/Shared/CourseSelectionPreview";
import AddCourseDialog from "../subcomponents/JobPosting/AddCourseDialog";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(6),
  },
  subContainer: {
    minWidth: 680,
  },
  field: {
    marginTop: theme.spacing(2),
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 1)",
    },
  },
  buttonGroup: {
    marginTop: theme.spacing(4),
  },
  careerPopupOverlay: {
    position: "fixed",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.6)",
    zIndex: "9",
  },
  careerPopupContent: {
    borderColor: "black",
    borderWidth: "2px",
    borderStyle: "solid",
    borderRadius: "15px",
    background: "white",
    width: "50%",
    height: "75%",
    margin: "0",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "10",
    overflow: "auto",
  },
  errorMessage: {
    marginBottom: 4,
  },
}));

function AddEditJobPosting(props) {
  const [_id, setId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [salary, setSalary] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [benefits, setBenefits] = useState("");
  const [amountOfJobs, setAmountOfJobs] = useState("");
  const [jobTimeline, setJobTimeline] = useState("");
  const [method, setMethod] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState([]);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [showAddCareerPopup, setShowAddCareerPopup] = useState(false);
  const { mode, id } = useParams();

  // Style hook
  const classes = useStyles();

  useEffect(() => {
    async function asyncAuth() {
      let response = await checkAndUpdateAuth(props.user.type);
      if (response !== "EmployerProfile") {
        props.history.push("/Login");
      } else {
        props.changeCurrentPage("Job Postings");
        setAuthenticated(true);
        if (mode === "Edit") {
          updateForEdit();
        }
      }
    }
    asyncAuth();
    // eslint-disable-next-line
  }, []);

  const updateForEdit = () => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/jobPosting?_id=" + id, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          setId(response.data._id);
          setJobTitle(response.data.jobTitle);
          setDescription(response.data.description);
          setZipCode(response.data.zipCode);
          setSalary(response.data.salary);
          setResponsibilities(response.data.responsibilities);
          setBenefits(response.data.benefits);
          setJobTimeline(response.data.jobTimeline);
          setAmountOfJobs(response.data.amountOfJobs);
          if (response.data.location === "Online") {
            setMethod("Online");
          } else {
            setMethod("In Person");
          }
          setLocation(response.data.location);
          setSkills(response.data.skills);
          setCourses(response.data.courses);
        }
        setErrors([]);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response && error.response.status === 400) {
            if (error.response.data.errors) {
              let errorArr = [];
              error.response.data.errors.forEach((errorItem) => {
                errorArr.push(errorItem.msg);
              });
              setErrors([...errorArr]);
            } else {
              setErrors([error.response.data]);
            }
          } else {
            setErrors(["Failed to load Job Posting"]);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Handle change of text fields to local states
   *
   * @param event
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "jobTitle":
        setJobTitle(event.target.value);
        break;
      case "description":
        setDescription(event.target.value);
        break;
      case "zipCode":
        setZipCode(event.target.value);
        break;
      case "salary":
        setSalary(event.target.value);
        break;
      case "responsibilities":
        setResponsibilities(event.target.value);
        break;
      case "benefits":
        setBenefits(event.target.value);
        break;
      case "amountOfJobs":
        setAmountOfJobs(event.target.value);
        break;
      case "jobTimeline":
        setJobTimeline(event.target.value);
        break;
      case "method":
        setMethod(event.target.value);
        if (event.target.value === "Online") {
          setLocation("Online");
        } else {
          setLocation("");
        }
        break;
      case "location":
        setLocation(event.target.value);
        break;
      default:
        break;
    }
  }

  /**
   * Add or edit a course
   *
   * @param event
   */
  function onSubmit(event) {
    if (skills.length === 0) {
      setErrors(["Skills are required"]);
    } else {
      setLoading(true);
      switch (mode) {
        case "Add":
          axios
            .post(
              process.env.REACT_APP_SERVER_URL + "/jobPosting",
              {
                jobTimeline,
                jobTitle,
                skills,
                responsibilities,
                benefits,
                description,
                zipCode,
                amountOfJobs,
                location,
                salary,
                courses,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              if (response.status === 200) {
                props.setJobPostingSuccessMessage(
                  "Successfully Created Job Posting"
                );
                props.history.push("/JobPostings");
              }
            })
            .catch((error) => {
              if (error.response && error.response.status === 400) {
                if (error.response.data.errors) {
                  let errorArr = [];
                  error.response.data.errors.forEach((errorItem) => {
                    errorArr.push(errorItem.msg);
                  });
                  setErrors([...errorArr]);
                } else {
                  setErrors([error.response.data]);
                }
              } else {
                setErrors(["Failed to add job posting"]);
              }
              setLoading(false);
            });
          break;
        case "Edit":
          axios
            .patch(
              process.env.REACT_APP_SERVER_URL + "/jobPosting",
              {
                _id: _id,
                jobTimeline,
                jobTitle,
                skills,
                responsibilities,
                benefits,
                description,
                amountOfJobs,
                location,
                zipCode,
                salary,
                courses,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              if (response.status === 200) {
                props.setJobPostingSuccessMessage(
                  "Successfully Updated Job Posting"
                );
                props.history.push("/JobPostings");
              }
            })
            .catch((error) => {
              if (error.response && error.response.status === 400) {
                if (error.response.data.errors) {
                  let errorArr = [];
                  error.response.data.errors.forEach((errorItem) => {
                    errorArr.push(errorItem.msg);
                  });
                  setErrors([...errorArr]);
                } else {
                  setErrors([error.response.data]);
                }
              } else {
                setErrors(["Failed to update job posting"]);
              }
              setLoading(false);
            });

          break;
        default:
          break;
      }
    }
    event.preventDefault();
  }

  function deleteCourse(courseId) {
    setCourses((courses) =>
      courses.filter((course) => course._id !== courseId)
    );
  }

  function closeAddCareer() {
    setShowAddCareerPopup(false);
  }

  if (!authenticated) {
    return <Box />;
  }

  return (
    <Container className={classes.container}>
      <Box className={classes.subContainer}>
        {errors.map((error) => (
          <Alert severity="error" className={classes.errorMessage}>
            {error}
          </Alert>
        ))}
        <form onSubmit={onSubmit}>
          <Box className={classes.field}>
            <Typography variant={"h5"}>
              {mode === "Add" ? "Add Job Posting" : "Edit Job Posting"}
            </Typography>
          </Box>
          <Box className={classes.field}>
            <Typography>Job Title</Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="jobTitle"
              name="jobTitle"
              required
              value={jobTitle}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>Description</Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="description"
              name="description"
              required
              value={description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>Zip Code</Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="zipCode"
              name="zipCode"
              required
              value={zipCode}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>
              Salary - <em>Optional</em>
            </Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="salary"
              name="salary"
              value={salary}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>
              Responsibilities - <em>Optional</em>
            </Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="responsibilities"
              name="responsibilities"
              value={responsibilities}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>
              Benefits - <em>Optional</em>
            </Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="benefits"
              name="benefits"
              value={benefits}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>
              Amount of Jobs - <em>Optional</em>
            </Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="amountOfJobs"
              name="amountOfJobs"
              value={amountOfJobs}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>
              Job Timeline - <em>Optional</em>
            </Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="jobTimeline"
              name="jobTimeline"
              value={jobTimeline}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>Method</Typography>
            <Select
              native
              labelId="select-filled-label"
              id="method"
              name="method"
              variant="outlined"
              fullWidth
              required
              value={method}
              onChange={handleChange}
              className={classes.field}
            >
              <option value={"Online"}>Online</option>
              <option value={"In Person"}>In Person</option>
            </Select>
          </Box>
          {method === "In Person" && (
            <Box className={classes.field}>
              <Typography>Location</Typography>
              <TextField
                variant={"outlined"}
                margin="normal"
                fullWidth
                id="location"
                name="location"
                required
                value={location}
                onChange={handleChange}
              />
            </Box>
          )}
          <Box className={classes.field}>
            <Typography>Skills</Typography>
            <Skills
              skills={skills}
              setSkills={setSkills}
              editMode={true}
              user={props.user.type}
              allowCreate
            />
          </Box>
          <Box className={classes.field}>
            <Typography>
              Courses - <em>Optional</em>
              <CourseSelectionPreview
                courses={courses}
                deleteCourse={deleteCourse}
              />
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                id="addCourse"
                onClick={() => {
                  setShowAddCareerPopup(true);
                }}
              >
                Add Courses
              </Button>
            </Typography>
          </Box>
          <Grid
            container
            direction={"row"}
            spacing={2}
            className={classes.buttonGroup}
          >
            <Grid item xs={3}>
              <Button
                variant={"outlined"}
                color={"primary"}
                fullWidth
                onClick={() => props.history.goBack()}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                color={"primary"}
                fullWidth
                type={"submit"}
                id="submit"
              >
                {loading ? "Processing..." : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <AddCourseDialog
        open={showAddCareerPopup}
        closeDialog={closeAddCareer}
        skills={skills}
        courses={courses}
        setCourses={setCourses}
      />
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    user: state.authentication,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
    setJobPostingSuccessMessage: (content) =>
      dispatch(setJobPostingSuccessMessage(content)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditJobPosting);
