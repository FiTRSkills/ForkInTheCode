import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { changeCurrentPage, updateResults } from "../../redux/actions";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import JobSearchForm from "../subcomponents/JobSearchForm";
import Results from "../subcomponents/Results";
import axios from "axios";

function JobSearch(props) {
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        props.changeCurrentPage("Job Search")
    });

    function search({zipcode, skills}) {
        return axios
          .post(
            process.env.REACT_APP_SERVER_URL + "/JobSearch",
            { zipcode, skills },
            {
                withCredentials: true,
            }
          )
          .then((response) => {
              if (response.status === 200) {
                  if (response.data.length === 0) {
                      setErrorMessage("No Results");
                  }
                  props.updateResults({ results: response.data});
              } else {
                  setErrorMessage("Please Try Again")
              }
          })
          .catch((error) => {
              setErrorMessage("Please Try Again");
              console.log(error);
          });  }

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
                <JobSearchForm errorMessage={errorMessage} apiCall={search}/>
            {props.results.length>0 &&
                <Results/>
            }
        </Container>
    );
}
const mapStateToProps = (state) => {
    return {
        user: state.authentication,
        results: state.searchResults.results
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
        updateResults:(content) => dispatch(updateResults(content))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(JobSearch);

