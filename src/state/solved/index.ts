import { Next } from "futura";

/** State */
export class Solved implements Solved.State {
  public static init = (): Next<Solved> => ({
    state: new Solved(),
    requests: [
    ],
  })

  public update(message: any): Next<Solved> {
    return { state: this };
  }

  public subscriptions = () => [
    
  ]

  private constructor(
  ) {}
}


/** Types */

export namespace Solved {
  export interface State {}
}


/** Messages */

interface Context {
  readonly instance: symbol;
}
