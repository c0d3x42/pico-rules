import { Context } from "./context";
import { Observable } from "rxjs";
import { PicoEngineProvider } from "./types";

export interface IdGenerator {
  generate(): string;
}

export interface Engine {
  exec(context: Observable<Context>): Observable<Context>;
}

export interface EngineLoader {
  load(rulesFile: Object): PicoEngineProvider;
}

export interface BasicJsonRules {
  main: [];
}
