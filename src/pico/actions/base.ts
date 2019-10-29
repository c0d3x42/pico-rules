import { Context } from "../context";

import { debug as debugLogger } from "debug";
import { injectable } from "inversify";
import { InternalIdentifier } from "../internal-identifier";

const debug = debugLogger("Actions");

export class ActionCollection extends Array<Action> {
  constructor() {
    super();
    console.log("ctor action Collection");
  }
}

@injectable()
export abstract class Action extends InternalIdentifier {
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

  constructor() {
    super();
  }
}
