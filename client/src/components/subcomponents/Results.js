import React from 'react';
import { connect } from 'react-redux';
import JobResult from '../subcomponents/JobResult'
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(4)
  },
  alert:{
    width:"100%"
  }
}));

function Results(props) {
  const classes = useStyles();
  const {results} = props;
  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h5">
        Results
      </Typography>
      {results.map((jobInfo) => {
        return (
            <JobResult
              jobInfo={jobInfo}
            />
        );
      })}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    results: state.searchResults.results
  };
};
export default connect(mapStateToProps)(Results);

