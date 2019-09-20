import { Type } from "class-transformer";
import { ConditionList, Condition, EqualityCondition } from "./condition";

export class Rule {
  @Type(() => Condition, {
    discriminator: {
      property: "__op",
      subTypes: [{ value: EqualityCondition, name: "eq" }, { value: ConditionList, name: "list" }]
    }
  })
  entry: ConditionList;

  constructor() {
    this.entry = new ConditionList();
  }
}
