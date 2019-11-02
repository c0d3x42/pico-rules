import { Transform, Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { Context } from "../context";
import { v4 } from "uuid";
import { debug as debugLogger } from "debug";
import { injectable } from "inversify";

import { InternalIdentifier } from "../internal-identifier";

const debug = debugLogger("Conditions");

export class ConditionCollection extends Array<Condition> {}

@injectable()
export abstract class Condition extends InternalIdentifier {
  @IsDefined()
  abstract op: string;

  public exec(context: Context): boolean {
    return true && context.logVisit(this.identifier);
  }

  constructor() {
    super();
  }
}

export interface Executable {
  exec(context: Context): boolean;
}
