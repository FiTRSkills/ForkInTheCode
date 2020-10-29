import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

function ProfileDisplayCareerItem(props) {
  /**
   * Props
   */
  const { careerItem, index } = props;

  return (
    <Grid item container>
      <Grid item xl={3} lg={3} sm={3} xs={3}>
        <Typography variant={"h6"}>Job title</Typography>
        <Typography name={`jobTitle${index}`}>{careerItem.jobTitle}</Typography>
      </Grid>
      <Grid item xl={3} lg={3} sm={3} xs={3}>
        <Typography variant={"h6"}>Start date</Typography>
        <Typography name={`startDate${index}`}>
          {careerItem.startDate}
        </Typography>
      </Grid>
      <Grid item xl={3} lg={3} sm={3} xs={3}>
        <Typography variant={"h6"}>End date</Typography>
        <Typography name={`endDate${index}`}>{careerItem.endDate}</Typography>
      </Grid>
      <Grid item xl={3} lg={3} sm={3} xs={3}>
        <Typography variant={"h6"}>Organization</Typography>
        <Typography name={`organization${index}`}>
          {careerItem.organization}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default ProfileDisplayCareerItem;
