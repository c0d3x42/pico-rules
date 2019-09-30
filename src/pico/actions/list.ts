import { ValidateNested, IsArray } from "class-validator";
import { Type, Expose } from "class-transformer";

import { Action, ActionCollection } from "./base";
import { ActionSetVar } from "./set";
import { ActionRule } from "./rule";

import { debug as debugLogger } from "debug";
const debug = debugLogger("Actions");

export class ActionList extends Action {
  @Expose()
  act: string = "list";

  @Expose()
  @ValidateNested()
  @IsArray()
  @Type(() => Action, {
    discriminator: {
      property: "act",
      subTypes: [{ name: "setvar", value: ActionSetVar }, { name: "rule", value: ActionRule }],
    },
  })
  actions: ActionCollection = [];

  public _exec() {
    debug(`executing ActionList `);
    return true;
  }
}
