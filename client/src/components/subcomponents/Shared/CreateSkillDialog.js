import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  form: {
    minWidth: 480,
  },
  field: {
    marginTop: theme.spacing(2),
  },
  submit: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  closeButton: { position: "absolute", right: 0 },
}));

function CreateSkillDialog({ open, closeDialog, skillName, onCreateSuccess }) {
  /**
   * Local state
   */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle(skillName);
  }, [skillName]);

  /**
   * Style hook
   */
  const classes = useStyles();

  /**
   * Handle change of text fields to local states
   *
   * @param event
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "skillTitle":
        setTitle(event.target.value);
        break;
      case "skillDescription":
        setDescription(event.target.value);
        break;
      default:
        break;
    }
  }

  function createSkill(event) {
    setLoading(true);
    axios
      .post(
        process.env.REACT_APP_SERVER_URL + "/skills/createSkill",
        {
          name: title,
          description: description,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === 200) {
          setTitle("");
          setDescription("");
          closeDialog();
          onCreateSuccess(response.data._id);
        }
      })
      .catch((error) => {
        setError("Failed to create skill");
        console.log(error);
      })
      .finally(() => setLoading(false));
    event.preventDefault();
  }

  return (
    <Dialog open={open}>
      <Button
        className={classes.closeButton}
        onClick={closeDialog}
        id="closeCreateSkill"
      >
        <CloseIcon />
      </Button>
      <Box className={classes.container}>
        <Box className={classes.field} alignItems={"center"}>
          <Typography variant={"h5"} align={"center"}>
            Create Skill
          </Typography>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        <form className={classes.form} onSubmit={createSkill}>
          <Box className={classes.field}>
            <Typography>Title</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="skillTitle"
              name="skillTitle"
              autoFocus
              required
              value={title}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>Description</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="skillDescription"
              name="skillDescription"
              required
              value={description}
              onChange={handleChange}
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            id="createSkillSubmit"
            disabled={loading}
          >
            {!loading ? "Create" : "Processing..."}
          </Button>
        </form>
      </Box>
    </Dialog>
  );
}

export default CreateSkillDialog;
