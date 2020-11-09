import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import AddSkills from "./AddSkills";
import axios from "axios";
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
    const [zipcode, setZipcode] = useState("");
    const [skills, setSkills] = useState(["yo","weas"]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        loadSkills();
    });
    function loadSkills(){
        if (props.user !== undefined && Object.keys(props.user).length > 0) {
            setLoading(true);
            axios
              .get(process.env.REACT_APP_SERVER_URL + "/Profile")
              .then((response) => {
                  setSkills(response.data.skills);
              })
              .catch((error) => {
                  console.error(error);
              })
              .finally(() => setLoading(false));
        }
    }
    function submit(event) {
        console.log(skills);
        setLoading(true);
        props.apiCall({zipcode, skills}).finally(() => {
            setLoading(false);
        });
        event.preventDefault();
    }

    function handleChange(event) {
        switch (event.target.name) {
            case "zipcode":
                setZipcode(event.target.value);
                break;
            case "skills":
                setSkills(event.target.value);
                break;
            default:
                break;
        }
    }

    const classes = useStyles();

    return (
      <div className={classes.paper}>
          <Typography component="h1" variant="h5">
              Job Search
          </Typography>
        <form className={classes.form} onSubmit={submit}>
            {props.errorMessage !== "" && (
                <Alert severity="error">{props.errorMessage}</Alert>
            )}
            <Typography variant="h6" >
                Zipcode
            </Typography>
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
                value={zipcode}
                onChange={handleChange}
            />
            <Typography variant="h6" >
                Skills
            </Typography>
            <AddSkills skills={skills} setSkills={setSkills} />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                id="submit"
                disabled={loading}
            >
                {loading && ("Processing...")}
                {!loading && "Search"}
            </Button>
        </form>
      </div>
    );
}
const mapStateToProps = (state) => {
    return {
        user: state.authentication,
    };
};
export default connect(mapStateToProps)(JobSearchForm);
