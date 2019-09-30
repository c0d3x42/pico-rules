import { IsString, IsNotEmpty, ValidateNested, IsArray, IsDefined, IsAlpha, Length } from "class-validator";
import { Type, Expose, Transform } from "class-transformer";
import { Rule } from "../rule";
import { Context } from "../context";

import { Action } from "./base";

import { debug as debugLogger } from "debug";
const debug = debugLogger("Actions");

export class ActionRule extends Action {
  @Expose()
  @Transform(value => value || "rule", { toClassOnly: true })
  act: string = "rule";

  @Expose()
  @ValidateNested()
  @Type(() => Rule)
  rule: Rule;

  constructor() {
    super();
    this.rule = new Rule();
  }

  public _exec(context: Context) {
    debug(`executing ActionRule `);
    this.rule.exec(context);
    return true;
  }
}
