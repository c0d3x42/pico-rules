import { IsString, IsNotEmpty, ValidateNested, IsArray, IsDefined, IsAlpha, Length } from "class-validator";
import { Type, Expose, Transform } from "class-transformer";
import { Context } from "../../context";

import { Action } from "../base";

import { debug as debugLogger } from "debug";
const debug = debugLogger("Actions");

export class ActionSetVar extends Action {
  @IsString()
  @IsNotEmpty()
  @Expose()
  varName: string = "";

  @Expose()
  varValue: string = "";

  act: string = "setvar";

  public _exec(context: Context) {
    debug(`executing ActionSetVar [${this.varName}] = [${this.varValue}]`);
    context.tokens.set(this.varName, this.varValue);
    return true;
  }
}
