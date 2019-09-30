import { Context } from "../context";

import { debug as debugLogger } from "debug";
const debug = debugLogger("Actions");

export class ActionCollection extends Array<Action> {}

export abstract class Action {
  abstract act: string;

  public abstract _exec(context: Context): boolean;
  exec(context: Context): boolean {
    if (this._exec) {
      return this._exec(context);
    }
    debug("Missing exec()");

    return false;
  }
  init(): void {}
}
