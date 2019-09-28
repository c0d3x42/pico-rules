import { Type, Expose } from "class-transformer";
import { ConditionList, Condition, EqualityCondition, ConditionCollection, LikeCondition } from "./condition";
import { ValidateNested, IsDefined, IsNumber, IsArray, IsString } from "class-validator";
import { Action, ActionRule, ActionSetVar, ActionCollection, ActionSetTemplated } from "./action";
import { Context } from "./context";

import { debug as debugLogger } from "debug";
const debug = debugLogger("Rule");

export class Rule {
  @Type(() => Condition, {
    discriminator: {
      property: "op",
      subTypes: [
        { value: EqualityCondition, name: "eq" },
        { value: ConditionList, name: "list" },
        { value: LikeCondition, name: "like" },
      ],
    },
  })
  @Expose({ name: "if" })
  @IsArray()
  @IsDefined()
  @ValidateNested()
  entry: ConditionCollection = [];

  @Expose()
  @IsDefined()
  @IsString()
  label: string = "";

  @Expose({ name: "then" })
  @Type(() => Action, {
    discriminator: {
      property: "act",
      subTypes: [
        { value: ActionRule, name: "rule" },
        { name: "setvar", value: ActionSetVar },
        { name: "template", value: ActionSetTemplated },
      ],
    },
  })
  @ValidateNested()
  disposition_then: ActionCollection = [];

  @Expose({ name: "else" })
  @Type(() => Action, {
    discriminator: {
      property: "act",
      subTypes: [
        { value: ActionRule, name: "rule" },
        { name: "setvar", value: ActionSetVar },
        { name: "template", value: ActionSetTemplated },
      ],
    },
  })
  @ValidateNested()
  disposition_else: ActionCollection = [];

  public exec(context: Context) {
    console.log("Rule ->");
    if (
      this.entry.find(condition => {
        return condition.exec(context);
      })
    ) {
      debug("Condition matched");
      this.disposition_then.forEach(action => action.exec(context));
    } else {
      debug("Condition did not match");
      this.disposition_else.forEach(action => action.exec(context));
    }
  }
}
