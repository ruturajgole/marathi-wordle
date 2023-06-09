import React from 'react';
import { Dispatch } from "futura";
import {makeStyles} from "@material-ui/core/styles";
import { Alphabet, Letter, Status } from '../../services/models/alphabet';
import { EnterLetter, RemoveLetter, Submit, Unsolved } from '../../state/unsolved';

const useStyles = makeStyles(() => ({
  keyboardButton: {
      fontSize: "large",
    },
  actionButtons: {
    display: "flex",
  },
  actionButton: {
    fontSize: "large",
    width: "100%",
    margin: 1,
  },
}));

const Keyboard: React.FunctionComponent<Props> = ({ alphabet, grid, dispatch }) => {
  const classes = useStyles();

  return (
    <div style={{width: "75vw", textAlign: "center"}}>
    {Object.values(alphabet).map((letters) =>
      <>
        {letters.map((letter: Letter) =>
          <button
            style={{
              backgroundColor: grid.slice().reverse().find((value) =>
                value.characterCode === letter.characterCode &&
                value.status !== Status.Unselected)?.status,
            }}
            disabled={grid.slice().reverse().find((value) => value.characterCode === letter.characterCode)?.status === Status.NotInWord}
            onClick={() => enterLetter(letter, dispatch)}
            key={letter.character}
            className={classes.keyboardButton}>
            {letter.character}
          </button>
        )}
        <br key={Math.random()}/>
      </>
    )}
    <div className={classes.actionButtons}>
      <button
        onClick={() => submit(dispatch)}
        className={classes.actionButton}>
        नोंदवा
      </button>
      <button
        onClick={() => removeLetter(dispatch)}
        className={classes.actionButton}>
        मिटवा
      </button>
    </div>
  </div>
  )
}

const enterLetter = (letter: Letter, dispatch: Dispatch<Unsolved.Message>) =>
  dispatch(new EnterLetter(letter));

const removeLetter = (dispatch: Dispatch<Unsolved.Message>) =>
  dispatch(new RemoveLetter());

const submit = (dispatch: Dispatch<Unsolved.Message>) =>
  dispatch(new Submit());

interface Props {
  readonly alphabet: Alphabet;
  readonly grid: ReadonlyArray<Letter>;
  readonly dispatch: Dispatch<Unsolved.Message>;
}

export default Keyboard;