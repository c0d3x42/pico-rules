import { container } from "./inversify.config";
import { TYPES, PicoEngineProvider } from "./types";
import { plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { PicoEngine } from "./engine";
import { switchMap } from "rxjs/operators";
import { Subject, Observable } from "rxjs";

import { ObserveOnOperator } from "rxjs/internal/operators/observeOn";
import { Context } from "./context";
import { BasicJsonRules } from "./interfaces";

export class EngineManager {
  ruleDoc: Object = {};
  ctx$: Subject<Context>;

  constructor(private readonly jsonProvider: Observable<BasicJsonRules>) {
    this.ctx$ = new Subject();
  }

  private engineFactory(rulesDocument: Object): Promise<PicoEngine> {
    const engine = container.get<PicoEngine>(TYPES.PicoEngine);
    const rule = plainToClassFromExist(engine, rulesDocument, { excludeExtraneousValues: true });

    return validate(rule).then(validationErrors => {
      if (validationErrors.length > 0) {
        throw validationErrors;
      }
      this.ruleDoc = rulesDocument;
      return rule;
    });
  }

  public load(): Observable<Context> {
    return this.jsonProvider.pipe(
      switchMap(jsonDoc => {
        console.log("FSW: ", jsonDoc);

        return this.engineFactory(jsonDoc);
      }),
      switchMap(eng => eng.exec2(this.ctx$))
    );
  }

  public exec(context: Context) {
    this.ctx$.next(context);
  }
}
