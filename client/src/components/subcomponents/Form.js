import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";

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
    maxWidth: 480,
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Form({apiCall, buttonTitle, errorMessage, isEmployer, isEducator}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employer, setEmployer] = useState("");
  const [educator, setEducator] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(event) {
    setLoading(true);
    apiCall({email, password, employer, educator}).finally(() => {
      setLoading(false);
    });
    event.preventDefault();
  }

  function handleChange(event) {
    switch (event.target.name) {
      case "email":
        setEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      case "employer":
        setEmployer(event.target.value);
        break;
      case "educator":
        setEducator(event.target.value);
        break;
      default:
        break;
    }
  }

  const classes = useStyles();

  return (
    <form className={classes.form} onSubmit={submit}>
      {errorMessage !== "" && (
        <Alert severity="error">{errorMessage}</Alert>
      )}
      <TextField
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={handleChange}
      />
      {isEducator && (
        <TextField
          variant="outlined"
          margin="normal"
          required={true}
          fullWidth
          name="educator"
          label="Educator"
          id="educator"
          autoComplete="educator"
          value={educator}
          onChange={handleChange}
        />
      )}
      {isEmployer && (
        <TextField
          variant="outlined"
          margin="normal"
          required={true}
          fullWidth
          name="employer"
          label="Employer"
          id="employer"
          autoComplete="employer"
          value={employer}
          onChange={handleChange}
        />
      )}
      {/*<FormControlLabel*/}
      {/*control={<Checkbox value="remember" color="primary" />}*/}
      {/*label="Remember me"*/}
      {/*/> commenting out remember me*/}
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
        {!loading && buttonTitle}
      </Button>
    </form>
  );
}

export default Form;