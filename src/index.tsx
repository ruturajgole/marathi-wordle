import React, { useState, useEffect, memo } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from "@material-ui/core/styles";
import { init, Message, State, subscriptions, update } from "./state";
import { AppView } from "./view";
import { program, Program } from 'futura';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#282c34",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    margin: "0",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
  },
  title: {
    margin: 0,
    color: "white",
    fontWeight: "bolder",
    textAlign: "center",
    fontSize: "xxx-large"
  },
}));

const App: React.FunctionComponent<AppProps> = () => {
  const [app, setApp] = useState(program<State, Message>({ init, update, subscriptions }));
  const [state, setState] = useState(app.state);
  const [pendingState, setPendingState] = useState<State>();
  const [ subscription, setSubscription] = useState();

  useEffect(() => {
    app.observe((state) => {
      if (pendingState === undefined) {
        requestAnimationFrame(() => {
          const state = pendingState;
          setPendingState(undefined);
          if (state !== undefined) {
            setState(state);
          }
        });
      }
      setState(state);
      setPendingState(state);
    })
  }, [state]);

  const dispatch = (message: Message) => {
    requestAnimationFrame(() => {
      app.update(message);
    });
  }

  const classes = useStyles();

  return (
    <div className="App">
      <header className={classes.root}>
        <p className={classes.title}>शब्दशोध</p>
        <AppView
          state={state}
          dispatch={dispatch} />
      </header>
    </div>
  );
}

/** Types */

interface AppProps {
}

interface AppState {
  readonly state: State;
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);