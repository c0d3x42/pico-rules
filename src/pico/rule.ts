import { Type, Expose } from "class-transformer";
import { ConditionList, Condition, EqualityCondition } from "./condition";
import { ValidateNested, IsDefined, IsNumber, IsArray, IsString } from "class-validator";

export class Rule {
  @Type(() => Condition, {
    discriminator: {
      property: "op",
      subTypes: [{ value: EqualityCondition, name: "eq" }, { value: ConditionList, name: "list" }]
    }
  })
  @Expose()
  @IsArray()
  @IsDefined()
  @ValidateNested()
  entry: ConditionList;

  @Expose()
  @IsDefined()
  @IsString()
  label: string = "";

  constructor() {
    this.entry = new ConditionList();
  }
}
