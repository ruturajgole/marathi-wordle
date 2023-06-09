import Grid from "./grid";
import { Dispatch } from "futura";
import Keyboard from "./keyboard";
import { Message, State } from '../state';
import { Unsolved } from '../state/unsolved';
import React from "react";
import { EndModal } from "./end-modal";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  solvedContainer: {
    textAlign: "center",
    filter: "blur(2px)"
  },
  unsolvedContainer: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column"
  }
});

export const AppView: React.FunctionComponent<Props> = ({ state, dispatch }) => {
  const classes = useStyles();
  
  if(state instanceof Unsolved){
    return (
      <>
        <div className={classes.unsolvedContainer}>
          <Grid
            state={state}
            dispatch={dispatch} />
          <Keyboard
            grid={state.grid}
            dispatch={dispatch}
            alphabet={state.alphabet}/>
        </div>
      </>
    );
  }
  return <></>;
}

interface Props {
  state: State;
  dispatch: Dispatch<Message>;
}

export default AppView;
