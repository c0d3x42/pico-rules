import { Observable } from "rxjs";
import { PicoEngine } from "./engine";

const TYPES = {
  IdGenerator: Symbol.for("IdGenertor"),
  PicoEngine: Symbol.for("PicoEngine"),
};

export { TYPES };

export type PicoEngineProvider = Observable<PicoEngine>;
export type RuleProvider = Observable<Object>;
