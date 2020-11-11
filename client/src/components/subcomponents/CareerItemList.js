import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Alert } from "@material-ui/lab";
import ViewEditCareerItem from "./ViewEditCareerItem";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import AddCareer from "./AddCareer";

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: 680,
  },
  icon: { float: "right", paddingTop: "5px" },
  careerPopupOverlay: {
    position: "fixed",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.6)",
    zIndex: "9",
  },
  careerPopupContent: {
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

const url = process.env.REACT_APP_SERVER_URL + "/profile/career";

function CareerItemList() {
  /**
   * Local states
   */
  const [careers, setCareers] = useState([]);
  const [showAddCareerPopup, setShowAddCareerPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);

  // Whenever we swap between editing and not the profile is updated
  useEffect(() => {
    updateCareers();
  }, [edit]);

  /**
   * Style hook
   */
  const classes = useStyles();

  function updateCareers() {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/Profile", {
        withCredentials: true,
      })
      .then((response) => {
        setCareers(response.data.career);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to get updated Career list.");
        }
        console.error(error);
      });
  }

  function closeAddCareer() {
    setShowAddCareerPopup(false);
  }

  function editCareer(editedCareer) {
    return new Promise((resolve, reject) => {
      setLoading(true);
      axios
        .patch(url, editedCareer, { withCredentials: true })
        .then(() => {
          resolve();
          updateCareers();
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.data && error.response.message) {
            reject(error.response.data.message);
          } else {
            reject("An error has occoured while trying to edit a career.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }

  function deleteCareer(id) {
    return new Promise((resolve, reject) => {
      setLoading(true);
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
            reject("An error has occoured while trying to delete a career.");
          }
          console.error(error);
        })
        .finally(() => {
          updateCareers();
          setLoading(false);
        });
    });
  }

  function toggleEdit() {
    setEdit(!edit);
  }

  return (
    <Box className={classes.container}>
      <Button className={classes.icon} onClick={toggleEdit} id="editCareers">
        <EditIcon />
      </Button>
      <Typography className={classes.field} variant={"h5"}>
        Careers
      </Typography>
      {error && <Alert severity={"error"}>{error}</Alert>}
      {careers.map((careerItem, index) => (
        <ViewEditCareerItem
          key={index}
          number={index}
          careerItem={careerItem}
          allowEdit={edit}
          editCareer={editCareer}
          deleteCareer={deleteCareer}
        />
      ))}
      <Button
        id="addCareer"
        fullWidth
        variant="outlined"
        color="primary"
        onClick={() => {
          setShowAddCareerPopup(true);
        }}
        className={classes.field}
      >
        Add career
      </Button>
      {showAddCareerPopup && (
        <Box className={classes.careerPopupOverlay}>
          <Box className={classes.careerPopupContent}>
            <Button
              className={classes.closeButton}
              onClick={closeAddCareer}
              id="closeAddCareer"
            >
              <CloseIcon />
            </Button>
            <AddCareer
              closePopup={closeAddCareer}
              updateCareer={updateCareers}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CareerItemList;
