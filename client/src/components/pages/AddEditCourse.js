import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { changeCurrentPage } from "../../redux/actions";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Skills from "../subcomponents/Shared/Skills";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(6),
  },
  subContainer: {
    minWidth: 680,
  },
  field: {
    marginTop: theme.spacing(2),
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 1)",
    },
  },
  buttonGroup: {
    marginTop: theme.spacing(4),
  },
}));

function AddEditCourse(props) {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [moneyCost, setMoneyCost] = useState("");
  const [timeCost, setTimeCost] = useState("");
  const [period, setPeriod] = useState("");
  const [times, setTimes] = useState("");
  const [method, setMethod] = useState("");
  const [location, setLocation] = useState("");
  const [requiredEquipment, setRequiredEquipment] = useState("");
  const [contact, setContact] = useState("");
  const [skillObjects, setSkillObjects] = useState([]);
  const [skillStrs, setSkillStrs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { mode } = useParams();

  // Style hook
  const classes = useStyles();

  useEffect(() => {
    props.changeCurrentPage("Courses");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (mode === "Edit") {
      let object = {
        _id: "1",
        location: "Harvard",
        name: "Java 101",
        skills: [
          { description: "", name: "saad", _id: "6025b1e9f39a82004cff0fd4" },
        ],
        contact: "Jake Rossi: 567-019-2345",
        period: "3 Months",
        times: "Monday: 15:00 - 18:00",
        description: "Java class",
        moneyCost: "10000",
        timeCost: "03/02/2021 - 05/02/2022",
        requiredEquipment: "Computer",
      };
      if (object) {
        setId(object._id);
        setTitle(object.name);
        setDescription(object.description);
        setMoneyCost(object.moneyCost);
        setTimeCost(object.timeCost);
        setPeriod(object.period);
        setTimes(object.times);
        if (object.location === "Online") {
          setMethod("Online");
        } else {
          setMethod("In Person");
        }
        setLocation(object.location);
        setRequiredEquipment(object.requiredEquipment);
        setContact(object.contact);
        setSkillObjects(object.skills);
        setSkillStrs(object.skills.map((skill) => skill.name));
      }
    }
  }, [mode]);

  /**
   * Handle change of text fields to local states
   *
   * @param event
   */
  function handleChange(event) {
    switch (event.target.name) {
      case "title":
        setTitle(event.target.value);
        break;
      case "description":
        setDescription(event.target.value);
        break;
      case "moneyCost":
        setMoneyCost(event.target.value);
        break;
      case "timeCost":
        setTimeCost(event.target.value);
        break;
      case "period":
        setPeriod(event.target.value);
        break;
      case "times":
        setTimes(event.target.value);
        break;
      case "method":
        setMethod(event.target.value);
        if (event.target.value === "Online") {
          setLocation("Online");
        } else {
          setLocation("");
        }
        break;
      case "location":
        setLocation(event.target.value);
        break;
      case "requiredEquipment":
        setRequiredEquipment(event.target.value);
        break;
      case "contact":
        setContact(event.target.value);
        break;
      default:
        break;
    }
  }

  /**
   * Add or edit a course
   *
   * @param event
   */
  function onSubmit(event) {
    if (skillObjects.length === 0) {
      setError("Skills are required");
      setMessage(null);
    } else {
      setLoading(true);
      switch (mode) {
        case "Add":
          axios
            .post(
              process.env.REACT_APP_SERVER_URL + "/courses/course",
              {
                location: location,
                name: title,
                skills: skillObjects,
                contact: contact,
                period: period,
                times: times,
                description: description,
                moneyCost: moneyCost,
                timeCost: timeCost,
                requiredEquipment: requiredEquipment,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              if (response.status === 200) {
                setMessage(response.data);
                setError(null);
              }
            })
            .catch((error) => {
              if (error.response && error.response.status === 400) {
                if (error.response.data.errors) {
                  let errorMessage = "";
                  error.response.data.errors.forEach((errorItem) => {
                    errorMessage += errorItem.msg + ". ";
                  });
                  setError(errorMessage);
                } else {
                  setError(error.response.data);
                }
              } else {
                setError("Failed to add course");
              }
              setMessage(null);
              console.log(error);
            })
            .finally(() => {
              setLoading(false);
            });
          break;
        case "Edit":
          axios
            .patch(
              process.env.REACT_APP_SERVER_URL + "/courses/course",
              {
                id: id,
                location: location,
                name: title,
                skills: skillObjects,
                contact: contact,
                period: period,
                times: times,
                description: description,
                moneyCost: moneyCost,
                timeCost: timeCost,
                requiredEquipment: requiredEquipment,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              if (response.status === 200) {
                setMessage(response.data);
                setError(null);
              }
            })
            .catch((error) => {
              if (error.response && error.response.status === 400) {
                if (error.response.data.errors) {
                  let errorMessage = "";
                  error.response.data.errors.forEach((errorItem) => {
                    errorMessage += errorItem.msg + ". ";
                  });
                  setError(errorMessage);
                } else {
                  setError(error.response.data);
                }
              } else {
                setError("Failed to update course");
              }
              setMessage(null);
              console.log(error);
            })
            .finally(() => {
              setLoading(false);
            });
          break;
        default:
          break;
      }
    }
    event.preventDefault();
  }

  return (
    <Container className={classes.container}>
      <Box className={classes.subContainer}>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={onSubmit}>
          <Box className={classes.field}>
            <Typography variant={"h5"}>
              {mode === "Add" ? "Add Course" : "Edit Course"}
            </Typography>
          </Box>
          <Box className={classes.field}>
            <Typography>Title</Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="title"
              name="title"
              required
              value={title}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>Description - Optional</Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>Cost - Optional</Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="moneyCost"
              name="moneyCost"
              value={moneyCost}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>
              Start and End Date (Format: DD/MM/YYYY - DD/MM/YYYY) - Optional
            </Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="timeCost"
              name="timeCost"
              value={timeCost}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>Period - Optional</Typography>
            <Select
              native
              labelId="select-filled-label"
              id="period"
              name="period"
              variant="outlined"
              fullWidth
              value={period}
              onChange={handleChange}
              className={classes.field}
            >
              <option aria-label="None" value="" />
              <option value={"3 Months"}>3 Months</option>
              <option value={"6 Months"}>6 Months</option>
              <option value={"12 Months"}>12 Months</option>
            </Select>
          </Box>
          <Box className={classes.field}>
            <Typography>Times (Format: Day: Start - End) - Optional</Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="times"
              name="times"
              value={times}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>Method</Typography>
            <Select
              native
              labelId="select-filled-label"
              id="method"
              name="method"
              variant="outlined"
              fullWidth
              required
              value={method}
              onChange={handleChange}
              className={classes.field}
            >
              <option aria-label="None" value="" />
              <option value={"Online"}>Online</option>
              <option value={"In Person"}>In Person</option>
            </Select>
          </Box>
          {method === "In Person" && (
            <Box className={classes.field}>
              <Typography>Location</Typography>
              <TextField
                variant={"outlined"}
                margin="normal"
                fullWidth
                id="location"
                name="location"
                required
                value={location}
                onChange={handleChange}
              />
            </Box>
          )}
          <Box className={classes.field}>
            <Typography>Equipment - Optional</Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="requiredEquipment"
              name="requiredEquipment"
              value={requiredEquipment}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>Contact - Optional</Typography>
            <TextField
              variant={"outlined"}
              margin="normal"
              fullWidth
              id="contact"
              name="contact"
              value={contact}
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.field}>
            <Typography>Skills</Typography>
            <Skills
              skills={skillStrs}
              skillObjects={skillObjects}
              setSkillObjects={setSkillObjects}
              setSkills={setSkillStrs}
              editMode={true}
              user={props.user.type}
            />
          </Box>
          <Grid
            container
            direction={"row"}
            spacing={2}
            className={classes.buttonGroup}
          >
            <Grid item xs={3}>
              <Button
                variant={"outlined"}
                color={"primary"}
                fullWidth
                onClick={() => props.history.goBack()}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                color={"primary"}
                fullWidth
                type={"submit"}
                id="submit"
              >
                {loading ? "Processing..." : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    user: state.authentication,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeCurrentPage: (content) => dispatch(changeCurrentPage(content)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditCourse);
