import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  field: {
    marginTop: theme.spacing(2),
  },
}));

function ProfileEditCareerItem(props) {
  /**
   * Props
   */
  const { careerItem, index, handleChange } = props;

  const classes = useStyles();

  return (
    <Box>
      <Box className={classes.field}>
        <Typography>Job title</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="jobTitle"
          label="jobTitle"
          name="jobTitle"
          autoFocus
          required
          value={careerItem.jobTitle}
          onChange={(event) => handleChange(event, index)}
        />
      </Box>
      <Box className={classes.field}>
        <Typography>Start date</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          id="startDate"
          name="startDate"
          type="date"
          fullWidth
          autoFocus
          required
          className={classes.field}
          value={careerItem.startDate}
          onChange={(event) => handleChange(event, index)}
        />
      </Box>
      <Box className={classes.field}>
        <Typography>End date</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          id="endDate"
          name="endDate"
          type="date"
          fullWidth
          autoFocus
          required
          className={classes.field}
          value={careerItem.endDate}
          onChange={(event) => handleChange(event, index)}
        />
      </Box>
      <Box className={classes.field}>
        <Typography>Organization</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="organization"
          label="Organization"
          name="organization"
          autoFocus
          required
          value={careerItem.organization}
          onChange={(event) => handleChange(event, index)}
        />
      </Box>
    </Box>
  );
}

export default ProfileEditCareerItem;
