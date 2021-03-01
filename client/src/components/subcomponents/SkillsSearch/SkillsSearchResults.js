import React from "react";
import { connect } from "react-redux";
import SkillResult from "./SkillResult";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    border: "darkgrey, 1px, solid",
    borderRadius: 5,
  },
}));

function SkillsSearchResults({ basicResults, user }) {
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [includeProfileSkills, setIncludeProfileSkills] = useState(false);
  const [usersSkills, setUsersSkills] = useState([]);
  const [loading, setLoading] = useState(false);
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
        }
      })
      .catch((error) => {
        console.error(error);
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
    setLoading(true)
    // TODO: Update call to array version when backend call is updated
    skillsToAdd.forEach((skill) => {
      await axios
        .post(
          process.env.REACT_APP_SERVER_URL + "/profile/skill",
          { skill },
          {
            withCredentials: true,
          }
        )
        .catch((error) => {
          if (error?.response?.status === 400) {
            reject(error.response.data);
          } else {
            reject("An error has occoured while trying to add a skill.");
          }
          console.error(error);
        });
    });
    updateUsersSkills();
    setLoading(false)
  };

  const classes = useStyles();

  return (
    <Box className={classes.paper} id="results">
      <Typography component="h1" variant="h5">
        Results
      </Typography>
      <Typography component="h2" variant="h5">
        Location {location} needs the following skills.
      </Typography>
      <Typography component="h2" variant="h5">
        Include Skills From Profile:
        <Switch
          checked={includeProfileSkills}
          onChange={toggleIncludeProfileSkills}
          name="includeProfileSkills"
          inputProps={{ "aria-label": "Include Profile Skills" }}
        />
      </Typography>
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
          {filteredResults.map((skill) => {
            return (
              <SkillResult
                skill={skill}
                toggleAddToProfile={toggleAddToProfile}
              />
            );
          })}
          <Button onClick={addSkillsToProfile}>Add Skills To Profile</Button>
        </Box>
      )}
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.authentication,
    allResults: state.skillsSearchResults.results,
  };
};

export default connect(mapStateToProps)(SkillsSearchResults);
