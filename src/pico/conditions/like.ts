import { Expose, Transform } from "class-transformer";
import { IsDefined, IsString, IsNotEmpty } from "class-validator";
import "reflect-metadata";
import { Context } from "../context";
import { debug as debugLogger } from "debug";

import { Condition, Executable } from "./base";

const debug = debugLogger("Conditions");

export class LikeCondition extends Condition implements Executable {
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

  @Expose({ toClassOnly: true })
  @Transform(
    (value, obj, typ) => {
      const re = new RegExp(obj.value);
      return re;
    },
    { toClassOnly: true }
  )
  valueRE?: RegExp;

  exec(context: Context): boolean {
    debug(`Like with ${this.value}`);
    if (this.token === null) {
      return false;
    }
    const comparisonValue = context.tokens.get(this.token);
    debug(`Like comparing ${comparisonValue}`);

    if (comparisonValue && this.valueRE) {
      const matches = this.valueRE.exec("" + comparisonValue);

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
