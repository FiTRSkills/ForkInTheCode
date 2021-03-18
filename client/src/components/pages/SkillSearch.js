import React, { useEffect, useState } from "react";
import { changeCurrentPage } from "../../redux/actions";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import SkillSearchForm from "../subcomponents/SkillSearch/SkillSearchForm";
import SkillsSearchResults from "../subcomponents/SkillSearch/SkillsSearchResults";

function SkillSearch(props) {
  const [skillsResults, setSkills] = useState([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    props.changeCurrentPage("Skill Search");
  });

  return (
    <Container component="main" maxWidth="lg">
      <SkillSearchForm setSkills={setSkills} setLocation={setLocation} />
      {skillsResults.length > 0 && skillsResults.length > 0 && (
        <SkillsSearchResults
          basicResults={skillsResults}
          location={location}
          history={props.history}
        />
      )}
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SkillSearch);
