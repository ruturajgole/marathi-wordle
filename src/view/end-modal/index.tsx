import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  modal: {
    width: "25vw",
    height: "75vh",
    position: "absolute",
    backgroundColor: "white",
    color: "black",
    borderRadius: "30px",
    boxShadow: "0px 0px 20px 10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
});

export const EndModal: React.FunctionComponent = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.modal}>
      You won
    </div>
  );
}