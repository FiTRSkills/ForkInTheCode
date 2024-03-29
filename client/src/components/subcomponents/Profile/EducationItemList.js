import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import ViewEditEducationItem from "./ViewEditEducationItem";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import AddEducation from "./AddEducation";

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: 680,
  },
  icon: { float: "right", paddingTop: "5px" },
  educationPopupOverlay: {
    position: "fixed",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.6)",
    zIndex: "9",
  },
  educationPopupContent: {
    borderColor: "black",
    borderWidth: "2px",
    borderStyle: "solid",
    borderRadius: "15px",
    background: "white",
    width: "50%",
    height: "75%",
    margin: "0",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "10",
    overflow: "auto",
  },
  closeButton: { float: "right", paddingTop: "15px" },
}));

const url = process.env.REACT_APP_SERVER_URL + "/profile/education";

function EducationItemList() {
  /**
   * Local states
   */
  const [education, setEducation] = useState([]);
  const [showAddEducationPopup, setShowAddEducationPopup] = useState(false);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);

  // Whenever we swap between editing and not the profile is updated
  useEffect(() => {
    updateEducation();
  }, [edit]);

  /**
   * Style hook
   */
  const classes = useStyles();

  function updateEducation() {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/Profile", {
        withCredentials: true,
      })
      .then((response) => {
        setEducation(response.data.education);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to get updated Education list.");
        }
        console.error(error);
      });
  }

  function closeAddEducation() {
    setShowAddEducationPopup(false);
  }

  function editEducation(editedEducation) {
    return new Promise((resolve, reject) => {
      axios
        .patch(url, editedEducation, { withCredentials: true })
        .then(() => {
          resolve();
          updateEducation();
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.data && error.response.message) {
            reject(error.response.data.message);
          } else {
            reject("An error has occoured while trying to edit a education.");
          }
        });
    });
  }

  function deleteEducation(id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "DELETE",
        url,
        data: {
          id,
        },
        withCredentials: true,
      })
        .then(() => resolve())
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.message &&
            error.response.message.length > 0
          ) {
            reject(error.response.data.message);
          } else {
            reject("An error has occoured while trying to delete a education.");
          }
          console.error(error);
        })
        .finally(() => {
          updateEducation();
        });
    });
  }

  function toggleEdit() {
    setEdit(!edit);
  }

  return (
    <Box className={classes.container}>
      <Button className={classes.icon} onClick={toggleEdit} id="editEducations">
        <EditIcon />
      </Button>
      <Typography variant={"h5"}>Education</Typography>
      {error && <Alert severity={"error"}>{error}</Alert>}
      {education.map((educationItem, index) => (
        <ViewEditEducationItem
          key={index}
          number={index}
          educationItem={educationItem}
          allowEdit={edit}
          editEducation={editEducation}
          deleteEducation={deleteEducation}
        />
      ))}
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        onClick={() => {
          setShowAddEducationPopup(true);
        }}
        id="addEducation"
      >
        Add Education
      </Button>
      {showAddEducationPopup && (
        <Box className={classes.educationPopupOverlay}>
          <Box className={classes.educationPopupContent}>
            <Button
              className={classes.closeButton}
              onClick={closeAddEducation}
              id="closeAddEducation"
            >
              <CloseIcon />
            </Button>
            <AddEducation
              closePopup={closeAddEducation}
              updateEducation={updateEducation}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default EducationItemList;
