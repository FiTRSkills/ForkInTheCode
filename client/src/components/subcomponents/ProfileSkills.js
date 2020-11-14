import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Skills from "./Skills";

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: 680,
  },
  icon: { float: "right", paddingTop: "5px" },
}));

function ProfileSkills() {
  const [skills, setSkills] = useState([]);
  const [skillObjects, setSkillObjects] = useState([]); // Used to get id of skill to be able to delete
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Style hook
   */
  const classes = useStyles();

  useEffect(() => {
    updateSkills();
  }, [edit]);

  function updateSkills() {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/Profile", {
        withCredentials: true,
      })
      .then((response) => {
        setSkills(response.data.skills.map((skill) => skill.name));
        setSkillObjects(response.data.skills);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else {
          setError("Failed to get updated Skills list.");
        }
        console.error(error);
      });
  }

  function addSkill(skill) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          process.env.REACT_APP_SERVER_URL + "/profile/skill",
          { skill },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          updateSkills();
          resolve();
        })
        .catch((error) => {
          if (error.response.status === 400) {
            reject(error.response.data);
          } else {
            reject("An error has occoured while trying to add a skill.");
          }
          console.error(error);
        });
    });
  }

  function deleteSkill(skillDeleteString) {
    let skillDeleteId = skillObjects.find(
      (skillObject) => skillObject.name === skillDeleteString
    )._id;
    return new Promise((resolve, reject) => {
      axios({
        method: "DELETE",
        url: process.env.REACT_APP_SERVER_URL + "/profile/skill",
        data: {
          id: skillDeleteId,
        },
        withCredentials: true,
      })
        .then(() => {
          updateSkills();
          resolve();
        })
        .catch((error) => {
          if (error?.response?.data?.message?.length > 0) {
            reject(error.response.data.message);
          } else {
            reject("An error has occoured while trying to delete a skill.");
          }
          console.error(error);
        });
    });
  }

  function toggleEdit() {
    setEdit(!edit);
  }

  // Renderer
  return (
    <Box className={classes.container}>
      <Button className={classes.icon} onClick={toggleEdit} id="editCareers">
        <EditIcon />
      </Button>
      <Typography variant={"h5"}>Skills</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {!edit &&
        skills.length === 0 &&
        "No skills have been added yet, please click the edit icon to add more!"}
      <Skills
        skills={skills}
        setSkills={setSkills}
        editMode={edit}
        onAdd={addSkill}
        onDelete={deleteSkill}
      />
    </Box>
  );
}

export default ProfileSkills;
