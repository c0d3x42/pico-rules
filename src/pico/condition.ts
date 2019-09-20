import { Type, Transform, Expose } from "class-transformer";
import { IsDefined, IsString, IsIn, ValidateNested, IsNumber, IsArray, ValidateIf, IsNotEmpty } from "class-validator";
import "reflect-metadata";
import { inspect } from "util";

export class ConditionCollection extends Array<Condition> {}

export abstract class Condition {}
export class EqualityCondition extends Condition {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  token: string | null = null;

  @IsDefined()
  @IsString()
  value: string | null = null;
}
export class LikeCondition extends Condition {}

export class ConditionList extends Condition {
  @IsIn(["list", "eq", "like"])
  op: string = "list";

  /*
  @Transform((value, obj, t) => {
    console.log(`value [${inspect(value)}]`);
    return value;
  })
  */
  @Type(() => Condition, {
    discriminator: {
      property: "op",
      subTypes: [
        { value: EqualityCondition, name: "eq" },
        { value: LikeCondition, name: "like" },
        { value: ConditionList, name: "list" }
      ]
    }
  })
  @ValidateNested()
  @IsArray()
  conditions: ConditionCollection;

  @ValidateIf(o => o.op === "list")
  @IsIn(["or", "and"])
  traversal: string = "or";

  constructor() {
    super();
    this.conditions = [];
    this.traversal = "or";
  }
}
