import React, { useEffect } from "react";
import { connect } from "react-redux";
import { changeCurrentPage } from "../../redux/actions";
import { Container, Tabs, Tab } from "@material-ui/core";
import SignUpTabPanel from "../subcomponents/SignUpTabPanel";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
const JOB_SEEKER_USERTYPE = "JobSeekerProfile";
const EMPLOYER_USERTYPE = "EmployerProfile";
const EDUCATOR_USERTYPE = "EducatorProfile";

/**
 * Sign up component
 *
 * @param props: injected props
 * @returns {JSX.Element}: render component
 * @constructor
 */
function SignUp(props) {
  /**
   * Local state: current sign-up tab panel index
   */
  const [currentTabIdx, setTabIdx] = React.useState(0);

  /**
   * Change sign-up tab panel index
   *
   * @param event: action event
   * @param newIdx: new tab panel index
   */
  const handleChange = (event, newIdx) => {
    setTabIdx(newIdx);
  };

  /**
   * Style sign up component
   *
   * @type {(props?: any) => ClassNameMap<"paper"|"form"|"submit"|"avatar">}
   */
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1),
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();

  /**
   * Update navigation bar title in Redux
   */
  useEffect(() => {
    if (props.user !== undefined && Object.keys(props.user).length > 0) {
      props.history.push("/Home");
    }
    props.changeCurrentPage("Sign Up");
  });

  /**
   * Render sign up component
   */
  return (
    <Container>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Tabs
          value={currentTabIdx}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Job Seeker" />
          <Tab label="Employer" />
          <Tab label="Educator" />
        </Tabs>
        <SignUpTabPanel
          usertype={JOB_SEEKER_USERTYPE}
          currentTabIdx={currentTabIdx}
          index={0}
          title={"Job Seeker"}
          form_id={"job_seeker_form"}
          {...props}
        />
        <SignUpTabPanel
          usertype={EMPLOYER_USERTYPE}
          currentTabIdx={currentTabIdx}
          index={1}
          title={"Employer"}
          form_id={"employer_form"}
          {...props}
        />
        <SignUpTabPanel
          usertype={EDUCATOR_USERTYPE}
          currentTabIdx={currentTabIdx}
          index={2}
          title={"Educator"}
          form_id={"educator_form"}
          {...props}
        />
      </div>
    </Container>
  );
}

/**
 * Map Redux states to sign up component props
 *
 * @param state: Redux states
 * @returns {{user: (function(*=, *): (*))}}
 */
const mapStateToProps = (state) => {
  return {
    user: state.authentication,
  };
};

/**
 * Dispatch sign up component actions to Redux states
 *
 * @param dispatch: Redux dispatch
 * @returns {{changeCurrentPage: (function(*=): *)}}
 */
const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
