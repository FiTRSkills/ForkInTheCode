import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";

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


  useEffect(() => {
    fetchSkills();
    setCurrentSkill("");
  }, [editMode]);

  function fetchSkills(){
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/skills", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          setError(null);
          setAllSkills(response.data.map((skill) => skill.name));
        }
      })
      .catch((error) => {
        setError("No Skills Found");
      })
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
      setSkills((skills) => skills.filter((skill) => skill !== skillToDelete));
    }
  }

  function addSkill() {
    if (skills.indexOf(currentSkill) > -1) {
      setError("Already in Skills");
    }
    else if(allSkills.indexOf(currentSkill) === -1){
      setError("Skill does not exist")
    }
    else if(currentSkill !== "") {
      if (onAdd !== undefined) {
        setLoading(true);
        onAdd(currentSkill)
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
        setSkills([...skills, currentSkill]);
        setError(null);
        setCurrentSkill("");
      }
    }
  }

  function handleSubmit(event) {
    if (event.key === "Enter") {
      addSkill();
      event.preventDefault();
    }
  }

  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Box className={classes.root} id="skillList">
        {skills.map((skill, index) => {
          return (
            <li key={index}>
              <Chip
                color="primary"
                variant="outlined"
                label={skill}
                name={skill}
                onDelete={
                  editMode
                    ? () => {
                        deleteSkill(skill);
                      }
                    : undefined
                }
                className={classes.chip}
              />
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
            options={allSkills.map((option) => option)}
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
        </Box>
      )}
    </Box>
  );
}
export default Skills;
