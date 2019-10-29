import { container } from "./inversify.config";
import { TYPES } from "./types";
import { IdGenerator } from "./interfaces";
import { Expose, Transform } from "class-transformer";

export class InternalIdentifier {
  @Expose()
  @Transform(value => {
    if (value) {
      return value;
    }
    const idGen: IdGenerator = container.get(TYPES.IdGenerator);
    return idGen.generate();
  })
  identifier: string;

  constructor() {
    const idGen: IdGenerator = container.get(TYPES.IdGenerator);
    this.identifier = idGen.generate();
  }
}
