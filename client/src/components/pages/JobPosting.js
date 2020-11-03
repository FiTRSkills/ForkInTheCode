import React, { useEffect } from "react";
import { connect } from "react-redux";
import { changeCurrentPage } from "../../redux/actions";
import Container from "@material-ui/core/Container";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import JobPostingInfoItem from "../subcomponents/JobPostingInfoItem";

const mockedPosting = {
  company: "Amazon",
  pay_range: "$99,172 to $128,920 per year",
  requirements:
    "This position is open until filled and resumes will be reviewed every two weeks. The first batch of applicants will " +
    "be reviewed on August 27, 2019.",
  objectives:
    "The IT Division is responsible for the planning, development and management of the IT systems and subsystems that " +
    "support DC Superior Court case flow, office automation, special programs and management operations. The incumbent " +
    "will serve as the specialist in planning, analyzing, designing, developing, and implementing software applications," +
    " primarily in the areas of custom system development, database development, web development, and systems integration " +
    "and interfacing.",
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

  /**
   * Change the nav title to Job
   */
  useEffect(() => {
    props.changeCurrentPage("Job");
  });

  const classes = useStyles();

  return (
    <Container>
      <Box className={classes.jobHeader}>
        <Typography variant={"h4"}>IT Specialist (APPSW)</Typography>
        <Button name={"applyJob"} variant="contained" color="primary">
          Apply Job
        </Button>
      </Box>
      <JobPostingInfoItem
        title={"Company"}
        description={mockedPosting.company}
      />
      <JobPostingInfoItem
        title={"Pay Range"}
        description={mockedPosting.pay_range}
      />
      <JobPostingInfoItem
        title={"Requirements"}
        description={mockedPosting.requirements}
      />
      <JobPostingInfoItem
        title={"Objectives"}
        description={mockedPosting.objectives}
      />
      <JobPostingInfoItem
        title={"Skills Needed to Apply"}
        skills={mockedPosting.skills}
        isSkills={true}
      />
      <JobPostingInfoItem
        title={"Classes Available In Your Area"}
        availableClasses={mockedClasses}
        isClasses={true}
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobPosting);
