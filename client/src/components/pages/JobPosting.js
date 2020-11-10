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

const mockedPosting = {
  organization: {
    name: "Amazon",
    location: "USA",
    contact: {
      address: "Silicon Valley",
      email: "amazon@gmail.com",
      phone: "0111222333",
    },
  },
  jobTitle: "Software Engineer",
  pay: "$12000",
  code: 14623,
  description:
    "The IT Division is responsible for the planning, development and management of the IT systems and subsystems that support DC Superior Court case flow, office automation, special programs and management operations. The incumbent will serve as the specialist in planning, analyzing, designing, developing, and implementing software applications, primarily in the areas of custom system development, database development, web development, and systems integration and interfacing.",
  qualifications:
    "This position is open until filled and resumes will be reviewed every two weeks. The first batch of applicants will be reviewed on August 27, 2019.",
  skills: [{ name: "Java" }, { name: "Python" }, { name: "SQL" }],
};

const mockedClasses = [
  { college: "RIT", skills: [{ name: "Python" }, { name: "SQL" }] },
  { college: "U of R", skills: [{ name: "Java" }, { name: "Ruby" }] },
];

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

  useEffect(() => {
    loadJobPosting();
  }, []);

  function loadJobPosting() {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/jobposting?id=" + id)
      .then((res) => {
        setOrganization(res.data.organization);
        setJob(res.data.jobTitle);
        setPay(res.data.pay);
        setCode(res.data.code);
        setDescription(res.data.description);
        setQualifications(res.data.qualifications);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else if (error.response.status === 404) {
          setError("Not found");
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
              Apply Job
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
