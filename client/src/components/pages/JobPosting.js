import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { changeCurrentPage } from "../../redux/actions";
import Container from "@material-ui/core/Container";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Alert } from "@material-ui/lab";
import Skills from "../subcomponents/Shared/Skills";
import JobPostingClassItem from "../subcomponents/JobPosting/JobPostingClassItem";

const useStyles = makeStyles((theme) => ({
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(6),
  },
  infoItem: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(3),
  },
}));

function JobPosting(props) {
  /**
   * Get the id of the job entry from search
   */
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobTitle, setJob] = useState("");
  const [pay, setPay] = useState("");
  const [description, setDescription] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [organization, setOrganization] = useState({});
  const [skills, setSkills] = useState([]);

  /**
   * Change the nav title to Job
   */
  useEffect(() => {
    props.changeCurrentPage("Job Post");
    // eslint-disable-next-line
  }, []);

  /**
   * Load the job posting on init
   */
  useEffect(() => {
    function loadJobPosting() {
      setLoading(true);
      axios
        .get(process.env.REACT_APP_SERVER_URL + "/jobs/jobposting?id=" + id, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data) {
            setOrganization(res.data.organization);
            setJob(res.data.jobTitle);
            setPay(res.data.pay);
            setDescription(res.data.description);
            setQualifications(res.data.qualifications);
            // TODO: Make sure this and other similar spots change to using skill id and other skill info vs just the name
            const skills = res.data.skills.map((skill) => {
              return skill.name;
            });
            setSkills(skills);
          }
          setError(null);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              setError(error.response.data);
            } else if (error.response.status === 404) {
              setError("Not found");
            }
          } else {
            setError("Failed to load Job Posting");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
    loadJobPosting();
  }, [id]);

  const classes = useStyles();

  return (
    <Container>
      {error && <Alert severity={"error"}>{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box className={classes.jobHeader}>
            <Typography variant={"h4"}>{jobTitle}</Typography>
            <Button name={"applyJob"} variant="contained" color="primary">
              Apply For Job
            </Button>
          </Box>
          <Box className={classes.infoItem}>
            <Typography variant={"h6"}>Company</Typography>
            <Typography>{organization.name}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography variant={"h6"}>Pay range</Typography>
            <Typography>{pay}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography variant={"h6"}>Requirements</Typography>
            <Typography>{qualifications}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography variant={"h6"}>Objectives</Typography>
            <Typography>{description}</Typography>
          </Box>
          <Box className={classes.infoItem}>
            <Typography variant={"h6"}>Skills Needed to Apply</Typography>
            <Skills skills={skills} />
          </Box>
          <Box className={classes.infoItem}>
            <Typography variant={"h6"}>
              Classes Available In Your Area
            </Typography>
            {[].map((classItem) => (
              <JobPostingClassItem
                college={classItem.college}
                skills={classItem.skills}
                title={classItem.name}
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

export default connect(mapStateToProps, mapDispatchToProps)(JobPosting);
