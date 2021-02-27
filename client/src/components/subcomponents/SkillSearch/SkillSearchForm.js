import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  select: {
    backgroundColor: "#F4F0F0",
  },
  switch: {
    margin: theme.spacing(2),
  },
}));

const SEARCH_BY_ZIPCODE = "SEARCH_BY_ZIPCODE";
const SEARCH_BY_ORGANIZATION = "SEARCH_BY_ORGANIZATION";

function SkillSearchForm(props) {
  const [zipCode, setZipCode] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchBy, setSearchBy] = useState(SEARCH_BY_ZIPCODE);

  const classes = useStyles();

  function searchSkills() {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/skills/search", {
        withCredentials: true,
        zipCode: zipCode,
        organization: organization,
      })
      .then((response) => {
        if (response.status === 200) {
          props.setSkills(response.data);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to search for skills");
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function onSubmit(event) {
    switch (searchBy) {
      case SEARCH_BY_ZIPCODE:
        if (zipCode.match("^\\d{5}$")) {
          searchSkills();
        } else {
          setError("Must be a 5-digit zip code");
        }
        break;
      case SEARCH_BY_ORGANIZATION:
        searchSkills();
        break;
      default:
        return null;
    }
    event.preventDefault();
  }

  function switchTab(searchBy) {
    switch (searchBy) {
      case SEARCH_BY_ZIPCODE:
        setSearchBy(SEARCH_BY_ZIPCODE);
        setOrganization("");
        break;
      case SEARCH_BY_ORGANIZATION:
        setSearchBy(SEARCH_BY_ORGANIZATION);
        setZipCode("");
        break;
      default:
        return null;
    }
    setError(null);
  }

  return (
    <Box className={classes.paper}>
      <Typography component="h1" variant="h5">
        Skill Search
      </Typography>
      <Box className={classes.switch}>
        <Grid container justify={"center"}>
          <Button
            id={"zipcode-tab"}
            onClick={() => {
              switchTab(SEARCH_BY_ZIPCODE);
            }}
            color={searchBy === SEARCH_BY_ZIPCODE ? "primary" : "default"}
          >
            Zip Code
          </Button>
          <Button
            id={"organization-tab"}
            onClick={() => {
              switchTab(SEARCH_BY_ORGANIZATION);
            }}
            color={searchBy === SEARCH_BY_ORGANIZATION ? "primary" : "default"}
          >
            Organization
          </Button>
        </Grid>
      </Box>
      <form className={classes.form} onSubmit={onSubmit}>
        {error && <Alert severity="error">{error}</Alert>}
        {searchBy === SEARCH_BY_ZIPCODE && (
          <>
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
            <Typography variant="h6">Radius</Typography>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              variant={"outlined"}
              disabled
              fullWidth
              className={classes.select}
            />
          </>
        )}
        {searchBy === SEARCH_BY_ORGANIZATION && (
          <>
            <Typography variant="h6">Organization</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required={true}
              fullWidth
              id="organization"
              label="organization"
              name="organization"
              autoComplete="organization"
              autoFocus
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
            />
          </>
        )}
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

export default SkillSearchForm;
