import { Type, Transform, Expose } from "class-transformer";
import { IsDefined, IsString, IsIn, ValidateNested, IsNumber, IsArray, ValidateIf, IsNotEmpty } from "class-validator";
import "reflect-metadata";
import { inspect, isRegExp } from "util";
import { Context } from "./context";
import { v4 } from "uuid";
import { debug as debugLogger } from "debug";

const debug = debugLogger("Conditions");

export class ConditionCollection extends Array<Condition> {}

export abstract class Condition {
  @IsDefined()
  abstract op: string;

  abstract _exec(context: Context): boolean;
  // must implement
  public exec(context: Context): boolean {
    return this._exec(context) && context.logVisit(this.id);
  }

  @Expose()
  @Transform(value => value || v4())
  id: string = "";
}

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

  _exec(context: Context): boolean {
    if (this.token === null) {
      return false;
    }
    const result: boolean = this.value === context.tokens.get(this.token);

    debug(`Equality with ${this.token}`);
    return result;
  }
}

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
          return condition.exec(context) && context.logVisit(condition.id);
        })
      );
    } else if (this.traversal === "and") {
      return Boolean(this.conditions.every(condition => condition.exec(context)));
    } else {
      return false;
    }
  }
}
