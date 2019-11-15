import { plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { container } from "./inversify.config";
import { PicoEngine } from "./engine";
import { TYPES } from "./types";
import { Subject } from "rxjs";
import { Context } from "./context";
import { BasicJsonRules } from "./interfaces";

enum ManagerEvents {
  Loaded = "loaded",
  Parsed = "parse",
  Validated = "validated",
  Executed = "executed"
}
export interface ManagerEvent {
  event: ManagerEvents;
  msg: string;
}

export class SyncManager {
  public events$: Subject<ManagerEvent>;

  private rawRules: Object = {};
  private engine?: PicoEngine;

  constructor() {
    this.events$ = new Subject();
  }

  private parse(rules: Object | BasicJsonRules): Promise<PicoEngine> {
    const basicEngine = container.get<PicoEngine>(TYPES.PicoEngine);
    const picoEngine = plainToClassFromExist(basicEngine, rules, { excludeExtraneousValues: true });

    return validate(picoEngine).then(validationErrors => {
      if (validationErrors.length > 0) {
        throw validationErrors;
      }
      this.events$.next({ event: ManagerEvents.Validated, msg: "ok" });
      return picoEngine;
    });
  }

  public load(rules: Object | BasicJsonRules) {
    // failed to parse, dont switch engines...

    return this.parse(rules)
      .then(picoEngine => {
        this.events$.next({ event: ManagerEvents.Parsed, msg: "ok" });
        this.engine = picoEngine;
        // save copy of rules
        this.rawRules = Object.create(rules);
        this.events$.next({ event: ManagerEvents.Loaded, msg: "ok" });
        return;
      })
      .catch(err => {
        this.events$.next({ event: ManagerEvents.Parsed, msg: "fail" });
      });
  }

  public exec(ctx: Context) {
    if (this.engine) {
      const processedCtx = this.engine.singleExec(ctx);
      this.events$.next({ event: ManagerEvents.Executed, msg: "ok" });
      return processedCtx;
    } else {
      this.events$.next({ event: ManagerEvents.Executed, msg: "fail" });
      return ctx;
    }
  }
}
