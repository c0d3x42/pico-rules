import { Context } from "./context";
import { Observable } from "rxjs";
import { PicoEngine } from "./engine";
import { PicoEngineProvider } from "./types";

export interface IdGenerator {
  generate(): string;
}

export interface Engine {
  exec(context: Context): void;
}

export interface EngineLoader {
  load(rulesFile: Object): PicoEngineProvider;
}

export interface BasicJsonRules {
  main: [];
}
