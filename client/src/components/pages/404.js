import React, { useEffect } from "react";
import { changeCurrentPage } from "../../redux/actions";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import { checkAndUpdateAuth } from "../../services/AuthService";

function Page404(props) {
  useEffect(() => {
    props.changeCurrentPage("404");
    checkAndUpdateAuth(props.user.type);
    // eslint-disable-next-line
  }, []);

  return (
    <Container component="main" maxWidth="lg">
      404: Page Not Found
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.authentication,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page404);
