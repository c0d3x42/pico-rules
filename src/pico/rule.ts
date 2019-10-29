import { Type, Expose, Transform, Exclude } from "class-transformer";
import { ConditionList, Condition, EqualityCondition, ConditionCollection, LikeCondition } from "./conditions";
import { ValidateNested, IsDefined, IsArray, IsString } from "class-validator";
import { Action, ActionRule, ActionSetVar, ActionCollection, ActionSetTemplated } from "./actions";
import { Context } from "./context";

import { debug as debugLogger } from "debug";
import { injectable } from "inversify";
import { InternalIdentifier } from "./internal-identifier";
const debug = debugLogger("Rule");

@injectable()
export class Rule /*extends InternalIdentifier */ {
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
        { name: "rule", value: ActionRule },
        { name: "setvar", value: ActionSetVar },
        { name: "template", value: ActionSetTemplated },
      ],
    },
  })
  @ValidateNested()
  @Transform(value => value || new ActionCollection())
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
  @Transform(value => value || new ActionCollection())
  disposition_else: ActionCollection = [];

  public constructor() {
    //super();
  }
  public exec(context: Context) {
    // console.log("Rule ->");
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
