import { Type, Expose } from "class-transformer";
import { ConditionList, Condition, EqualityCondition, ConditionCollection, LikeCondition } from "./condition";
import { ValidateNested, IsDefined, IsNumber, IsArray, IsString } from "class-validator";
import { ActionList, Action, ActionRule, ActionSetVar, ActionCollection } from "./action";
import { Context } from "./context";

export class Rule {
  @Type(() => Condition, {
    discriminator: {
      property: "op",
      subTypes: [
        { value: EqualityCondition, name: "eq" },
        { value: ConditionList, name: "list" },
        { value: LikeCondition, name: "like" }
      ]
    }
  })
  @Expose({ name: "if" })
  @IsArray()
  @IsDefined()
  @ValidateNested()
  entry: ConditionCollection;

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
  disposition_then: ActionCollection;

  @Expose({ name: "else" })
  @Type(() => Action, {
    discriminator: {
      property: "act",
      subTypes: [{ value: ActionRule, name: "rule" }, { name: "setvar", value: ActionSetVar }]
    }
  })
  @ValidateNested()
  disposition_else: ActionCollection;

  constructor() {
    this.entry = new ConditionCollection();
    this.disposition_then = new ActionCollection();
    this.disposition_else = new ActionCollection();
  }

  public exec(context: Context) {
    if (
      this.entry.find(condition => {
        return condition.exec(context);
      })
    ) {
      console.log("Condition matched");
      this.disposition_then.forEach(action => action.exec(context));
    } else {
      console.log("Condition did not match");
      this.disposition_else.forEach(action => action.exec(context));
    }
  }
}
