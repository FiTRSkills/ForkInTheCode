import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles, rgbToHex } from "@material-ui/core/styles";
import axios from "axios";
import { Alert } from "@material-ui/lab";
import ViewEditCareerItem from "./ViewEditCareerItem";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import AddEducation from "./AddEducation";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  icon: { float: "right", paddingTop: "5px" },
  careerPopupOverlay: {
    position: "fixed",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.6)",
  },
  careerPopupContent: {
    borderColor: "black",
    borderWidth: "2px",
    borderStyle: "solid",
    borderRadius: "15px",
    background: "white",
  },
}));

const url = process.env.REACT_APP_SERVER_URL + "/profile/career";

function CareerItemList({ careers, updateCareers, ...props }) {
  /**
   * Local states
   */
  const [individualCareer, setIndividualCareer] = useState({});
  const [showAddCareerPopup, setShowAddCareerPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(true);

  /**
   * Style hook
   */
  const classes = useStyles();

  function startAddCareer() {
    setIndividualCareer({
      title: "",
      startDate: "",
      endDate: Date.now(),
      organization: "",
    });
    setShowAddCareerPopup(true);
  }

  function submitAddCareer() {
    console.log("APPLE: submit the new career");
  }

  function closeAddCareer() {
    setShowAddCareerPopup(false);
  }

  function editCareer(editedCareer) {
    setLoading(true);
    axios
      .patch(url, editedCareer, { withCredentials: true })
      .catch((error) => {
        setError(error.response.data.message);
        console.error(error);
      })
      .finally(() => {
        updateCareers();
        setLoading(false);
      });
  }

  function deleteCareer(id) {
    setLoading(true);
    axios
      .delete(url, { id }, { withCredentials: true })
      .catch((error) => {
        setError(error.response.data.message);
        console.error(error);
      })
      .finally(() => {
        updateCareers();
        setLoading(false);
      });
  }

  function toggleEdit() {
    setEdit(!edit);
  }

  return (
    <Box className={classes.container}>
      {/*<Link href={"/Profile"} onClick={cancelEdit}>
        Back to profile
  </Link>*/}
      {edit && <EditIcon className={classes.icon} onClick={toggleEdit} />}
      <Typography className={classes.field} variant={"h5"}>
        Career{careers.length > 1 ? "s" : ""}
      </Typography>
      {error && <Alert severity={"error"}>{error}</Alert>}
      {careers.map((careerItem) => (
        <ViewEditCareerItem
          careerItem={careerItem}
          edit={edit}
          editCareer={editCareer}
          deleteCareer={deleteCareer}
        />
      ))}
      <Button
        variant="outlined"
        color="primary"
        onClick={startAddCareer}
        className={classes.field}
      >
        Add career
      </Button>
      <Box className={classes.careerPopupOverlay}>
        <Box className={classes.careerPopupContent}>
          <Button>
            <CloseIcon />
          </Button>
          {showAddCareerPopup && <AddEducation />}
        </Box>
      </Box>
    </Box>
  );
}

export default CareerItemList;
