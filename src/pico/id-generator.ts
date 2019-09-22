import { injectable } from "inversify";
import { v4 } from "uuid";
import nanoid from "nanoid";

import { IdGenerator } from "./interfaces";

@injectable()
export class UuidGenerator implements IdGenerator {
  generate() {
    return v4();
  }
}

@injectable()
export class NanoIdGenerator implements IdGenerator {
  generate() {
    return nanoid();
  }
}
