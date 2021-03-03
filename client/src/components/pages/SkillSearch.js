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
      <SkillsSearchResults basicResults={skillsResults} location={location} />
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
