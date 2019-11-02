import { Expose } from "class-transformer";
import { IsDefined, IsString, IsNotEmpty } from "class-validator";
import { Context } from "../context";
import { debug as debugLogger } from "debug";
import { Condition, Executable } from "./base";

const debug = debugLogger("Conditions");

export class EqualityCondition extends Condition implements Executable {
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

  exec(context: Context): boolean {
    if (this.token === null) {
      return false;
    }
    const result: boolean = this.value === context.tokens.get(this.token);

    debug(`Equality with ${this.token}`);
    return result;
  }
}
