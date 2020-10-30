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

function ProfileEditEducationItem(props) {
  /**
   * Props
   */
  const { educationItem, index, handleChange } = props;

  const classes = useStyles();

  return (
    <Box>
      <Box className={classes.field}>
        <Typography>Degree</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="degree"
          label="Degree"
          name="degree"
          autoFocus
          required
          value={educationItem.degree}
          onChange={(event) => handleChange(event, index)}
        />
      </Box>
      <Box className={classes.field}>
        <Typography>Major</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="major"
          label="Major"
          name="major"
          autoFocus
          required
          value={educationItem.major}
          onChange={(event) => handleChange(event, index)}
        />
      </Box>
      <Box className={classes.field}>
        <Typography>Institution</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="institution"
          label="Institution"
          name="institution"
          autoFocus
          required
          value={educationItem.institution}
          onChange={(event) => handleChange(event, index)}
        />
      </Box>
    </Box>
  );
}

export default ProfileEditEducationItem;
