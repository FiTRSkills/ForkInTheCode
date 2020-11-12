import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { changeCurrentPage } from "../../redux/actions";
import Container from "@material-ui/core/Container";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import JobPostingInfoItem from "../subcomponents/JobPostingInfoItem";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(6),
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
  const [code, setCode] = useState("");

  /**
   * Change the nav title to Job
   */
  useEffect(() => {
    props.changeCurrentPage("Job Post");
  });

  /**
   * Load the job posting on init
   */
  useEffect(() => {
    loadJobPosting();
  }, []);

  /**
   * Load the job posting
   */
  function loadJobPosting() {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/jobs/jobposting?id=" + id, {
        withCredentials: true,
      })
      .then((res) => {
        setOrganization(res.data.organization);
        setJob(res.data.jobTitle);
        setPay(res.data.pay);
        setCode(res.data.code);
        setDescription(res.data.description);
        setQualifications(res.data.qualifications);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setError(error.response.data);
          } else if (error.response.status === 404) {
            setError("Not found");
          }
        } else {
          setError("Failed to load profile");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

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
          <JobPostingInfoItem
            title={"Company"}
            description={organization.name}
          />
          <JobPostingInfoItem title={"Pay Range"} description={pay} />
          <JobPostingInfoItem
            title={"Requirements"}
            description={qualifications}
          />
          <JobPostingInfoItem title={"Objectives"} description={description} />
          <JobPostingInfoItem
            title={"Skills Needed to Apply"}
            skills={[]}
            isSkills={true}
          />
          <JobPostingInfoItem
            title={"Classes Available In Your Area"}
            availableClasses={[]}
            isClasses={true}
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

export default connect(mapStateToProps, mapDispatchToProps)(JobPosting);
