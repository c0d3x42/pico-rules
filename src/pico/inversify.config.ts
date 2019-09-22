import { Container, injectable } from "inversify";
import { TYPES } from "./types";
import { IdGenerator, Engine } from "./interfaces";
import { PicoEngine } from "./index";

import { v4 } from "uuid";

@injectable()
export class UuidGenerator {
  generate() {
    return v4();
  }
}

const container = new Container();
container.bind<IdGenerator>(TYPES.IdGenerator).to(UuidGenerator);
container.bind<Engine>(TYPES.PicoEngine).to(PicoEngine);

export { container };
