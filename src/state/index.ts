import { Next } from "futura";
import { Unsolved } from "./unsolved";
import { Solved } from "./solved";

export const init: () => Next<State> = Unsolved.init;

export const update = (state: State, message: Message): Next<State> =>
    state.update(message);

export const subscriptions = (state: State) =>
  state.subscriptions();

export type State
    = Unsolved
    | Solved;

export type Message
  = Unsolved.Message;