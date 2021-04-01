import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { changeCurrentPage } from "../../redux/actions";
import Container from "@material-ui/core/Container";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import CourseItem from "../subcomponents/Shared/CourseItem";

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
}));

function SkillDetails(props) {
  /**
   * Get the id of the skill from the url
   */
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [aliases, setAliases] = useState([]);
  const [courses, setCourses] = useState([]);

  /**
   * Change the nav title to Skill Details
   */
  useEffect(() => {
    props.changeCurrentPage("Skill Details");
    // eslint-disable-next-line
  }, []);

  /**
   * Load the skill details on start
   */
  useEffect(() => {
    function loadSkillDetails() {
      setLoading(true);
      axios
        .get(process.env.REACT_APP_SERVER_URL + "/skills/getSkill?id=" + id, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data) {
            setName(res.data.skill.name);
            setDescription(res.data.skill.description);
            setAliases(res.data.skill.alias);
            setCourses(res.data.courses);
          }
          setError(null);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              setError(error.response.data);
            } else if (error.response.status === 406) {
              setError("Invalid Skill Id");
            }
          } else {
            setError("Failed to load Skill Details");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
    loadSkillDetails();
  }, [id]);

  const classes = useStyles();

  return (
    <Container>
      {error && (
        <Alert severity={"error"} id="error">
          {error}
        </Alert>
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box className={classes.skillHeading}>
            <Typography variant={"h4"} id="name">
              {name}
            </Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography variant={"h6"}>Description</Typography>
            <Typography id="description">{description}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography variant={"h6"}>Aliases</Typography>
            <Typography id="aliases">
              {aliases && aliases.join(", ")}
            </Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography variant={"h6"}>
              Classes Associated With This Skill
            </Typography>
            {courses &&
              courses.map((courseItem) => (
                <CourseItem
                  id={courseItem._id}
                  description={courseItem.description}
                  skills={courseItem.skills}
                  title={courseItem.name}
                />
              ))}
          </Box>
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

export default connect(mapStateToProps, mapDispatchToProps)(SkillDetails);
