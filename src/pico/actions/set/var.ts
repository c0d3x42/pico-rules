import { IsString, IsNotEmpty, ValidateNested, IsArray, IsDefined, IsAlpha, Length, IsIn } from "class-validator";
import { Type, Expose, Transform } from "class-transformer";
import { Context } from "../../context";

import { Action } from "../base";

import { debug as debugLogger } from "debug";
const debug = debugLogger("Actions");

const MAX_VAR_VALUE_LENGTH = 4096;

export class ActionSetVar extends Action {
  @IsString()
  @IsNotEmpty()
  @Expose()
  varName: string = "";

  @Expose()
  varValue: string = "";

  @Expose()
  @IsString()
  @IsIn(["append", "prepend", "replace"])
  @Transform(value => value || "replace")
  modifier: "append" | "prepend" | "replace" = "replace";

  act: string = "setvar";

  public _exec(context: Context) {
    debug(`executing ActionSetVar [${this.varName}] = [${this.varValue}]`);

    let valueToSet = "";

    if (this.modifier === "replace") {
      valueToSet = this.varValue;
    } else {
      const currentValue = context.tokens.get(this.varName) || "";
      if (this.modifier === "append") {
        valueToSet = currentValue + this.varValue;
      } else if (this.modifier === "prepend") {
        valueToSet = this.varValue + currentValue;
      }
    }
    if (valueToSet.length > MAX_VAR_VALUE_LENGTH) {
      debug(`setting variable ${this.varName} to excessively long value ${valueToSet.length}`);
      return false;
    }
    context.tokens.set(this.varName, valueToSet);
    return true;
  }
}
