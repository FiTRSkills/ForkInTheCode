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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpenCreateSkillDialog, setOpenCreateSkillDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [currentSkill, setCurrentSkill] = useState(null);

  useEffect(() => {
    fetchSkills();
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
          skills.filter((skill) => skill.name !== skillToDelete.name)
        );
      }
    }
  }

  function addSkill() {
    // Check if skill exists in database
    if (currentSkill !== null) {
      // Check if skills already added
      const existedSkill = skills.find(
        (skill) => skill.name === currentSkill.name
      );
      if (existedSkill) {
        setError("Already in Skills");
      } else {
        if (onAdd !== undefined) {
          setLoading(true);
          onAdd(currentSkill)
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
            setSkills([...skills, currentSkill]);
          }
          setError(null);
        }
      }
      setSearch("");
      setCurrentSkill(null);
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

  function onSelectSkill(event, value) {
    // If return a skill object then set current skill. If return a skill name, then check if skill name exists
    // in database, then set current skill if yes
    if (typeof value === "object" && value !== null) {
      setCurrentSkill(value);
    } else {
      const skillToBeAdded = allSkills.find((skill) => skill.name === value);
      if (skillToBeAdded) {
        setCurrentSkill(skillToBeAdded);
      }
    }
  }

  function onChangeInput(event, value) {
    // Check if every new input matches any skill names in database, if yes then set current skill, if not then remove
    // current skill
    setSearch(value);
    const skillToBeAdded = allSkills.find((skill) => skill.name === value);
    if (skillToBeAdded) {
      setCurrentSkill(skillToBeAdded);
    }
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
            inputValue={search}
            freeSolo
            onInputChange={onChangeInput}
            onChange={onSelectSkill}
            options={allSkills}
            blurOnSelect={"mouse"}
            getOptionLabel={(option) => option.name}
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
            skillName={search}
            onCreateSuccess={fetchSkills}
          />
        </Box>
      )}
    </Box>
  );
}
export default Skills;
