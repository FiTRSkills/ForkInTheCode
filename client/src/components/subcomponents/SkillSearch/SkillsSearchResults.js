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

function SkillsSearchResults({ basicResults, user, location }) {
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [includeProfileSkills, setIncludeProfileSkills] = useState(false);
  const [usersSkills, setUsersSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const skillsToAdd = [];

  /**
   * Whenever the given results change or the user's skills change update it to include if the skill is in the user's skills
   */
  useEffect(() => {
    setAllResults(
      basicResults.map((result) => {
        result.inProfile =
          usersSkills.find((skill) => skill.id === result.id) !== undefined;
      })
    );
  }, [basicResults, usersSkills]);

  /**
   * Whenever the user changes update the stored info on the skills the user already has
   */
  useEffect(() => {
    if (user !== undefined && Object.keys(user).length > 0) {
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
          setError(null);
        }
      })
      .catch((error) => {
        setError(error);
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
    } else {
      skillsToAdd.push(skill);
    }
  };

  const addSkillsToProfile = () => {
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
        setError(null);
      })
      .catch((error) => {
        if (error?.response?.status === 400) {
          //TODO: try again if a specific subset failed
          setError(error.response.data);
        } else {
          setError("An error has occoured while trying to add a skill.");
        }
        console.error(error);
      });
    updateUsersSkills();
    setLoading(false);
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
        />
      </Typography>
      {error && <Alert severity={"error"}>{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box className={classes.resultsContainer}>
          <Grid container>
            <Grid item xs={8}></Grid>
            <Grid item xs={2}>
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
                />
              );
            })
          ) : (
            <Box style={{ textAlign: "center" }}>No Results Found</Box>
          )}
          <Button
            onClick={addSkillsToProfile}
            className={classes.addSkillsButton}
            color="primary"
            variant="contained"
          >
            Add Skills To Profile
          </Button>
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

export default connect(mapStateToProps)(SkillsSearchResults);
