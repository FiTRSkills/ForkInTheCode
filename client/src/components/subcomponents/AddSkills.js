import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

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

export default function ChipsArray(props) {
  const { skills, setSkills } = props;
  const classes = useStyles();
  const [chipData, setChipData] = React.useState(skills);
  const [skillsList] = React.useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSkill, setCurrentSkill] = React.useState("");
  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
  };
  useEffect(() => {
    //TODO make API call to fetch skills list and update
    // setSkillsList([]);
    setSkills(chipData);
  }, [chipData, setSkills]);
  const addSkill = () => {
    if (chipData.indexOf(currentSkill) > -1) {
      setErrorMessage("Already in Skills");
    } else if (currentSkill !== "") {
      setErrorMessage("");
      setCurrentSkill("");
      setChipData((chipData) => [...chipData, currentSkill]);
    }
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      addSkill();
      e.preventDefault();
    }
  };

  return (
    <div>
      {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
      <div className={classes.root}>
        {chipData.map((skill, index) => {
          return (
            <li key={index}>
              <Chip
                color="primary"
                variant="outlined"
                label={skill}
                onDelete={handleDelete(skill)}
                className={classes.chip}
              />
            </li>
          );
        })}
      </div>
      <Autocomplete
        value={currentSkill}
        freeSolo
        onInputChange={(event, value) => setCurrentSkill(value)}
        options={skillsList.map((option) => option)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="New Skill"
            margin="normal"
            variant="outlined"
            onKeyPress={(e) => handleSubmit(e)}
          />
        )}
      />
      <Button onClick={addSkill} variant="outlined" color="primary" fullWidth>
        Add Skill
      </Button>
    </div>
  );
}
