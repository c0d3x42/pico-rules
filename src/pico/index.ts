import { container } from "./inversify.config";
import { TYPES, PicoEngineProvider } from "./types";
import { plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { PicoEngine } from "./engine";
import { switchMap, tap } from "rxjs/operators";
import { Subject, Observable, AsyncSubject } from "rxjs";

import { ObserveOnOperator } from "rxjs/internal/operators/observeOn";
import { Context } from "./context";
import { BasicJsonRules } from "./interfaces";

export class EngineManager {
  ruleDoc: Object = {};
  ctx$: Subject<Context>;
  ready$: AsyncSubject<string>;

  constructor(private readonly jsonProvider: Observable<BasicJsonRules>) {
    this.ctx$ = new Subject();
    this.ready$ = new AsyncSubject();
  }

  private engineFactory(rulesDocument: Object): Promise<PicoEngine> {
    const engine = container.get<PicoEngine>(TYPES.PicoEngine);
    const picoEngine = plainToClassFromExist(engine, rulesDocument, { excludeExtraneousValues: true });

    return validate(picoEngine).then(validationErrors => {
      if (validationErrors.length > 0) {
        throw validationErrors;
      }
      this.ready$.next("ready");
      this.ruleDoc = rulesDocument;
      return picoEngine;
    });
  }

  public init(): Observable<PicoEngine> {
    return this.jsonProvider.pipe(switchMap(doc => this.engineFactory(doc)));
  }

  public run(contexts: Observable<Context>) {
    return this.init().pipe(switchMap(engine => engine.exec(contexts)));
  }

  public load(): Observable<Context> {
    return this.jsonProvider.pipe(
      switchMap(jsonDoc => {
        console.log("FSW: ", jsonDoc);

        return this.engineFactory(jsonDoc);
      }),
      tap(blah => {
        // signal readiness
        this.ready$.complete();
      }),
      switchMap(eng => eng.exec(this.ctx$))
    );
  }

  public exec(context: Context) {
    this.ctx$.next(context);
  }
}
