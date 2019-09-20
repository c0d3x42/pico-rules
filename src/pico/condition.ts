import { Type, Transform, Expose } from "class-transformer";
import { IsDefined, IsString, IsIn, ValidateNested, IsNumber, IsArray, ValidateIf, IsNotEmpty } from "class-validator";
import "reflect-metadata";
import { inspect } from "util";

export class ConditionCollection extends Array<Condition> {}

export abstract class Condition {}
export class EqualityCondition extends Condition {
  @Expose()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  token: string | null = null;

  @Expose()
  @IsDefined()
  @IsString()
  value: string | null = null;

  op: string = "eq";
}
export class LikeCondition extends Condition {}

export class ConditionList extends Condition {
  @Transform(value => value || "list", { toClassOnly: true })
  @IsIn(["list", "eq", "like"])
  @Expose()
  @IsString()
  op: string = "list";

  /*
  @Transform((value, obj, t) => {
    console.log(`value [${inspect(value)}]`);
    return value;
  })
  */
  @Expose()
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

  @Expose()
  @ValidateIf(o => o.op === "list")
  @IsIn(["or", "and"])
  @Transform(value => value || "or", { toClassOnly: true })
  traversal!: string;

  constructor() {
    super();
    this.conditions = [];
    //this.traversal = "or";
  }
}
