import * as moment from "moment";
import { Moment } from "moment";

import { Rule } from "./rule";
import { Type, Transform, Expose } from "class-transformer";
import { Context } from "./context";
import { injectable, inject } from "inversify";
import { TYPES } from "./types";
import { IdGenerator } from "./interfaces";
import { IsArray, ValidateNested, IsDefined, IsOptional } from "class-validator";
export { Rule };

export class RuleCollection extends Array<Rule> {}

@injectable()
export class PicoEngine {
  @Expose({ name: "global" })
  @IsOptional()
  @IsDefined()
  @IsArray()
  @Transform(value => value || new RuleCollection())
  globalRules: RuleCollection = [];

  @Expose({ name: "main" })
  @IsOptional()
  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => Rule)
  @Transform(value => value || new RuleCollection())
  mainRules: RuleCollection = [];

  /*
  @Type(() => Date)
  @Transform(value => moment.default(value), { toClassOnly: true })
  created_at!: Moment;

  @Type(() => Date)
  @Transform(value => moment.default(value), { toClassOnly: true })
  loaded_at: Moment = moment.default();
*/
  constructor(@inject(TYPES.IdGenerator) private readonly idGen: IdGenerator) {
    //this.created_at = moment.default();
    this.mainRules = new RuleCollection();
  }

  public exec(context: Context): void {
    console.log("ID = " + this.idGen.generate());
    console.log("rules exec = ", this.mainRules);
    this.mainRules.forEach(rule => rule.exec(context));
  }
}
