import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import { Tooltip } from "@material-ui/core";
import CreateSkillDialog from "./CreateSkillDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    listStyle: "none",
    margin: 0,
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function Skills({ skills, setSkills, editMode, onAdd, onDelete }) {
  const classes = useStyles();
  const [allSkills, setAllSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpenCreateSkillDialog, setOpenCreateSkillDialog] = useState(false);

  useEffect(() => {
    fetchSkills();
    setCurrentSkill("");
  }, [editMode]);

  function fetchSkills() {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/skills", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          setError(null);
          setAllSkills(response.data.map((skill) => skill));
        }
      })
      .catch((error) => {
        setError("No Skills Found");
      });
  }

  function deleteSkill(skillToDelete) {
    if (onDelete !== undefined) {
      setLoading(true);
      onDelete(skillToDelete)
        .then(() => {
          setError(null);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (setSkills !== undefined) {
        setSkills((skills) =>
          skills.filter((skill) => skill._id !== skillToDelete._id)
        );
      }
    }
  }

  function addSkill() {
    const skillToBeAdded = allSkills.find(
      (skill) => skill.name === currentSkill
    );
    // Check if skill exists in database
    if (skillToBeAdded !== null) {
      // Check if skills already added
      const existedSkill = skills.find(
        (skill) => skill.name === skillToBeAdded.name
      );
      if (existedSkill) {
        setError("Already in Skills");
      } else {
        if (onAdd !== undefined) {
          setLoading(true);
          onAdd(skillToBeAdded)
            .then(() => {
              setError(null);
              setCurrentSkill("");
            })
            .catch((error) => {
              setError(error);
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          if (setSkills !== undefined) {
            setSkills([...skills, skillToBeAdded]);
          }
          setError(null);
          setCurrentSkill("");
        }
      }
    } else {
      setError("Skill does not exist");
    }
  }

  function handleSubmit(event) {
    if (event.key === "Enter") {
      addSkill();
      event.preventDefault();
    }
  }

  function handleCreateSKillDialog() {
    setOpenCreateSkillDialog(!isOpenCreateSkillDialog);
  }

  function allowCreate() {
    return false;
  }

  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Box className={classes.root} id="skillList">
        {skills.map((skill, index) => {
          return (
            <li key={index}>
              <Tooltip title={skill.description}>
                <Chip
                  color="primary"
                  variant="outlined"
                  label={skill.name}
                  name={skill.name}
                  onDelete={
                    editMode
                      ? () => {
                          deleteSkill(skill);
                        }
                      : undefined
                  }
                  className={classes.chip}
                />
              </Tooltip>
            </li>
          );
        })}
      </Box>
      {editMode && (
        <Box>
          <Autocomplete
            inputValue={currentSkill}
            freeSolo
            onInputChange={(event, value) => setCurrentSkill(value)}
            options={allSkills.map((item) => item.name)}
            blurOnSelect={"mouse"}
            id="skillInput"
            renderInput={(params) => (
              <TextField
                {...params}
                label="New Skill"
                margin="normal"
                variant="outlined"
                onKeyPress={handleSubmit}
              />
            )}
          />
          {allowCreate() ? (
            <Button
              onClick={handleCreateSKillDialog}
              variant="outlined"
              color="primary"
              fullWidth
              id="createSkill"
              disabled={loading}
            >
              {loading ? "Processing..." : "Create Skill"}
            </Button>
          ) : (
            <Button
              onClick={addSkill}
              variant="outlined"
              color="primary"
              fullWidth
              id="addSkill"
              disabled={loading}
            >
              {loading ? "Processing..." : "Add Skill"}
            </Button>
          )}
          <CreateSkillDialog
            open={isOpenCreateSkillDialog}
            closeDialog={handleCreateSKillDialog}
            skillName={currentSkill}
            onCreateSuccess={fetchSkills}
          />
        </Box>
      )}
    </Box>
  );
}
export default Skills;
