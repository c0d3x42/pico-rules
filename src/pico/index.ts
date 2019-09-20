import * as moment from "moment";
import { Moment } from "moment";

import { Rule } from "./rule";
import { Type, Transform, Expose } from "class-transformer";
import { Context } from "./context";
export { Rule };

export class RuleCollection extends Array<Rule> {}

export class PicoEngine {
  @Expose({ name: "global" })
  globalRules: RuleCollection = [];

  @Expose({ name: "main" })
  @Type(() => Rule)
  mainRules: RuleCollection = [];

  /*
  @Type(() => Date)
  @Transform(value => moment.default(value), { toClassOnly: true })
  created_at!: Moment;

  @Type(() => Date)
  @Transform(value => moment.default(value), { toClassOnly: true })
  loaded_at: Moment = moment.default();
*/
  constructor() {
    //this.created_at = moment.default();
  }

  public exec(context: Context): void {
    this.mainRules.forEach(rule => rule.exec(context));
  }
}
