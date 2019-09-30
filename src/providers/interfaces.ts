import { Observable } from "rxjs";

import { BasicJsonRules } from "../pico/interfaces";

export abstract class Provider {
  abstract emit(): Observable<BasicJsonRules>;
}
