import React, { useEffect, useState } from "react";
import { changeCurrentPage } from "../../redux/actions";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import SkillSearchForm from "../subcomponents/SkillSearch/SkillSearchForm";

function SkillSearch(props) {
  const [, setSkills] = useState([]);

  useEffect(() => {
    props.changeCurrentPage("Skill Search");
  });

  return (
    <Container component="main" maxWidth="lg">
      <SkillSearchForm setSkills={setSkills} />
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
