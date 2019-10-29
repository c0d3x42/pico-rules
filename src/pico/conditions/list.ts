import { Type, Transform, Expose } from "class-transformer";
import { IsString, IsIn, ValidateNested, IsArray, ValidateIf } from "class-validator";
import "reflect-metadata";
import { Context } from "../context";
import { debug as debugLogger } from "debug";

import { Condition, ConditionCollection } from "./base";
import { LikeCondition } from "./like";
import { EqualityCondition } from "./equality";

const debug = debugLogger("Conditions");

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
        { value: ConditionList, name: "list" },
      ],
    },
  })
  @ValidateNested()
  @IsArray()
  conditions: ConditionCollection = [];

  @Expose()
  @ValidateIf(o => o.op === "list")
  @IsIn(["or", "and"])
  @Transform(value => value || "or", { toClassOnly: true })
  traversal!: string;

  public _exec(context: Context): boolean {
    if (this.traversal === "or") {
      return Boolean(
        this.conditions.find(condition => {
          return condition.exec(context) && context.logVisit(condition.identifier);
        })
      );
    } else if (this.traversal === "and") {
      return Boolean(this.conditions.every(condition => condition.exec(context)));
    } else {
      return false;
    }
  }
}
