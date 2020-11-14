import React from "react";
import { connect } from "react-redux";
import JobResult from "../subcomponents/JobResult";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

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
}));

function Results({results}) {
  const classes = useStyles();
  return (
    <Box className={classes.paper} id="results">
      <Typography component="h1" variant="h5">
        Results
      </Typography>
      {results.map((jobInfo) => {
        return <JobResult jobInfo={jobInfo} />;
      })}
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {
    results: state.searchResults.results,
  };
};
export default connect(mapStateToProps)(Results);
