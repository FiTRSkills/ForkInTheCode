import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import axios from "axios";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

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

function SkillSearchForm(props) {
  const [zipCode, setZipCode] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const classes = useStyles();

  /**
   * Search skills based on zip code or organization
   */
  function searchSkills() {
    setLoading(true);
    axios
      .get(
        process.env.REACT_APP_SERVER_URL +
          "/skills/search?zipCode=" +
          zipCode +
          "&organization=" +
          organization,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          props.setSkills(response.data);
          props.setLocation(zipCode);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 406) {
          setError("No Skills Found");
        } else {
          setError("Failed to search for skills");
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  /**
   * Switch tab between zip code and organization
   *
   * @param event
   * @param newIndex: new tab index
   * @returns {null}
   */
  function switchTab(event, newIndex) {
    switch (newIndex) {
      case 0:
        setOrganization("");
        break;
      case 1:
        setZipCode("");
        break;
      default:
        return null;
    }
    setError(null);
    setTabIndex(newIndex);
  }

  /**
   * Submit the skill search form
   *
   * @param event
   */
  function onSubmit(event) {
    switch (tabIndex) {
      case 0:
        // Validate that zip code is a 5-digit
        if (zipCode.match("^\\d{5}$")) {
          searchSkills();
        } else {
          setError("Must be a 5-digit zip code");
        }
        break;
      case 1:
        searchSkills();
        break;
      default:
        return null;
    }
    event.preventDefault();
  }

  return (
    <Box className={classes.paper}>
      <Typography component="h1" variant="h5">
        Skill Search
      </Typography>
      <Box className={classes.switch}>
        <Tabs
          value={tabIndex}
          onChange={switchTab}
          aria-label="skill-search-by-tab-bar"
          indicatorColor="primary"
        >
          <Tab label="Zip Code" id="zipcode-tab" />
          <Tab label="Organization" id="organization-tab" />
        </Tabs>
      </Box>
      <form className={classes.form} onSubmit={onSubmit}>
        {error && <Alert severity="error">{error}</Alert>}
        {tabIndex === 0 && (
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
              labelId="select-filled-label"
              id="select-filled"
              variant={"outlined"}
              disabled
              fullWidth
              className={classes.select}
            />
          </>
        )}
        {tabIndex === 1 && (
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
