import { Type, Transform } from "class-transformer";
import "reflect-metadata";
import { inspect } from "util";

export class ConditionCollection extends Array<Condition> {}

export abstract class Condition {}
export class EqualityCondition extends Condition {}
export class LikeCondition extends Condition {}

export class ConditionList extends Condition {
  @Transform((value, obj, t) => {
    console.log(`value [${inspect(value)}]`);
    return value;
  })
  @Type(() => Condition, {
    discriminator: {
      property: "__op",
      subTypes: [
        { value: EqualityCondition, name: "eq" },
        { value: LikeCondition, name: "like" },

        { value: ConditionList, name: "list" }
      ]
    }
  })
  conditions: ConditionCollection;

  traversal: string = "or";

  constructor() {
    super();
    this.conditions = [];
  }
}
