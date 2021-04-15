import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { changeCurrentPage, updateResults } from "../../redux/actions";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import JobSearchForm from "../subcomponents/JobSearch/JobSearchForm";
import Results from "../subcomponents/JobSearch/Results";
import axios from "axios";
import { checkAndUpdateAuth } from "../../services/AuthService";

function JobSearch(props) {
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    props.changeCurrentPage("Job Search");
    checkAndUpdateAuth(props.user.type);
    // eslint-disable-next-line
  }, []);

  function search(zipCode, skills) {
    return axios
      .post(
        process.env.REACT_APP_SERVER_URL + "/JobSearch",
        { zipCode, skills },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length === 0) {
            setErrorMessage("No Results");
          }else{
            setErrorMessage("");
          }
          props.updateResults(response.data);
        } else {
          setErrorMessage("Please Try Again");
        }
      })
      .catch((error) => {
        setErrorMessage("Please Try Again");
        console.log(error);
      });
  }

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <JobSearchForm errorMessage={errorMessage} apiCall={search} location={"state" in props.location? props.location.state: null}/>
      {props.results.length > 0 && <Results />}
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    results: state.searchResults.results,
    user: state.authentication,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
    updateResults: (content) => dispatch(updateResults(content)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JobSearch);
