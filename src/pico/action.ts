import { IsString, IsNotEmpty, ValidateNested, IsArray } from "class-validator";
import { Type, Expose } from "class-transformer";
import { Rule } from "./rule";

export class ActionCollection extends Array<Action> {}

export abstract class Action {
  abstract act: string;
}

export class ActionRule extends Action {
  @Expose()
  act: string = "rule";

  @Expose()
  @ValidateNested()
  @Type(() => Rule)
  rule: Rule;

  constructor() {
    super();
    this.rule = new Rule();
  }
}

export class ActionSetVar extends Action {
  @IsString()
  @IsNotEmpty()
  @Expose()
  varName: string = "";

  @Expose()
  varValue: string = "";

  act: string = "setvar";
}

export class ActionList extends Action {
  @Expose()
  act: string = "list";

  @Expose()
  @ValidateNested()
  @IsArray()
  @Type(() => Action, {
    discriminator: {
      property: "act",
      subTypes: [{ name: "setvar", value: ActionSetVar }, { name: "rule", value: ActionRule }]
    }
  })
  actions: ActionCollection = [];
}
