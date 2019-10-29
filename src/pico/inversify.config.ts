import { Container, injectable } from "inversify";
import { TYPES } from "./types";
import { IdGenerator, Engine } from "./interfaces";
import { PicoEngine } from "./engine";
import { Rule } from "./rule";
import { UuidGenerator, NanoIdGenerator } from "./id-generator";

const container = new Container();
container.bind<IdGenerator>(TYPES.IdGenerator).to(NanoIdGenerator);
container.bind<Engine>(TYPES.PicoEngine).to(PicoEngine);
container.bind<Rule>(TYPES.Rule).to(Rule);

export { container };
