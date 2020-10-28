import React from "react";
import { Grid, Typography } from "@material-ui/core";

function ProfileDisplayEducationItem(props) {
  const { educationItem, index } = props;

  return (
    <Grid item container>
      <Grid item xl={4} lg={4} sm={4} xs={4}>
        <Typography variant={"h6"}>Degree</Typography>
        <Typography name={`degree${index}`}>{educationItem.degree}</Typography>
      </Grid>
      <Grid item xl={4} lg={4} sm={4} xs={4}>
        <Typography variant={"h6"}>Major</Typography>
        <Typography name={`major${index}`}>{educationItem.major}</Typography>
      </Grid>
      <Grid item xl={4} lg={4} sm={4} xs={4}>
        <Typography variant={"h6"}>Institution</Typography>
        <Typography name={`institution${index}`}>
          {educationItem.institution}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default ProfileDisplayEducationItem;
