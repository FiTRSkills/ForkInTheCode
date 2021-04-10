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
}));

function ViewJobPostings({ changeCurrentPage, user, history }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [jobPostingToDeleteId, setJobPostingToDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const classes = useStyles();

  const getJobPostings = () => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/jobPostings", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          setJobPostings(response.data);
        }
        setError(null);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setError(error.response.data);
          } else {
            setError("Failed to load Job Postings");
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Check for authenticated user, and if so change the nav title to Job Postings and getJobPostings, otherwise go to Login
   */
  useEffect(() => {
    async function asyncAuth() {
      let response = await checkAndUpdateAuth(user.type);
      if (response === undefined || response !== "EmployerProfile") {
        history.push("/Login");
      } else {
        changeCurrentPage("Job Postings");
        getJobPostings();
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

  const confirmDelete = (jobPostingItem) => {
    setJobPostingToDeleteId(jobPostingItem._id);
    setShowConfirmDialogue(true);
  };

  const submitDelete = () => {
    axios({
      method: "DELETE",
      url: process.env.REACT_APP_SERVER_URL + "/jobPosting",
      data: {
        _id: jobPostingToDeleteId,
      },
      withCredentials: true,
    })
      .then(() => {
        setSuccessMessage("A job posting has been successfully deleted!");
        clearSuccessMessageTimeout();
        getJobPostings();
      })
      .catch((error) => {
        if (error?.response?.message?.length > 0) {
          setError(error.response.data.message);
        } else {
          setError(
            "An error has occurred while trying to delete a job posting."
          );
        }
        console.error(error);
      })
      .finally(() => {
        setShowConfirmDialogue(false);
      });
  };

  const editJobPosting = (jobPostingItem) => {
    history.push("/JobPosting/Edit/" + jobPostingItem._id);
  };

  if (!authenticated) {
    return <Box />;
  }

  return (
    <Container className={classes.container}>
      <Link className={classes.addButtonLink} to="/JobPosting/Add">
        <Button
          className={classes.addButton}
          id="addJobPostingButton"
          variant="contained"
          color="primary"
        >
          Add Job Posting
        </Button>
      </Link>
      <Typography className={classes.title} variant="h5" component="h1">
        Manage Job Postings
      </Typography>
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
          {jobPostings.map((jobPostingItem) => (
            <Box
              className={classes.itemContainer}
              id={"jobPostingNumber" + jobPostingItem._id}
              key={jobPostingItem._id}
            >
              <Box className={classes.header}>
                <Typography variant="h5" component="h2">
                  {jobPostingItem.name}
                </Typography>
                <Box className={classes.buttonContainer}>
                  <Button
                    className={classes.button}
                    name="DeleteJobPosting"
                    id={"DeleteJobPosting" + jobPostingItem._id}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      confirmDelete(jobPostingItem);
                    }}
                  >
                    Delete
                  </Button>
                  <br />
                  <Button
                    className={classes.button}
                    name="EditJobPosting"
                    id={"EditJobPosting" + jobPostingItem._id}
                    variant="contained"
                    onClick={() => {
                      editJobPosting(jobPostingItem);
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
                    {jobPostingItem.organization.name}
                  </span>
                </Typography>
              </Box>
              {jobPostingItem.salary && (
                <Box className={classes.body}>
                  <Typography className={classes.item} component="div">
                    Salary:{" "}
                    <span className={classes.value}>
                      {jobPostingItem.salary}
                    </span>
                  </Typography>
                </Box>
              )}
              <Box className={classes.body}>
                <Typography className={classes.item} component="div">
                  Description:{" "}
                  <span className={classes.value}>
                    {jobPostingItem.description}
                  </span>
                </Typography>
              </Box>
              <Box className={classes.body}>
                <Typography className={classes.item} component="div">
                  Required Skills:{" "}
                  <span className={classes.value}>
                    {jobPostingItem.skills
                      .map((skill) => skill.name)
                      .join(", ")}
                  </span>
                </Typography>
              </Box>
            </Box>
          ))}
          <ConfirmationDialogue
            title="Are you sure you would like to delete this Job Posting?"
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewJobPostings);
