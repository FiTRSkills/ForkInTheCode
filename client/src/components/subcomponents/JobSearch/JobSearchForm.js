import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Skills from "../Shared/Skills";
import axios from "axios";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function JobSearchForm(props) {
  const [zipCode, setZipCode] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    function loadSkills() {
      if (props.user !== undefined && Object.keys(props.user).length > 0) {
        setLoading(true);
        axios
          .get(process.env.REACT_APP_SERVER_URL + "/Profile", {
            withCredentials: true,
          })
          .then((response) => {
            if (response.status === 200) {
              setSkills(response.data.skills.map((skill) => skill.name));
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => setLoading(false));
      }
    }
    loadSkills();
  }, [props.user]);

  useEffect(() => {
    if (props.sharedSkills && props.sharedSkills.length !== 0) {
      setSkills([...skills, ...props.sharedSkills.map((skill) => skill.name)]);
    }
  }, [props.sharedSkills]);

  function submit(event) {
    setLoading(true);
    props.apiCall(zipCode, skills).finally(() => {
      setLoading(false);
    });
    event.preventDefault();
  }

  const classes = useStyles();

  return (
    <Box className={classes.paper}>
      <Typography component="h1" variant="h5">
        Job Search
      </Typography>
      <form className={classes.form} onSubmit={submit}>
        {props.errorMessage !== "" && (
          <Alert severity="error">{props.errorMessage}</Alert>
        )}
        <Typography variant="h6">Zipcode</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required={true}
          fullWidth
          id="zipcode"
          label="zipcode"
          name="zipcode"
          autoComplete="zipcode"
          autoFocus
          value={zipCode}
          onChange={(event) => setZipCode(event.target.value)}
        />
        <Typography variant="h6">Skills</Typography>
        <Skills skills={skills} setSkills={setSkills} editMode={true} />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          id="submit"
          disabled={loading}
        >
          {loading ? "Processing..." : "Search"}
        </Button>
      </form>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.authentication,
    sharedSkills: state.storedSkills.skills,
  };
};

export default connect(mapStateToProps)(JobSearchForm);
