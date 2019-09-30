import { Transform, Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { Context } from "../context";
import { v4 } from "uuid";
import { debug as debugLogger } from "debug";

const debug = debugLogger("Conditions");

export class ConditionCollection extends Array<Condition> {}

export abstract class Condition {
  @IsDefined()
  abstract op: string;

  abstract _exec(context: Context): boolean;
  // must implement
  public exec(context: Context): boolean {
    return this._exec(context) && context.logVisit(this.id);
  }

  @Expose()
  @Transform(value => value || v4())
  id: string = "";
}
