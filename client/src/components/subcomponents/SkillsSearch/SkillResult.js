import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    textAlign: "left",
    width: "100%",
    border: "1px solid #3f51b5",
    borderRadius: "5px",
    padding: theme.spacing(2),
    "&:hover": {
      border: "2px solid #3f51b5",
    },
  },
  alert: {
    width: "100%",
  },
  title: {
    color: "#3f51b5",
  },
  smalltext: {
    fontSize: "20px",
    marginTop: theme.spacing(1),
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  boldText: {
    fontSize: "1.25rem",
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: "0.0075rem",
  },
}));

function SkillResult({ skill, toggleAddToProfile, inProfile }) {
  const [checked, setChecked] = useState(inProfile);
  const classes = useStyles();

  const handleToggle = (event) => {
    setChecked(event.target.checked);
    toggleAddToProfile(skill);
  };

  return (
    <Grid container>
      <Grid item xs={8}>
        <Link className={classes.title} to={"/SkillsDetails/" + skill._id}>
          {skill.name}
        </Link>
      </Grid>
      <Grid item xs={2}>
        {skill.numJobs}
      </Grid>
      <Grid item xs={2}>
        <Checkbox
          checked={checked}
          onChange={handleToggle}
          disabled={inProfile}
          inputProps={{
            "aria-label":
              "Select for add to profile, disabled is already in profile",
          }}
        />
      </Grid>
    </Grid>
  );
}
export default SkillResult;
