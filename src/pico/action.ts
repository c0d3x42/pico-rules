import { IsString, IsNotEmpty, ValidateNested, IsArray } from "class-validator";
import { Type, Expose, Transform } from "class-transformer";
import { Rule } from "./rule";
import { Context } from "./context";

export class ActionCollection extends Array<Action> {}

export abstract class Action {
  abstract act: string;
  abstract exec(context: Context): boolean;
}

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

  public exec(context: Context) {
    this.rule.exec(context);
    return true;
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

  public exec(context: Context) {
    console.log("Setting " + this.varName + " to " + this.varValue);
    context.tokens.set(this.varName, this.varValue);
    return true;
  }
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

  public exec() {
    return true;
  }
}
