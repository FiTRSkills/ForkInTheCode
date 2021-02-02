import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles((theme) => ({
  dialogueTitle: { textAlign: "center" },
  dialogueActions: { justifyContent: "center" },
}));

function ConfirmationDialogue({ open, title, onCancel, onConfirm }) {
  const classes = useStyles();

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmationDialogTitle"
      open={open}
    >
      <DialogTitle
        className={classes.dialogueTitle}
        id="confirmationDialogTitle"
      >
        {title}
      </DialogTitle>
      <DialogActions className={classes.dialogueActions}>
        <Button
          id="confirmationCancel"
          onClick={onCancel}
          variant="contained"
          color="primary"
        >
          Cancel
        </Button>
        <Button
          autoFocus
          id="confirmationConfirm"
          onClick={onConfirm}
          variant="contained"
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialogue;
