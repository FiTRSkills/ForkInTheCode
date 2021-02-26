import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import axios from "axios";

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
}));

function SkillSearchForm(props) {
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const classes = useStyles();

  function searchSkills() {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/skills/search", {
        withCredentials: true,
        zipCode: zipCode,
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
    if (zipCode.match("^\\d{5}$")) {
      searchSkills();
    } else {
      setError("Must be a 5-digit zip code");
    }
    event.preventDefault();
  }

  return (
    <Box className={classes.paper}>
      <Typography component="h1" variant="h5">
        Skill Search
      </Typography>
      <form className={classes.form} onSubmit={onSubmit}>
        {error && <Alert severity="error">{error}</Alert>}
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
