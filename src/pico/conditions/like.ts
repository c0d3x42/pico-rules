import { Expose } from "class-transformer";
import { IsDefined, IsString, IsNotEmpty } from "class-validator";
import "reflect-metadata";
import { Context } from "../context";
import { debug as debugLogger } from "debug";

import { Condition } from "./base";

const debug = debugLogger("Conditions");

export class LikeCondition extends Condition {
  op: string = "like";

  @Expose()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  token: string | null = null;

  @Expose()
  @IsDefined()
  @IsString()
  value: string = "";

  valueRE?: RegExp;

  _exec(context: Context): boolean {
    if (!this.valueRE) {
      this.valueRE = new RegExp(this.value);
    }
    debug(`Like with ${this.value}`);
    if (this.token === null) {
      return false;
    }
    const comparisonValue = context.tokens.get(this.token);
    debug(`Like comparing ${comparisonValue}`);

    if (comparisonValue) {
      const matches = this.valueRE.exec(comparisonValue);

      if (matches && matches.groups) {
        debug(`Like found some matches `);
        const m = new Map(Object.entries(matches.groups));
        context.locals = m;
      }
      return Boolean(matches);
    }
    return false;
  }
}
