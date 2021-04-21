import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import SkillResult from "./SkillResult";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import { storeSkills } from "../../../redux/actions";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(4),
  },
  alert: {
    width: "100%",
  },
  resultsContainer: {
    border: "darkgrey 1px solid",
    backgroundColor: "#F6F6F6",
    borderRadius: 5,
    padding: 15,
    width: "70%",
  },
  lineSpacing: {
    marginBottom: theme.spacing(1),
  },
  addSkillsButton: {
    width: "50%",
    marginLeft: "25%",
    marginRight: "25%",
    marginTop: 15,
  },
}));

function SkillsSearchResults({
  basicResults,
  user,
  location,
  storeSkills,
  history,
}) {
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [includeProfileSkills, setIncludeProfileSkills] = useState(false);
  const [usersSkills, setUsersSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skillsToAdd, setSkillsToAdd] = useState([]);
  let hadProfileError = false;
  let hadSkillError = false;

  /**
   * Whenever the given results change or the user's skills change update it to include if the skill is in the user's skills
   */
  useEffect(() => {
    setAllResults(
      basicResults.map((result) => {
        result.inProfile =
          usersSkills.find((skill) => skill._id === result._id) !== undefined;
        return result;
      })
    );
  }, [basicResults, usersSkills]);

  /**
   * Whenever the user changes update the stored info on the skills the user already has
   */
  useEffect(() => {
    if (user.type === "JobSeekerProfile") {
      setLoading(true);
      updateUsersSkills();
    }
    // eslint-disable-next-line
  }, [user]);

  /**
   * Whenever the overall results change or the toggle for including skills already in the profile changes update what skills are shown
   */
  useEffect(() => {
    setLoading(true);
    if (includeProfileSkills) {
      setFilteredResults(allResults);
    } else {
      setFilteredResults(allResults.filter((skill) => !skill.inProfile));
    }
    setLoading(false);
    // eslint-disable-next-line
  }, [includeProfileSkills, allResults]); // Note: usersSkills is not included here since allResults changes when usersSkills changes and having both here would just trigger this twice.

  // Updates the stored list of skills the user already has
  const updateUsersSkills = () => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/Profile", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          setUsersSkills(response.data.skills);
          if (hadProfileError) {
            setError(null);
            hadProfileError = false;
          }
        }
      })
      .catch((error) => {
        setError(error);
        hadProfileError = true;
      })
      .finally(() => setLoading(false));
  };

  const toggleIncludeProfileSkills = (event) => {
    setIncludeProfileSkills(event.target.checked);
  };

  const toggleAddToProfile = (skill) => {
    if (skillsToAdd.includes(skill)) {
      let index = skillsToAdd.indexOf(skill);
      skillsToAdd.splice(index, 1);
      setSkillsToAdd(skillsToAdd);
    } else {
      setSkillsToAdd([...skillsToAdd, skill]);
    }
  };

  const addSkillsToProfile = () => {
    if (skillsToAdd.length < 1) {
      return;
    }
    setLoading(true);
    axios
      .post(
        process.env.REACT_APP_SERVER_URL + "/profile/skill",
        { skills: skillsToAdd },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        if (hadSkillError) {
          setError(null);
          hadSkillError = false;
        }
      })
      .catch((error) => {
        if (error?.response?.status === 400) {
          setError(
            "An error has occoured while trying to add a skill. Some skills may have been added, please try again."
          );
        } else {
          setError("An error has occoured while trying to add a skill.");
        }
        hadSkillError = true;
        console.error(error);
      })
      .finally(() => {
        updateUsersSkills();
      });
    setLoading(false);
  };

  const addSkillsToJobSearch = () => {
    storeSkills(skillsToAdd);
    history.push("/JobSearch");
  };

  const classes = useStyles();

  return (
    <Box className={classes.paper} id="results">
      <Typography component="h1" variant="h5" className={classes.lineSpacing}>
        Results
      </Typography>
      {location && (
        <Typography
          component="p"
          variant="subtitle1"
          className={classes.lineSpacing}
        >
          Location {location} needs the following skills.
        </Typography>
      )}
      {user.type === "JobSeekerProfile" && (
        <Typography
          component="p"
          variant="subtitle1"
          className={classes.lineSpacing}
        >
          Include Skills From Profile:
          <Switch
            checked={includeProfileSkills}
            onChange={toggleIncludeProfileSkills}
            name="includeProfileSkills"
            inputProps={{ "aria-label": "Include Profile Skills" }}
            color="primary"
            id="includeProfileSkillsToggle"
          />
        </Typography>
      )}
      {error && <Alert severity={"error"}>{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box className={classes.resultsContainer}>
          <Grid container style={{ marginBottom: 10 }}>
            <Grid item xs={8}></Grid>
            <Grid item xs={2} style={{ textAlign: "center" }}>
              # Jobs
            </Grid>
            <Grid item xs={2}>
              Select
            </Grid>
          </Grid>
          {filteredResults.length > 0 ? (
            filteredResults.map((skill) => {
              return (
                <SkillResult
                  skill={skill}
                  toggleAddToProfile={toggleAddToProfile}
                  key={skill._id}
                />
              );
            })
          ) : (
            <Box style={{ textAlign: "center" }}>No Results Found</Box>
          )}
          {user.type === "JobSeekerProfile" ? (
            <Button
              onClick={addSkillsToProfile}
              className={classes.addSkillsButton}
              color="primary"
              variant="contained"
              disabled={skillsToAdd.length < 1}
              id="addSkillsToProfileButton"
            >
              Add Skills To Profile
            </Button>
          ) : (
            <Button
              onClick={addSkillsToJobSearch}
              className={classes.addSkillsButton}
              color="primary"
              variant="contained"
              disabled={skillsToAdd.length < 1}
              id="addSkillsToJobSearchButton"
            >
              Add Skills To Job Search
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.authentication,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeSkills: (content) => dispatch(storeSkills(content)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SkillsSearchResults);
