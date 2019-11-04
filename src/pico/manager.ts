import { container } from "./inversify.config";
import { PicoEngine } from "./engine";
import { TYPES } from "./types";
import { Observable, Subject } from "rxjs";
import { BasicJsonRules } from "./interfaces";

import { plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { switchMap, tap, delay, concatMap, first, take } from "rxjs/operators";
import { Context } from "./context";

export class Manager {
  private engine: Observable<PicoEngine>;

  constructor(private readonly jsonProvider: Observable<BasicJsonRules>) {
    this.engine = jsonProvider.pipe(
      tap(_ => {
        console.log("tap rules");
      }),
      switchMap(ruleDoc => {
        return this.engineFactory(ruleDoc);
      })
    );
    console.log("ctor");
  }

  private engineFactory(rulesDocument: Object): Promise<PicoEngine> {
    const engine = container.get<PicoEngine>(TYPES.PicoEngine);
    const picoEngine = plainToClassFromExist(engine, rulesDocument, { excludeExtraneousValues: true });

    return validate(picoEngine).then(validationErrors => {
      if (validationErrors.length > 0) {
        throw validationErrors;
      }
      // this.ready$.next("ready");
      // this.ruleDoc = rulesDocument;
      return picoEngine;
    });
  }

  public start(ctx$: Observable<Context>) {
    const out = new Subject<Context>();

    const sub = this.engine.pipe(take(1)).subscribe(f => {
      console.log("FIRST");
    });

    return this.engine.pipe(
      concatMap(pico => {
        console.log("switchmap");
        return pico.exec(ctx$);
      })
    );
  }

  public run(ctx: Observable<Context>) {
    return this.engine
      .pipe(
        switchMap(engine => {
          return engine.exec(ctx);
        }),
        tap(_ => {
          console.log("switched engines");
        })
      )
      .subscribe(obs => {
        console.log("number " + obs.tokens.get("counter"));
      });
  }
}
