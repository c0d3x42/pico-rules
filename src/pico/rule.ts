import { Type, Expose } from "class-transformer";
import { ConditionList, Condition, EqualityCondition } from "./condition";
import { ValidateNested, IsDefined, IsNumber, IsArray, IsString } from "class-validator";
import { ActionList, Action, ActionRule, ActionSetVar } from "./action";

export class Rule {
  @Type(() => Condition, {
    discriminator: {
      property: "op",
      subTypes: [{ value: EqualityCondition, name: "eq" }, { value: ConditionList, name: "list" }]
    }
  })
  @Expose({ name: "if" })
  @IsArray()
  @IsDefined()
  @ValidateNested()
  entry: ConditionList;

  @Expose()
  @IsDefined()
  @IsString()
  label: string = "";

  @Expose({ name: "then" })
  @Type(() => Action, {
    discriminator: {
      property: "act",
      subTypes: [{ value: ActionRule, name: "rule" }, { name: "setvar", value: ActionSetVar }]
    }
  })
  @ValidateNested()
  disposition_then: ActionList;

  @Expose({ name: "else" })
  disposition_else: ActionList;

  constructor() {
    this.entry = new ConditionList();
    this.disposition_then = new ActionList();
    this.disposition_else = new ActionList();
  }
}
